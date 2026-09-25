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
    return tl;
  }

  /* ---------- Atlas ---------- */
  const state = { cats: new Set(Object.keys(M.cats)), age: "all", q: "", active: null, trail: null, mapActive: false };
  let svg, world, over, overWorld, zoom, currentT = d3.zoomIdentity, pinSel;

  function buildAtlas() {
    svg = d3.select(".atlas__svg").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
    world = svg.append("g").attr("class", "world");
    // Pins, routes and the travel marker live in a separate overlay <svg> on its own GPU layer,
    // so animating them never forces the detailed state geometry underneath to repaint.
    over = d3.select(".atlas__overlay").attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet");
    overWorld = over.append("g").attr("class", "world");
    const grat = d3.geoGraticule().extent([[55, -5], [110, 45]]).step([5, 5]);
    world.append("path").attr("class", "grat").attr("d", d3.geoPath(proj)(grat()));
    const seas = [["Arabian Sea", 65.5, 15.5], ["Bay of Bengal", 88.5, 15.5]];
    seas.forEach(([t, lon, lat]) => { const [x, y] = proj([lon, lat]); world.append("text").attr("class", "sea").attr("x", x).attr("y", y).attr("text-anchor", "middle").text(t); });
    world.append("g").attr("class", "states").selectAll("path").data(G.states).join("path").attr("class", "state").attr("d", (d) => d.d)
      .on("pointerenter", (e, d) => { $(".atlas__state").textContent = d.name; $(".atlas__state").style.opacity = 1; })
      .on("pointerleave", () => { $(".atlas__state").style.opacity = 0; });
    // soft glow = two wide translucent strokes under the crisp outline (no blur filter to recompute)
    world.append("path").attr("class", "outline-glow outline-glow--wide").attr("d", G.outline);
    world.append("path").attr("class", "outline-glow").attr("d", G.outline);
    world.append("path").attr("class", "outline").attr("d", G.outline);
    overWorld.append("g").attr("class", "routes");
    const pins = overWorld.append("g").attr("class", "pins");
    overWorld.append("g").attr("class", "marker-layer");
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
        overWorld.attr("transform", currentT);
        overWorld.node().style.setProperty("--k", currentT.k);
        pinSel.attr("transform", (d) => `translate(${d.x},${d.y}) scale(${1 / currentT.k})`);
        placeMarker();
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
  /* Trails of influence.
     Each hop between two stops is its own gentle arc, like a flight path. Hops already travelled
     are drawn solid, hops still ahead are dotted, and a navigation marker drives along the
     current hop from one stop to the next. */
  const HOLD = 2600;            // ms to pause at each stop
  function arcPath(a, b, bend) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const cx = mx - (dy / d) * d * bend, cy = my + (dx / d) * d * bend;
    return `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`;
  }
  function buildMarker(color) {
    const layer = overWorld.select(".marker-layer");
    layer.selectAll("*").remove();
    const g = layer.append("g").attr("class", "nav-marker").style("--c", color);
    g.append("circle").attr("class", "nav-marker__pulse").attr("r", 14);
    g.append("circle").attr("class", "nav-marker__disc").attr("r", 11);
    g.append("path").attr("class", "nav-marker__arrow").attr("d", "M7.5,0 L-5,-6.5 L-2,0 L-5,6.5 Z");
    return g;
  }
  function placeMarker() {
    const tr = state.trail;
    if (!tr || !tr.marker) return;
    const k = currentT.k;
    tr.marker.attr("transform", `translate(${tr.mx},${tr.my}) rotate(${tr.mang}) scale(${1 / k})`);
  }
  function setMarkerAt(seg, l) {
    const tr = state.trail, n = seg.node, len = seg.len;
    const p = n.getPointAtLength(Math.max(0, Math.min(len, l)));
    const a = n.getPointAtLength(Math.max(0, Math.min(len, l - 2)));
    const b = n.getPointAtLength(Math.max(0, Math.min(len, l + 2)));
    tr.mx = p.x; tr.my = p.y;
    if (Math.hypot(b.x - a.x, b.y - a.y) > 0.01) tr.mang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    placeMarker();
  }
  function setSegDone(i, frac) {
    const seg = state.trail.segs[i];
    seg.done.attr("stroke-dashoffset", seg.len * (1 - frac));
    seg.ahead.style("opacity", frac >= 1 ? 0 : 1);
  }
  function playTrail(id) {
    const t = M.trails.find((x) => x.id === id); if (!t) return;
    stopTrail(true);
    closeDrawer();
    const pts = t.stops.map((s) => byId[s]);
    state.trail = { t, i: 0, paused: false, timer: null, tween: null, segs: [], marker: null, mx: pts[0].x, my: pts[0].y, mang: 0 };
    const tr = state.trail;
    $$(".trail-btn").forEach((b) => b.classList.toggle("is-on", b.dataset.trail === id));
    pinSel.classed("is-trail", (d) => t.stops.includes(d.id)).classed("is-visited", false).classed("is-active", (d) => d.id === pts[0].id);
    applyFilters();
    const routes = overWorld.select(".routes");
    routes.interrupt().style("opacity", 1).selectAll("*").remove();
    routes.style("--c", t.color);
    for (let i = 0; i < pts.length - 1; i++) {
      const d = arcPath(pts[i], pts[i + 1], i % 2 ? -0.16 : 0.16);
      const g = routes.append("g").attr("class", "hop");
      const ahead = g.append("path").attr("class", "hop__ahead").attr("d", d);
      g.append("path").attr("class", "hop__glow").attr("d", d);
      const done = g.append("path").attr("class", "hop__done").attr("d", d);
      const len = done.node().getTotalLength();
      done.attr("stroke-dasharray", `${len} ${len + 1}`).attr("stroke-dashoffset", len);
      g.select(".hop__glow").attr("stroke-dasharray", `${len} ${len + 1}`).attr("stroke-dashoffset", len);
      tr.segs.push({ node: done.node(), len, done: g.selectAll(".hop__done, .hop__glow"), ahead });
    }
    // fade the dotted road in, hop by hop
    routes.selectAll(".hop__ahead").style("opacity", 0).transition().delay((d, i) => 300 + i * 90).duration(500).style("opacity", 1);
    tr.marker = buildMarker(t.color);
    tr.mang = pts.length > 1 ? (Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x) * 180) / Math.PI : 0;
    placeMarker();
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    fitBox(Math.min(...xs) - 40, Math.min(...ys) - 40, Math.max(...xs) + 40, Math.max(...ys) + 40, 1400, 4);
    const cap = $(".caption");
    cap.style.setProperty("--c", t.color);
    cap.querySelector(".caption__top span").textContent = t.name;
    cap.querySelector(".caption__top em").textContent = `Stop 1 / ${t.stops.length}`;
    cap.querySelector(".caption__name").textContent = pts[0].name;
    cap.querySelector(".caption__note").textContent = t.notes[0] || "";
    gsap.set(cap.querySelector(".caption__bar i"), { width: `${(1 / t.stops.length) * 100}%` });
    cap.classList.add("is-on");
    updateCaptionButtons();
    tr.timer = setTimeout(() => trailStep(1), HOLD + 600);
    if (!isDesktop()) $(".atlas__panel").classList.add("is-collapsed");
  }
  function updateCaptionButtons() {
    const tr = state.trail; if (!tr) return;
    const cap = $(".caption");
    cap.querySelector('[data-a="prev"]').disabled = tr.i === 0;
    const last = tr.i >= tr.t.stops.length - 1;
    cap.querySelector('[data-a="next"]').disabled = last;
    cap.querySelector('[data-a="pause"]').textContent = last ? "Replay" : tr.paused ? "Play" : "Pause";
  }
  function arrive(i) {
    const tr = state.trail;
    const p = byId[tr.t.stops[i]];
    pinSel.classed("is-active", (d) => d.id === p.id).classed("is-visited", (d) => tr.t.stops.slice(0, i).includes(d.id));
    const cap = $(".caption");
    cap.querySelector(".caption__top em").textContent = `Stop ${i + 1} / ${tr.t.stops.length}`;
    cap.querySelector(".caption__name").textContent = p.name;
    cap.querySelector(".caption__note").textContent = tr.t.notes[i] || "";
    gsap.to(cap.querySelector(".caption__bar i"), { width: `${((i + 1) / tr.t.stops.length) * 100}%`, duration: 0.5, ease: "power2.out" });
    updateCaptionButtons();
    if (!tr.paused && i < tr.t.stops.length - 1) tr.timer = setTimeout(() => trailStep(1), HOLD);
  }
  function trailStep(dir) {
    const tr = state.trail; if (!tr) return;
    clearTimeout(tr.timer);
    if (tr.tween) { tr.tween.progress(1); tr.tween = null; }
    const from = tr.i, to = Math.max(0, Math.min(tr.t.stops.length - 1, from + dir));
    if (to === from) return;
    tr.i = to;
    const a = byId[tr.t.stops[from]], b = byId[tr.t.stops[to]];
    const x0 = Math.min(a.x, b.x), x1 = Math.max(a.x, b.x), y0 = Math.min(a.y, b.y), y1 = Math.max(a.y, b.y);
    const pad = Math.max(40, 0.25 * Math.max(x1 - x0, y1 - y0));
    fitBox(x0 - pad, y0 - pad, x1 + pad, y1 + pad, 1100, 3.6);
    if (dir < 0) {
      // step back: un-travel the hop and put the marker back at the previous stop
      setSegDone(to, 0);
      setMarkerAt(tr.segs[to], 0);
      arrive(to);
      return;
    }
    const seg = tr.segs[from];
    const st = { l: 0 };
    const dur = Math.min(3.2, Math.max(1.6, seg.len / 110));
    pinSel.classed("is-active", false);
    const cap = $(".caption");
    cap.querySelector(".caption__top em").textContent = `Travelling · ${from + 1} → ${to + 1}`;
    tr.tween = gsap.to(st, {
      l: seg.len, duration: dur, delay: 0.35, ease: "power1.inOut",
      onUpdate: () => { setMarkerAt(seg, st.l); seg.done.attr("stroke-dashoffset", seg.len - st.l); },
      onComplete: () => { tr.tween = null; setSegDone(from, 1); arrive(to); },
    });
  }
  function stopTrail(silent) {
    const tr = state.trail;
    if (!tr) return;
    clearTimeout(tr.timer);
    if (tr.tween) tr.tween.kill();
    state.trail = null;
    $(".caption").classList.remove("is-on");
    $$(".trail-btn").forEach((b) => b.classList.remove("is-on"));
    overWorld.select(".routes").transition().duration(500).style("opacity", 0).on("end", function () { d3.select(this).selectAll("*").remove(); d3.select(this).style("opacity", 1); });
    overWorld.select(".marker-layer").selectAll("*").remove();
    pinSel.classed("is-trail", false).classed("is-active", false).classed("is-visited", false);
    applyFilters();
  }
  function initCaption() {
    const cap = $(".caption");
    cap.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b || !state.trail) return;
      const a = b.dataset.a;
      if (a === "prev") { state.trail.paused = true; trailStep(-1); updateCaptionButtons(); }
      if (a === "next") { trailStep(1); }
      if (a === "pause") {
        const tr = state.trail;
        if (tr.i >= tr.t.stops.length - 1) { playTrail(tr.t.id); return; }
        tr.paused = !tr.paused;
        if (tr.paused) clearTimeout(tr.timer); else if (!tr.tween) trailStep(1);
        updateCaptionButtons();
      }
      if (a === "open") { const id = state.trail.t.stops[Math.max(0, state.trail.i)]; stopTrail(); select(id); }
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
  KALA.intro(heroIntro);
  KALA.ready.then(() => {
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
