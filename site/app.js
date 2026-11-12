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
      $("video-box").innerHTML = `<div class="video-missing"><p>This video isn't loaded here. Open <b>${t.id}.mp4</b> from the videos folder.</p></div>`;
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
    stopAnim();
    $("anim-ctl").hidden = !s.anim;
    $("anim-stage").textContent = s.anim ? `${s.anim.states.length} stages` : "";
    $("count").textContent = `${si + 1} / ${t.slides.length}`;
    $("prev").disabled = si === 0;
    $("next").disabled = si === t.slides.length - 1;
    $("slide-kind").textContent = s.extra ? "NEET tip · beyond NCERT" : s.kind === "qa" ? "NCERT exercise" : "";
    document.querySelectorAll("#dots button").forEach((b) => b.setAttribute("aria-current", String(+b.dataset.k === si)));
  }
  let raf = 0;
  function stopAnim() { cancelAnimationFrame(raf); raf = 0; $("anim-play").textContent = "▶ Play animation"; }
  $("anim-play").onclick = () => {
    if (raf) return stopAnim();
    const s = topics[ti].slides[si], box = current.querySelector(".dia-anim");
    if (!s.anim || !box) return;
    const states = s.anim.states.filter((x, i, a) => i === 0 || x !== a[i - 1]);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SEG = reduce ? 1 : 1600, HOLD = 1100;
    let t0 = performance.now();
    $("anim-play").textContent = "■ Stop";
    const tick = (now) => {
      const el = now - t0, seg = Math.floor(el / (SEG + HOLD)), k = Math.min(seg + 1, states.length - 1);
      const p = Math.min(1, (el - seg * (SEG + HOLD)) / SEG);
      box.innerHTML = drawScene(s.anim.scene, states[Math.max(0, k - 1)], states[k], states.length === 1 ? 1 : p);
      $("anim-stage").textContent = `Stage ${k + 1} of ${states.length}`;
      if (seg >= states.length - 1) return stopAnim();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
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

  /* ---------- stage lab (chapters with drills) ---------- */
  function stageLab() {
    const lab = document.querySelector("#v-lab .lab");
    lab.previousElementSibling.textContent = "Put stages in order, and track chromosome number (N) and DNA content (C).";
    lab.innerHTML = `<div class="box"><h3 style="margin:0;font-family:var(--f-display)">Put the stages in order</h3>
      <div class="drill-pick seg" id="drill-pick" role="group" aria-label="Drill"></div>
      <p class="muted" style="margin:8px 0 0">Tap the stages in the order they happen.</p>
      <div class="built" id="built" aria-live="polite"></div><div class="pool" id="pool"></div>
      <div class="status" id="lad-status"></div><button class="btn" id="lad-reset" style="margin-top:8px">Shuffle again</button></div>
      <div class="box"><h3 style="margin:0;font-family:var(--f-display)">N and C tracker</h3>
      <p class="muted" style="margin:4px 0 0">For a diploid cell (2n, 2C at G<sub>1</sub>), pick N and C at each stage.</p>
      <div class="nc-grid" id="nc"></div>
      <div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn primary" id="nc-check">Check</button><button class="btn" id="nc-show">Show answers</button></div>
      <div class="status" id="nc-status"></div></div>`;
    let d = 0, built = [], pool = [];
    const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    $("drill-pick").innerHTML = DATA.drills.map((x, i) => `<button aria-pressed="${i === 0}" data-i="${i}">${x.name}</button>`).join("");
    $("drill-pick").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; d = +b.dataset.i; $("drill-pick").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); reset(); });
    const reset = () => { built = []; pool = shuffle(DATA.drills[d].order); draw(); };
    function draw() {
      const order = DATA.drills[d].order;
      $("pool").innerHTML = pool.filter((x) => !built.includes(x)).map((x) => `<button>${x}</button>`).join("");
      $("built").innerHTML = built.map((x, i) => `<span class="${x === order[i] ? "" : "wrong"}">${x}</span>`).join("");
      const bad = built.findIndex((x, i) => x !== order[i]);
      $("lad-status").className = "status " + (bad >= 0 ? "no" : built.length === order.length ? "ok" : "");
      $("lad-status").textContent = bad >= 0 ? `Not quite. ${bad ? "After " + order[bad - 1] + " comes" : "It starts with"} ${order[bad]}.` : built.length === order.length ? "Correct order!" : "";
      if (bad >= 0) $("pool").querySelectorAll("button").forEach((b) => (b.disabled = true));
    }
    $("pool").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { built.push(b.textContent); draw(); } });
    $("lad-reset").onclick = reset;
    reset();
    const NS = ["n", "2n", "4n"], CS = ["C", "2C", "4C"];
    $("nc").innerHTML = `<span class="h">Stage</span><span class="h">N</span><span class="h">C</span>` + DATA.ncQuiz.map(([st], i) =>
      `<label for="ncn-${i}">${st}</label><select id="ncn-${i}" aria-label="${st} N"><option value="">–</option>${NS.map((x) => `<option>${x}</option>`).join("")}</select><select id="ncc-${i}" aria-label="${st} C"><option value="">–</option>${CS.map((x) => `<option>${x}</option>`).join("")}</select>`).join("");
    $("nc-check").onclick = () => {
      let ok = 0, tot = 0;
      DATA.ncQuiz.forEach(([, n, c], i) => [["ncn-", n], ["ncc-", c]].forEach(([p, v]) => { const s = $(p + i); tot++; const g = s.value === v; ok += g; s.className = s.value ? (g ? "ok" : "no") : ""; }));
      $("nc-status").className = "status " + (ok === tot ? "ok" : "no");
      $("nc-status").textContent = ok === tot ? "All correct." : `${ok} of ${tot} correct.`;
    };
    $("nc-show").onclick = () => DATA.ncQuiz.forEach(([, n, c], i) => { $("ncn-" + i).value = n; $("ncc-" + i).value = c; $("ncn-" + i).className = $("ncc-" + i).className = "ok"; });
  }
  if (DATA.drills) stageLab(); else {
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

  }
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
