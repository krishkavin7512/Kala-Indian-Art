/* =========================================================
   KALĀ — shared runtime
   loader · smooth scroll · cursor · transitions · reveals · footer · sound
   ========================================================= */
(function () {
  "use strict";

  const KALA = (window.KALA = window.KALA || {});
  const root = document.documentElement.dataset.root || "";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduced) document.documentElement.classList.add("reduced");
  KALA.root = root;
  KALA.reduced = reduced;
  KALA.finePointer = finePointer;

  KALA.TEAM = [
    { name: "Kavin Krish Vijay", reg: "" },
    { name: "Tanay Krishnan", reg: "" },
    { name: "Ryan Fernandes", reg: "" },
    { name: "Prithvi Chauhan", reg: "" },
  ];

  const store = {
    get(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (e) {} },
  };
  KALA.store = store;

  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP) {
    const plugins = ["ScrollTrigger", "SplitText", "CustomEase", "Draggable", "InertiaPlugin", "Flip", "DrawSVGPlugin", "MotionPathPlugin", "ScrollToPlugin", "Observer"]
      .map((n) => window[n]).filter(Boolean);
    gsap.registerPlugin(...plugins);
    if (window.CustomEase) {
      CustomEase.create("kala", "0.16, 1, 0.3, 1");
      CustomEase.create("kalaIO", "0.76, 0, 0.24, 1");
    }
  }

  /* ---------- Chrome: grain, cursor, curtain ---------- */
  function injectChrome() {
    const grain = document.createElement("div");
    grain.className = "grain";
    grain.setAttribute("aria-hidden", "true");
    document.body.appendChild(grain);

    const curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.setAttribute("aria-hidden", "true");
    curtain.innerHTML = "<i></i><i></i><i></i><i></i><i></i>";
    document.body.appendChild(curtain);
    KALA.curtain = curtain;

    if (finePointer && !reduced) {
      const c = document.createElement("div");
      c.className = "cursor";
      c.innerHTML = "<span></span>";
      const d = document.createElement("div");
      d.className = "cursor-dot";
      document.body.append(c, d);
      document.body.classList.add("has-cursor");
      let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
      addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; d.style.transform = `translate(${mx}px,${my}px)`; }, { passive: true });
      (function loop() {
        cx += (mx - cx) * 0.16; cy += (my - cy) * 0.16;
        c.style.transform = `translate(${cx}px,${cy}px)`;
        requestAnimationFrame(loop);
      })();
      const label = c.querySelector("span");
      document.addEventListener("pointerover", (e) => {
        const t = e.target.closest("[data-cursor], a, button, input, select, label, [role=button]");
        c.classList.remove("is-hover", "is-link");
        if (!t) return;
        if (t.dataset.cursor) { label.textContent = t.dataset.cursor; c.classList.add("is-hover"); }
        else c.classList.add("is-link");
      });
      document.addEventListener("pointerleave", () => { c.classList.add("is-hidden"); d.classList.add("is-hidden"); });
      document.addEventListener("pointerenter", () => { c.classList.remove("is-hidden"); d.classList.remove("is-hidden"); });
      KALA.cursor = c;
    }
  }

  /* ---------- Page intros ----------
     Each page registers its hero entrance with KALA.intro(fn). The timeline is built (and its
     starting state applied) BEFORE the loader or curtain lifts, then played as the page is
     revealed, so visitors never see the finished hero first and then watch it replay. */
  const introFns = [];
  let introTls = null;
  KALA.intro = (fn) => {
    if (introTls) { const tl = buildIntro(fn); if (tl) tl.play(); return; }
    introFns.push(fn);
  };
  function buildIntro(fn) {
    try { const tl = fn(); return tl && typeof tl.pause === "function" ? tl.pause(0) : null; }
    catch (e) { console.error(e); return null; }
  }
  function prepIntros() {
    introTls = [];
    if (!hasGSAP || reduced || SHOT) return;
    introFns.splice(0).forEach((fn) => { const tl = buildIntro(fn); if (tl) introTls.push(tl); });
  }
  function playIntros(delay) {
    const tls = introTls || [];
    introTls = [];
    tls.forEach((tl) => (delay ? gsap.delayedCall(delay, () => tl.play()) : tl.play()));
  }

  /* ---------- Loader ---------- */
  function mandalaSVG() {
    let s = '<svg class="loader__mandala" viewBox="-100 -100 200 200" aria-hidden="true">';
    s += '<circle r="96"/><circle r="88"/><circle r="30"/><circle r="22"/><circle r="6"/>';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const r1 = 30, r2 = 86;
      const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
      const x2 = Math.cos(a) * r2, y2 = Math.sin(a) * r2;
      const w = 0.2;
      const cxa = Math.cos(a - w) * 62, cya = Math.sin(a - w) * 62;
      const cxb = Math.cos(a + w) * 62, cyb = Math.sin(a + w) * 62;
      s += `<path d="M${x1.toFixed(2)},${y1.toFixed(2)} Q${cxa.toFixed(2)},${cya.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)} Q${cxb.toFixed(2)},${cyb.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}"/>`;
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(a) * 22, y = Math.sin(a) * 22;
      s += `<path d="M0,0 Q${(Math.cos(a - 0.5) * 18).toFixed(2)},${(Math.sin(a - 0.5) * 18).toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)} Q${(Math.cos(a + 0.5) * 18).toFixed(2)},${(Math.sin(a + 0.5) * 18).toFixed(2)} 0,0"/>`;
    }
    return s + "</svg>";
  }

  function runLoader() {
    return new Promise((resolve) => {
      const seen = store.get("kala-seen");
      const word = document.body.dataset.loaderWord || "कला";
      const sub = document.body.dataset.loaderSub || "Kalā · Indian Art";
      const show = () => document.documentElement.classList.add("is-ready");
      const params = new URLSearchParams(location.search);
      if (!hasGSAP || reduced || params.has("shot")) { show(); resolve(); return; }

      if (seen) {
        // Returning within the session: curtain reveal only
        const cols = KALA.curtain.querySelectorAll("i");
        gsap.set(cols, { scaleY: 1, transformOrigin: "top" });
        show();
        playIntros(0.25);
        gsap.to(cols, { scaleY: 0, duration: 0.9, ease: "kalaIO", stagger: 0.06, delay: 0.05, onComplete: resolve });
        return;
      }
      store.set("kala-seen", "1");
      const el = document.createElement("div");
      el.className = "loader";
      el.innerHTML = `<div class="loader__inner">${mandalaSVG()}<div class="loader__word indic">${word}</div><div class="loader__sub">${sub}</div></div><div class="loader__count">000</div><div class="loader__bar"></div>`;
      document.body.appendChild(el);
      show();
      const paths = el.querySelectorAll(".loader__mandala path, .loader__mandala circle");
      paths.forEach((p) => {
        const len = p.getTotalLength ? p.getTotalLength() : 600;
        p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      });
      const count = el.querySelector(".loader__count");
      const bar = el.querySelector(".loader__bar");
      const st = { v: 0 };
      const ready = Promise.race([
        Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true })))]),
        new Promise((r) => setTimeout(r, 4500)),
      ]);
      const tl = gsap.timeline();
      tl.to(paths, { strokeDashoffset: 0, duration: 2.1, ease: "power2.inOut", stagger: 0.025 }, 0)
        .from(el.querySelector(".loader__word"), { opacity: 0, y: 20, duration: 1, ease: "kala" }, 0.3)
        .from(el.querySelector(".loader__sub"), { opacity: 0, duration: 1 }, 0.6)
        .to(st, { v: 86, duration: 1.9, ease: "power1.inOut", onUpdate: () => { count.textContent = String(Math.round(st.v)).padStart(3, "0"); gsap.set(bar, { scaleX: st.v / 100 }); } }, 0);
      ready.then(() => tl.then(() => {
        gsap.to(st, { v: 100, duration: 0.45, ease: "power2.out", onUpdate: () => { count.textContent = String(Math.round(st.v)).padStart(3, "0"); gsap.set(bar, { scaleX: st.v / 100 }); } });
        gsap.to(el.querySelector(".loader__inner"), { opacity: 0, y: -30, duration: 0.7, delay: 0.35, ease: "power2.in" });
        gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, delay: 0.75, ease: "kalaIO", onStart: () => { playIntros(0.45); setTimeout(resolve, 350); }, onComplete: () => el.remove() });
      }));
    });
  }

  /* ---------- Smooth scroll ---------- */
  const SHOT = new URLSearchParams(location.search).has("shot");
  if (SHOT) document.documentElement.classList.add("shot");
  function initScroll() {
    if (!window.Lenis || reduced || SHOT || document.body.dataset.noLenis !== undefined) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    KALA.lenis = lenis;
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: 0, duration: 1.6 });
      });
    });
  }

  /* ---------- Page transitions ---------- */
  function initTransitions() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-transition]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || !hasGSAP || reduced) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      const cols = KALA.curtain.querySelectorAll("i");
      gsap.set(cols, { transformOrigin: "bottom" });
      gsap.to(cols, { scaleY: 1, duration: 0.75, ease: "kalaIO", stagger: 0.05, onComplete: () => { window.location.href = href; } });
    });
    addEventListener("pageshow", (e) => {
      if (e.persisted && KALA.curtain && hasGSAP) gsap.set(KALA.curtain.querySelectorAll("i"), { scaleY: 0 });
    });
  }

  /* ---------- Reveals ---------- */
  KALA.splitLines = function (el) {
    if (!window.SplitText) return null;
    const split = new SplitText(el, { type: "lines", linesClass: "line-mask", mask: "lines" });
    return split;
  };
  // Run fn once when el scrolls into view (IntersectionObserver: robust even if layout shifts)
  KALA.onView = function (el, fn, threshold = 0.12) {
    const els = typeof el === "string" ? [...document.querySelectorAll(el)] : el.length !== undefined ? [...el] : [el];
    if (!("IntersectionObserver" in window)) { els.forEach((e) => fn(e)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); fn(en.target); } });
    }, { threshold, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  };
  function initReveals() {
    const items = [...document.querySelectorAll("[data-reveal]")];
    if (!hasGSAP || SHOT) { items.forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; }); return; }
    KALA.onView(items, (el) => gsap.to(el, { opacity: 1, y: 0, duration: 1.3, ease: "kala" }), 0.05);
    document.querySelectorAll("[data-split]").forEach((el) => {
      const split = KALA.splitLines(el);
      if (!split) return;
      gsap.set(split.lines, { yPercent: 110 });
      KALA.onView(el, () => gsap.to(split.lines, { yPercent: 0, duration: 1.4, ease: "kala", stagger: 0.08 }), 0.05);
    });
  }

  /* ---------- Footer ---------- */
  function renderFooter() {
    const f = document.querySelector("[data-footer]");
    if (!f) return;
    const big = f.dataset.big || "Kalā";
    const project = f.dataset.project || "";
    const members = KALA.TEAM.map((m, i) => `
      <div class="team__m">
        <div class="team__idx">${["i", "ii", "iii", "iv", "v"][i]}.</div>
        <div class="team__name">${m.name}</div>
        ${m.reg ? `<div class="team__reg">${m.reg}</div>` : ""}
      </div>`).join("");
    f.innerHTML = `
      <div class="footer__big" aria-hidden="true">${big}</div>
      <span class="footer__label">Curated &amp; built by</span>
      <div class="team">${members}</div>
      <div class="footer__meta">
        <div><strong>KALĀ</strong> · Three interactive journeys through Indian art${project ? " · " + project : ""}</div>
        <div>Hand-built with HTML, CSS, JavaScript, GSAP &amp; D3</div>
        <div><a href="${root}index.html" data-transition>All journeys</a> &nbsp;·&nbsp; <a href="${root}credits/index.html" data-transition>Image credits &amp; sources</a></div>
      </div>`;
    f.querySelectorAll(".team__m").forEach((m) => {
      m.addEventListener("pointermove", (e) => {
        const r = m.getBoundingClientRect();
        m.style.setProperty("--mx", `${e.clientX - r.left}px`);
        m.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Sound toggle ---------- */
  function initSound() {
    const btn = document.querySelector("[data-sound]");
    if (!btn) return;
    btn.innerHTML = '<span class="sound__bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="sound__label">Tanpura</span>';
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "Toggle ambient tanpura drone");
    btn.addEventListener("click", () => {
      if (!window.Tanpura) return;
      const on = window.Tanpura.toggle();
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
      store.set("kala-sound", on ? "1" : "0");
    });
    if (store.get("kala-sound") === "1") {
      const resume = () => {
        if (window.Tanpura && !window.Tanpura.playing) { window.Tanpura.start(); btn.classList.add("is-on"); btn.setAttribute("aria-pressed", "true"); }
        removeEventListener("pointerdown", resume);
        removeEventListener("keydown", resume);
      };
      addEventListener("pointerdown", resume);
      addEventListener("keydown", resume);
    }
  }

  /* ---------- Nav: hide on scroll down, frosted on scroll up, peek at top edge ---------- */
  function initNav() {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    let lastY = window.scrollY, ticking = false, peek = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, dy = y - lastY;
      if (Math.abs(dy) > 6) {
        if (dy > 0 && y > 140 && !peek && !nav.contains(document.activeElement)) nav.classList.add("is-hidden");
        else if (dy < 0) nav.classList.remove("is-hidden");
        lastY = y;
      }
      nav.classList.toggle("is-solid", y > 40);
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("pointermove", (e) => {
      const near = e.clientY < 84;
      if (near === peek) return;
      peek = near;
      if (near) nav.classList.remove("is-hidden");
    }, { passive: true });
    nav.addEventListener("focusin", () => nav.classList.remove("is-hidden"));
    update();
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (!finePointer || reduced || !hasGSAP) return;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.6, ease: "power3.out" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" }));
    });
  }

  /* ---------- Boot ---------- */
  KALA.ready = new Promise((resolve) => {
    const boot = () => {
      document.documentElement.classList.remove("no-js");
      injectChrome();
      renderFooter();
      initScroll();
      initNav();
      initTransitions();
      initSound();
      initMagnetic();
      prepIntros();
      runLoader().then(() => {
        initReveals();
        document.documentElement.classList.add("is-loaded");
        resolve();
        const y = new URLSearchParams(location.search).get("y");
        if (y) { window.scrollTo(0, +y); if (window.ScrollTrigger) ScrollTrigger.update(); }
      });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  });
})();
