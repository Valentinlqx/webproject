"use strict";
/* =====================================================================
   audio.js — maps the node graph onto a Web Audio graph.
   Sounds are WAV files crossfade-looped at load so they cycle seamlessly.
   The same builder runs on a live AudioContext (preview) and an
   OfflineAudioContext (WAV export with a seamless loop join).
   ===================================================================== */

const pcmCache = new Map();                 // url → {channels:[Float32Array], sampleRate}
let decodeCtx = null;

function soundUrl(node){
  return "sounds/" + encodeURIComponent(node.params.cat) + "/" + encodeURIComponent(node.params.file);
}

/* Crossfade the clip's tail into its head → seamless loop. */
function crossfadeLoop(audioBuf, xfSec){
  const sr = audioBuf.sampleRate;
  const xf = Math.min(Math.floor(xfSec * sr), Math.floor(audioBuf.length / 3));
  const frames = audioBuf.length - xf;
  const channels = [];
  for (let ch = 0; ch < audioBuf.numberOfChannels; ch++){
    const src = audioBuf.getChannelData(ch);
    const out = new Float32Array(frames);
    out.set(src.subarray(0, frames));
    for (let i = 0; i < xf; i++){
      const th = (Math.PI / 2) * (i / xf);
      out[i] = out[i] * Math.sin(th) + src[frames + i] * Math.cos(th);
    }
    channels.push(out);
  }
  return { channels, sampleRate: sr };
}

async function loadPcm(url){
  if (pcmCache.has(url)) return pcmCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Cannot load " + url);
  if (!decodeCtx) decodeCtx = new AudioContext();
  const decoded = await decodeCtx.decodeAudioData(await res.arrayBuffer());
  const pcm = crossfadeLoop(decoded, Math.min(1.5, decoded.duration / 4));
  pcmCache.set(url, pcm);
  return pcm;
}

function pcmToBuffer(ctx, pcm){
  const b = ctx.createBuffer(pcm.channels.length, pcm.channels[0].length, pcm.sampleRate);
  pcm.channels.forEach((d, ch) => b.copyToChannel(d, ch));
  return b;
}

function makeIR(ctx, secs){
  const len = Math.max(1, Math.floor(ctx.sampleRate * secs));
  const b = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++){
    const d = b.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  }
  return b;
}

/* Build the full Web Audio graph. Returns per-node runtime refs. */
function buildAudio(ctx, dest){
  const refs = new Map();
  const master = ctx.createGain();
  const dc = ctx.createBiquadFilter(); dc.type = "highpass"; dc.frequency.value = 22;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -9; comp.knee.value = 12; comp.ratio.value = 5;
  comp.attack.value = .004; comp.release.value = .25;
  master.connect(dc).connect(comp).connect(dest);

  for (const node of graph.nodes.values()){
    const p = node.params;
    if (node.type === "out"){
      refs.set(node.id, { entry: master, exit: null, comp });

    } else if (node.type === "sound"){
      const exit = ctx.createStereoPanner();
      exit.pan.value = p.pan;
      const vol = ctx.createGain(); vol.gain.value = p.vol * p.vol * 1.4;
      let src = null;
      const url = p.file ? soundUrl(node) : null;
      if (url && pcmCache.has(url)){
        src = ctx.createBufferSource();
        src.buffer = pcmToBuffer(ctx, pcmCache.get(url));
        src.loop = true;
        src.playbackRate.value = speedFor(node.id);
        src.connect(vol).connect(exit);
      }
      refs.set(node.id, { entry: null, exit, src, vol, pan: exit });

    } else if (node.type === "reverb"){
      const entry = ctx.createGain(), exit = ctx.createGain();
      const conv = ctx.createConvolver(); conv.buffer = makeIR(ctx, p.size);
      const dry = ctx.createGain(); dry.gain.value = 1 - p.mix;
      const wet = ctx.createGain(); wet.gain.value = p.mix;
      entry.connect(dry).connect(exit);
      entry.connect(conv).connect(wet).connect(exit);
      refs.set(node.id, { entry, exit, conv, dry, wet, ctx });

    } else if (node.type === "filter"){
      const f = ctx.createBiquadFilter();
      f.type = p.kind; f.frequency.value = freqToHz(p.freq); f.Q.value = .8;
      refs.set(node.id, { entry: f, exit: f, filter: f });

    } else if (node.type === "delay"){
      const entry = ctx.createGain(), exit = ctx.createGain();
      const dl = ctx.createDelay(2); dl.delayTime.value = p.time;
      const fb = ctx.createGain(); fb.gain.value = .35;
      const dry = ctx.createGain(); dry.gain.value = 1 - p.mix;
      const wet = ctx.createGain(); wet.gain.value = p.mix;
      entry.connect(dry).connect(exit);
      entry.connect(dl).connect(wet).connect(exit);
      dl.connect(fb).connect(dl);
      refs.set(node.id, { entry, exit, dl, dry, wet });

    } else if (node.type === "pitch"){
      const g = ctx.createGain();                    // pass-through; speed applies upstream
      refs.set(node.id, { entry: g, exit: g });
    }
  }

  for (const w of graph.wires){
    const ra = refs.get(w.a), rb = refs.get(w.b);
    if (ra && rb && ra.exit && rb.entry) ra.exit.connect(rb.entry);
  }
  return { refs, master };
}

