// Renders carousels (PNG) and explainer videos (MP4) from content/<chapter>.mjs.
// Usage: node scripts/render.mjs [carousels|videos|all] [topicIndex] [--chapter ch10] [--voice]
//   --voice: Kokoro voice-over (scripts/voice.py), animated diagrams tweened at 30 fps.
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const { chromium } = createRequire(import.meta.url)("playwright"); // pre-installed globally
const ROOT =path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); if (i < 0) return null; const v = args[i + 1]; args.splice(i, v && !v.startsWith("--") ? 2 : 1); return v ?? true; };
const CH = flag("--chapter") || "ch01";
const VOICE = !!flag("--voice");
const OUT = CH === "ch01" ? path.join(ROOT, "out") : path.join(ROOT, "out", CH);
const what = args[0] || "all";
const only = args[1] !== undefined ? Number(args[1]) : null;

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1350 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("PAGE ERROR", e.message));
await page.goto(`${base}/templates/render.html?ch=${CH}`);
await page.waitForFunction(() => window.R && window.READY);
await page.evaluate(() => window.READY);
const manifest = await page.evaluate(() => R.manifest());

const todo = manifest.map((t, i) => i).filter((i) => only === null || i === only);

if (what === "carousels" || what === "all") {
  for (const ti of todo) {
    const t = manifest[ti];
    const dir = path.join(OUT, "carousels", t.id);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (let si = 0; si < t.slides.length; si++) {
      const name = String(si + 1).padStart(2, "0");
      // MCQs get a question-only image first, then the answer image, for self-testing.
      if (t.slides[si].kind === "mcq") {
        await page.evaluate(([a, b]) => R.carousel(a, b, 0), [ti, si]);
        await page.locator("#stage > .sl").screenshot({ path: path.join(dir, `${name}a-question.png`) });
      }
      const fsz = await page.evaluate(([a, b]) => R.carousel(a, b), [ti, si]);
      if (fsz <= 18) console.warn(`  ! ${t.id} slide ${si + 1} hit minimum font size`);
      const suffix = t.slides[si].kind === "mcq" ? "b-answer" : "";
      await page.locator("#stage > .sl").screenshot({ path: path.join(dir, `${name}${suffix}.png`) });
    }
    console.log(`carousel ${t.id}: ${t.slides.length} slides`);
  }
}

