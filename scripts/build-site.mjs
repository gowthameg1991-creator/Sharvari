// Inlines content + slide renderer + app into one self-contained page: out/site/index.html
import fs from "node:fs";
import path from "node:path";
import data from "../content/ch01.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const slidesJs = read("templates/slides.js")
  .replace(/^export \{[^}]*\};?\s*$/m, "")
  .replace(/^export (function|const)/gm, "$1");
const js = `const DATA = ${JSON.stringify(data)};\n${slidesJs}\n${read("site/app.js")}`.replace(/<\/script/gi, "<\\/script");
const css = read("templates/slides.css").replace(/\.vframe[\s\S]*$/, ""); // video-only rules not needed

const html = read("site/page.html").replace("/*SLIDES_CSS*/", () => css).replace("/*APP_JS*/", () => js);
const outDir = path.join(ROOT, "out", "site");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("wrote out/site/index.html", (html.length / 1024).toFixed(0) + " KB");
