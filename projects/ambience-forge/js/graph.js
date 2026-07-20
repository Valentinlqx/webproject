"use strict";
/* =====================================================================
   graph.js — the node-graph model and its URL share-code serialization.
   A mix is: nodes (sound sources, fx, one output) + wires between them.
   The whole graph continuously serializes into location.hash, so copying
   the URL shares the mix and templates are just pre-written codes.
   ===================================================================== */

const NODE_DEFS = {
  sound:  { title:"SOUND",  w:210, params:{ cat:"", file:"", vol:.8, pan:0 } },
  reverb: { title:"REVERB", w:180, params:{ size:2.5, mix:.35 } },
  filter: { title:"FILTER", w:180, params:{ kind:"lowpass", freq:.62 } }, // freq normalized 0..1
  delay:  { title:"DELAY",  w:180, params:{ time:.35, mix:.3 } },
  pitch:  { title:"PITCH",  w:180, params:{ speed:1 } },
  out:    { title:"OUTPUT", w:170, params:{} },
};
const freqToHz = v => Math.round(80 * Math.pow(200, v));   // 0..1 → 80..16000 Hz

const graph = {
  nodes: new Map(),          // id → {id, type, x, y, params}
  wires: [],                 // [{a, b}] : a's output feeds b's input
  seq: 1,
};

function addNode(type, x, y, params){
  const id = type === "out" ? "out" : type[0] + (graph.seq++);
  const node = { id, type, x: Math.round(x), y: Math.round(y),
    params: { ...NODE_DEFS[type].params, ...(params || {}) } };
  graph.nodes.set(id, node);
  return node;
}

function removeNode(id){
  if (id === "out") return;
  graph.nodes.delete(id);
  graph.wires = graph.wires.filter(w => w.a !== id && w.b !== id);
}

/* Would wiring a→b create a cycle? (is `a` reachable from `b`) */
function wouldCycle(a, b){
  const stack = [b], seen = new Set();
  while (stack.length){
    const n = stack.pop();
    if (n === a) return true;
    if (seen.has(n)) continue;
    seen.add(n);
    for (const w of graph.wires) if (w.a === n) stack.push(w.b);
  }
  return false;
}

function addWire(a, b){
  if (a === b) return false;
  if (!graph.nodes.has(a) || !graph.nodes.has(b)) return false;
  if (graph.nodes.get(a).type === "out") return false;      // out has no output
  if (graph.nodes.get(b).type === "sound") return false;    // sound has no input
  if (graph.wires.some(w => w.a === a && w.b === b)) return false;
  if (wouldCycle(a, b)) return false;
  graph.wires.push({ a, b });
  return true;
}

function removeWire(a, b){
  graph.wires = graph.wires.filter(w => !(w.a === a && w.b === b));
}

/* Cumulative speed for a sound node: product of every distinct PITCH node
   reachable downstream of it. */
function speedFor(soundId){
  let speed = 1;
  const stack = [soundId], seen = new Set();
  while (stack.length){
    const n = stack.pop();
    if (seen.has(n)) continue;
    seen.add(n);
    const node = graph.nodes.get(n);
    if (node && node.type === "pitch" && n !== soundId) speed *= node.params.speed;
    for (const w of graph.wires) if (w.a === n) stack.push(w.b);
  }
  return speed;
}

/* ---------------- share-code (URL hash) ---------------- */
function serializeGraph(){
  const r3 = v => typeof v === "number" ? Math.round(v * 1000) / 1000 : v;
  const o = {
    n: [...graph.nodes.values()].map(n =>
      [n.id, n.type, n.x, n.y, Object.fromEntries(Object.entries(n.params).map(([k, v]) => [k, r3(v)]))]),
    w: graph.wires.map(w => [w.a, w.b]),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(o));
  let bin = "";
  for (const c of bytes) bin += String.fromCharCode(c);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deserializeGraph(code){
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  const o = JSON.parse(new TextDecoder().decode(bytes));
  graph.nodes.clear();
  graph.wires = [];
  let maxSeq = 0;
  for (const [id, type, x, y, params] of o.n){
    if (!NODE_DEFS[type]) continue;
    graph.nodes.set(id, { id, type, x, y, params: { ...NODE_DEFS[type].params, ...params } });
    const m = /\d+$/.exec(id);
    if (m) maxSeq = Math.max(maxSeq, +m[0]);
  }
  graph.seq = maxSeq + 1;
  for (const [a, b] of o.w) addWire(a, b);
  ensureOutNode();
}

function ensureOutNode(){
  if (!graph.nodes.has("out"))
    addNode("out", Math.max(60, innerWidth - 260), Math.round(innerHeight / 2) - 60);
}

let hashTimer = 0;
function syncHash(){
  clearTimeout(hashTimer);
  hashTimer = setTimeout(() => {
    history.replaceState(null, "", "#" + serializeGraph());
  }, 250);
}
