// Renders carousels (PNG) and silent captioned explainer videos (MP4) from content/ch01.mjs.
// Usage: node scripts/render.mjs [carousels|videos|all] [topicIndex]
import { createRequire } from "node:module";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const { chromium } = createRequire(import.meta.url)("playwright"); // pre-installed globally
const ROOT =path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "out");
const what = process.argv[2] || "all";
const only = process.argv[3] !== undefined ? Number(process.argv[3]) : null;

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
await page.goto(`${base}/templates/render.html`);
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

if (what === "videos" || what === "all") {
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

await browser.close();
server.close();