/* ---------------- live preview ---------------- */
const player = { ctx: null, rt: null, playing: false, raf: 0 };

async function preloadAllSounds(){
  const jobs = [];
  for (const n of graph.nodes.values())
    if (n.type === "sound" && n.params.file) jobs.push(loadPcm(soundUrl(n)));
  await Promise.all(jobs);
}

async function startPlayback(){
  if (!player.ctx) player.ctx = new AudioContext();
  await player.ctx.resume();
  await preloadAllSounds();
  const analyser = player.ctx.createAnalyser();
  analyser.fftSize = 1024;
  const rt = buildAudio(player.ctx, analyser);
  analyser.connect(player.ctx.destination);
  rt.analyser = analyser;
  for (const r of rt.refs.values())
    if (r.src) r.src.start(0, Math.random() * r.src.buffer.duration);
  player.rt = rt;
  player.playing = true;
  drawMeter();
}

function stopPlayback(){
  player.playing = false;
  cancelAnimationFrame(player.raf);
  if (player.rt){
    for (const r of player.rt.refs.values()){
      if (r.src){ try { r.src.stop(); } catch(e){} }
    }
    try { player.rt.master.disconnect(); } catch(e){}
    if (player.rt.analyser){ try { player.rt.analyser.disconnect(); } catch(e){} }
    player.rt = null;
  }
  drawMeter();
}

async function restartPlayback(){
  if (!player.playing) return;
  stopPlayback();
  await startPlayback();
}

/* Live param tweak without rebuilding the graph. */
function applyParam(node){
  if (!player.playing || !player.rt) return;
  const r = player.rt.refs.get(node.id), p = node.params;
  if (!r) return;
  if (node.type === "sound"){
    if (r.vol) r.vol.gain.value = p.vol * p.vol * 1.4;
    if (r.pan) r.pan.pan.value = p.pan;
  } else if (node.type === "reverb"){
    r.dry.gain.value = 1 - p.mix; r.wet.gain.value = p.mix;
    r.conv.buffer = makeIR(r.ctx, p.size);
  } else if (node.type === "filter"){
    r.filter.type = p.kind; r.filter.frequency.value = freqToHz(p.freq);
  } else if (node.type === "delay"){
    r.dl.delayTime.value = p.time;
    r.dry.gain.value = 1 - p.mix; r.wet.gain.value = p.mix;
  } else if (node.type === "pitch"){
    refreshSpeeds();
  }
}

