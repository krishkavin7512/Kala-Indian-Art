/* =========================================================
   SAṄGAM — fusion page
   ========================================================= */
(function () {
  "use strict";
  const S = window.Sangam, C = S.C, Mo = S.motifs;
  const CREDITS = window.KALA_CREDITS || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const R = S.rng(7);

  /* ---------- Hero: Warli spiral vs Kalamkari mandala ---------- */
  function buildHero() {
    let w = "";
    [[150, 0.95], [255, 1.1], [360, 1.25]].forEach(([r, sc], ri) => {
      const n = Math.round((2 * Math.PI * r) / (34 * sc));
      w += `<g class="ring" style="transform-origin:0 0">`;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + ri * 0.2;
        w += Mo.warliFigure(Math.cos(a) * r, Math.sin(a) * r, (a * 180) / Math.PI + 90, sc, { dance: true, arms: "M-6,-15 L-15,-7 M6,-15 L15,-7" });
      }
      w += "</g>";
    });
    w += `<circle r="420" fill="none" stroke="${C.rice}" stroke-width="2" stroke-dasharray="3 9" opacity=".6"/>`;
    w += Mo.warliFigure(0, 10, 0, 2.3, { arms: "M-6,-15 L4,-22 M6,-15 L10,-20" });
    w += `<path d="M10,-10 C50,-4 70,30 82,62" fill="none" stroke="${C.rice}" stroke-width="7" stroke-linecap="round"/><path d="M68,64 Q86,48 102,68 Q86,84 68,64Z" fill="${C.rice}"/>`;
    $(".s-hero__side--w .s-hero__art").innerHTML = `<svg viewBox="-500 -500 1000 1000">${S.defs()}<g class="spin">${w}</g></svg>`;

    let k = `<circle r="440" fill="none" stroke="${C.madder}" stroke-width="3"/><circle r="452" fill="none" stroke="${C.kasimi}" stroke-width="1.5"/>`;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      k += Mo.paisley(Math.cos(a) * 395, Math.sin(a) * 395, 1.6, (a * 180) / Math.PI + 90, i % 2 ? C.indigo : C.madder);
    }
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.3;
      k += Mo.blossom(Math.cos(a) * 300, Math.sin(a) * 300, 52, i * 20, i % 2 ? [C.indigo, C.madder, C.mustard] : [C.madder, C.mustard, C.cream], R);
    }
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      k += Mo.leaf(Math.cos(a) * 150, Math.sin(a) * 150, 88, a, i % 2 ? C.green : C.indigo, { w: 0.32 });
    }
    k += Mo.blossom(0, 0, 150, 0, [C.madder, C.indigo, C.mustard], R);
    $(".s-hero__side--k .s-hero__art").innerHTML = `<svg viewBox="-500 -500 1000 1000">${S.defs()}<g class="spin spin--rev">${k}</g></svg>`;
  }
  function initSplit() {
    const hero = $(".s-hero"), div = $(".s-hero__divider");
    let drag = false;
    const set = (x) => {
      const r = hero.getBoundingClientRect();
      const p = Math.max(4, Math.min(96, ((x - r.left) / r.width) * 100));
      hero.style.setProperty("--split", p + "%");
    };
    div.addEventListener("pointerdown", (e) => { drag = true; div.setPointerCapture(e.pointerId); set(e.clientX); });
    div.addEventListener("pointermove", (e) => { if (drag) set(e.clientX); });
    div.addEventListener("pointerup", () => (drag = false));
    div.addEventListener("keydown", (e) => {
      const cur = parseFloat(getComputedStyle(hero).getPropertyValue("--split")) || 50;
      if (e.key === "ArrowLeft") hero.style.setProperty("--split", Math.max(4, cur - 4) + "%");
      if (e.key === "ArrowRight") hero.style.setProperty("--split", Math.min(96, cur + 4) + "%");
    });
  }
  function heroIntro() {
    if (KALA.reduced) return;
    const hero = $(".s-hero");
    const st = { v: 100 };
    gsap.to(st, { v: 50, duration: 2.2, ease: "kalaIO", delay: 0.2, onUpdate: () => hero.style.setProperty("--split", st.v + "%") });
    gsap.from(".s-hero__center > div", { y: 40, opacity: 0, duration: 1.4, ease: "kala", stagger: 0.12, delay: 0.5 });
    gsap.to(".s-hero .spin", { rotate: 360, duration: 140, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    gsap.to(".s-hero .spin--rev", { rotate: -360, duration: 180, ease: "none", repeat: -1, overwrite: true, transformOrigin: "50% 50%" });
    gsap.to(".s-hero__art", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".s-hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- Venn ---------- */
  const VENN = {
    W: { title: "Only in Warli", tag: "Warli · Maharashtra", items: [
      "Rice paste on walls plastered with mud and cow-dung", "A strict geometry: circle, triangle, square", "Monochrome — rice-white on red-brown", "Human figures in motion: dancing, farming, hunting", "Painted by the community for weddings and harvests"] },
    B: { title: "Shared by both", tag: "Where they meet", items: [
      "Outline-led: the drawn line carries the image", "Nature is sacred — trees, birds and animals everywhere", "Flat space with no single-point perspective", "Materials taken from the earth and plants", "Storytelling for community, ritual and devotion", "Living traditions protected by GI tags"] },
    K: { title: "Only in Kalamkari", tag: "Kalamkari · Andhra Pradesh", items: [
      "Cotton cloth, mordants and natural dyes", "Flowing, curving line drawn with a bamboo kalam", "Rich polychrome: madder, indigo, myrobalan yellow", "Epic narratives, deities and the flowering Tree of Life", "Hereditary artisans; cloth traded across the world"] },
  };
  function buildVenn() {
    const svg = `<svg viewBox="0 0 700 480" role="img" aria-label="Venn diagram comparing Warli and Kalamkari">
      <defs><clipPath id="clipL"><circle cx="260" cy="240" r="200"/></clipPath></defs>
      <circle class="c cW" cx="260" cy="240" r="200" fill="${C.geru}" fill-opacity=".55" stroke="${C.rice}" stroke-width="1.4"/>
      <circle class="c cK" cx="440" cy="240" r="200" fill="${C.cream}" fill-opacity=".22" stroke="${C.mustard}" stroke-width="1.4"/>
      <circle class="c cB" cx="440" cy="240" r="200" clip-path="url(#clipL)" fill="${C.mustard}" fill-opacity=".35"/>
      <text class="ttl" x="170" y="232" text-anchor="middle">Warli</text>
      <text x="170" y="258" text-anchor="middle" opacity=".7">वारली</text>
      <text class="ttl" x="530" y="232" text-anchor="middle">Kalamkari</text>
      <text x="530" y="258" text-anchor="middle" opacity=".7">కలంకారీ</text>
      <text x="350" y="232" text-anchor="middle" style="font-family:var(--serif);font-size:22px;font-style:italic">Saṅgam</text>
      <text x="350" y="256" text-anchor="middle" opacity=".7">6 shared ideas</text>
      <circle class="zone" data-z="W" cx="170" cy="240" r="95" fill="transparent"/>
      <circle class="zone" data-z="K" cx="530" cy="240" r="95" fill="transparent"/>
      <ellipse class="zone" data-z="B" cx="350" cy="240" rx="70" ry="150" fill="transparent"/>
    </svg>`;
    $(".venn").innerHTML = svg;
    const show = (z) => {
      const v = VENN[z];
      $(".venn-list .body").innerHTML = `<h3><small>${v.tag}</small>${v.title}</h3><ul>${v.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
      $$(".venn-tabs .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.z === z));
      $(".venn .cW").style.opacity = z === "K" ? 0.35 : 1;
      $(".venn .cK").style.opacity = z === "W" ? 0.35 : 1;
      $(".venn .cB").style.opacity = z === "B" ? 1 : 0.55;
      if (!KALA.reduced) gsap.from(".venn-list li", { x: 20, opacity: 0, duration: 0.6, ease: "kala", stagger: 0.05 });
    };
    $(".venn").addEventListener("click", (e) => { const z = e.target.closest("[data-z]"); if (z) show(z.dataset.z); });
    $(".venn-tabs").addEventListener("click", (e) => { const z = e.target.closest("[data-z]"); if (z) show(z.dataset.z); });
    show("B");
  }

  /* ---------- The artwork ---------- */
  let layers = [], assembleTl = null;
  function buildArtwork() {
    const frame = $(".art-frame");
    layers = S.render(frame, { seed: 2026 });
    const tags = [["cloth", "Kalamkari cloth & border", "#e9c56b", 84], ["wall", "Warli geru wall", "#f09a74", 67], ["tree", "Kalamkari Tree of Life", "#e9c56b", 50], ["life", "Warli life & tarpa dance", "#f09a74", 33], ["frieze", "Fusion frieze", "#f3cf7e", 16]];
    $(".art-tags").innerHTML = tags.map(([id, t, c, top], i) => `<span class="art-tag" style="--c:${c};top:${top}%;transition-delay:${0.2 + i * 0.08}s">${String(i + 1).padStart(2, "0")} · ${t}</span>`).join("");

    // hover explanations
    const tip = $(".art-tip");
    const ORIG = { W: ["Warli", "#f09a74"], K: ["Kalamkari", "#e9c56b"], F: ["Fusion", "#f3cf7e"] };
    frame.addEventListener("pointermove", (e) => {
      const g = e.target.closest("[data-note]");
      if (!g || frame.classList.contains("is-exploded")) { tip.classList.remove("is-on"); return; }
      const [label, col] = ORIG[g.dataset.origin] || ["", "#fff"];
      tip.style.setProperty("--c", col);
      tip.innerHTML = `<small>${label}</small><b>${g.dataset.name}</b><p>${g.dataset.note}</p>`;
      tip.style.left = e.clientX + "px"; tip.style.top = e.clientY + "px";
      const r = tip.getBoundingClientRect();
      if (e.clientX + r.width + 30 > innerWidth) tip.style.left = e.clientX - r.width - 30 + "px";
      if (e.clientY + r.height + 30 > innerHeight) tip.style.top = e.clientY - r.height - 30 + "px";
      tip.classList.add("is-on");
    });
    frame.addEventListener("pointerleave", () => tip.classList.remove("is-on"));

    // modes
    $(".art-controls").addEventListener("click", (e) => {
      const b = e.target.closest("[data-mode]"); if (!b) return;
      finishAssemble();
      const m = b.dataset.mode;
      $$(".art-mode").forEach((x) => x.classList.toggle("is-active", x === b));
      const stage = $(".art-stage");
      stage.classList.remove("mode-W", "mode-K", "mode-F");
      if (m !== "all") stage.classList.add("mode-" + m);
    });
    $("[data-explode]").addEventListener("click", (e) => {
      finishAssemble();
      const on = frame.classList.toggle("is-exploded");
      e.currentTarget.querySelector("span.t").textContent = on ? "Reassemble" : "Explode the layers";
    });
    $("[data-download]").addEventListener("click", () => finishAssemble() || downloadSVG(S.flatten(layers), 2000, 2600, "sangam-tree-of-life-and-the-tarpa-dance.png"));

    // assemble on scroll — fromTo with explicit end states, then clear every inline style
    // so CSS alone controls the layers afterwards (explode / modes rely on that)
    if (!KALA.reduced && !document.documentElement.classList.contains("shot")) {
      const inner2 = layers[2].querySelectorAll("g[data-origin]");
      const inner3 = layers[3].querySelectorAll("g[data-origin]");
      const CLEAR = "opacity,transform,scale,translate,rotate,transformOrigin";
      assembleTl = gsap.timeline({
        paused: true,
        onComplete: () => gsap.set([...layers, ...inner2, ...inner3], { clearProps: CLEAR }),
      });
      assembleTl
        .fromTo(layers[0], { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 1.2, ease: "kala" })
        .fromTo(layers[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "kala" }, "-=0.6")
        .fromTo(inner2, { opacity: 0, scale: 0.9, transformOrigin: "50% 80%" }, { opacity: 1, scale: 1, duration: 1.3, ease: "kala", stagger: 0.15 }, "-=0.5")
        .fromTo(inner3, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "kala", stagger: 0.12 }, "-=0.8")
        .fromTo(layers[4], { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.6");
      KALA.onView($(".art-stage"), () => assembleTl.play(), 0.15);
    }
  }
  // If a visitor explodes or filters before the reveal has finished, finish it instantly first
  function finishAssemble() { if (assembleTl && assembleTl.progress() < 1) assembleTl.progress(1); }

  function downloadSVG(svgStr, w, h, name) {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      cv.toBlob((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b); a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      }, "image/png");
    };
    img.src = url;
  }

  /* ---------- Studio ---------- */
  const SW = 1000, SH = 700;
  const DANCER_ARMS = "M-6,-15 L-15,-7 M6,-15 L15,-7";
  const LIB = {
    "w-dancer": { g: "w", label: "Dancer", box: 34, draw: () => Mo.warliFigure(0, 0, 0, 2.4, { dance: true, arms: DANCER_ARMS }) },
    "w-pot": { g: "w", label: "Water carrier", box: 42, draw: () => Mo.warliFigure(0, 8, 0, 2.2, { pot: true, arms: "M-6,-15 L-5,-28 M6,-15 L5,-28" }) },
    "w-deer": { g: "w", label: "Deer", box: 34, draw: () => Mo.warliAnimal(0, 0, 2.4, false, "deer") },
    "w-bull": { g: "w", label: "Bullock", box: 34, draw: () => Mo.warliAnimal(0, 0, 2.4, false, "bull") },
    "w-hut": { g: "w", label: "Hut", box: 50, draw: () => Mo.warliHut(0, 8, 1.3) },
    "w-tree": { g: "w", label: "Tree", box: 60, draw: () => Mo.warliTree(0, 70, 140, S.rng(3)) },
    "w-bird": { g: "w", label: "Birds", box: 34, draw: () => Mo.warliBird(-16, 0, 2.6) + Mo.warliBird(22, -18, 1.8) },
    "w-circle": { g: "w", label: "Tarpa circle", box: 92, draw: () => { let s = ""; const n = 12; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; s += Mo.warliFigure(Math.cos(a) * 64, Math.sin(a) * 64, (a * 180) / Math.PI + 90, 1.1, { dance: true, arms: DANCER_ARMS }); } return s + Mo.warliFigure(0, 6, 0, 1.2, {}); } },
    "k-blossom": { g: "k", label: "Blossom", box: 56, draw: () => Mo.blossom(0, 0, 52, 0, [C.madder, C.indigo, C.mustard], S.rng(11)) },
    "k-blossom2": { g: "k", label: "Indigo blossom", box: 56, draw: () => Mo.blossom(0, 0, 52, 10, [C.indigo, C.madder, C.cream], S.rng(5)) },
    "k-lotus": { g: "k", label: "Lotus bud", box: 50, draw: () => Mo.lotusSide(0, 24, 50, 0) },
    "k-leaf": { g: "k", label: "Leaf spray", box: 56, draw: () => Mo.leaf(-10, 30, 70, -1.2, C.green) + Mo.leaf(-10, 30, 64, -2.1, C.indigo) + Mo.leaf(-10, 30, 58, -0.4, C.mustard) },
    "k-peacock": { g: "k", label: "Peacock", box: 80, draw: () => Mo.peacock(40, -10, 0.95, false) },
    "k-parrot": { g: "k", label: "Parrot", box: 44, draw: () => Mo.parrot(0, 0, 1.6, false) },
    "k-paisley": { g: "k", label: "Paisley", box: 50, draw: () => Mo.paisley(0, 0, 2.3, 0, C.madder) },
    "f-dancer": { g: "f", label: "Patterned dancer", box: 34, draw: () => Mo.warliFigure(0, 0, 0, 2.4, { dance: true, arms: DANCER_ARMS, fill: "url(#kpatRed)" }) },
    "f-dancer2": { g: "f", label: "Indigo dancer", box: 34, draw: () => Mo.warliFigure(0, 0, 0, 2.4, { dance: true, arms: DANCER_ARMS, fill: "url(#kpatIndigo)" }) },
    "f-sun": { g: "f", label: "Fusion sun", box: 64, draw: () => { let s = ""; for (let i = 0; i < 16; i++) s += `<path transform="rotate(${i * 22.5})" d="M-7,-36 L0,-60 L7,-36Z" fill="${i % 2 ? C.mustard : C.madder}" stroke="${C.kasimi}" stroke-width="1.4"/>`; return s + `<circle r="36" fill="${C.rice}" stroke="${C.kasimi}" stroke-width="1.6"/>` + Mo.blossom(0, 0, 22, 0, [C.madder, C.mustard, C.cream], S.rng(2)); } },
    "f-fruit": { g: "f", label: "Warli fruit", box: 30, draw: () => { let s = `<circle r="24" fill="${C.geru}" stroke="${C.kasimi}" stroke-width="2.5"/>`; for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; s += `<circle cx="${Math.cos(a) * 15}" cy="${Math.sin(a) * 15}" r="2.6" fill="${C.rice}"/>`; } return s + Mo.leaf(0, -24, 34, -1.9, C.green); } },
  };
  const BGS = { geru: { fill: C.geru, label: "Geru wall", ink: C.rice }, cream: { fill: C.cream, label: "Kalamkari cloth", ink: "#2a1a10" }, indigo: { fill: C.indigo2, label: "Indigo", ink: C.rice } };
  const studio = { items: [], bg: "geru", border: "vine", sel: null, uid: 0 };

  function stampSVG(type, bg) {
    let s = LIB[type].draw();
    if (LIB[type].g !== "k") s = s.split(C.rice).join(BGS[bg].ink);
    return s;
  }
  function borderSVG(kind, bg) {
    if (kind === "none") return "";
    let s = "";
    if (kind === "vine") {
      s += `<path d="M0,0H${SW}V${SH}H0Z M40,40V${SH - 40}H${SW - 40}V40Z" fill="${C.madder}" fill-rule="evenodd"/><rect x="40" y="40" width="${SW - 80}" height="${SH - 80}" fill="none" stroke="${C.kasimi}" stroke-width="3"/><rect x="6" y="6" width="${SW - 12}" height="${SH - 12}" fill="none" stroke="${C.kasimi}" stroke-width="2"/>`;
      const rr = S.rng(9);
      for (let x = 60; x < SW - 40; x += 60) { s += Mo.blossom(x, 20, 12, 0, [C.cream, x % 120 ? C.indigo : C.mustard, C.madder], rr) + Mo.blossom(x, SH - 20, 12, 0, [C.cream, x % 120 ? C.mustard : C.indigo, C.madder], rr); }
      for (let y = 80; y < SH - 40; y += 60) { s += Mo.blossom(20, y, 12, 0, [C.cream, C.indigo, C.madder], rr) + Mo.blossom(SW - 20, y, 12, 0, [C.cream, C.mustard, C.madder], rr); }
    } else {
      const ink = BGS[bg].ink;
      s += `<rect x="4" y="4" width="${SW - 8}" height="${SH - 8}" fill="none" stroke="${ink}" stroke-width="2" stroke-dasharray="3 6"/>`;
      let f = "";
      for (let x = 30; x <= SW - 30; x += 22) { f += Mo.warliFigure(x, 30, 0, 0.8, { dance: true, arms: "M-6,-15 L-16,-6 M6,-15 L16,-6" }) + Mo.warliFigure(x, SH - 24, 0, 0.8, { dance: true, arms: "M-6,-15 L-16,-6 M6,-15 L16,-6" }); }
      s += f.split(C.rice).join(ink);
    }
    return s;
  }
  function renderStudio() {
    const svg = $(".studio__canvas svg");
    const bg = BGS[studio.bg];
    let s = S.defs() + `<rect width="${SW}" height="${SH}" fill="${bg.fill}"/><rect width="${SW}" height="${SH}" fill="${bg.fill}" filter="url(#${studio.bg === "cream" ? "clothTex" : "mudTex"})"/>`;
    s += borderSVG(studio.border, studio.bg);
    s += `<g class="items">` + studio.items.map((it) => `<g class="item${studio.sel === it.id ? " is-selected" : ""}" data-id="${it.id}" transform="translate(${it.x},${it.y}) rotate(${it.r}) scale(${it.s})">${stampSVG(it.type, studio.bg)}<rect class="sel" x="${-LIB[it.type].box - 8}" y="${-LIB[it.type].box - 8}" width="${(LIB[it.type].box + 8) * 2}" height="${(LIB[it.type].box + 8) * 2}" rx="6"/></g>`).join("") + `</g>`;
    svg.innerHTML = s;
    $(".studio__empty").style.display = studio.items.length ? "none" : "";
    $$(".studio__bar [data-need-sel]").forEach((b) => (b.disabled = !studio.sel));
    $$(".bg-row button").forEach((b) => b.classList.toggle("is-active", b.dataset.bg === studio.bg));
    $$(".border-row button").forEach((b) => b.classList.toggle("is-active", b.dataset.border === studio.border));
  }
  function addItem(type, x, y, s, r) {
    const it = { id: ++studio.uid, type, x: x ?? SW / 2 + (Math.random() - 0.5) * 160, y: y ?? SH / 2 + (Math.random() - 0.5) * 120, s: s ?? 1, r: r ?? 0 };
    studio.items.push(it);
    studio.sel = it.id;
    renderStudio();
  }
  const selItem = () => studio.items.find((i) => i.id === studio.sel);
  function buildStudio() {
    $(".stamps").innerHTML = Object.entries(LIB).map(([k, v]) => {
      const bg = v.g === "k" ? "cream" : "geru";
      return `<button class="stamp stamp--${v.g}" type="button" data-stamp="${k}" title="${v.label}" aria-label="Add ${v.label}"><svg viewBox="${-v.box - 6} ${-v.box - 6} ${(v.box + 6) * 2} ${(v.box + 6) * 2}">${S.defs()}${stampSVG(k, bg)}</svg></button>`;
    }).join("");
    $(".bg-row").innerHTML = Object.entries(BGS).map(([k, b]) => `<button type="button" data-bg="${k}"><i style="background:${b.fill}"></i>${b.label}</button>`).join("");
    $(".border-row").innerHTML = [["vine", "Kalamkari vine"], ["frieze", "Warli frieze"], ["none", "None"]].map(([k, l]) => `<button type="button" data-border="${k}">${l}</button>`).join("");
    $(".stamps").addEventListener("click", (e) => { const b = e.target.closest("[data-stamp]"); if (b) addItem(b.dataset.stamp); });
    $(".bg-row").addEventListener("click", (e) => { const b = e.target.closest("[data-bg]"); if (b) { studio.bg = b.dataset.bg; renderStudio(); } });
    $(".border-row").addEventListener("click", (e) => { const b = e.target.closest("[data-border]"); if (b) { studio.border = b.dataset.border; renderStudio(); } });
    $(".studio__bar").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]"); if (!b) return;
      const it = selItem();
      switch (b.dataset.act) {
        case "bigger": if (it) it.s = Math.min(4, it.s * 1.2); break;
        case "smaller": if (it) it.s = Math.max(0.3, it.s / 1.2); break;
        case "rotate": if (it) it.r = (it.r + 15) % 360; break;
        case "front": if (it) { studio.items = studio.items.filter((x) => x !== it); studio.items.push(it); } break;
        case "dup": if (it) { addItem(it.type, it.x + 30, it.y + 20, it.s, it.r); return; } break;
        case "del": if (it) { studio.items = studio.items.filter((x) => x !== it); studio.sel = null; } break;
        case "clear": studio.items = []; studio.sel = null; break;
        case "surprise": surprise(); return;
        case "download": {
          const keep = studio.sel; studio.sel = null; renderStudio();
          const svg = $(".studio__canvas svg").cloneNode(true);
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg"); svg.setAttribute("width", SW); svg.setAttribute("height", SH);
          downloadSVG(svg.outerHTML, SW * 2, SH * 2, "my-sangam.png");
          studio.sel = keep; break;
        }
      }
      renderStudio();
    });
    // drag
    const svgEl = $(".studio__canvas svg");
    let drag = null;
    const pt = (e) => { const p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svgEl.getScreenCTM().inverse()); };
    svgEl.addEventListener("pointerdown", (e) => {
      const g = e.target.closest(".item");
      if (!g) { studio.sel = null; renderStudio(); return; }
      const id = +g.dataset.id, it = studio.items.find((i) => i.id === id);
      studio.sel = id;
      const p = pt(e);
      drag = { it, dx: p.x - it.x, dy: p.y - it.y, pid: e.pointerId };
      svgEl.setPointerCapture(e.pointerId);
      $$(".studio__canvas .item").forEach((n) => n.classList.toggle("is-selected", +n.dataset.id === id));
      $$(".studio__bar [data-need-sel]").forEach((b) => (b.disabled = false));
    });
    svgEl.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const p = pt(e);
      drag.it.x = Math.round(p.x - drag.dx); drag.it.y = Math.round(p.y - drag.dy);
      const g = svgEl.querySelector(`.item[data-id="${drag.it.id}"]`);
      if (g) g.setAttribute("transform", `translate(${drag.it.x},${drag.it.y}) rotate(${drag.it.r}) scale(${drag.it.s})`);
    });
    const end = () => { if (drag) { drag = null; renderStudio(); } };
    svgEl.addEventListener("pointerup", end);
    svgEl.addEventListener("pointercancel", end);
    svgEl.addEventListener("wheel", (e) => {
      const it = selItem(); if (!it || !e.target.closest(".item")) return;
      e.preventDefault();
      it.s = Math.max(0.3, Math.min(4, it.s * Math.exp(-e.deltaY * 0.0015)));
      const g = svgEl.querySelector(`.item[data-id="${it.id}"]`);
      if (g) g.setAttribute("transform", `translate(${it.x},${it.y}) rotate(${it.r}) scale(${it.s})`);
    }, { passive: false });
    document.addEventListener("keydown", (e) => {
      const it = selItem(); if (!it || e.target.matches("input, textarea")) return;
      if (!$(".studio").matches(":hover") && document.activeElement !== document.body) return;
      if (e.key === "Delete" || e.key === "Backspace") { studio.items = studio.items.filter((x) => x !== it); studio.sel = null; renderStudio(); }
    });
    surprise();
  }
  function surprise() {
    studio.items = []; studio.sel = null;
    studio.bg = "geru"; studio.border = "vine";
    addItem("w-circle", 500, 440, 1.5, 0);
    addItem("k-blossom", 500, 200, 1.3, 0);
    addItem("k-leaf", 420, 250, 1.2, 0);
    addItem("k-leaf", 580, 250, 1.2, 180);
    addItem("f-sun", 150, 140, 1, 0);
    addItem("k-peacock", 780, 330, 1, 0);
    addItem("w-hut", 180, 520, 1.1, 0);
    addItem("w-deer", 820, 560, 1, 0);
    addItem("f-dancer", 330, 580, 0.9, 0);
    addItem("f-dancer2", 670, 580, 0.9, 0);
    addItem("w-bird", 330, 120, 1, 0);
    addItem("k-paisley", 860, 150, 0.8, 30);
    studio.sel = null;
    renderStudio();
  }

  /* ---------- Reference lightbox ---------- */
  let dz = null;
  function initLightbox() {
    document.addEventListener("click", (e) => {
      const f = e.target.closest("[data-zoom]");
      if (!f) return;
      const id = f.dataset.zoom;
      const lb = $(".lightbox");
      if (!dz) dz = new DeepZoom(lb.querySelector(".detail__viewer"), {});
      lb.classList.add("is-open");
      if (KALA.lenis) KALA.lenis.stop();
      dz.load(`../assets/img/f/${id}-sm.jpg`, `../assets/img/f/${id}.jpg`, "", (CREDITS[id] || {}).served);
      const cr = CREDITS[id] || {};
      lb.querySelector(".lightbox__cap").innerHTML = `${f.dataset.title || ""} · Photo: ${cr.artist || "Wikimedia Commons"} · ${cr.license || ""} · scroll or pinch to zoom`;
    });
    const close = () => { $(".lightbox").classList.remove("is-open"); if (KALA.lenis) KALA.lenis.start(); };
    $(".lightbox__close").addEventListener("click", close);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    $$("[data-credit]").forEach((el) => { const cr = CREDITS[el.dataset.credit] || {}; el.textContent = `Photo: ${cr.artist || "Wikimedia Commons"} · ${cr.license || ""}`; });
  }

  /* ---------- Boot ---------- */
  buildHero();
  initSplit();
  buildVenn();
  buildArtwork();
  buildStudio();
  initLightbox();
  KALA.ready.then(() => {
    heroIntro();
    if (!KALA.reduced && !document.documentElement.classList.contains("shot")) {
      gsap.set(".step", { y: 50, opacity: 0 });
      KALA.onView($(".steps"), () => gsap.to(".step", { y: 0, opacity: 1, duration: 1.1, ease: "kala", stagger: 0.1 }), 0.1);
      gsap.set(".trad", { y: 60, opacity: 0 });
      KALA.onView($(".duo"), () => gsap.to(".trad", { y: 0, opacity: 1, duration: 1.2, ease: "kala", stagger: 0.15 }), 0.05);
    }
  });
})();
