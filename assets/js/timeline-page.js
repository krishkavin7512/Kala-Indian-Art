/* =========================================================
   KĀLA — timeline page
   ========================================================= */
(function () {
  "use strict";
  const DATA = window.KALA_TIMELINE;
  const CREDITS = window.KALA_CREDITS || {};
  const IMG = (id, sm) => `../assets/img/t/${id}${sm ? "-sm" : ""}.jpg`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const eraById = Object.fromEntries(DATA.eras.map((e) => [e.id, e]));
  const arts = DATA.artifacts;
  const TINT = { indus: "#140c08", maurya: "#110f0b", stupa: "#100d09", kushan: "#0b0c0e", gupta: "#140b09", rock: "#0c0c0b", temple: "#110c06", mughal: "#081010", rajput: "#120a0c", modern: "#0c0b10" };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Hero collage ---------- */
  function buildHero() {
    const bg = $(".k-hero__bg");
    const pool = arts.map((a) => a.id);
    for (let c = 0; c < 5; c++) {
      const col = document.createElement("div");
      col.className = "col";
      for (let r = 0; r < 4; r++) {
        const id = pool[(c * 5 + r * 3) % pool.length];
        col.insertAdjacentHTML("beforeend", `<img src="${IMG(id, true)}" alt="" loading="${r < 2 ? "eager" : "lazy"}">`);
      }
      bg.appendChild(col);
    }
    $(".k-hero__meta").innerHTML = `
      <div><b>${DATA.eras.length}</b>Eras</div>
      <div><b>${arts.length}</b>Artifacts</div>
      <div><b>${arts.filter((a) => a.sketchfab).length}</b>3D museum scans</div>
      <div><b>5,000</b>Years</div>`;
  }

  /* ---------- Journey ---------- */
  function buildJourney() {
    const track = $(".hz__track");
    let html = `<div class="hz__start">
        <div class="eyebrow">The walk begins</div>
        <div class="big">3300<small>BCE</small></div>
        <p>Scroll to walk forward through time. Each hall is an age of Indian art; each lit case holds an object. Click one to step inside.</p>
        <span class="arrow-line"></span>
      </div>`;
    let n = 0;
    DATA.eras.forEach((e) => {
      html += `<section class="era" data-era="${e.id}" aria-label="${esc(e.name)}">
          <div class="era__native" aria-hidden="true">${e.native}</div>
          <div class="era__num" aria-hidden="true">${e.num}</div>
          <div class="era__span eyebrow">${e.span}</div>
          <h2 class="era__name">${e.name}</h2>
          <p class="era__intro">${e.intro}</p>
        </section>`;
      arts.filter((a) => a.era === e.id).forEach((a) => {
        n++;
        a._no = n;
        html += `<article class="vitrine" data-id="${a.id}" data-era="${e.id}" data-cursor="View" tabindex="0" role="button" aria-label="Open ${esc(a.title)}">
            <div class="vitrine__spot" aria-hidden="true"></div>
            <div class="vitrine__case">
              <div class="vitrine__frame"><img src="${IMG(a.id, true)}" alt="${esc(a.title)}" decoding="async" fetchpriority="low"></div>
              <div class="vitrine__light"></div><div class="vitrine__glass"></div>
              ${a.sketchfab ? '<span class="vitrine__badge">3D</span>' : ""}
            </div>
            <div class="vitrine__plinth" aria-hidden="true"></div>
            <div class="vitrine__label">
              <span class="vitrine__no">No. ${String(n).padStart(2, "0")}</span>
              <h3 class="vitrine__title">${a.title}</h3>
              <div class="vitrine__sub">${a.date} · ${a.category}</div>
            </div>
          </article>`;
      });
    });
    html += `<div class="hz__end">
        <div class="eyebrow">1950 CE · and onward</div>
        <h3>The story <em>continues</em> — across the land.</h3>
        <p>Every object here was made somewhere. Follow them onto the map of India to see where these traditions were born and how they travelled.</p>
        <a class="btn" href="../map/index.html" data-transition data-magnetic="0.25">Open the atlas · Deśa <span class="arrow"></span></a>
      </div>`;
    track.innerHTML = html;
  }

  /* ---------- Ruler ---------- */
  function buildRuler() {
    const bar = $(".ruler__bar");
    bar.innerHTML = '<div class="ruler__line"></div><div class="ruler__fill"></div>' +
      DATA.eras.map((e) => `<div class="ruler__tick" data-era="${e.id}"><span>${e.name}</span><button type="button" aria-label="Jump to ${esc(e.name)}">${e.num}</button></div>`).join("");
  }

  /* ---------- Horizontal scroll ---------- */
  let hzTween = null, hzST = null, eraFracs = [];
  function initHorizontal() {
    const track = $(".hz__track");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const dist = () => track.scrollWidth - innerWidth;
      hzTween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: ".hz", pin: true, scrub: 0.8, end: () => "+=" + dist(), invalidateOnRefresh: true,
          onUpdate: (self) => updateRuler(self.progress),
          onToggle: (self) => $(".ruler").classList.toggle("is-on", self.isActive),
          onRefresh: computeFracs,
        },
      });
      hzST = hzTween.scrollTrigger;
      computeFracs();

      // parallax inside cases
      $$(".vitrine__frame img").forEach((img) => {
        gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: img.closest(".vitrine"), containerAnimation: hzTween, start: "left right", end: "right left", scrub: true } });
      });
      // era numerals slide
      $$(".era").forEach((era) => {
        gsap.fromTo(era.querySelector(".era__num"), { xPercent: 30, opacity: 0.2 }, { xPercent: -10, opacity: 0.9, ease: "none", scrollTrigger: { trigger: era, containerAnimation: hzTween, start: "left right", end: "center center", scrub: true } });
        gsap.fromTo(era.querySelector(".era__native"), { xPercent: 40 }, { xPercent: -40, ease: "none", scrollTrigger: { trigger: era, containerAnimation: hzTween, start: "left right", end: "right left", scrub: true } });
      });
      // cases rise into the light as they enter
      $$(".vitrine").forEach((v) => {
        gsap.fromTo(v.querySelector(".vitrine__case"), { y: 60, rotateY: -18, opacity: 0.35 }, { y: 0, rotateY: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: v, containerAnimation: hzTween, start: "left 105%", end: "left 55%", scrub: true } });
      });
      return () => { hzTween = null; hzST = null; };
    });
    mm.add("(max-width: 899px)", () => {
      gsap.set($$(".vitrine, .era"), { y: 50, opacity: 0 });
      KALA.onView($$(".vitrine, .era"), (el) => gsap.to(el, { y: 0, opacity: 1, duration: 1.1, ease: "kala" }), 0.02);
      $$(".era").forEach((era) => ScrollTrigger.create({ trigger: era, start: "top 60%", onEnter: () => setTint(era.dataset.era), onEnterBack: () => setTint(era.dataset.era) }));
    });
  }

  function computeFracs() {
    const track = $(".hz__track");
    const dist = track.scrollWidth - innerWidth;
    eraFracs = $$(".era").map((el) => ({ id: el.dataset.era, f: Math.max(0, Math.min(1, (el.offsetLeft - innerWidth * 0.35) / dist)) }));
    $$(".ruler__tick").forEach((t, i) => { t.style.left = (eraFracs[i].f * 100) + "%"; });
  }

  let currentEra = null;
  function setTint(id) {
    document.body.style.setProperty("--era-tint", TINT[id] || "#0b0a08");
  }
  function updateRuler(p) {
    gsap.set(".ruler__fill", { scaleX: p });
    let cur = eraFracs[0] ? eraFracs[0].id : null;
    eraFracs.forEach((e) => { if (p + 0.0001 >= e.f) cur = e.id; });
    $$(".ruler__tick").forEach((t, i) => {
      t.classList.toggle("is-past", p >= eraFracs[i].f);
      t.classList.toggle("is-current", t.dataset.era === cur);
    });
    if (cur !== currentEra) {
      currentEra = cur;
      const e = eraById[cur];
      setTint(cur);
      $(".ruler__era").textContent = `${e.num} · ${e.name}`;
      const y = $(".ruler__year");
      const old = y.querySelector("span");
      const nu = document.createElement("span");
      nu.textContent = e.span;
      y.appendChild(nu);
      gsap.fromTo(nu, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "kala" });
      if (old) gsap.to(old, { yPercent: -100, duration: 0.6, ease: "kala", onComplete: () => old.remove() });
      if (old) { old.style.position = "absolute"; old.style.top = "0"; }
    }
  }
  function jumpToEra(id) {
    const e = eraFracs.find((x) => x.id === id);
    if (!e || !hzST) return;
    const target = hzST.start + (hzST.end - hzST.start) * (e.f + 0.002);
    if (KALA.lenis) KALA.lenis.scrollTo(target, { duration: 2 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }

  /* ---------- 3D tilt on cases ---------- */
  function initTilt() {
    if (!KALA.finePointer || KALA.reduced) return;
    $$(".vitrine").forEach((v) => {
      const c = v.querySelector(".vitrine__case");
      const rx = gsap.quickTo(c, "rotateX", { duration: 0.6, ease: "power3.out" });
      const ry = gsap.quickTo(c, "rotateY", { duration: 0.6, ease: "power3.out" });
      v.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * 10); ry(px * 12);
      });
      v.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }

  /* ---------- Index grid ---------- */
  function buildIndex() {
    const cats = ["All", ...new Set(arts.map((a) => a.category))];
    $(".filters").innerHTML = cats.map((c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" data-cat="${c}" type="button">${c}<span class="muted">${c === "All" ? arts.length : arts.filter((a) => a.category === c).length}</span></button>`).join("");
    $(".grid").innerHTML = arts.map((a) => `
      <article class="card" data-id="${a.id}" data-cat="${a.category}" tabindex="0" role="button" data-cursor="Open" aria-label="Open ${esc(a.title)}">
        <div class="card__img"><img src="${IMG(a.id, true)}" alt="${esc(a.title)}" loading="lazy" decoding="async"></div>
        <div class="card__era">${eraById[a.era].num} · ${eraById[a.era].name}</div>
        <h3 class="card__title">${a.title}</h3>
        <div class="card__date">${a.date}</div>
      </article>`).join("");
    $(".filters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".filters .chip").forEach((c) => c.classList.toggle("is-active", c === b));
      const cat = b.dataset.cat;
      const state = window.Flip ? Flip.getState(".card") : null;
      $$(".card").forEach((c) => c.classList.toggle("is-hidden", cat !== "All" && c.dataset.cat !== cat));
      if (state) Flip.from(state, { duration: 0.7, ease: "power3.inOut", scale: true, absolute: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }) });
      ScrollTrigger.refresh();
    });
  }

  /* ---------- Detail overlay ---------- */
  let dz = null, openIndex = -1, lastFocus = null;
  function initDetail() {
    const d = $(".detail");
    dz = new DeepZoom($(".detail__viewer"), {
      onZoom: (z) => { $(".detail__zoom output").textContent = Math.round(z * 100) + "%"; if (z > 0) $(".detail__hint").style.opacity = 0; },
      onLoaded: (n) => { const r = $(".detail__res"); r.classList.add("is-loaded"); r.lastChild.textContent = ` ${n.w} × ${n.h} px · full resolution`; },
    });
    $(".detail__zoom").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.z === "in") dz.zoomBy(1.6);
      if (b.dataset.z === "out") dz.zoomBy(1 / 1.6);
      if (b.dataset.z === "fit") dz.fit(true);
    });
    $(".detail__close").addEventListener("click", closeDetail);
    $(".detail__tabs").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      show3D(b.dataset.tab === "3d");
    });
    $(".detail__panel").addEventListener("click", (e) => {
      const b = e.target.closest(".detail__nav button"); if (!b) return;
      go(b.dataset.dir === "next" ? 1 : -1);
    });
    document.addEventListener("keydown", (e) => {
      if (!d.classList.contains("is-open")) return;
      if (e.key === "Escape") closeDetail();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "+" || e.key === "=") dz.zoomBy(1.5);
      if (e.key === "-") dz.zoomBy(1 / 1.5);
      if (e.key === "Tab") trapFocus(e);
    });
    document.addEventListener("click", (e) => {
      const t = e.target.closest(".vitrine, .card");
      if (t) openDetail(t.dataset.id);
    });
    document.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && document.activeElement && document.activeElement.matches(".vitrine, .card")) {
        e.preventDefault(); openDetail(document.activeElement.dataset.id);
      }
    });
    $$(".ruler__tick button").forEach((b) => b.addEventListener("click", () => jumpToEra(b.parentElement.dataset.era)));
  }
  function trapFocus(e) {
    const f = $$(".detail button, .detail a, .detail [tabindex]:not([tabindex='-1'])").filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function show3D(on) {
    const d = $(".detail");
    const a = arts[openIndex];
    d.classList.toggle("show-3d", on);
    $$(".detail__tabs button").forEach((b) => b.setAttribute("aria-selected", String((b.dataset.tab === "3d") === on)));
    const box = $(".detail__3d");
    if (on && a.sketchfab && !box.querySelector("iframe")) {
      box.innerHTML = `<div class="offline">Loading the 3D scan…<br><small style="font-family:var(--sans);font-size:12px;letter-spacing:.1em">(needs an internet connection)</small></div>
        <iframe title="${esc(a.sketchfab.label)}" allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen
          src="https://sketchfab.com/models/${a.sketchfab.uid}/embed?autostart=1&autospin=0.25&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_hint=2&dnt=1&transparent=0"></iframe>`;
      box.querySelector("iframe").addEventListener("load", () => { const o = box.querySelector(".offline"); if (o) o.remove(); });
    }
  }
  function renderDetail(a) {
    const e = eraById[a.era];
    const cr = CREDITS[a.id] || {};
    const d = $(".detail");
    d.classList.remove("show-3d");
    $(".detail__3d").innerHTML = "";
    $(".detail__tabs").style.display = a.sketchfab ? "" : "none";
    $$(".detail__tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === "photo")));
    const res = $(".detail__res");
    res.classList.remove("is-loaded");
    res.innerHTML = `<span class="dot"></span> Loading full resolution`;
    $(".detail__hint").style.opacity = 1;
    dz.load(IMG(a.id, true), IMG(a.id, false), a.title, cr.served);
    const prev = arts[(openIndex - 1 + arts.length) % arts.length], next = arts[(openIndex + 1) % arts.length];
    $(".detail__panel .content").innerHTML = `
      <div class="detail__era"><span class="eyebrow">Era ${e.num} · ${e.name}</span></div>
      <h2 class="detail__title" id="detail-title">${a.title}</h2>
      <div class="detail__native">${a.native}</div>
      <div class="detail__date">${a.date}</div>
      <p class="detail__summary">${a.summary}</p>
      <dl class="detail__meta">
        <dt>Medium</dt><dd>${a.medium}</dd>
        <dt>Size</dt><dd>${a.dims}</dd>
        <dt>Origin</dt><dd>${a.found}</dd>
        <dt>Now at</dt><dd>${a.now}</dd>
        <dt>Type</dt><dd>${a.category}</dd>
      </dl>
      <div class="detail__body">${a.body.map((p) => `<p>${p}</p>`).join("")}</div>
      <div class="detail__look"><h4>Look closer</h4><ol>${a.look.map((l) => `<li>${l}</li>`).join("")}</ol></div>
      <div class="detail__credit">
        Photograph: ${cr.artist ? esc(cr.artist) : "Wikimedia Commons contributor"} · ${cr.license || "see source"} ·
        ${cr.page ? `<a href="${cr.page}" target="_blank" rel="noopener">Wikimedia Commons</a>` : "Wikimedia Commons"}
        ${a.sketchfab ? `<br>3D: ${esc(a.sketchfab.label)} · <a href="https://sketchfab.com/3d-models/${a.sketchfab.uid}" target="_blank" rel="noopener">Sketchfab</a>` : ""}
      </div>
      <div class="detail__nav">
        <button type="button" data-dir="prev"><small>← Previous</small><span>${prev.title}</span></button>
        <button type="button" data-dir="next"><small>Next →</small><span>${next.title}</span></button>
      </div>`;
    $(".detail__panel").scrollTop = 0;
    try { history.replaceState(null, "", "#" + a.id); } catch (err) {}
  }
  function openDetail(id) {
    const i = arts.findIndex((a) => a.id === id);
    if (i < 0) return;
    lastFocus = document.activeElement;
    openIndex = i;
    const d = $(".detail");
    const wasOpen = d.classList.contains("is-open");
    d.classList.add("is-open");
    d.setAttribute("aria-hidden", "false");
    if (KALA.lenis) KALA.lenis.stop();
    document.documentElement.style.overflow = "hidden";
    renderDetail(arts[i]);
    if (!wasOpen && !KALA.reduced) {
      gsap.fromTo(d, { clipPath: "inset(50% 0 50% 0)" }, { clipPath: "inset(0% 0 0% 0)", duration: 0.9, ease: "kalaIO" });
      gsap.fromTo(".detail__panel .content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "kala", stagger: 0.04, delay: 0.35 });
      gsap.fromTo(".detail__viewer", { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1, ease: "kala", delay: 0.3, clearProps: "all" });
    }
    setTimeout(() => $(".detail__close").focus(), 50);
  }
  function go(dir) {
    openIndex = (openIndex + dir + arts.length) % arts.length;
    renderDetail(arts[openIndex]);
    if (!KALA.reduced) gsap.fromTo(".detail__panel .content > *", { x: 24 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "kala", stagger: 0.03 });
  }
  function closeDetail() {
    const d = $(".detail");
    const done = () => {
      d.classList.remove("is-open", "show-3d");
      d.setAttribute("aria-hidden", "true");
      $(".detail__3d").innerHTML = "";
      document.documentElement.style.overflow = "";
      if (KALA.lenis) KALA.lenis.start();
      try { history.replaceState(null, "", location.pathname); } catch (err) {}
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    if (KALA.reduced) done();
    else gsap.to(d, { clipPath: "inset(50% 0 50% 0)", duration: 0.7, ease: "kalaIO", onComplete: () => { done(); gsap.set(d, { clearProps: "clipPath" }); } });
  }

  /* ---------- Hero intro ---------- */
  function heroIntro() {
    if (KALA.reduced) return;
    const h1 = $(".k-hero h1");
    const chars = Array.from(h1.textContent.normalize("NFC"));
    h1.classList.remove("gold-text");
    h1.innerHTML = chars.map((c) => `<span class="char gold-text">${c}</span>`).join("");
    const tl = gsap.timeline();
    tl.from(".k-hero h1 .char", { yPercent: 110, opacity: 0, rotate: 8, duration: 1.4, ease: "kala", stagger: 0.07 })
      .from(".k-hero__ghost", { opacity: 0, scale: 1.2, duration: 2.2, ease: "kala" }, 0)
      .from(".k-hero .eyebrow, .k-hero__sub, .k-hero__meta > div, .scroll-cue", { y: 30, opacity: 0, duration: 1.1, ease: "kala", stagger: 0.08 }, 0.4)
      .from(".k-hero__bg .col", { yPercent: (i) => (i % 2 ? -12 : 12), opacity: 0, duration: 2.2, ease: "kala", stagger: 0.08 }, 0);
    $$(".k-hero__bg .col").forEach((c, i) => {
      gsap.to(c, { yPercent: i % 2 ? 14 : -14, ease: "none", scrollTrigger: { trigger: ".k-hero", start: "top top", end: "bottom top", scrub: true } });
    });
    gsap.to(".k-hero__inner", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".k-hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- Boot ---------- */
  buildHero();
  buildJourney();
  buildRuler();
  buildIndex();
  initDetail();
  KALA.ready.then(() => {
    heroIntro();
    initHorizontal();
    initTilt();
    const imgs = $$(".vitrine__frame img");
    let n = 0;
    imgs.forEach((im) => { if (!im.complete) im.addEventListener("load", () => { if (++n % 6 === 0) ScrollTrigger.refresh(); }, { once: true }); });
    setTimeout(() => ScrollTrigger.refresh(), 600);
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && arts.some((a) => a.id === hash)) setTimeout(() => openDetail(hash), 400);
  });
})();
