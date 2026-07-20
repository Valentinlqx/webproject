# Ambience Forge

A static website for building **seamless ambience loops** with a friendly
node editor: drop sound nodes, wire them through effects, press play,
export a loopable WAV. No backend, no accounts, no AI — just files.

```
index.html          the whole app (one page)
css/styles.css      styles (sage palette, soft cartoony minimal)
js/graph.js         node-graph model + URL share-code serialization
js/audio.js         Web Audio engine: loop buffers, fx, export
js/editor.js        the visual node editor (drag, wires, knobs)
js/main.js          boot + toolbar
sounds/<category>/  YOUR .wav files go here (folders start empty)
sounds/manifest.json  index of available sounds (generated)
tools/manifest.mjs  regenerates the manifest
templates.json      named share-codes shown as template buttons
SOUND_LIST.md       what sounds to download to fill the library
```

## Run it

Any static file server works. For local use:

```
python -m http.server 8080
# or: npx serve
```

then open http://localhost:8080. (Opening index.html via file:// won't work —
fetch() needs http.)

## Add sounds

1. Download ambience WAVs ([SOUND_LIST.md](SOUND_LIST.md) tells you what to get
   and what search terms to use).
2. Drop them into `sounds/<category>/` — folder names are the categories
   (rain, wind, fire, … add your own folders freely).
3. Rebuild the index: `node tools/manifest.mjs`
4. Refresh the page.

Sounds are automatically crossfade-looped on load, so any clip becomes
seamless. Keep beds dry and event-free (see SOUND_LIST.md tips).

## The node editor

- **+ sound** — picks a WAV from your library; volume + pan knobs.
- **+ reverb / + filter / + delay / + pitch** — effects. Wire freely:
  sound → fx → fx → OUTPUT, several branches allowed, branches merge by
  wiring into the same input.
- Drag from a node's **right port** onto another node to connect.
  Click a wire to remove it. Drag the background to pan.
- **pitch** changes playback speed of the sounds wired into it —
  the same WAV at ×0.8 is a new sound for free.

## Share & templates

The mix lives in the URL (`#…`) at all times: **copy the link = save/share
the mix**. You can also paste a code or link into the "paste a code…" field.
To offer built-in templates, add entries to `templates.json`:

```json
[{ "name": "rainy cabin", "code": "eyJuIjpbW.." }]
```

(the code is whatever is after `#` in the URL of the mix you built).

## Export

Set a duration, press **export wav** — renders offline at 48 kHz/16-bit with
an equal-power crossfade at the loop join. In Godot/Unity, just enable
looping on the imported clip.