if ((what === "videos" || what === "all") && !VOICE) {
  const FPS = 30, TFRAMES = 8;
  fs.mkdirSync(path.join(OUT, "videos"), { recursive: true });
  for (const ti of todo) {
    const t = manifest[ti];
    const tmp = path.join(OUT, ".frames", t.id);
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    const totalSteps = t.slides.reduce((a, s) => a + s.steps, 0);
    let done = 0, n = 0;
    const list = [];
    for (let si = 0; si < t.slides.length; si++) {
      const fsz = await page.evaluate(([a, b]) => R.fitLandscape(a, b), [ti, si]);
      for (let step = 0; step < t.slides[si].steps; step++) {
        done++;
        let info;
        for (let f = 0; f < TFRAMES; f++) {
          const p = (f + 1) / TFRAMES;
          info = await page.evaluate(([a, b, c, d, e, g]) => R.frame(a, b, c, d, e, g), [ti, si, step, p, fsz, done / totalSteps]);
          const file = path.join(tmp, `${String(n++).padStart(5, "0")}.jpg`);
          await page.locator("#stage > .vframe").screenshot({ path: file, type: "jpeg", quality: 90 });
          list.push([file, f < TFRAMES - 1 ? 1 / FPS : null, info]);
        }
        // hold the last frame long enough to read it
        let hold = 1.6 + info.chars / 16;
        let cap = info.kind === "points" && t.slides[si].steps === 1 && info.chars > 300 ? 22 : 14;
        if (info.kind === "mcq" && step === 0) hold = Math.max(hold, 9);
        hold = Math.min(Math.max(hold, 3.5), cap);
        list[list.length - 1][1] = hold;
      }
    }
    const concat = list.map(([f, d]) => `file '${f}'\nduration ${d.toFixed(3)}`).join("\n") + `\nfile '${list[list.length - 1][0]}'\n`;
    const listFile = path.join(tmp, "list.txt");
    fs.writeFileSync(listFile, concat);
    const mp4 = path.join(OUT, "videos", `${t.id}.mp4`);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile,
      "-vf", `fps=${FPS},format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-tune", "stillimage",
      "-movflags", "+faststart", mp4]);
    const secs = list.reduce((a, [, d]) => a + d, 0);
    console.log(`video ${t.id}: ${Math.round(secs)}s, ${n} frames`);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if ((what === "videos" || what === "all") && VOICE) {
  const FPS = 30, LEAD = 0.25, TAIL = 0.5, SLIDE_IN = 9, TWEEN = 54;
  const work = path.join(OUT, ".voice");
  fs.mkdirSync(work, { recursive: true });
  fs.mkdirSync(path.join(OUT, "videos"), { recursive: true });
  const narration = await page.evaluate(() => R.narration());
  // 1. Speech for every step (cached by text, so re-runs only synthesise changed lines).
  const steps = todo.map((ti) => narration[ti]).flat(2);
  fs.writeFileSync(path.join(work, "steps.json"), JSON.stringify(steps.map(({ id, speak }) => ({ id, speak }))));
  execFileSync("python3", [path.join(ROOT, "scripts/voice.py"), "tts", path.join(work, "steps.json"), path.join(work, "cache"), path.join(work, "durations.json")], { stdio: "inherit" });
  const durs = JSON.parse(fs.readFileSync(path.join(work, "durations.json"), "utf8"));
  const contents = JSON.parse(await page.evaluate(() => JSON.stringify(R.manifest())));

  // Caption chunks of at most ~110 characters, split at sentence then comma boundaries.
  const chunk = (text) => {
    const out = [];
    for (const sent of text.split(/(?<=[.!?])\s+/)) {
      if (sent.length <= 110) { out.push(sent); continue; }
      let rest = sent;
      while (rest.length > 110) {
        let cut = rest.lastIndexOf(", ", 100);
        if (cut < 40) cut = rest.lastIndexOf(" ", 100);
        out.push(rest.slice(0, cut + 1)); rest = rest.slice(cut + 1).trim();
      }
      if (rest) out.push(rest);
    }
    const merged = [];
    for (const c of out) { if (merged.length && (merged.at(-1) + " " + c).length <= 110) merged[merged.length - 1] += " " + c; else merged.push(c); }
    return merged.length ? merged : [""];
  };

  for (const ti of todo) {
    const t = contents[ti], tSteps = narration[ti];
    const tmp = path.join(OUT, ".frames", t.id);
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.mkdirSync(tmp, { recursive: true });
    const totalSteps = tSteps.reduce((a, s) => a + s.length, 0);
    const list = [], clips = [];
    let n = 0, clock = 0, done = 0;
    const shot = async (si, step, p, at, cap, fsz, prog, dur) => {
      await page.evaluate((a) => R.vframe(...a), [ti, si, step, p, at, cap, prog, fsz]);
      const file = path.join(tmp, `${String(n++).padStart(5, "0")}.jpg`);
      await page.locator("#stage > .vframe").screenshot({ path: file, type: "jpeg", quality: 90 });
      list.push([file, dur]);
    };
    let prevStates = null;
    for (let si = 0; si < tSteps.length; si++) {
      const fsz = await page.evaluate(([a, b]) => R.fitLandscape(a, b), [ti, si]);
      for (const st of tSteps[si]) {
        done++;
        const d = durs[st.id] || { dur: 0 };
        const stepDur = LEAD + Math.max(d.dur, 1.2) + TAIL;
        if (d.path) clips.push({ path: d.path, start: clock + LEAD });
        const chunks = chunk(st.text);
        const total = chunks.reduce((a, c) => a + c.length, 0) || 1;
        const bounds = []; let acc = 0;
        chunks.forEach((c) => { bounds.push(LEAD + (acc / total) * d.dur); acc += c.length; });
        const capAt = (time) => { let k = 0; bounds.forEach((b, i) => { if (time >= b) k = i; }); return chunks[k]; };
        const tween = st.anim && st.step > 0;
        const N = tween ? TWEEN : SLIDE_IN;
        for (let f = 0; f < N; f++) {
          await shot(si, st.step, Math.min(1, (f + 1) / SLIDE_IN), tween ? (f + 1) / N : 1, capAt(f / FPS), fsz, done / totalSteps, 1 / FPS);
        }
        // holds: change caption at each chunk boundary after the transition
        let tNow = N / FPS;
        const later = bounds.map((b, i) => [b, i]).filter(([b]) => b > tNow);
        list[list.length - 1][1] = (later.length ? later[0][0] : stepDur) - tNow + 1 / FPS;
        for (let j = 0; j < later.length; j++) {
          const end = j + 1 < later.length ? later[j + 1][0] : stepDur;
          await shot(si, st.step, 1, 1, chunks[later[j][1]], fsz, done / totalSteps, Math.max(1 / FPS, end - later[j][0]));
        }
        clock += stepDur;
      }
    }
    // video track timing must equal the audio clock
    const vidLen = list.reduce((a, [, d]) => a + d, 0);
    list[list.length - 1][1] += clock - vidLen;
    fs.writeFileSync(path.join(tmp, "list.txt"), list.map(([f, d]) => `file '${f}'\nduration ${d.toFixed(4)}`).join("\n") + `\nfile '${list.at(-1)[0]}'\n`);
    fs.writeFileSync(path.join(tmp, "timeline.json"), JSON.stringify({ total: clock, clips }));
    const wav = path.join(tmp, "voice.wav");
    execFileSync("python3", [path.join(ROOT, "scripts/voice.py"), "mix", path.join(tmp, "timeline.json"), wav]);
    const mp4 = path.join(OUT, "videos", `${t.id}.mp4`);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "list.txt"), "-i", wav,
      "-map", "0:v", "-map", "1:a", "-vf", `fps=${FPS},format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-tune", "animation",
      "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", mp4]);
    console.log(`video ${t.id}: ${Math.round(clock)}s, ${n} frames, ${clips.length} voice clips`);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

await browser.close();
server.close();