function refreshSpeeds(){
  if (!player.rt) return;
  for (const n of graph.nodes.values())
    if (n.type === "sound"){
      const r = player.rt.refs.get(n.id);
      if (r && r.src) r.src.playbackRate.value = speedFor(n.id);
    }
}

/* ---------------- meter on the OUTPUT node ---------------- */
const meterData = new Float32Array(1024);
function drawMeter(){
  const cv = document.querySelector('[data-id="out"] canvas');
  if (!cv) return;
  const g = cv.getContext("2d");
  g.clearRect(0, 0, cv.width, cv.height);
  if (!player.playing || !player.rt || !player.rt.analyser) return;
  player.rt.analyser.getFloatTimeDomainData(meterData);
  let pk = 0;
  for (let i = 0; i < meterData.length; i++) pk = Math.max(pk, Math.abs(meterData[i]));
  g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--deep") || "#475841";
  g.fillRect(0, 0, Math.min(1, pk) * cv.width, cv.height);
  player.raf = requestAnimationFrame(drawMeter);
}

/* ---------------- WAV export (seamless loop) ---------------- */
async function exportWav(durationSec, onStatus){
  const dur = Math.min(300, Math.max(5, durationSec || 60));
  const sr = 48000;
  const xf = Math.min(4, dur / 2 - .5);
  const pre = 2;                                  // reverb/delay warm-up, discarded
  const total = pre + dur + xf;

  onStatus && onStatus("rendering…");
  await preloadAllSounds();
  const octx = new OfflineAudioContext({ numberOfChannels: 2, length: Math.ceil(total * sr), sampleRate: sr });
  const rt = buildAudio(octx, octx.destination);
  for (const r of rt.refs.values())
    if (r.src) r.src.start(0, Math.random() * r.src.buffer.duration);
  const rendered = await octx.startRendering();

  const frames = Math.floor(dur * sr), xfF = Math.floor(xf * sr), preF = Math.floor(pre * sr);
  const chans = [0, 1].map(ch => {
    const src = rendered.getChannelData(ch);
    const out = new Float32Array(frames);
    for (let i = 0; i < frames; i++) out[i] = src[preF + i];
    for (let i = 0; i < xfF; i++){                // equal-power crossfade: tail → head
      const th = (Math.PI / 2) * (i / xfF);
      out[i] = out[i] * Math.sin(th) + src[preF + frames + i] * Math.cos(th);
    }
    return out;
  });

  let peak = 1e-9;
  for (const c of chans) for (let i = 0; i < frames; i++) peak = Math.max(peak, Math.abs(c[i]));
  const norm = Math.pow(10, -1 / 20) / peak;      // normalize to −1 dBFS
  for (const c of chans) for (let i = 0; i < frames; i++) c[i] *= norm;

  const blob = encodeWav16(chans, sr);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ambience_${dur}s.wav`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  onStatus && onStatus(`done — ${(blob.size / 1048576).toFixed(1)} MB`);
}

function encodeWav16(chans, sr){
  const frames = chans[0].length, nCh = chans.length;
  const dataLen = frames * nCh * 2;
  const buf = new ArrayBuffer(44 + dataLen);
  const v = new DataView(buf);
  const ws = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
  ws(0, "RIFF"); v.setUint32(4, 36 + dataLen, true); ws(8, "WAVE");
  ws(12, "fmt "); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, nCh, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * nCh * 2, true);
  v.setUint16(32, nCh * 2, true); v.setUint16(34, 16, true);
  ws(36, "data"); v.setUint32(40, dataLen, true);
  let o = 44;
  for (let i = 0; i < frames; i++)
    for (let ch = 0; ch < nCh; ch++){
      const x = Math.max(-1, Math.min(1, chans[ch][i]));
      v.setInt16(o, x * 32767, true); o += 2;
    }
  return new Blob([buf], { type: "audio/wav" });
}
