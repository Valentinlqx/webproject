"use strict";
/* =====================================================================
   editor.js — the visual node editor: draggable nodes, bezier wires,
   per-node controls. Pointer-events based, no dependencies.
   World coordinates = node.x/y; the world div pans with the background.
   ===================================================================== */

const editor = {
  canvas: null, world: null, svg: null,
  panX: 0, panY: 0,
  temp: null,                 // temp wire path while dragging a connection
};

const WORLD_W = 8000, WORLD_H = 6000;

function initEditor(canvasEl){
  editor.canvas = canvasEl;
  editor.world = document.createElement("div");
  editor.world.id = "world";
  editor.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  editor.svg.id = "wires";
  editor.svg.setAttribute("width", WORLD_W);
  editor.svg.setAttribute("height", WORLD_H);
  editor.world.appendChild(editor.svg);
  canvasEl.appendChild(editor.world);
  applyPan();

  /* pan the canvas by dragging the background */
  canvasEl.addEventListener("pointerdown", e => {
    if (e.target !== canvasEl && e.target !== editor.world && e.target !== editor.svg) return;
    const sx = e.clientX - editor.panX, sy = e.clientY - editor.panY;
    const move = ev => {
      editor.panX = Math.min(80, ev.clientX - sx);
      editor.panY = Math.min(80, ev.clientY - sy);
      applyPan();
    };
    const up = () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  });
}

function applyPan(){
  editor.world.style.transform = `translate(${editor.panX}px, ${editor.panY}px)`;
}

/* ---------------- node rendering ---------------- */
function slider(key, label, min, max, step, value, fmt){
  return `<div class="row"><label>${label}</label>
    <input type="range" data-k="${key}" min="${min}" max="${max}" step="${step}" value="${value}">
    <output>${fmt(value)}</output></div>`;
}

const FMT = {
  pct: v => Math.round(v * 100),
  pan: v => Math.abs(v) < .02 ? "C" : (v > 0 ? "R" : "L") + Math.round(Math.abs(v) * 100),
  hz:  v => { const h = freqToHz(+v); return h >= 1000 ? (h / 1000).toFixed(1) + "k" : h; },
  sec: v => (+v).toFixed(2) + "s",
  x:   v => "×" + (+v).toFixed(2),
};

function soundOptions(sel){
  let html = `<option value="">— pick a sound —</option>`;
  for (const [cat, files] of Object.entries(window.MANIFEST || {})){
    html += `<optgroup label="${cat}">`;
    for (const f of files){
      const v = cat + "/" + f;
      const name = f.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      html += `<option value="${v}" ${v === sel ? "selected" : ""}>${name}</option>`;
    }
    html += `</optgroup>`;
  }
  return html;
}

function nodeBody(node){
  const p = node.params;
  switch (node.type){
    case "sound": return `
      <select data-k="file" class="pick">${soundOptions(p.cat && p.file ? p.cat + "/" + p.file : "")}</select>
      ${slider("vol", "vol", 0, 1, .01, p.vol, FMT.pct)}
      ${slider("pan", "pan", -1, 1, .01, p.pan, FMT.pan)}`;
    case "reverb": return `
      ${slider("size", "size", .3, 6, .1, p.size, FMT.sec)}
      ${slider("mix", "mix", 0, 1, .01, p.mix, FMT.pct)}`;
    case "filter": return `
      <select data-k="kind" class="pick">
        <option value="lowpass" ${p.kind === "lowpass" ? "selected" : ""}>low-pass (muffle)</option>
        <option value="highpass" ${p.kind === "highpass" ? "selected" : ""}>high-pass (thin)</option>
      </select>
      ${slider("freq", "freq", 0, 1, .005, p.freq, FMT.hz)}`;
    case "delay": return `
      ${slider("time", "time", .05, 1.5, .01, p.time, FMT.sec)}
      ${slider("mix", "mix", 0, 1, .01, p.mix, FMT.pct)}`;
    case "pitch": return `
      ${slider("speed", "speed", .5, 2, .01, p.speed, FMT.x)}`;
    case "out": return `<canvas class="meter" width="130" height="8"></canvas>`;
  }
  return "";
}

function renderNode(node){
  const el = document.createElement("div");
  el.className = "node " + node.type;
  el.dataset.id = node.id;
  el.style.left = node.x + "px";
  el.style.top = node.y + "px";
  el.style.width = NODE_DEFS[node.type].w + "px";
  const hasIn = node.type !== "sound";
  const hasOut = node.type !== "out";
  el.innerHTML = `
    <div class="head"><span class="dot"></span>${NODE_DEFS[node.type].title}
      ${node.id !== "out" ? '<button class="x" title="remove">×</button>' : ""}</div>
    <div class="body">${nodeBody(node)}</div>
    ${hasIn ? '<div class="port in" title="input"></div>' : ""}
    ${hasOut ? '<div class="port out" title="drag to connect"></div>' : ""}`;
  editor.world.appendChild(el);
  bindNode(el, node);
  return el;
}

