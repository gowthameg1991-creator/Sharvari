// Shared slide renderer for carousels (portrait), video frames (landscape) and the site.
// Pure DOM-string building + a fit() helper. Animated diagrams come from cellanim.js.
import { drawScene } from "./cellanim.js";

const LETTERS = ["A", "B", "C", "D"];
const esc = (s) => String(s);

/** Adds the generated MCQ topic and numbers slides. */
export function buildTopics(data) {
  const topics = data.topics.map((t) => ({ ...t, slides: [...t.slides] }));
  const n = data.mcq.length;
  const chapNo = (data.chapter.match(/Chapter (\d+)/) || [, ""])[1];
  // Practice comes in sets of about 20 so each video stays short.
  const sets = Math.max(1, Math.round(n / 20)), per = Math.ceil(n / sets);
  for (let k = 0; k < sets; k++) {
    const part = data.mcq.slice(k * per, (k + 1) * per), from = k * per + 1, to = k * per + part.length;
    const label = sets > 1 ? ` · set ${k + 1} of ${sets}` : "";
    topics.push({
      id: String(topics.length + 1).padStart(2, "0") + "-neet-practice" + (sets > 1 ? `-${k + 1}` : ""),
      short: "NEET practice MCQs" + (sets > 1 ? ` ${from}–${to}` : ""),
      title: `NEET practice: ${part.length} MCQs${label}`,
      slides: [
        {
          kind: "cover",
          eyebrow: "Practice · Beyond NCERT format" + label,
          title: sets > 1 ? `NEET MCQs ${from}–${to}` : `${n} NEET-style MCQs`,
          sub: `Every fact comes from Chapter ${chapNo}. Pause on each question, answer, then check.`,
          say: [sets > 1 ? `Practice set ${k + 1} of ${sets}: questions ${from} to ${to}. Pause on each one, answer it, then let the answer appear.` : `${n} practice questions. Pause on each one, answer it, then let the answer appear.`],
        },
        ...part.map((m, i) => ({ kind: "mcq", extra: true, n: from + i, ...m })),
      ],
    });
  }
  return topics;
}

/** Number of reveal steps a slide has in video mode. */
export function stepCount(s) {
  if (s.kind === "cover") return 1;
  if (s.kind === "mcq") return 2;
  if (s.kind === "qa") return 1 + s.a.length;
  return Math.max(1, s.points.length);
}

const plain = (h) => String(h).replace(/<sub>(.*?)<\/sub>/g, "$1").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

/** Caption text for a step (video). With voice=true, every step gets spoken text. */
export function captionFor(s, step, voice = false) {
  if (s.say && s.say[step]) return s.say[step];
  if (s.kind === "mcq") {
    if (!voice) return step === 0 ? "Pause the video and choose your answer." : "Answer: " + LETTERS[s.a] + ". " + s.why;
    return step === 0
      ? `Question ${s.n}. ${plain(s.q)}. ` + s.o.map((o, i) => `${LETTERS[i]}: ${plain(o)}.`).join(" ") + " Pause the video and choose your answer."
      : `The answer is ${LETTERS[s.a]}, ${plain(s.o[s.a])}. ${plain(s.why)}`;
  }
  if (s.kind === "qa") {
    if (!voice) return step === 0 ? "Think of your answer first. The model answer follows." : "";
    return step === 0 ? plain(s.q) + " Think of your answer first." : plain(s.a[step - 1]);
  }
  if (voice && s.kind === "points" && s.points[step]) return plain(s.points[step]);
  return "";
}

/** Text for the speech engine: expands symbols the voice would misread. */
export function speakable(text) {
  return plain(text)
    .replace(/\bG([0-2])\b/g, (_, d) => "G " + ["zero", "one", "two"][d])
    .replace(/\b([248])C\b/g, (_, d) => ({ 2: "two", 4: "four", 8: "eight" })[d] + " C")
    .replace(/\b(\d)n\b/g, (_, d) => ({ 2: "two", 3: "three", 4: "four" })[d] + " n")
    .replace(/(\d)\s*%/g, "$1 percent")
    .replace(/→/g, " to ").replace(/~/g, "about ").replace(/\bEx (\d+)\./g, "Exercise $1.")
    .replace(/\bvs\b/g, "versus").replace(/\be\.g\./g, "for example").replace(/\bi\.e\./g, "that is")
    .replace(/[·•]/g, ",").replace(/\s+/g, " ").trim();
}

