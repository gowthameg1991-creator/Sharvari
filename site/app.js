// Revision page logic. DATA, buildTopics, renderSlide and fit are inlined above this by build-site.mjs.
(function () {
  const topics = buildTopics(DATA);
  const $ = (id) => document.getElementById(id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lw:" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("lw:" + k, JSON.stringify(v)); } catch {} },
  };

  /* ---------- routing ---------- */
  const views = ["learn", "glossary", "lab", "quiz"];
  function route() {
    const v = views.includes(location.hash.slice(1)) ? location.hash.slice(1) : "learn";
    views.forEach((x) => { $("v-" + x).hidden = x !== v; });
    document.querySelectorAll("nav.tabs a").forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + v ? "page" : "false"));
    if (v === "learn") layoutSlide();
  }
  window.addEventListener("hashchange", route);

  /* ---------- learn ---------- */
  let ti = Math.min(store.get("topic", 0), topics.length - 1), si = 0;
  const strip = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent; };

  $("topics").innerHTML = topics.map((t, i) => `<button data-i="${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span>${t.short}</button>`).join("");
  $("topics").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) selectTopic(+b.dataset.i); });

  function selectTopic(i) {
    ti = i; si = 0; store.set("topic", i);
    document.querySelectorAll("#topics button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === i)));
    const t = topics[i];
    $("vid-name").textContent = t.id + ".mp4";
    $("video-box").innerHTML = `<video controls preload="metadata" playsinline src="videos/${t.id}.mp4"></video>`;
    $("video-box").querySelector("video").addEventListener("error", () => {
      $("video-box").innerHTML = `<div class="video-missing">This video isn't loaded here. Open <b>${t.id}.mp4</b> from the videos folder.</div>`;
    });
    $("notes").innerHTML = `<div class="panel-label"><span>In this topic</span><span>${t.slides.length} slides</span></div><ul>${t.slides
      .map((s, k) => `<li><a href="#learn" data-k="${k}">${strip(s.title || s.q || "")}</a>${s.extra ? ' <span class="badge-extra">NEET tip</span>' : ""}</li>`).join("")}</ul>`;
    $("dots").innerHTML = t.slides.map((_, k) => `<button data-k="${k}" aria-label="Slide ${k + 1}"></button>`).join("");
    showSlide();
  }
  $("notes").addEventListener("click", (e) => { const a = e.target.closest("a[data-k]"); if (a) { e.preventDefault(); si = +a.dataset.k; showSlide(); $("frame").scrollIntoView({ block: "nearest", behavior: "smooth" }); } });
  $("dots").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { si = +b.dataset.k; showSlide(); } });

  let current = null;
  function showSlide() {
    const t = topics[ti], s = t.slides[si];
    $("frame").innerHTML = renderSlide(s, { orient: "portrait", step: null, topic: t, index: si, total: t.slides.length, chapter: DATA.chapter });
    current = $("frame").firstElementChild;
    current.style.transform = "none";
    fit(current, 54, 18);
    layoutSlide();
    $("count").textContent = `${si + 1} / ${t.slides.length}`;
    $("prev").disabled = si === 0;
    $("next").disabled = si === t.slides.length - 1;
    $("slide-kind").textContent = s.extra ? "NEET tip · beyond NCERT" : s.kind === "qa" ? "NCERT exercise" : "";
    document.querySelectorAll("#dots button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.k === si)));
  }
  function layoutSlide() {
    if (!current) return;
    const w = $("frame").clientWidth;
    if (w) current.style.transform = `scale(${w / 1080})`;
  }
  const step = (d) => { const n = topics[ti].slides.length; si = Math.max(0, Math.min(n - 1, si + d)); showSlide(); };
  $("prev").onclick = () => step(-1);
  $("next").onclick = () => step(1);
  document.addEventListener("keydown", (e) => {
    if ($("v-learn").hidden || /INPUT|SELECT|TEXTAREA|VIDEO/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  let x0 = null;
  $("frame").addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  $("frame").addEventListener("pointerup", (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 40) step(e.clientX < x0 ? 1 : -1); x0 = null; });
  new ResizeObserver(layoutSlide).observe($("frame"));

  /* ---------- glossary ---------- */
  function renderCards() {
    const q = $("gl-q").value.trim().toLowerCase();
    $("cards").innerHTML = DATA.glossary
      .filter(([t, d]) => !q || (t + " " + d).toLowerCase().includes(q))
      .map(([t, d]) => `<button class="card" aria-pressed="false"><span class="term">${t}</span><span class="def">${d}</span><span class="hint">Tap to flip</span></button>`)
      .join("") || `<p class="muted">No term matches “${q.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])}”.</p>`;
  }
  $("gl-q").addEventListener("input", renderCards);
  $("cards").addEventListener("click", (e) => { const c = e.target.closest(".card"); if (c) c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true")); });
  $("gl-all").onclick = () => document.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", "true"));
  $("gl-none").onclick = () => document.querySelectorAll(".card").forEach((c) => c.setAttribute("aria-pressed", "false"));
  renderCards();

  /* ---------- hierarchy lab ---------- */
  const ORDER = ["Species", "Genus", "Family", "Order", "Class", "Phylum / Division", "Kingdom"];
  let built = [];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function ladder(reset) {
    if (reset) { built = []; $("pool").dataset.order = JSON.stringify(shuffle(ORDER)); }
    const pool = JSON.parse($("pool").dataset.order).filter((x) => !built.includes(x));
    $("pool").innerHTML = pool.map((x) => `<button>${x}</button>`).join("");
    $("built").innerHTML = built.map((x, i) => `<span class="${x === ORDER[i] ? "" : "wrong"}">${x}</span>`).join('<span aria-hidden="true" style="background:none;color:var(--muted);padding:8px 0">→</span>');
    const wrong = built.some((x, i) => x !== ORDER[i]);
    $("lad-status").className = "status " + (wrong ? "no" : built.length === 7 ? "ok" : "");
    $("lad-status").textContent = wrong
      ? `Not quite. After ${built[built.findIndex((x, i) => x !== ORDER[i]) - 1] || "nothing"} comes ${ORDER[built.findIndex((x, i) => x !== ORDER[i])]}.`
      : built.length === 7 ? "Correct! Common characters decrease as you go up." : "";
    if (wrong) $("pool").querySelectorAll("button").forEach((b) => (b.disabled = true));
  }
  $("pool").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { built.push(b.textContent); ladder(false); } });
  $("lad-reset").onclick = () => ladder(true);
  ladder(true);

  const T11 = {
    Man: ["Homo sapiens", "Homo", "Hominidae", "Primata", "Mammalia", "Chordata"],
    Housefly: ["Musca domestica", "Musca", "Muscidae", "Diptera", "Insecta", "Arthropoda"],
    Mango: ["Mangifera indica", "Mangifera", "Anacardiaceae", "Sapindales", "Dicotyledonae", "Angiospermae"],
    Wheat: ["Triticum aestivum", "Triticum", "Poaceae", "Poales", "Monocotyledonae", "Angiospermae"],
  };
  const ROWS = ["Biological name", "Genus", "Family", "Order", "Class", "Phylum / Division"];
  let org = "Mango";
  $("org").innerHTML = Object.keys(T11).map((o) => `<button aria-pressed="${o === org}">${o}</button>`).join("");
  $("org").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; org = b.textContent; $("org").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); table(); });
  function table() {
    $("tbl").innerHTML = ROWS.map((r, i) => {
      const opts = [...new Set(Object.values(T11).map((v) => v[i]))].sort();
      return `<label for="t11-${i}">${r}</label><select id="t11-${i}"><option value="">Choose…</option>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
    }).join("");
    $("tbl-status").textContent = "";
  }
  $("tbl-check").onclick = () => {
    let ok = 0;
    ROWS.forEach((_, i) => { const s = $("t11-" + i); const good = s.value === T11[org][i]; ok += good; s.className = s.value ? (good ? "ok" : "no") : ""; });
    $("tbl-status").className = "status " + (ok === 6 ? "ok" : "no");
    $("tbl-status").textContent = ok === 6 ? `All 6 correct for ${org}.` : `${ok} of 6 correct. Fix the red ones.`;
  };
  $("tbl-show").onclick = () => { ROWS.forEach((_, i) => { const s = $("t11-" + i); s.value = T11[org][i]; s.className = "ok"; }); $("tbl-status").className = "status"; $("tbl-status").textContent = ""; };
  table();

  /* ---------- quiz ---------- */
  const Q = DATA.mcq, L = ["A", "B", "C", "D"];
  let qi = 0, answers = [];
  function quiz() {
    const best = store.get("best", null);
    if (qi >= Q.length) {
      const score = answers.filter((a, i) => a === Q[i].a).length;
      if (best === null || score > best) store.set("best", score);
      const missed = Q.map((q, i) => [q, i]).filter(([q, i]) => answers[i] !== q.a);
      $("quiz").innerHTML = `<div class="q-head"><span>Finished</span><span>Best: ${Math.max(score, best ?? 0)} / ${Q.length}</span></div>
        <div class="score-big">${score} / ${Q.length}</div>
        <p>${score === Q.length ? "Perfect. You know this chapter." : score >= 15 ? "Strong. Revise the ones you missed below." : "Watch the videos for the topics below, then try again."}</p>
        ${missed.length ? `<div class="panel-label"><span>Review</span></div><ol style="padding-left:20px;display:grid;gap:10px">${missed.map(([q]) => `<li>${q.q}<br><b>${L[q.a]}. ${q.o[q.a]}</b> <span class="muted">${q.why}</span></li>`).join("")}</ol>` : ""}
        <div class="q-nav"><button class="btn primary" id="q-restart">Start again</button>${missed.length ? '<button class="btn" id="q-wrong">Retry missed only</button>' : ""}</div>`;
      $("q-restart").onclick = () => { qi = 0; answers = []; order = Q.map((_, i) => i); quiz(); };
      const w = $("q-wrong"); if (w) w.onclick = () => { order = missed.map(([, i]) => i); qi = 0; answers = []; retry(); };
      return;
    }
    renderQ(qi, Q.length);
  }
  let order = Q.map((_, i) => i);
  function renderQ(pos, total) {
    const idx = order[pos], q = Q[idx], picked = answers[idx];
    $("quiz").innerHTML = `<div class="q-head"><span>Question ${pos + 1} of ${total}</span><span>Score ${answers.filter((a, i) => a !== undefined && a === Q[i].a).length}</span></div>
      <div class="q-bar"><div style="width:${(pos / total) * 100}%"></div></div>
      <p class="q-text">${q.q}</p>
      <div class="opts">${q.o.map((o, i) => `<button data-i="${i}" ${picked !== undefined ? "disabled" : ""} class="${picked === undefined ? "" : i === q.a ? "ok" : i === picked ? "no" : ""}"><span class="l">${L[i]}</span><span>${o}</span></button>`).join("")}</div>
      ${picked !== undefined ? `<div class="why"><b>${picked === q.a ? "Correct." : "Answer: " + L[q.a] + "."}</b> ${q.why}</div>` : ""}
      <div class="q-nav">${picked !== undefined ? `<button class="btn primary" id="q-next">${pos + 1 === total ? "See score" : "Next question"}</button>` : ""}</div>`;
    $("quiz").querySelectorAll(".opts button").forEach((b) => (b.onclick = () => { answers[idx] = +b.dataset.i; renderQ(pos, total); }));
    const n = $("q-next");
    if (n) { n.focus(); n.onclick = () => { qi = pos + 1; if (qi >= total) finish(); else renderQ(qi, total); }; }
  }
  function finish() {
    if (order.length === Q.length) { quiz(); return; }
    const right = order.filter((i) => answers[i] === Q[i].a).length;
    $("quiz").innerHTML = `<div class="score-big">${right} / ${order.length}</div><p>Retry round done.</p><div class="q-nav"><button class="btn primary" id="q-restart">Full quiz again</button></div>`;
    $("q-restart").onclick = () => { qi = 0; answers = []; order = Q.map((_, i) => i); quiz(); };
  }
  function retry() { renderQ(0, order.length); }
  quiz();

  selectTopic(ti);
  route();
})();
