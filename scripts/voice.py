"""Voice-over helper for the explainer videos (Kokoro neural TTS, runs offline on CPU).

  python3 scripts/voice.py tts  steps.json  cache_dir  durations.json
      steps.json: [{"id": ..., "speak": ...}, ...]  ->  durations.json: {id: {"path", "dur"}}
  python3 scripts/voice.py mix  timeline.json  out.wav
      timeline.json: {"total": secs, "clips": [{"path", "start"}, ...]}

Setup: pip install kokoro-onnx soundfile; model files in models/ (see README).
"""
import hashlib
import json
import os
import sys

import numpy as np
import soundfile as sf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE, SPEED, LANG, SR = "af_heart", 1.1, "en-us", 24000


def tts(steps_path, cache_dir, out_path):
    steps = json.load(open(steps_path))
    os.makedirs(cache_dir, exist_ok=True)
    kokoro = None
    result = {}
    for i, st in enumerate(steps):
        text = st["speak"].strip()
        key = hashlib.sha1(f"{VOICE}|{SPEED}|{text}".encode()).hexdigest()[:16]
        path = os.path.join(cache_dir, key + ".wav")
        if text and not os.path.exists(path):
            if kokoro is None:
                from kokoro_onnx import Kokoro
                kokoro = Kokoro(os.path.join(ROOT, "models/kokoro-v1.0.onnx"), os.path.join(ROOT, "models/voices-v1.0.bin"))
            audio, sr = kokoro.create(text, voice=VOICE, speed=SPEED, lang=LANG)
            sf.write(path, audio, sr)
            print(f"[{i + 1}/{len(steps)}] {len(audio) / sr:5.1f}s  {text[:60]}", flush=True)
        dur = sf.info(path).duration if text else 0.0
        result[st["id"]] = {"path": path if text else None, "dur": dur}
    json.dump(result, open(out_path, "w"), indent=1)


def mix(timeline_path, out_path):
    tl = json.load(open(timeline_path))
    track = np.zeros(int(tl["total"] * SR) + SR, dtype=np.float32)
    for c in tl["clips"]:
        a, sr = sf.read(c["path"], dtype="float32")
        assert sr == SR, sr
        s = int(c["start"] * SR)
        track[s:s + len(a)] += a[: max(0, len(track) - s)]
    peak = np.abs(track).max() or 1.0
    track = track / max(peak, 1.0) * 0.95 if peak > 1.0 else track
    sf.write(out_path, track[: int(tl["total"] * SR)], SR)


if __name__ == "__main__":
    {"tts": tts, "mix": mix}[sys.argv[1]](*sys.argv[2:])
