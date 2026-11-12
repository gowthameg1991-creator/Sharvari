// Animated biology diagrams as SVG strings. No dependencies; runs in Node or a browser.
// drawScene(scene, fromState, toState, t) → SVG markup, tweening numeric fields from → to.
// Scenes: "cell" (mitosis + meiosis engine), "wheel" (cell cycle), "graph" (DNA content).

const W = 600, H = 440, CX = 300, CY = 212;
const COL = { ink: "#12261E", muted: "#4A5E55", line: "#B9C7BC", cell: "#F7FAF5", cyto: "#E6F0E9", nuc: "#FFFFFF", spindle: "#7B8F86", plate: "#C08A00", accent: "#1C6B58", tag: "#F3CF5A" };
// 2n = 4: chromosome 0/1 = long homologues, 2/3 = short homologues. Blue = maternal, red = paternal.
const CHROM = [
  { len: 78, col: "#2B5FA8" },
  { len: 78, col: "#C0394B" },
  { len: 50, col: "#6FA0DD" },
  { len: 50, col: "#E58A97" },
];
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;
const r1 = (v) => Math.round(v * 10) / 10;

/* ───────────────────────── state builders (cell scene) ───────────────────────── */
// A state: { cells[5], nuclei[4], centro[4], chromatids[8], fibre, plate[2], sc, chiasma, cond, chromatin, nucleolus, label, tags[] }
const offCell = { x: CX, y: CY, rx: 10, ry: 10, furrow: 0, op: 0, rect: 0, cellPlate: 0 };
const offNuc = { x: CX, y: CY, r: 10, env: 0, chromatin: 0, nucleolus: 0, op: 0 };
const offCen = { x: CX, y: CY, op: 0, aster: 0 };

function base() {
  return {
    cells: [{ x: CX, y: CY, rx: 250, ry: 172, furrow: 0, op: 1, rect: 0, cellPlate: 0 }, offCell, offCell, offCell, offCell],
    nuclei: [{ x: CX, y: CY, r: 104, env: 1, chromatin: 1, nucleolus: 1, op: 1 }, offNuc, offNuc, offNuc],
    centro: [{ x: CX - 14, y: 70, op: 1, aster: 0 }, { x: CX + 14, y: 70, op: 1, aster: 0 }, offCen, offCen],
    chromatids: [],
    fibre: 0, // spindle fibre opacity
    plates: [{ x1: CX, y1: 60, x2: CX, y2: 364, op: 0 }, { x1: 0, y1: 0, x2: 0, y2: 0, op: 0 }],
    sc: 0, nodule: 0, chiasma: 0, chiasmaPos: 0.62,
    label: "", tags: [],
  };
}
// chromatid: {x, y, a(deg), len, b(bend px), w(width), op, col, col2, swap(0..1 tip fraction), pole}
function cd(k, s, x, y, a, o = {}) {
  return { x, y, a, len: CHROM[k].len * (o.lenK ?? 1), b: o.b ?? 0, w: o.w ?? 13, op: o.op ?? 1, col: CHROM[k].col, col2: o.col2 ?? CHROM[k].col, swap: o.swap ?? 0, pole: o.pole ?? s, k, s };
}
// Interphase-like scatter inside the nucleus (sisters overlapping).
const SCATTER = [[262, 176, 25], [336, 170, -35], [270, 254, 70], [336, 252, -12]];
function scatter(gap, w, op, lenK = 1) {
  const out = [];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) {
    const [x, y, a] = SCATTER[k];
    const rad = ((a + 90) * Math.PI) / 180;
    const d = (s ? 1 : -1) * gap;
    out.push(cd(k, s, x + Math.cos(rad) * d, y + Math.sin(rad) * d, a, { w, op, lenK }));
  }
  return out;
}
// Metaphase: vertical stack on the plate, sisters either side.
const STACK_Y = [108, 184, 252, 306];
function plateLine(gap, xo = CX) {
  const out = [];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) out.push(cd(k, s, xo + (s ? gap : -gap), STACK_Y[k], 90, { lenK: 0.82 }));
  return out;
}
function toPoles(dx, bend, w = 13, op = 1) {
  const out = [];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) out.push(cd(k, s, CX + (s ? dx : -dx), lerp(STACK_Y[k], CY, 0.35), 90, { lenK: 0.78, b: (s ? 1 : -1) * bend, w, op }));
  return out;
}
const poles = (st, dx = 228, op = 1, aster = 1) => { st.centro = [{ x: CX - dx, y: CY, op, aster }, { x: CX + dx, y: CY, op, aster }, offCen, offCen]; };

