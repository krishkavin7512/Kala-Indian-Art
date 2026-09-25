/* =========================================================
   DEŚA — atlas page
   ========================================================= */
(function () {
  "use strict";
  const G = window.INDIA_GEO, M = window.KALA_MAP, CREDITS = window.KALA_CREDITS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const IMG = (id, sm) => `../assets/img/m/${id}${sm ? "-sm" : ""}.jpg`;
  const W = G.w, H = G.h;
  const proj = d3.geoConicConformal().parallels(G.proj.parallels).rotate(G.proj.rotate).scale(G.proj.scale).translate(G.proj.translate);
  const places = M.places.slice().sort((a, b) => a.year - b.year);
  places.forEach((p) => { const [x, y] = proj([p.lon, p.lat]); p.x = x; p.y = y; });
  const byId = Object.fromEntries(places.map((p) => [p.id, p]));
  const isDesktop = () => innerWidth > 900;

  /* ---------- Hero map ---------- */
  function buildHero() {
    const svg = $(".d-hero__map svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    let s = `<path class="outline" d="${G.outline}"/><path class="inner" d="${G.inner}"/>`;
    places.forEach((p) => {
      const c = M.cats[p.cat].color;
      s += `<g class="hp" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})"><circle r="14" fill="${c}" opacity=".18"/><circle r="5.5" fill="${c}" stroke="#060a14" stroke-width="2"/></g>`;
    });
    svg.innerHTML = s;
    $(".d-hero__stats").innerHTML = `<div><b>${places.length}</b>Places</div><div><b>${Object.keys(M.cats).length}</b>Art forms</div><div><b>${M.trails.length}</b>Trails of influence</div><div><b>${new Set(places.map((p) => p.state)).size}</b>States &amp; UTs</div>`;
  }
  function heroIntro() {
    if (KALA.reduced) return;
    const h1 = $(".d-hero h1");
    h1.classList.remove("gold-text");
    h1.innerHTML = Array.from(h1.textContent.normalize("NFC")).map((c) => `<span class="char gold-text">${c}</span>`).join("");
    const outline = $(".d-hero__map .outline");
    const len = outline.getTotalLength();
    gsap.set(outline, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    const tl = gsap.timeline();
    tl.from(".d-hero h1 .char", { yPercent: 110, opacity: 0, duration: 1.3, ease: "kala", stagger: 0.07 })
      .from(".d-hero .eyebrow, .d-hero__sub, .d-hero__stats > div, .d-hero .btn", { y: 30, opacity: 0, duration: 1, ease: "kala", stagger: 0.07 }, 0.3)
      .to(outline, { strokeDashoffset: 0, duration: 3.2, ease: "power2.inOut" }, 0)
      .to(outline, { fillOpacity: 1, duration: 1.4 }, 2.4)
      .from(".d-hero__map .inner", { opacity: 0, duration: 1.4 }, 2.2)
      .from(".d-hero__map .hp", { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(3)", stagger: 0.05 }, 1.4);
    gsap.to(".d-hero__map", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".d-hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- Atlas ---------- */
  const state = { cats: new Set(Object.keys(M.cats)), age: "all", q: "", active: null, trail: null, mapActive: false };
  let svg, world, zoom, currentT = d3.zoomIdentity, pinSel;

  function buildAtlas() {
    svg = d3.select(".atlas__svg").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
    svg.append("defs").html(`<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
    world = svg.append("g").attr("class", "world");
    const grat = d3.geoGraticule().extent([[55, -5], [110, 45]]).step([5, 5]);
    world.append("path").attr("class", "grat").attr("d", d3.geoPath(proj)(grat()));
    const seas = [["Arabian Sea", 65.5, 15.5], ["Bay of Bengal", 88.5, 15.5]];
    seas.forEach(([t, lon, lat]) => { const [x, y] = proj([lon, lat]); world.append("text").attr("class", "sea").attr("x", x).attr("y", y).attr("text-anchor", "middle").text(t); });
    world.append("g").attr("class", "states").selectAll("path").data(G.states).join("path").attr("class", "state").attr("d", (d) => d.d)
      .on("pointerenter", (e, d) => { $(".atlas__state").textContent = d.name; $(".atlas__state").style.opacity = 1; })
      .on("pointerleave", () => { $(".atlas__state").style.opacity = 0; });
    world.append("path").attr("class", "outline").attr("d", G.outline);
    world.append("g").attr("class", "routes");
    const pins = world.append("g").attr("class", "pins");
    pinSel = pins.selectAll("g").data(places).join("g")
      .attr("class", "pin").attr("tabindex", 0).attr("role", "button")
      .attr("aria-label", (d) => `${d.name}, ${d.state}`)
      .attr("style", (d) => `--c:${M.cats[d.cat].color}`)
      .attr("transform", (d) => `translate(${d.x},${d.y})`);
    pinSel.append("circle").attr("class", "halo").attr("r", 11).style("animation-delay", (d, i) => `${(i % 7) * 0.35}s`);
    pinSel.append("circle").attr("class", "ring").attr("r", 7.5);
    pinSel.append("circle").attr("class", "core").attr("r", 4.2);
    pinSel.append("text").attr("class", "lbl").attr("x", 12).attr("y", 4).text((d) => d.name);
    pinSel.on("click", (e, d) => { e.stopPropagation(); stopTrail(); select(d.id); })
      .on("keydown", (e, d) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stopTrail(); select(d.id); } })
      .on("pointerenter", (e, d) => showTip(e, d)).on("pointermove", (e, d) => showTip(e, d)).on("pointerleave", hideTip);

    zoom = d3.zoom().scaleExtent([0.6, 14])
      .filter((e) => (e.type === "wheel" ? state.mapActive || e.ctrlKey : !e.button))
      .on("zoom", (e) => {
        currentT = e.transform;
        world.attr("transform", currentT);
        pinSel.attr("transform", (d) => `translate(${d.x},${d.y}) scale(${1 / currentT.k})`);
        world.selectAll(".sea").style("font-size", `${22 / Math.sqrt(currentT.k)}px`);
        $(".atlas").classList.toggle("show-labels", currentT.k > 2.6);
      });
    svg.call(zoom).on("dblclick.zoom", null);
    svg.on("click", () => { if (!state.trail) closeDrawer(); });
    const atlas = $(".atlas");
    atlas.addEventListener("pointerdown", (e) => { if (e.target.closest(".atlas__svg")) activateMap(true); });
    atlas.addEventListener("pointerleave", () => activateMap(false));
    $(".atlas__zoom").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.z === "in") svg.transition().duration(600).call(zoom.scaleBy, 1.6);
      if (b.dataset.z === "out") svg.transition().duration(600).call(zoom.scaleBy, 1 / 1.6);
      if (b.dataset.z === "home") { stopTrail(); closeDrawer(); goHome(1200); }
    });
    goHome(0);
    addEventListener("resize", () => { if (!state.active && !state.trail) goHome(0); });
  }
  function activateMap(on) {
    state.mapActive = on;
    const a = $(".atlas");
    if (on) a.setAttribute("data-lenis-prevent", ""); else a.removeAttribute("data-lenis-prevent");
    $(".atlas__hint").style.opacity = on ? 0 : 1;
  }

  /* geometry helpers: viewBox ⇄ screen */
  function metrics() {
    const r = $(".atlas__svg").getBoundingClientRect();
    const s = Math.min(r.width / W, r.height / H);
    const ox = (r.width - W * s) / 2, oy = (r.height - H * s) / 2;
    const left = isDesktop() ? $(".atlas__panel").getBoundingClientRect().right - r.left + 10 : 0;
    const drawerOpen = $(".atlas__drawer").classList.contains("is-open");
    const right = isDesktop() && drawerOpen ? r.width - ($(".atlas__drawer").getBoundingClientRect().width + 40) : r.width;
    const top = isDesktop() ? 70 : 60;
    const bottom = isDesktop() ? r.height - 40 : r.height * 0.52;
    return { r, s, ox, oy, left, right, top, bottom };
  }
  const toUser = (m, px, py) => [(px - m.ox) / m.s, (py - m.oy) / m.s];
  function fitBox(x0, y0, x1, y1, dur, maxK = 8, opts = {}) {
    const m = metrics();
    if (opts.forDrawer && isDesktop()) m.right = m.r.width - (Math.min(460, innerWidth * 0.38) + 40);
    const aw = (m.right - m.left) / m.s, ah = (m.bottom - m.top) / m.s;
    const k = Math.min(maxK, 0.9 * Math.min(aw / (x1 - x0), ah / (y1 - y0)));
    const [cx, cy] = toUser(m, (m.left + m.right) / 2, (m.top + m.bottom) / 2);
    const t = d3.zoomIdentity.translate(cx - k * (x0 + x1) / 2, cy - k * (y0 + y1) / 2).scale(k);
    svg.transition().duration(dur).ease(d3.easeCubicInOut).call(zoom.transform, t);
  }
  function goHome(dur) { fitBox(20, 20, W - 20, H - 20, dur, 1.2); }
  function flyTo(p, k, dur, opts) { const h = 60 / k; fitBox(p.x - h, p.y - h, p.x + h, p.y + h, dur, k, opts); }

  /* ---------- Tooltip ---------- */
  function showTip(e, d) {
    const tip = $(".tip");
    const r = $(".atlas").getBoundingClientRect();
    tip.style.left = e.clientX - r.left + "px";
    tip.style.top = e.clientY - r.top + "px";
    tip.style.setProperty("--c", M.cats[d.cat].color);
    tip.innerHTML = `<span>${M.cats[d.cat].label}</span><b>${esc(d.name)}</b>`;
    tip.classList.add("is-on");
  }
  function hideTip() { $(".tip").classList.remove("is-on"); }

  /* ---------- Panel: filters + list ---------- */
  function buildPanel() {
    $(".cat-chips").innerHTML = Object.entries(M.cats).map(([k, c]) => `<button class="chip" type="button" data-cat="${k}" style="--c:${c.color}" aria-pressed="true"><span class="dot"></span>${c.label}</button>`).join("");
    $(".age-chips").innerHTML = Object.entries(M.ages).map(([k, l]) => `<button class="chip${k === "all" ? " is-active" : ""}" type="button" data-age="${k}">${l}</button>`).join("");
    $(".trails").innerHTML = M.trails.map((t) => `<button class="trail-btn" type="button" data-trail="${t.id}" style="--c:${t.color}"><i></i><span>${t.name}</span><small>${t.stops.length} stops</small></button>`).join("");
    $(".atlas__legend").innerHTML = Object.values(M.cats).map((c) => `<span style="--c:${c.color}"><i></i>${c.label}</span>`).join("");
    $(".cat-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      const k = b.dataset.cat;
      if (state.cats.size === Object.keys(M.cats).length) { state.cats = new Set([k]); }
      else if (state.cats.has(k)) { state.cats.delete(k); if (!state.cats.size) state.cats = new Set(Object.keys(M.cats)); }
      else state.cats.add(k);
      $$(".cat-chips .chip").forEach((c) => { const on = state.cats.has(c.dataset.cat); c.classList.toggle("is-off", !on); c.setAttribute("aria-pressed", String(on)); });
      applyFilters();
    });
    $(".age-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-age]"); if (!b) return;
      state.age = b.dataset.age;
      $$(".age-chips .chip").forEach((c) => c.classList.toggle("is-active", c === b));
      applyFilters();
    });
    $(".search input").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); applyFilters(); });
    $(".trails").addEventListener("click", (e) => { const b = e.target.closest("[data-trail]"); if (b) playTrail(b.dataset.trail); });
    $(".list").addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) { stopTrail(); select(b.dataset.id); } });
    $(".panel-toggle").addEventListener("click", () => $(".atlas__panel").classList.toggle("is-collapsed"));
    if (!isDesktop()) $(".atlas__panel").classList.add("is-collapsed");
    applyFilters();
  }
  function visible(p) {
    if (!state.cats.has(p.cat)) return false;
    if (state.age !== "all" && p.age !== state.age) return false;
    if (state.q && !(`${p.name} ${p.state} ${p.desc} ${M.cats[p.cat].label}`.toLowerCase().includes(state.q))) return false;
    return true;
  }
  const yearLabel = (y) => (y < 0 ? `${Math.abs(y).toLocaleString()} BCE` : `${y} CE`);
  function applyFilters() {
    const vis = places.filter(visible);
    pinSel.classed("is-dim", (d) => !visible(d) && !(state.trail && state.trail.t.stops.includes(d.id)));
    $(".list").innerHTML = vis.map((p) => `<button type="button" data-id="${p.id}" style="--c:${M.cats[p.cat].color}" class="${state.active === p.id ? "is-active" : ""}"><span class="d"></span><span class="n">${esc(p.name)}<span class="s">${p.state}</span></span><span class="y">${yearLabel(p.year)}</span></button>`).join("") || `<p class="muted" style="padding:16px">No places match. Try clearing a filter.</p>`;
    $(".atlas__count").textContent = `Showing ${vis.length} of ${places.length} places`;
  }

  /* ---------- Drawer ---------- */
  function select(id) {
    const p = byId[id]; if (!p) return;
    state.active = id;
    pinSel.classed("is-active", (d) => d.id === id);
    $$(".list [data-id]").forEach((b) => b.classList.toggle("is-active", b.dataset.id === id));
    openDrawer(p);
    flyTo(p, isDesktop() ? 4.2 : 3.4, 1500, { forDrawer: true });
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
  }
  function openDrawer(p) {
    const d = $(".atlas__drawer");
    const c = M.cats[p.cat].color;
    const cr = CREDITS[p.id] || {};
    const vis = places.filter(visible);
    const i = Math.max(0, vis.findIndex((x) => x.id === p.id));
    const prev = vis[(i - 1 + vis.length) % vis.length], next = vis[(i + 1) % vis.length];
    d.style.setProperty("--c", c);
    d.innerHTML = `
      <div class="drawer__img" data-cursor="Zoom" role="button" tabindex="0" aria-label="Open full-resolution photograph">
        <img src="${IMG(p.id, true)}" alt="${esc(p.name)}">
        <button class="drawer__close" type="button" aria-label="Close"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1 1l14 14M15 1L1 15"/></svg></button>
        <span class="drawer__zoom">⤢ ${cr.served ? cr.served.join(" × ") + " px" : "Full size"}</span>
      </div>
      <div class="drawer__body" data-lenis-prevent>
        <div class="drawer__cat">${M.cats[p.cat].label}</div>
        <h3 class="drawer__name">${esc(p.name)}</h3>
        <div class="drawer__native">${p.native}</div>
        <div class="drawer__meta"><span><b>State</b>${p.state}</span><span><b>Period</b>${p.period}</span></div>
        ${p.unesco ? `<div class="drawer__unesco">✦ UNESCO World Heritage · ${p.unesco}</div>` : ""}
        <p class="drawer__desc">${p.desc}</p>
        <ul class="drawer__hl">${p.highlights.map((h) => `<li>${h}</li>`).join("")}</ul>
        <div class="drawer__links">
          ${p.timeline ? `<a class="btn" href="../timeline/index.html#${p.timeline}" data-transition>See it in the timeline <span class="arrow"></span></a>` : ""}
          ${p.fusion ? `<a class="btn" href="../fusion/index.html" data-transition>See it in Saṅgam <span class="arrow"></span></a>` : ""}
        </div>
        <div class="drawer__credit">Photograph: ${cr.artist ? esc(cr.artist) : "Wikimedia Commons contributor"} · ${cr.license || ""} · ${cr.page ? `<a href="${cr.page}" target="_blank" rel="noopener">Wikimedia Commons</a>` : ""}</div>
        <div class="drawer__nav"><button type="button" data-go="${prev.id}">← ${esc(prev.name)}</button><button type="button" data-go="${next.id}">${esc(next.name)} →</button></div>
      </div>`;
    d.classList.add("is-open");
    $(".atlas").classList.add("drawer-open");
    d.querySelector(".drawer__close").addEventListener("click", (e) => { e.stopPropagation(); closeDrawer(); });
    d.querySelector(".drawer__img").addEventListener("click", (e) => { if (!e.target.closest(".drawer__close")) openLightbox(p); });
    d.querySelector(".drawer__img").addEventListener("keydown", (e) => { if (e.key === "Enter") openLightbox(p); });
    d.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => select(b.dataset.go)));
    if (!KALA.reduced) gsap.fromTo(d.querySelectorAll(".drawer__body > *"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "kala", stagger: 0.04, delay: 0.15 });
  }
  function closeDrawer() {
    const d = $(".atlas__drawer");
    if (!d.classList.contains("is-open")) return;
    d.classList.remove("is-open");
    $(".atlas").classList.remove("drawer-open");
    state.active = null;
    pinSel.classed("is-active", false);
    $$(".list [data-id]").forEach((b) => b.classList.remove("is-active"));
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
  }

  /* ---------- Lightbox ---------- */
  let dz = null;
  function openLightbox(p) {
    const lb = $(".lightbox");
    if (!dz) dz = new DeepZoom(lb.querySelector(".detail__viewer"), {});
    lb.classList.add("is-open");
    if (KALA.lenis) KALA.lenis.stop();
    const cr = CREDITS[p.id] || {};
    dz.load(IMG(p.id, true), IMG(p.id, false), p.name, cr.served);
    lb.querySelector(".lightbox__cap").textContent = `${p.name} · scroll or pinch to zoom`;
    setTimeout(() => lb.querySelector(".lightbox__close").focus(), 30);
  }
  function closeLightbox() {
    $(".lightbox").classList.remove("is-open");
    if (KALA.lenis) KALA.lenis.start();
  }

  /* ---------- Trails ---------- */
  function playTrail(id) {
    const t = M.trails.find((x) => x.id === id); if (!t) return;
    stopTrail(true);
    closeDrawer();
    state.trail = { t, i: -1, paused: false, timer: null };
    $$(".trail-btn").forEach((b) => b.classList.toggle("is-on", b.dataset.trail === id));
    const pts = t.stops.map((s) => byId[s]);
    pinSel.classed("is-trail", (d) => t.stops.includes(d.id));
    applyFilters();
    const line = d3.line().x((d) => d.x).y((d) => d.y).curve(d3.curveCatmullRom.alpha(0.5));
    const routes = world.select(".routes");
    routes.selectAll("*").remove();
    const path = routes.append("path").attr("class", "route").attr("d", line(pts)).attr("stroke", t.color);
    routes.append("path").attr("class", "route-dots").attr("d", line(pts)).attr("stroke", "#fff");
    const len = path.node().getTotalLength();
    path.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len).transition().duration(2600).ease(d3.easeCubicInOut).attr("stroke-dashoffset", 0);
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    fitBox(Math.min(...xs) - 40, Math.min(...ys) - 40, Math.max(...xs) + 40, Math.max(...ys) + 40, 1500, 4);
    const cap = $(".caption");
    cap.style.setProperty("--c", t.color);
    cap.querySelector(".caption__top span").textContent = t.name;
    cap.querySelector(".caption__name").textContent = t.sub;
    cap.querySelector(".caption__note").textContent = `${t.stops.length} stops · starting at ${pts[0].name}`;
    cap.classList.add("is-on");
    state.trail.timer = setTimeout(() => trailStep(1), 2800);
    if (!isDesktop()) $(".atlas__panel").classList.add("is-collapsed");
  }
  function trailStep(dir) {
    const tr = state.trail; if (!tr) return;
    clearTimeout(tr.timer);
    tr.i = Math.max(0, Math.min(tr.t.stops.length - 1, tr.i + dir));
    const p = byId[tr.t.stops[tr.i]];
    pinSel.classed("is-active", (d) => d.id === p.id);
    flyTo(p, 3.4, 1500);
    const cap = $(".caption");
    cap.querySelector(".caption__top em").textContent = `Stop ${tr.i + 1} / ${tr.t.stops.length}`;
    cap.querySelector(".caption__name").textContent = p.name;
    cap.querySelector(".caption__note").textContent = tr.t.notes[tr.i] || "";
    const bar = cap.querySelector(".caption__bar i");
    gsap.killTweensOf(bar);
    gsap.fromTo(bar, { width: `${(tr.i / tr.t.stops.length) * 100}%` }, { width: `${((tr.i + 1) / tr.t.stops.length) * 100}%`, duration: 4.6, ease: "none" });
    if (!tr.paused && tr.i < tr.t.stops.length - 1) tr.timer = setTimeout(() => trailStep(1), 4800);
  }
  function stopTrail(silent) {
    const tr = state.trail;
    if (!tr) return;
    clearTimeout(tr.timer);
    state.trail = null;
    $(".caption").classList.remove("is-on");
    $$(".trail-btn").forEach((b) => b.classList.remove("is-on"));
    world.select(".routes").selectAll("*").transition().duration(600).style("opacity", 0).remove();
    pinSel.classed("is-trail", false).classed("is-active", false);
    applyFilters();
  }
  function initCaption() {
    const cap = $(".caption");
    cap.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b || !state.trail) return;
      const a = b.dataset.a;
      if (a === "prev") trailStep(-1);
      if (a === "next") trailStep(1);
      if (a === "open") { const id = state.trail.t.stops[Math.max(0, state.trail.i)]; state.trail.paused = true; clearTimeout(state.trail.timer); stopTrail(); select(id); }
      if (a === "stop") { stopTrail(); goHome(1200); }
    });
  }

  /* ---------- Trails section cards ---------- */
  function buildTrailCards() {
    $(".trail-cards").innerHTML = M.trails.map((t, i) => `
      <button class="trail-card" type="button" data-trail="${t.id}" style="--c:${t.color}" data-cursor="Play">
        <span class="n">${["i", "ii", "iii", "iv"][i]}.</span>
        <h3>${t.name}</h3>
        <p>${t.sub}</p>
        <div class="stops">${t.stops.map((s) => byId[s].name.split(" — ")[0].split(" & ")[0]).join(" → ")}</div>
        <span class="go">Play on the map →</span>
      </button>`).join("");
    $(".trail-cards").addEventListener("click", (e) => {
      const b = e.target.closest("[data-trail]"); if (!b) return;
      const atlas = $(".atlas");
      const go = () => setTimeout(() => playTrail(b.dataset.trail), 200);
      if (KALA.lenis) KALA.lenis.scrollTo(atlas, { duration: 1.4, onComplete: go });
      else { atlas.scrollIntoView({ behavior: "smooth" }); setTimeout(go, 900); }
    });
  }

  /* ---------- Boot ---------- */
  buildHero();
  buildAtlas();
  buildPanel();
  initCaption();
  buildTrailCards();
  $(".lightbox__close").addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($(".lightbox").classList.contains("is-open")) closeLightbox();
    else if (state.trail) stopTrail();
    else closeDrawer();
  });
  KALA.ready.then(() => {
    heroIntro();
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && byId[hash]) {
      const atlas = $(".atlas");
      setTimeout(() => { if (KALA.lenis) KALA.lenis.scrollTo(atlas, { immediate: true }); else atlas.scrollIntoView(); setTimeout(() => select(hash), 300); }, 200);
    }
    KALA.onView($(".atlas"), () => {
      if (KALA.reduced) return;
      gsap.fromTo(".atlas .pin", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.03, ease: "power2.out", clearProps: "opacity" });
      gsap.fromTo(".atlas__panel", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "kala", clearProps: "transform,opacity" });
    }, 0.2);
  });
})();
