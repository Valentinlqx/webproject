"use strict";
/* =====================================================================
   main.js — boot: load manifest + templates, restore the mix from the
   URL, wire the toolbar (play / export / share / paste-code).
   ===================================================================== */

window.MANIFEST = {};

function status(msg, ok){
  const el = document.getElementById("status");
  el.textContent = msg;
  el.className = ok ? "ok" : "";
  clearTimeout(status._t);
  if (msg) status._t = setTimeout(() => { el.textContent = ""; }, 5000);
}

function updateHint(){
  const hint = document.getElementById("hint");
  const hasLib = Object.keys(window.MANIFEST).length > 0;
  const hasNodes = [...graph.nodes.values()].some(n => n.type !== "out");
  if (!hasLib){
    hint.innerHTML = "<b>No sounds installed yet.</b><br>" +
      "Drop .wav files into <code>sounds/&lt;category&gt;/</code><br>" +
      "then run <code>node tools/manifest.mjs</code> and refresh.<br>" +
      "<small>(see SOUND_LIST.md for what to download)</small>";
    hint.style.display = "";
  } else if (!hasNodes){
    hint.innerHTML = "Add a <b>+ sound</b> node from the top bar,<br>" +
      "wire it to <b>OUTPUT</b>, press play.";
    hint.style.display = "";
  } else {
    hint.style.display = "none";
  }
}

function loadCode(raw){
  const code = raw.includes("#") ? raw.split("#").pop() : raw.trim();
  if (!code) return false;
  try {
    deserializeGraph(code);
    renderAll();
    updateHint();
    syncHash();
    if (player.playing) restartPlayback();
    return true;
  } catch (e){
    console.error(e);
    status("invalid code");
    return false;
  }
}

async function boot(){
  try { window.MANIFEST = await (await fetch("sounds/manifest.json")).json(); }
  catch (e){ console.warn("manifest.json not found — is the site served over http?"); }
  let templates = [];
  try { templates = await (await fetch("templates.json")).json(); } catch (e){}

  initEditor(document.getElementById("canvas"));

  const code = location.hash.slice(1);
  let restored = false;
  if (code){
    try { deserializeGraph(code); restored = true; } catch (e){ console.warn("bad share-code", e); }
  }
  if (!restored){
    graph.nodes.clear(); graph.wires = [];
    ensureOutNode();
  }
  renderAll();
  updateHint();

  /* templates row */
  const tpl = document.getElementById("templates");
  for (const t of templates){
    if (!t || !t.name || !t.code) continue;
    const b = document.createElement("button");
    b.textContent = t.name;
    b.onclick = () => loadCode(t.code);
    tpl.appendChild(b);
  }
  if (!tpl.children.length) tpl.style.display = "none";

  /* add-node buttons */
  for (const b of document.querySelectorAll("[data-add]"))
    b.onclick = () => spawnNode(b.dataset.add);

  /* play / stop */
  const playBtn = document.getElementById("playBtn");
  playBtn.onclick = async () => {
    if (player.playing){
      stopPlayback();
      playBtn.textContent = "▸ play";
      playBtn.classList.remove("on");
      return;
    }
    if (![...graph.nodes.values()].some(n => n.type === "sound" && n.params.file)){
      status("add a sound node first");
      return;
    }
    playBtn.textContent = "…";
    try {
      await startPlayback();
      playBtn.textContent = "■ stop";
      playBtn.classList.add("on");
    } catch (e){
      console.error(e);
      status(e.message);
      playBtn.textContent = "▸ play";
    }
  };

  /* export */
  const exportBtn = document.getElementById("exportBtn");
  exportBtn.onclick = async () => {
    if (![...graph.nodes.values()].some(n => n.type === "sound" && n.params.file)){
      status("nothing to export");
      return;
    }
    exportBtn.disabled = true;
    try { await exportWav(+document.getElementById("expDur").value, m => status(m, true)); }
    catch (e){ console.error(e); status("export failed: " + e.message); }
    exportBtn.disabled = false;
  };

  /* share */
  document.getElementById("shareBtn").onclick = async () => {
    history.replaceState(null, "", "#" + serializeGraph());
    try {
      await navigator.clipboard.writeText(location.href);
      status("link copied", true);
    } catch (e){
      status("copy the address bar URL");
    }
  };

  /* paste a code or link */
  const paste = document.getElementById("pasteCode");
  paste.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (loadCode(paste.value)){
      paste.value = "";
      status("mix loaded", true);
    }
  });
}

boot();