const S = {};
S.interphase = (() => { const st = base(); st.chromatids = scatter(0, 4, 0); st.label = "Interphase"; st.tags = [{ x: 300, y: 110, t: "nucleus" }, { x: 330, y: 218, t: "chromatin" }]; return st; })();
S["prophase-early"] = (() => {
  const st = base(); st.chromatids = scatter(4, 8, 0.75, 1.15);
  st.nuclei[0] = { ...st.nuclei[0], chromatin: 0.35, nucleolus: 0.6 };
  st.centro = [{ x: CX - 90, y: 74, op: 1, aster: 0.6 }, { x: CX + 90, y: 74, op: 1, aster: 0.6 }, offCen, offCen];
  st.label = "Early prophase"; st.tags = [{ x: 210, y: 52, t: "centrosomes move apart" }]; return st;
})();
S["prophase-late"] = (() => {
  const st = base(); st.chromatids = scatter(6, 13, 1);
  st.nuclei[0] = { ...st.nuclei[0], env: 0.25, chromatin: 0, nucleolus: 0 };
  poles(st, 205, 1, 1); st.fibre = 0.35;
  st.label = "Late prophase"; st.tags = [{ x: 96, y: 170, t: "aster" }, { x: 300, y: 118, t: "two chromatids + centromere" }]; return st;
})();
S.metaphase = (() => {
  const st = base(); st.chromatids = plateLine(7);
  st.nuclei[0] = { ...st.nuclei[0], env: 0, chromatin: 0, nucleolus: 0, op: 0 };
  poles(st); st.fibre = 1; st.plates[0].op = 1;
  st.label = "Metaphase"; st.tags = [{ x: 300, y: 48, t: "metaphase plate" }, { x: 96, y: 170, t: "aster" }, { x: 452, y: 330, t: "kinetochore + spindle fibre" }]; return st;
})();
S["anaphase-early"] = (() => {
  const st = base(); st.chromatids = toPoles(60, 16);
  st.nuclei[0] = { ...offNuc }; poles(st); st.fibre = 1; st.plates[0].op = 0.35;
  st.label = "Anaphase"; st.tags = [{ x: 300, y: 48, t: "centromeres split" }]; return st;
})();
S["anaphase-late"] = (() => {
  const st = base(); st.chromatids = toPoles(150, 22);
  st.nuclei[0] = { ...offNuc }; poles(st); st.fibre = 0.9; st.plates[0].op = 0;
  st.label = "Late anaphase"; st.tags = [{ x: 300, y: 48, t: "centromere leads, arms trail" }]; return st;
})();
function telo(st, furrow) {
  st.chromatids = toPoles(165, 6, 6, 0.4);
  st.chromatids.forEach((c) => { c.len *= 0.62; c.y = lerp(c.y, CY, 0.55); });
  st.nuclei = [{ x: CX - 165, y: CY, r: 66, env: 1, chromatin: 0.8, nucleolus: 1, op: 1 }, { x: CX + 165, y: CY, r: 66, env: 1, chromatin: 0.8, nucleolus: 1, op: 1 }, offNuc, offNuc];
  poles(st, 238, 0.5, 0.2); st.fibre = 0.1; st.cells[0].furrow = furrow;
}
S.telophase = (() => { const st = base(); telo(st, 0.28); st.label = "Telophase"; st.tags = [{ x: 135, y: 128, t: "nuclear envelope reforms" }, { x: 420, y: 300, t: "nucleolus reappears" }]; return st; })();
S["cyto-animal-mid"] = (() => { const st = base(); telo(st, 0.7); st.chromatids.forEach((c) => (c.op = 0.15)); st.label = "Cytokinesis (animal)"; st.tags = [{ x: 300, y: 60, t: "furrow deepens" }]; return st; })();
S["cyto-animal"] = (() => {
  const st = base(); telo(st, 1); st.chromatids.forEach((c) => (c.op = 0)); st.nuclei.forEach((n) => (n.chromatin = n.op));
  st.centro = [{ x: CX - 165, y: 120, op: 1, aster: 0 }, { x: CX + 165, y: 120, op: 1, aster: 0 }, offCen, offCen];
  st.label = "Two daughter cells"; st.tags = [{ x: 300, y: 60, t: "furrow meets in the centre" }]; return st;
})();
function plant(st, plate) {
  telo(st, 0); st.cells[0] = { ...st.cells[0], rect: 1, cellPlate: plate };
  st.centro = [offCen, offCen, offCen, offCen];
  st.chromatids.forEach((c) => (c.op = plate > 0 ? 0.12 : 0.45));
}
S["plant-telophase"] = (() => { const st = base(); plant(st, 0); st.label = "Plant cell · telophase"; st.tags = [{ x: 300, y: 32, t: "rigid cell wall" }]; return st; })();
S["plant-plate"] = (() => { const st = base(); plant(st, 0.45); st.label = "Cell plate grows from centre"; st.tags = [{ x: 300, y: 32, t: "cell plate: centre → outward" }]; return st; })();
S["plant-done"] = (() => { const st = base(); plant(st, 1); st.chromatids.forEach((c) => (c.op = 0)); st.label = "New wall complete"; st.tags = [{ x: 300, y: 32, t: "middle lamella" }]; return st; })();
S.syncytium4 = (() => {
  const st = base(); st.chromatids = scatter(0, 4, 0);
  st.nuclei = [[205, 150], [395, 150], [205, 278], [395, 278]].map(([x, y]) => ({ x, y, r: 52, env: 1, chromatin: 1, nucleolus: 1, op: 1 }));
  st.centro = [offCen, offCen, offCen, offCen];
  st.label = "Syncytium: many nuclei, one cell"; st.tags = [{ x: 300, y: 32, t: "karyokinesis without cytokinesis" }]; return st;
})();

