// Shared slide renderer for carousels (portrait), video frames (landscape) and the site.
// Pure DOM-string building + a fit() helper; no dependencies.

const LETTERS = ["A", "B", "C", "D"];
const esc = (s) => String(s);

/** Adds the generated MCQ topic and numbers slides. */
export function buildTopics(data) {
  const topics = data.topics.map((t) => ({ ...t, slides: [...t.slides] }));
  topics.push({
    id: "08-neet-practice",
    short: "NEET practice MCQs",
    title: "NEET practice: 20 MCQs",
    slides: [
      {
        kind: "cover",
        eyebrow: "Practice · Beyond NCERT format",
        title: "20 NEET-style MCQs",
        sub: "Every fact comes from Chapter 1. Pause on each question, answer, then check.",
        say: ["Twenty practice questions. Pause on each one, answer it, then let the answer appear."],
      },
      ...data.mcq.map((m, i) => ({ kind: "mcq", extra: true, n: i + 1, ...m })),
    ],
  });
  return topics;
}

/** Number of reveal steps a slide has in video mode. */
export function stepCount(s) {
  if (s.kind === "cover") return 1;
  if (s.kind === "mcq") return 2;
  if (s.kind === "qa") return 1 + s.a.length;
  return Math.max(1, s.points.length);
}

/** Caption text for a step (video). */
export function captionFor(s, step) {
  if (s.kind === "mcq") return step === 0 ? "Pause the video and choose your answer." : "Answer: " + LETTERS[s.a] + ". " + s.why;
  if (s.kind === "qa") return step === 0 ? "Think of your answer first. The model answer follows." : "";
  return (s.say && s.say[step]) || "";
}

function renderDiagram(d) {
  if (!d) return "";
  switch (d.type) {
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
  const { orient = "portrait", step = null, topic, index = 0, total = 1, chapter = "" } = opts;
  const all = step === null;
  const cls = `sl ${orient} kind-${s.kind}${s.extra ? " is-extra" : ""}`;
  const tag = s.extra ? "NEET tip · Beyond NCERT" : topic.short;
  const top = `<div class="sl-top"><span class="sl-tag">${tag}</span><span>${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span></div>`;
  const foot = `<div class="sl-foot"><span>${chapter}</span><span>NCERT Biology XI</span></div>`;

  if (s.kind === "cover") {
    return `<section class="${cls}">${top}<div class="cv-main"><div class="cv-eyebrow">${s.eyebrow}</div><h1 class="cv-title">${s.title}</h1><p class="cv-sub">${s.sub}</p><div class="cv-specimen">TAXON <i>Homo sapiens</i> · Ch 1</div></div>${foot}</section>`;
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
  const dia = s.diagram ? `<div class="sl-dia">${renderDiagram(s.diagram)}</div>` : "";
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