function renderDiagram(d, a) {
  if (!d) return "";
  switch (d.type) {
    case "anim":
      return `<div class="dia-anim">${drawScene(d.scene, a.from, a.to, a.t)}</div>`;
    case "nctable":
      return `<table class="dia-table nct"><thead><tr><th>Stage</th><th>Chromosomes (N)</th><th>DNA (C)</th></tr></thead><tbody>${d.rows
        .map(([st, n, c]) => `<tr><th>${st}</th><td>${n}</td><td>${c}</td></tr>`).join("")}</tbody></table>`;
    case "compare":
      return `<div class="dia-compare">${[d.left, d.right]
        .map((c) => `<div><h4>${c.h}</h4>${c.items.map((x) => `<p>${x}</p>`).join("")}</div>`)
        .join("")}</div>`;
    case "binomial": {
      const parts = [
        `<div><span class="bn-word"><em>M</em>angifera</span><span class="bn-brace"></span><span class="bn-label">Generic name<br>(genus · capital)</span></div>`,
        `<div><span class="bn-word"><em>i</em>ndica</span><span class="bn-brace"></span><span class="bn-label">Specific epithet<br>(small letter)</span></div>`,
      ];
      if (d.author)
        parts.push(`<div><span class="bn-word author">Linn.</span><span class="bn-brace"></span><span class="bn-label">Author<br>(abbreviated)</span></div>`);
      return `<div class="dia-binomial"><div class="bn-row">${parts.join("")}</div><div class="bn-note">Mango · Latin · italics in print</div></div>`;
    }
    case "ladder": {
      const ranks = [
        ["Kingdom", ""],
        ["Phylum", "or Division (plants)"],
        ["Class", ""],
        ["Order", ""],
        ["Family", ""],
        ["Genus", ""],
        ["Species", "lowest category"],
      ];
      const rungs = ranks
        .map(([r, s], i) => `<div class="ld-rung" style="width:${8 + i * 1.1}em;align-self:center">${r}${s ? `<small>${s}</small>` : ""}</div>`)
        .join("");
      const trend = d.trend
        ? `<div class="ld-trend"><div>Fewer common characters<br>Harder to relate taxa</div><div class="ld-arrow"></div><div>More common characters<br>(ascending order, Fig 1.1)</div></div>`
        : "";
      return `<div class="dia-ladder"><div class="ld-rungs">${rungs}</div>${trend}</div>`;
    }
    case "tree": {
      const node = (n, cls) =>
        `<div class="tr-node ${cls}">${n.italic ? `<i>${n.label}</i>` : n.label}${n.sub ? `<small>${n.sub}</small>` : ""}</div>`;
      const col = (c) =>
        `<div class="tr-col">${node(c, "lvl1")}${c.children ? `<div class="tr-leaves">${c.children.map((k) => node(k, "")).join("")}</div>` : ""}</div>`;
      return `<div class="dia-tree">${node(d.root, "root")}<div class="tr-kids">${d.root.children.map(col).join("")}</div></div>`;
    }
    case "table11": {
      const cols = ["Man", "Housefly", "Mango", "Wheat"];
      const rows = [
        ["Biological name", ["<i>Homo sapiens</i>", "<i>Musca domestica</i>", "<i>Mangifera indica</i>", "<i>Triticum aestivum</i>"]],
        ["Genus", ["<i>Homo</i>", "<i>Musca</i>", "<i>Mangifera</i>", "<i>Triticum</i>"]],
        ["Family", ["Hominidae", "Muscidae", "Anacardiaceae", "Poaceae"]],
        ["Order", ["Primata", "Diptera", "Sapindales", "Poales"]],
        ["Class", ["Mammalia", "Insecta", "Dicotyledonae", "Monocotyledonae"]],
        ["Phylum / Division", ["Chordata", "Arthropoda", "Angiospermae", "Angiospermae"]],
      ];
      return `<table class="dia-table" lang="en"><thead><tr><th>Common name</th>${cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows
        .map(([h, v]) => `<tr><th>${h}</th>${v.map((x) => `<td>${x}</td>`).join("")}</tr>`)
        .join("")}</tbody></table>`;
    }
    case "timeline":
      return `<ol class="dia-timeline">${d.events.map(([y, e]) => `<li><span class="yr">${y}</span><span class="ev">${e}</span></li>`).join("")}</ol>`;
    case "nested": {
      let inner = "";
      for (let i = d.rings.length - 1; i >= 0; i--) inner = `<div class="ns-ring"><span>${d.rings[i]}</span>${inner}</div>`;
      return `<div class="dia-nested">${inner}</div>`;
    }
    case "chips":
      return `<div class="dia-chips">${d.items.map((x, i) => `${i ? '<span class="arr">→</span>' : ""}<span class="chip">${x}</span>`).join("")}</div>`;
  }
  return "";
}