// ── Meiosis ──
// Pair positions in the nucleus during prophase I: homologue k at x offset; sisters ±sg.
function bivalents(hg, sg, w, op, cx = [258, 350], cy = [204, 222], angle = 86) {
  const out = [];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) {
    const pair = k >> 1, side = k & 1 ? 1 : -1;
    const x = cx[pair] + side * hg + (s ? sg : -sg), y = cy[pair];
    out.push(cd(k, s, x, y, angle, { w: w * 1.2, op, lenK: 1.55 }));
  }
  return out;
}
const crossover = (arr) => arr.forEach((c) => {
  // inner non-sister chromatids exchange tips: k even/s=1 with k odd/s=0
  if ((c.k % 2 === 0 && c.s === 1) || (c.k % 2 === 1 && c.s === 0)) { c.col2 = CHROM[c.k ^ 1].col; c.swap = 0.38; }
});
S.leptotene = (() => { const st = base(); st.chromatids = scatter(2, 6, 0.85, 1.15); st.nuclei[0].chromatin = 0.3; st.label = "Leptotene"; st.tags = [{ x: 300, y: 92, t: "chromosomes become visible" }]; return st; })();
S.zygotene = (() => { const st = base(); st.chromatids = bivalents(9, 2, 7, 0.95); st.nuclei[0].chromatin = 0; st.sc = 1; st.label = "Zygotene · synapsis"; st.tags = [{ x: 300, y: 92, t: "homologues pair (synaptonemal complex)" }]; return st; })();
S.pachytene = (() => { const st = base(); st.chromatids = bivalents(13, 5, 9, 1); st.nuclei[0].chromatin = 0; st.sc = 0.6; st.nodule = 1; st.label = "Pachytene · tetrad"; st.tags = [{ x: 300, y: 92, t: "4 chromatids · recombination nodules" }]; return st; })();
S["pachytene-x"] = (() => { const st = S.pachytene; const s2 = JSON.parse(JSON.stringify(st)); crossover(s2.chromatids); s2.label = "Pachytene · crossing over"; s2.tags = [{ x: 300, y: 92, t: "non-sister chromatids exchange segments" }]; return s2; })();
S.diplotene = (() => { const st = base(); st.chromatids = bivalents(24, 5, 10, 1); crossover(st.chromatids); st.nuclei[0].chromatin = 0; st.nuclei[0].nucleolus = 0.7; st.chiasma = 1; st.label = "Diplotene · chiasmata"; st.tags = [{ x: 300, y: 92, t: "X-shaped chiasmata hold homologues" }]; return st; })();
S.diakinesis = (() => {
  const st = base(); st.chromatids = bivalents(22, 6, 11, 1); crossover(st.chromatids);
  st.nuclei[0] = { ...st.nuclei[0], env: 0.2, chromatin: 0, nucleolus: 0 }; st.chiasma = 1; st.chiasmaPos = 0.95;
  poles(st, 205, 1, 0.8); st.fibre = 0.3;
  st.label = "Diakinesis · terminalisation"; st.tags = [{ x: 300, y: 92, t: "chiasmata move to the ends" }]; return st;
})();
function mI(gap) {
  const out = [];
  const Y = [124, 124, 286, 286];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) {
    // pair B lands the other way round (independent assortment): red left, blue right
    const side = k === 0 || k === 3 ? -1 : 1;
    out.push(cd(k, s, CX + side * gap + (s ? 5 : -5), Y[k], 90, { w: 12, pole: side < 0 ? 0 : 1 }));
  }
  crossover(out); return out;
}
S["metaphase-1"] = (() => { const st = base(); st.chromatids = mI(15); st.nuclei[0] = { ...offNuc }; poles(st); st.fibre = 1; st.plates[0].op = 1; st.label = "Metaphase I"; st.tags = [{ x: 300, y: 48, t: "bivalents on the equatorial plate" }]; return st; })();
S["anaphase-1"] = (() => {
  const st = base(); st.chromatids = mI(150); st.chromatids.forEach((c) => { c.b = (c.pole ? 1 : -1) * 14; c.y = lerp(c.y, CY, 0.3); });
  st.nuclei[0] = { ...offNuc }; poles(st); st.fibre = 0.9; st.label = "Anaphase I";
  st.tags = [{ x: 300, y: 48, t: "homologues separate; sisters stay joined" }]; return st;
})();
S["telophase-1"] = (() => {
  const st = base(); st.chromatids = mI(165); st.chromatids.forEach((c) => { c.y = lerp(c.y, CY, 0.62); c.len *= 0.6; c.op = 0.8; c.w = 9; c.x += (c.pole ? -1 : 1) * 0; });
  st.nuclei = [{ x: CX - 165, y: CY, r: 70, env: 1, chromatin: 0, nucleolus: 1, op: 1 }, { x: CX + 165, y: CY, r: 70, env: 1, chromatin: 0, nucleolus: 1, op: 1 }, offNuc, offNuc];
  poles(st, 238, 0.4, 0); st.fibre = 0; st.cells[0].furrow = 0.4; st.label = "Telophase I"; st.tags = [{ x: 300, y: 48, t: "each pole gets half the chromosomes" }]; return st;
})();
S.dyad = (() => { const st = JSON.parse(JSON.stringify(S["telophase-1"])); st.cells[0].furrow = 1; st.label = "Dyad · interkinesis"; st.tags = [{ x: 300, y: 48, t: "no DNA replication in interkinesis" }]; return st; })();
// Meiosis II: two cells, vertical spindles, chromosomes horizontal.
const MII = [165, 435];
function mII(phase) {
  const out = [];
  // left cell keeps chromosomes 0 (blue long) & 3 (red short); right keeps 1 & 2 (from mI sides)
  const owner = [0, 1, 1, 0];
  const slot = [-1, -1, 1, 1];
  for (let k = 0; k < 4; k++) for (let s = 0; s < 2; s++) {
    const cx = MII[owner[k]] + slot[k] * 40;
    let c;
    if (phase === "P") c = cd(k, s, cx, CY + (s ? 6 : -6) + (k % 2 ? 18 : -18), 20 * slot[k], { w: 12 });
    if (phase === "M") c = cd(k, s, cx, CY + (s ? 6 : -6), 0, { w: 12, lenK: 0.8, pole: owner[k] * 2 + s });
    if (phase === "A") c = cd(k, s, cx, CY + (s ? 88 : -88), 0, { w: 11, lenK: 0.72, b: (s ? 1 : -1) * 12, pole: owner[k] * 2 + s });
    if (phase === "T") c = cd(k, s, cx * 0.85 + MII[owner[k]] * 0.15, CY + (s ? 92 : -92), 0, { w: 6, lenK: 0.5, op: 0.4 });
    out.push(c);
  }
  crossover(out); return out;
}
function twoCells(st) {
  st.cells = [{ ...st.cells[0], op: 0 }, { x: MII[0], y: CY, rx: 128, ry: 168, furrow: 0, op: 1, rect: 0, cellPlate: 0 }, { x: MII[1], y: CY, rx: 128, ry: 168, furrow: 0, op: 1, rect: 0, cellPlate: 0 }, offCell, offCell];
}
S["prophase-2"] = (() => { const st = base(); twoCells(st); st.chromatids = mII("P"); st.nuclei = [offNuc, offNuc, offNuc, offNuc]; st.centro = MII.map((x) => ({ x, y: 70, op: 1, aster: 0.5 })).concat([offCen, offCen]); st.label = "Prophase II"; st.tags = [{ x: 300, y: 30, t: "nuclear membrane disappears" }]; return st; })();
S["metaphase-2"] = (() => {
  const st = base(); twoCells(st); st.chromatids = mII("M"); st.nuclei = [offNuc, offNuc, offNuc, offNuc];
  st.centro = [{ x: MII[0], y: 58, op: 1, aster: 1 }, { x: MII[0], y: 366, op: 1, aster: 1 }, { x: MII[1], y: 58, op: 1, aster: 1 }, { x: MII[1], y: 366, op: 1, aster: 1 }];
  st.fibre = 1; st.plates = [{ x1: 50, y1: CY, x2: 280, y2: CY, op: 1 }, { x1: 320, y1: CY, x2: 550, y2: CY, op: 1 }];
  st.label = "Metaphase II"; st.tags = [{ x: 300, y: 30, t: "chromosomes at the equator of each cell" }]; return st;
})();
S["anaphase-2"] = (() => { const st = JSON.parse(JSON.stringify(S["metaphase-2"])); st.chromatids = mII("A"); st.plates.forEach((p) => (p.op = 0.2)); st.label = "Anaphase II"; st.tags = [{ x: 300, y: 30, t: "centromeres split; sisters separate" }]; return st; })();
S["telophase-2"] = (() => {
  const st = base(); st.chromatids = mII("T");
  const Q = [[165, 118], [165, 306], [435, 118], [435, 306]];
  st.cells = [{ ...offCell }].concat(Q.map(([x, y]) => ({ x, y, rx: 122, ry: 88, furrow: 0, op: 1, rect: 0, cellPlate: 0 })));
  st.nuclei = Q.map(([x, y]) => ({ x, y, r: 40, env: 1, chromatin: 0.9, nucleolus: 1, op: 1 }));
  st.centro = [offCen, offCen, offCen, offCen];
  st.label = "Telophase II · tetrad of cells"; st.tags = [{ x: 300, y: 214, t: "4 haploid cells" }]; return st;
})();

