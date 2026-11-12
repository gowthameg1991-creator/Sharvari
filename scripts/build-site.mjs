// Inlines content + slide renderer + app into one self-contained page: out/site/index.html
import fs from "node:fs";
import path from "node:path";
const CH = process.argv[2] || "ch01";
const data = (await import(`../content/${CH}.mjs`)).default;

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const strip = (src) => src.replace(/^import .*$/gm, "").replace(/^export \{[^}]*\};?\s*$/m, "").replace(/^export (function|const)/gm, "$1");
const animJs = strip(read("templates/cellanim.js"));
const slidesJs = read("templates/slides.js")
  .replace(/^import .*$/gm, "")
  .replace(/^export \{[^}]*\};?\s*$/m, "")
  .replace(/^export (function|const)/gm, "$1");
const { mustCover, ...pageData } = data;
const js = `const DATA = ${JSON.stringify(pageData)};\n${animJs}\n${slidesJs}\n${read("site/app.js")}`.replace(/<\/script/gi, "<\\/script");
const css = read("templates/slides.css").replace(/\.vframe[\s\S]*$/, ""); // video-only rules not needed

const nTopics = data.topics.length + 1;
const title = data.short || data.chapter.split("·").pop().trim();
const chapName = data.chapter.split("·")[0].trim();
const vars = {
  TITLE: title, CHAPNAME: chapName, NMCQ: data.mcq.length, PDF: data.source.split("/").pop(),
  EYEBROW: `${data.book.replace("NCERT Biology · Class XI", "NCERT Biology XI")} · NEET revision`,
  LABNAME: data.drills ? "Stage lab" : "Hierarchy lab",
  LEDE: `${chapName}, complete: ${nTopics} ${data.drills ? "voice-over explainer videos with animations" : "explainer videos"}, swipeable slides for every topic, a glossary, a ${data.drills ? "stage lab" : "hierarchy lab"} and ${data.mcq.length} practice MCQs.`,
};
const html = read("site/page.html").replace("/*SLIDES_CSS*/", () => css).replace("/*APP_JS*/", () => js).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k]);
const outDir = CH === "ch01" ? path.join(ROOT, "out", "site") : path.join(ROOT, "out", CH, "site");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("wrote out/site/index.html", (html.length / 1024).toFixed(0) + " KB");