/**
 * Render one slide.
 * opts: { orient: "portrait"|"landscape", step: number|null (null = all visible),
 *         topic, index, total, chapter }
 */
export function renderSlide(s, opts) {
  const { orient = "portrait", step = null, topic, index = 0, total = 1, chapter = "", specimen = "TAXON <i>Homo sapiens</i> · Ch 1", animT = 1 } = opts;
  const all = step === null;
  const cls = `sl ${orient} kind-${s.kind}${s.extra ? " is-extra" : ""}`;
  const tag = s.extra ? "NEET tip · Beyond NCERT" : topic.short;
  const top = `<div class="sl-top"><span class="sl-tag">${tag}</span><span>${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></div>`;
  const foot = `<div class="sl-foot"><span>${chapter}</span><span>NCERT Biology XI</span></div>`;

  if (s.kind === "cover") {
    return `<section class="${cls}">${top}<div class="cv-main"><div class="cv-eyebrow">${s.eyebrow}</div><h1 class="cv-title">${s.title}</h1><p class="cv-sub">${s.sub}</p><div class="cv-specimen">${specimen}</div></div>${foot}</section>`;
  }

  const vis = (i) => {
    if (all) return "";
    if (i > step) return "step-hidden";
    return i === step ? "step-current" : "";
  };

  if (s.kind === "qa") {
    const ans = s.a.map((x, i) => `<li data-i="${i}" class="${all ? "" : vis(i + 1)}">${x}</li>`).join("");
    return `<section class="${cls}">${top}<div class="sl-body"><div class="qa-label">NCERT exercise</div><h2 class="qa-q">${s.q}</h2><div class="qa-label">Model answer</div><ul class="sl-points">${ans}</ul></div>${foot}</section>`;
  }

  if (s.kind === "mcq") {
    const reveal = all || step >= 1;
    const opts2 = s.o.map((o, i) => `<li class="${reveal && i === s.a ? "correct" : ""}"><span>${LETTERS[i]}</span><div>${o}</div></li>`).join("");
    return `<section class="${cls}">${top}<div class="sl-body"><div class="qa-label">Question ${s.n}</div><h2 class="qa-q">${s.q}</h2><ol class="mcq-opts">${opts2}</ol><div class="mcq-why ${reveal ? "" : "step-hidden"}"><b>Answer ${LETTERS[s.a]}.</b> ${s.why}</div></div>${foot}</section>`;
  }

  const pts = s.points.map((p, i) => `<li data-i="${i}" class="${vis(i)}">${p}</li>`).join("");
  // Animated slides: step i shows anim.states[i]; carousels (step null) show the last state.
  let anim = null, diagram = s.diagram;
  if (s.anim) {
    const st = s.anim.states;
    const i = step === null ? (s.anim.still ? st.indexOf(s.anim.still) : st.length - 1) : Math.min(step, st.length - 1);
    anim = { from: st[Math.max(0, animT < 1 ? i - 1 : i)], to: st[i], t: animT };
    diagram = { type: "anim", scene: s.anim.scene };
  }
  const dia = diagram ? `<div class="sl-dia">${renderDiagram(diagram, anim)}</div>` : "";
  const bodyCls = `sl-body${dia ? " has-diagram" : ""}${s.points.length ? "" : " no-points"}`;
  const list = s.points.length ? `<ul class="sl-points${s.numbered ? " numbered" : ""}">${pts}</ul>` : "";
  // Portrait: diagram above points. Landscape: points left, diagram right (CSS order).
  return `<section class="${cls}">${top}<h2 class="sl-title">${s.title}</h2><div class="${bodyCls}">${dia}${list}</div>${foot}</section>`;
}

/** Shrink the slide's base font size until nothing overflows. */
export function fit(el, max = 36, min = 18) {
  let fs = max;
  el.style.setProperty("--fs", fs + "px");
  const body = el.querySelector(".sl-body") || el;
  const over = () => el.scrollHeight > el.clientHeight + 1 || body.scrollHeight > body.clientHeight + 1 || body.scrollWidth > body.clientWidth + 1;
  while (over() && fs > min) {
    fs -= 1;
    el.style.setProperty("--fs", fs + "px");
  }
  return fs;
}

export { esc };