function bindNode(el, node){
  const head = el.querySelector(".head");

  /* drag node */
  head.addEventListener("pointerdown", e => {
    if (e.target.classList.contains("x")) return;
    e.preventDefault();
    head.setPointerCapture(e.pointerId);
    const ox = e.clientX - node.x, oy = e.clientY - node.y;
    const move = ev => {
      node.x = Math.round(Math.max(0, Math.min(WORLD_W - 240, ev.clientX - ox)));
      node.y = Math.round(Math.max(0, Math.min(WORLD_H - 160, ev.clientY - oy)));
      el.style.left = node.x + "px";
      el.style.top = node.y + "px";
      updateWires();
    };
    const up = () => {
      head.removeEventListener("pointermove", move);
      head.removeEventListener("pointerup", up);
      syncHash();
    };
    head.addEventListener("pointermove", move);
    head.addEventListener("pointerup", up);
  });

  /* remove */
  const x = el.querySelector(".x");
  if (x) x.onclick = () => {
    removeNode(node.id);
    el.remove();
    updateWires();
    topologyChanged();
  };

  /* params */
  for (const input of el.querySelectorAll("[data-k]")){
    input.addEventListener("input", () => {
      const k = input.dataset.k;
      if (k === "file"){
        const [cat, ...rest] = input.value.split("/");
        node.params.cat = input.value ? cat : "";
        node.params.file = input.value ? rest.join("/") : "";
        topologyChanged();                      // needs (re)load of the buffer
      } else if (k === "kind"){
        node.params.kind = input.value;
        applyParam(node);
      } else {
        node.params[k] = +input.value;
        const out = input.nextElementSibling;
        if (out) out.textContent = { vol: FMT.pct, mix: FMT.pct, pan: FMT.pan, freq: FMT.hz,
          size: FMT.sec, time: FMT.sec, speed: FMT.x }[k](+input.value);
        applyParam(node);
      }
      syncHash();
    });
  }

  /* start a wire from the out port */
  const op = el.querySelector(".port.out");
  if (op) op.addEventListener("pointerdown", e => {
    e.preventDefault();
    e.stopPropagation();
    const from = portPos(node.id, "out");
    const move = ev => {
      const r = editor.canvas.getBoundingClientRect();
      drawTempWire(from, { x: ev.clientX - r.left - editor.panX, y: ev.clientY - r.top - editor.panY });
    };
    const up = ev => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      clearTempWire();
      const target = document.elementFromPoint(ev.clientX, ev.clientY);
      const nodeEl = target && target.closest(".node");
      if (nodeEl && addWire(node.id, nodeEl.dataset.id)){
        updateWires();
        topologyChanged();
      }
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  });
}

/* ---------------- wires ---------------- */
function portPos(id, kind){
  const nodeEl = editor.world.querySelector(`[data-id="${id}"]`);
  const port = nodeEl && nodeEl.querySelector(".port." + kind);
  if (!port) return { x: 0, y: 0 };
  return {
    x: nodeEl.offsetLeft + port.offsetLeft + port.offsetWidth / 2,
    y: nodeEl.offsetTop + port.offsetTop + port.offsetHeight / 2,
  };
}

function wirePath(a, b){
  const dx = Math.max(50, Math.abs(b.x - a.x) / 2);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

function updateWires(){
  for (const p of [...editor.svg.querySelectorAll("path:not(.temp)")]) p.remove();
  for (const w of graph.wires){
    const d = wirePath(portPos(w.a, "out"), portPos(w.b, "in"));
    const hit = document.createElementNS("http://www.w3.org/2000/svg", "path");
    hit.setAttribute("d", d);
    hit.setAttribute("class", "hit");
    hit.addEventListener("click", () => {
      removeWire(w.a, w.b);
      updateWires();
      topologyChanged();
    });
    const vis = document.createElementNS("http://www.w3.org/2000/svg", "path");
    vis.setAttribute("d", d);
    vis.setAttribute("class", "wire");
    editor.svg.appendChild(hit);
    editor.svg.appendChild(vis);
  }
}

function drawTempWire(a, b){
  if (!editor.temp){
    editor.temp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    editor.temp.setAttribute("class", "wire temp");
    editor.svg.appendChild(editor.temp);
  }
  editor.temp.setAttribute("d", wirePath(a, b));
}

function clearTempWire(){
  if (editor.temp){ editor.temp.remove(); editor.temp = null; }
}

/* ---------------- full redraw ---------------- */
function renderAll(){
  for (const n of [...editor.world.querySelectorAll(".node")]) n.remove();
  for (const node of graph.nodes.values()) renderNode(node);
  updateWires();
}

function spawnNode(type){
  const r = editor.canvas.getBoundingClientRect();
  const jitter = () => (Math.random() - .5) * 60;
  const node = addNode(type,
    r.width / 2 - editor.panX - 110 + jitter(),
    r.height / 2 - editor.panY - 90 + jitter());
  renderNode(node);
  topologyChanged();
  return node;
}

function topologyChanged(){
  syncHash();
  if (player.playing) restartPlayback();
  updateHint();
}