/* ───────────────────────── interpolation ───────────────────────── */
function mix(a, b, t) {
  if (typeof a === "number" && typeof b === "number") return lerp(a, b, t);
  if (Array.isArray(a) && Array.isArray(b)) return b.map((v, i) => (i < a.length ? mix(a[i], v, t) : v));
  if (a && b && typeof a === "object") { const o = {}; for (const k in b) o[k] = k in a ? mix(a[k], b[k], t) : b[k]; return o; }
  return t < 0.5 ? a : b;
}
function mixColor(c1, c2, t) {
  if (c1 === c2) return c2;
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [a, b] = [p(c1), p(c2)];
  return "#" + a.map((v, i) => Math.round(lerp(v, b[i], t)).toString(16).padStart(2, "0")).join("");
}

/* ───────────────────────── drawing (cell scene) ───────────────────────── */
function cellPath(c) {
  if (c.rect > 0.5) return `<rect x="${c.x - c.rx}" y="${c.y - c.ry}" width="${c.rx * 2}" height="${c.ry * 2}" rx="10" fill="${COL.cyto}" stroke="#5E7A55" stroke-width="9"/>`;
  const pts = [];
  for (let i = 0; i < 96; i++) {
    const th = (i / 96) * Math.PI * 2;
    const x = c.x + c.rx * Math.cos(th);
    let y = c.y + c.ry * Math.sin(th);
    const pinch = c.furrow * Math.exp(-Math.pow((x - c.x) / (c.rx * 0.28), 2));
    y = c.y + (y - c.y) * (1 - pinch * 0.985);
    pts.push(`${r1(x)},${r1(y)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${COL.cyto}" stroke="${COL.ink}" stroke-width="3" stroke-linejoin="round" opacity="${r1(c.op)}"/>`;
}
function chromatidPath(c, t2) {
  const rad = (c.a * Math.PI) / 180, dx = Math.cos(rad) * c.len / 2, dy = Math.sin(rad) * c.len / 2;
  const nx = -Math.sin(rad), ny = Math.cos(rad);
  const p0 = [c.x - dx, c.y - dy], p2 = [c.x + dx, c.y + dy], p1 = [c.x + nx * c.b * 2, c.y + ny * c.b * 2];
  const at = (t) => [(1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
  const seg = (t0, t1) => { const pts = []; for (let i = 0; i <= 10; i++) pts.push(at(lerp(t0, t1, i / 10)).map(r1).join(",")); return pts.join(" "); };
  const w = r1(c.w);
  const split = 1 - c.swap;
  let s = `<polyline points="${seg(0, c.swap > 0.01 ? split : 1)}" fill="none" stroke="${c.col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  if (c.swap > 0.01) s += `<polyline points="${seg(split, 1)}" fill="none" stroke="${c.col2}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const mid = at(0.5);
  return { svg: `<g opacity="${r1(c.op)}">${s}</g>`, mid, at };
}
function drawCell(st) {
  let svg = "";
  st.cells.forEach((c) => { if (c.op > 0.02) svg += `<g opacity="${r1(c.op)}">${cellPath(c)}</g>`; });
  // cell plate
  st.cells.forEach((c) => {
    if (c.rect > 0.5 && c.cellPlate > 0.01) {
      const h = c.ry * c.cellPlate;
      svg += `<line x1="${c.x}" y1="${r1(c.y - h)}" x2="${c.x}" y2="${r1(c.y + h)}" stroke="#5E7A55" stroke-width="${r1(4 + 5 * c.cellPlate)}" stroke-linecap="round"/>`;
      if (c.cellPlate < 0.98) svg += `<g fill="#8FB07F">${[-1, 1].map((d) => `<circle cx="${c.x}" cy="${r1(c.y + d * (h + 10))}" r="5"/>`).join("")}</g>`;
    }
  });
  // nuclei
  st.nuclei.forEach((n, i) => {
    if (n.op < 0.02) return;
    svg += `<g opacity="${r1(n.op)}">`;
    if (n.env > 0.02) svg += `<circle cx="${r1(n.x)}" cy="${r1(n.y)}" r="${r1(n.r)}" fill="${COL.nuc}" fill-opacity="${r1(0.75 * n.env)}" stroke="${COL.muted}" stroke-width="3" stroke-dasharray="${n.env < 0.6 ? "6 9" : "none"}" opacity="${r1(Math.min(1, n.env * 1.3))}"/>`;
    if (n.chromatin > 0.02) {
      const s = n.r / 104;
      svg += `<path d="M${-60 * s},${-20 * s} q${15 * s},${-30 * s} ${30 * s},0 t${30 * s},0 t${30 * s},0 t${30 * s},0 M${-55 * s},${25 * s} q${12 * s},${25 * s} ${25 * s},0 t${25 * s},0 t${25 * s},0 t${25 * s},0 M${-20 * s},${-55 * s} q${-25 * s},${15 * s} 0,${30 * s} t0,${30 * s}" transform="translate(${r1(n.x)},${r1(n.y)})" fill="none" stroke="#7A6CB0" stroke-width="2.5" opacity="${r1(n.chromatin)}"/>`;
    }
    if (n.nucleolus > 0.02) svg += `<circle cx="${r1(n.x + n.r * 0.38)}" cy="${r1(n.y + n.r * 0.32)}" r="${r1(n.r * 0.17)}" fill="#3D5249" opacity="${r1(n.nucleolus)}"/>`;
    svg += `</g>`;
  });
  // plates
  st.plates.forEach((p) => { if (p.op > 0.02) svg += `<line x1="${r1(p.x1)}" y1="${r1(p.y1)}" x2="${r1(p.x2)}" y2="${r1(p.y2)}" stroke="${COL.plate}" stroke-width="3" stroke-dasharray="10 8" opacity="${r1(p.op)}"/>`; });
  // chromatids (geometry first, for fibres)
  const geo = st.chromatids.map((c) => chromatidPath(c));
  // spindle fibres
  if (st.fibre > 0.02) {
    let f = "";
    st.chromatids.forEach((c, i) => {
      const p = st.centro[c.pole] || st.centro[0];
      if (!p || p.op < 0.1 || c.op < 0.1) return;
      const [mx, my] = geo[i].mid;
      f += `<line x1="${r1(p.x)}" y1="${r1(p.y)}" x2="${r1(mx)}" y2="${r1(my)}"/>`;
    });
    for (let i = 0; i + 1 < st.centro.length; i += 2) {
      const a = st.centro[i], b = st.centro[i + 1];
      if (a.op > 0.1 && b.op > 0.1) [-30, 30].forEach((o) => {
        const vert = Math.abs(a.x - b.x) < Math.abs(a.y - b.y);
        const mx = (a.x + b.x) / 2 + (vert ? o * 1.6 : 0), my = (a.y + b.y) / 2 + (vert ? 0 : o * 2.6);
        f += `<path d="M${r1(a.x)},${r1(a.y)} Q${r1(mx)},${r1(my)} ${r1(b.x)},${r1(b.y)}" fill="none"/>`;
      });
    }
    svg += `<g stroke="${COL.spindle}" stroke-width="1.6" opacity="${r1(st.fibre * 0.85)}">${f}</g>`;
  }
  // centrosomes + asters
  st.centro.forEach((c) => {
    if (c.op < 0.02) return;
    let rays = "";
    if (c.aster > 0.02) for (let i = 0; i < 14; i++) { const th = (i / 14) * Math.PI * 2; rays += `<line x1="${r1(c.x)}" y1="${r1(c.y)}" x2="${r1(c.x + Math.cos(th) * 30 * c.aster)}" y2="${r1(c.y + Math.sin(th) * 30 * c.aster)}"/>`; }
    svg += `<g opacity="${r1(c.op)}"><g stroke="${COL.spindle}" stroke-width="1.6">${rays}</g><circle cx="${r1(c.x)}" cy="${r1(c.y)}" r="7" fill="${COL.accent}"/></g>`;
  });
  // synaptonemal complex rungs between homologues 0-1 and 2-3
  if (st.sc > 0.02) {
    let r = "";
    [[0, 2], [4, 6]].forEach(([i, j]) => {
      const A = geo[i + 1], B = geo[j];
      for (let q = 1; q < 8; q++) { const a = A.at(q / 8), b = B.at(q / 8); r += `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`; }
    });
    svg += `<g stroke="#9A8A3A" stroke-width="2" opacity="${r1(st.sc)}">${r}</g>`;
  }
  svg += geo.map((g) => g.svg).join("");
  // kinetochores / centromeres
  st.chromatids.forEach((c, i) => { if (c.op > 0.3 && c.w > 7) { const [mx, my] = geo[i].mid; svg += `<circle cx="${r1(mx)}" cy="${r1(my)}" r="${r1(c.w * 0.33)}" fill="${COL.ink}" opacity="${r1(c.op)}"/>`; } });
  // recombination nodules
  if (st.nodule > 0.02) [[2, 3], [6, 7]].forEach(([i, j]) => {
    const p = geo[i - 1].at(0.75), q = geo[i].at(0.75);
    svg += `<circle cx="${r1((p[0] + q[0]) / 2 + 9)}" cy="${r1((p[1] + q[1]) / 2)}" r="7" fill="${COL.tag}" stroke="${COL.ink}" stroke-width="1.5" opacity="${r1(st.nodule)}"/>`;
  });
  // chiasmata: X between inner non-sister chromatids
  if (st.chiasma > 0.02) [[1, 2], [5, 6]].forEach(([i, j]) => {
    const a = geo[i].at(st.chiasmaPos), b = geo[j].at(st.chiasmaPos), a2 = geo[i].at(st.chiasmaPos - 0.12), b2 = geo[j].at(st.chiasmaPos - 0.12);
    svg += `<g stroke="${COL.ink}" stroke-width="3" stroke-linecap="round" opacity="${r1(st.chiasma)}"><line x1="${r1(a2[0])}" y1="${r1(a2[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/><line x1="${r1(b2[0])}" y1="${r1(b2[1])}" x2="${r1(a[0])}" y2="${r1(a[1])}"/></g>`;
  });
  return svg;
}
function tagsSvg(tags, op) {
  return tags.map((g) => `<g opacity="${r1(op)}"><text x="${g.x}" y="${g.y}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="15" fill="${COL.ink}" paint-order="stroke" stroke="#EDF1EA" stroke-width="5">${g.t}</text></g>`).join("");
}

/* ───────────────────────── wheel scene ───────────────────────── */
// Illustrative proportions (not to scale for M phase so it stays visible).
const ARCS = [["G1", 0, 0.42, "#6FA0DD"], ["S", 0.42, 0.70, "#1C6B58"], ["G2", 0.70, 0.90, "#C08A00"], ["M", 0.90, 1, "#C0394B"]];
const WHEEL = {
  all: { hi: -1, ptr: 0.0, g0: 0, inter: 0 },
  interphase: { hi: -2, ptr: 0.45, g0: 0, inter: 1 },
  G1: { hi: 0, ptr: 0.21, g0: 0, inter: 0 },
  S: { hi: 1, ptr: 0.56, g0: 0, inter: 0 },
  G2: { hi: 2, ptr: 0.8, g0: 0, inter: 0 },
  M: { hi: 3, ptr: 0.95, g0: 0, inter: 0 },
  G0: { hi: 0, ptr: 0.12, g0: 1, inter: 0 },
};
function drawWheel(a, b, t) {
  const st = mix(a, b, t), hi = t < 0.5 ? a.hi : b.hi;
  const cx = 270, cy = 222, R = 150, w = 54;
  const pt = (f, r) => { const th = f * Math.PI * 2 - Math.PI / 2; return [cx + Math.cos(th) * r, cy + Math.sin(th) * r]; };
  let s = "";
  ARCS.forEach(([name, f0, f1, col], i) => {
    const on = hi === -1 || hi === i || (hi === -2 && i < 3);
    const [x0, y0] = pt(f0 + 0.004, R), [x1, y1] = pt(f1 - 0.004, R), [x2, y2] = pt(f1 - 0.004, R - w), [x3, y3] = pt(f0 + 0.004, R - w);
    const large = f1 - f0 > 0.5 ? 1 : 0;
    s += `<path d="M${r1(x0)},${r1(y0)} A${R},${R} 0 ${large} 1 ${r1(x1)},${r1(y1)} L${r1(x2)},${r1(y2)} A${R - w},${R - w} 0 ${large} 0 ${r1(x3)},${r1(y3)} Z" fill="${col}" opacity="${on ? 1 : 0.22}"/>`;
    const [lx, ly] = pt((f0 + f1) / 2, R - w / 2);
    s += `<text x="${r1(lx)}" y="${r1(ly + 7)}" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="${name === "M" ? 18 : 24}" fill="#fff" opacity="${on ? 1 : 0.5}">${name}</text>`;
  });
  // interphase bracket
  if (st.inter > 0.02) { const [x0, y0] = pt(0.0, R + 18), [x1, y1] = pt(0.9, R + 18); s += `<path d="M${r1(x0)},${r1(y0)} A${R + 18},${R + 18} 0 1 1 ${r1(x1)},${r1(y1)}" fill="none" stroke="${COL.ink}" stroke-width="3" opacity="${r1(st.inter)}"/><text x="${cx}" y="${cy + R + 52}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="17" fill="${COL.ink}" opacity="${r1(st.inter)}">interphase &gt; 95%</text>`; }
  // pointer
  const [px, py] = pt(st.ptr, R - w - 18);
  s += `<line x1="${cx}" y1="${cy}" x2="${r1(px)}" y2="${r1(py)}" stroke="${COL.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="10" fill="${COL.ink}"/>`;
  // G0 loop
  if (st.g0 > 0.02) {
    const [gx, gy] = pt(0.16, R + 4);
    s += `<g opacity="${r1(st.g0)}"><path d="M${r1(gx)},${r1(gy)} C${r1(gx + 120)},${r1(gy - 70)} ${r1(gx + 170)},${r1(gy + 40)} ${r1(gx + 110)},${r1(gy + 70)}" fill="none" stroke="#7A6CB0" stroke-width="4" stroke-dasharray="8 6"/><circle cx="${r1(gx + 120)}" cy="${r1(gy + 72)}" r="34" fill="#7A6CB0"/><text x="${r1(gx + 120)}" y="${r1(gy + 80)}" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="24" fill="#fff">G0</text><text x="${r1(gx + 120)}" y="${r1(gy + 126)}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="${COL.ink}">quiescent</text></g>`;
  }
  s += `<text x="590" y="24" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" fill="${COL.muted}">not to scale · human cell ≈ 24 h</text>`;
  return s;
}

/* ───────────────────────── DNA graph scene ───────────────────────── */
const GX = ["G1", "S", "G2", "M", "after"];
const GRAPH = {
  "dna-G1": { mode: 0, reveal: 0.2 }, "dna-S": { mode: 0, reveal: 0.42 }, "dna-G2": { mode: 0, reveal: 0.62 },
  "dna-M": { mode: 0, reveal: 0.82 }, "dna-done": { mode: 0, reveal: 1 }, "meio-all": { mode: 1, reveal: 1 },
};
function drawGraph(a, b, t) {
  const st = mix(a, b, t), mode = b.mode;
  const x0 = 80, x1 = 560, y0 = 360, yTop = 70;
  const ys = { "4": yTop + 10, "2": (yTop + y0) / 2 + 20, "1": y0 - 40 };
  const labels = mode ? ["G1", "S", "G2", "Meiosis I", "Meiosis II", "gametes"] : ["G1", "S", "G2", "M phase", "daughter cells"];
  const n = labels.length, step = (x1 - x0) / n;
  // DNA (C) line and chromosome (n) line as point lists over [0..n]
  const dna = mode ? [[0, 2], [1, 2], [2, 4], [3, 4], [4, 2], [5, 1], [6, 1]] : [[0, 2], [1, 2], [2, 4], [3.8, 4], [4, 2], [5, 2]];
  const chr = mode ? [[0, 2], [3.9, 2], [4, 1], [6, 1]] : [[0, 2], [5, 2]];
  const P = (pts) => pts.map(([i, v]) => `${r1(x0 + i * step)},${r1(ys[v] + (pts === chr ? 6 : 0))}`).join(" ");
  const clipW = r1((x1 - x0) * st.reveal + 2);
  const cid = "rv" + Math.random().toString(36).slice(2, 8);
  let s = `<defs><clipPath id="${cid}"><rect x="${x0}" y="0" width="${clipW}" height="${H}"/></clipPath></defs>`;
  s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${COL.ink}" stroke-width="2"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${yTop - 10}" stroke="${COL.ink}" stroke-width="2"/>`;
  [["4", "4C"], ["2", "2C · 2n"], ["1", "C · n"]].forEach(([k, l]) => (s += `<text x="${x0 - 10}" y="${ys[k] + 5}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="15" fill="${COL.muted}">${l}</text><line x1="${x0}" y1="${ys[k]}" x2="${x1}" y2="${ys[k]}" stroke="${COL.line}" stroke-dasharray="4 6"/>`));
  labels.forEach((l, i) => (s += `<text x="${r1(x0 + (i + 0.5) * step)}" y="${y0 + 26}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${mode ? 13 : 15}" fill="${COL.ink}">${l}</text>`));
  s += `<g clip-path="url(#${cid})"><polyline points="${P(dna)}" fill="none" stroke="${COL.accent}" stroke-width="6" stroke-linejoin="round"/><polyline points="${P(chr)}" fill="none" stroke="#C0394B" stroke-width="4" stroke-dasharray="10 7"/></g>`;
  s += `<g font-family="JetBrains Mono, monospace" font-size="15"><rect x="330" y="20" width="16" height="6" fill="${COL.accent}"/><text x="352" y="28" fill="${COL.ink}">DNA content (C)</text><rect x="330" y="40" width="16" height="4" fill="#C0394B"/><text x="352" y="48" fill="${COL.ink}">chromosome number (n)</text></g>`;
  return s;
}

/* ───────────────────────── public API ───────────────────────── */
export const sceneStates = { cell: S, wheel: WHEEL, graph: GRAPH };

export function drawScene(scene, fromName, toName, t = 1) {
  const table = sceneStates[scene];
  const A = table[fromName] || table[toName], B = table[toName];
  if (!B) return `<svg viewBox="0 0 ${W} ${H}"><text x="20" y="40">unknown state ${toName}</text></svg>`;
  const e = ease(Math.max(0, Math.min(1, t)));
  let body;
  if (scene === "cell") {
    const st = mix(A, B, e);
    st.chromatids.forEach((c, i) => { c.col = mixColor(A.chromatids[i]?.col ?? B.chromatids[i].col, B.chromatids[i].col, e); c.col2 = mixColor(A.chromatids[i]?.col2 ?? B.chromatids[i].col2, B.chromatids[i].col2, e); c.pole = B.chromatids[i].pole; });
    st.cells.forEach((c, i) => (c.rect = B.cells[i].rect));
    body = drawCell(st);
    const sameLabel = A.label === B.label;
    body += tagsSvg(B.tags, sameLabel ? 1 : e) + (sameLabel ? "" : tagsSvg(A.tags, 1 - e));
    const lab = (txt, op) => `<text x="16" y="${H - 14}" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="26" fill="${COL.accent}" opacity="${r1(op)}">${txt}</text>`;
    body += sameLabel ? lab(B.label, 1) : lab(A.label, 1 - e) + lab(B.label, e);
    body += `<text x="${W - 14}" y="${H - 16}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" fill="${COL.muted}">example cell · 2n = 4</text>`;
  } else if (scene === "wheel") body = drawWheel(A, B, e);
  else body = drawGraph(A, B, e);
  return `<svg class="anim" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${scene} diagram">${body}</svg>`;
}
