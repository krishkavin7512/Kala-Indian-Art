/* =========================================================
   SAṄGAM — "The Tree of Life and the Tarpa Dance"
   An original fusion artwork, hand-coded as layered SVG.
   Warli grammar (circle · triangle · line, rice-white on geru)
   meets Kalamkari (kalam-drawn line, natural-dye palette,
   the palampore Tree of Life).
   Each layer is its own <svg> so it can be isolated, exploded
   in 3D, or re-used in the Fusion Studio.
   ========================================================= */
(function () {
  "use strict";

  const W = 1000, H = 1300;
  const C = {
    cream: "#f1e3c2", cream2: "#e8d4a8", madder: "#a3302a", madder2: "#7d1f1c",
    indigo: "#1f3a63", indigo2: "#142746", mustard: "#c99a2e", green: "#56703a",
    kasimi: "#1a120c", geru: "#8a3a1d", geru2: "#6f2c15", rice: "#f6efe0",
  };

  /* ---------- tiny utils ---------- */
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const f = (n) => Math.round(n * 10) / 10;
  const deg = (r) => (r * 180) / Math.PI;
  function crPath(pts, closed) {
    // Catmull-Rom → cubic Bézier
    const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${f(p[1][0])},${f(p[1][1])}`;
    for (let i = 1; i < p.length - 2; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
      d += `C${f(x1 + (x2 - x0) / 6)},${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)},${f(y2 - (y3 - y1) / 6)} ${f(x2)},${f(y2)}`;
    }
    return closed ? d + "Z" : d;
  }
  let measurer = null;
  function sampler(d) {
    if (!measurer) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
      svg.style.position = "absolute"; svg.style.visibility = "hidden";
      measurer = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.appendChild(measurer); document.body.appendChild(svg);
    }
    measurer.setAttribute("d", d);
    const len = measurer.getTotalLength();
    return {
      len,
      at(t) {
        const l = Math.max(0, Math.min(len, t * len));
        const a = measurer.getPointAtLength(l), b = measurer.getPointAtLength(Math.min(len, l + 1));
        const c = measurer.getPointAtLength(Math.max(0, l - 1));
        return { x: a.x, y: a.y, ang: Math.atan2(b.y - c.y, b.x - c.x) };
      },
    };
  }
  const tip = (origin, name, note) => `data-origin="${origin}" data-name="${name}" data-note="${note.replace(/"/g, "&quot;")}"`;

  /* ---------- shared defs ---------- */
  function defs() {
    return `<defs>
      <filter id="clothTex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.35" numOctaves="3" seed="7" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.22  0 0 0 0 0.08  0 0 0 0.16 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
        <feBlend in2="SourceGraphic" mode="multiply"/>
      </filter>
      <filter id="mudTex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="3" result="a"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" result="b"/>
        <feBlend in="a" in2="b" mode="multiply" result="c"/>
        <feColorMatrix in="c" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.06  0 0 0 0 0.02  0 0 0 0.5 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
        <feBlend in2="SourceGraphic" mode="multiply"/>
      </filter>
      <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
      <pattern id="kpatRed" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${C.madder}"/><circle cx="4" cy="4" r="1.3" fill="${C.cream}"/></pattern>
      <pattern id="kpatIndigo" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${C.indigo}"/><path d="M0,4 L4,0 L8,4 L4,8Z" fill="none" stroke="${C.cream}" stroke-width=".7"/></pattern>
      <pattern id="kpatMustard" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="${C.mustard}"/><circle cx="3.5" cy="3.5" r="1" fill="${C.kasimi}"/></pattern>
      <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="5" stroke="${C.kasimi}" stroke-width=".8" opacity=".55"/></pattern>
    </defs>`;
  }

  /* ---------- Kalamkari motifs ---------- */
  function leaf(x, y, len, ang, fill, opt = {}) {
    const w = len * (opt.w || 0.3);
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(deg(ang))})">`;
    s += `<path d="M0,0 Q${f(len * 0.45)},${f(-w)} ${f(len)},0 Q${f(len * 0.45)},${f(w)} 0,0Z" fill="${fill}" stroke="${C.kasimi}" stroke-width="1.6" stroke-linejoin="round"/>`;
    s += `<path d="M${f(len * 0.08)},0 L${f(len * 0.9)},0" stroke="${C.cream}" stroke-width="1" opacity=".85"/>`;
    for (let i = 1; i <= 3; i++) {
      const px = len * (0.18 + i * 0.18);
      s += `<path d="M${f(px)},0 L${f(px + len * 0.12)},${f(-w * 0.55)} M${f(px)},0 L${f(px + len * 0.12)},${f(w * 0.55)}" stroke="${C.cream}" stroke-width=".8" opacity=".7"/>`;
    }
    return s + "</g>";
  }

  function blossom(x, y, r, rot, pal, R) {
    const [outer, inner, core] = pal;
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">`;
    const n1 = 9 + Math.floor(R() * 4), n2 = 7;
    for (let i = 0; i < n1; i++) {
      const a = (i / n1) * 360;
      s += `<path transform="rotate(${f(a)})" d="M0,${f(-r * 0.25)} C${f(r * 0.34)},${f(-r * 0.45)} ${f(r * 0.3)},${f(-r * 0.95)} 0,${f(-r)} C${f(-r * 0.3)},${f(-r * 0.95)} ${f(-r * 0.34)},${f(-r * 0.45)} 0,${f(-r * 0.25)}Z" fill="${outer}" stroke="${C.kasimi}" stroke-width="1.5"/>`;
      s += `<path transform="rotate(${f(a)})" d="M0,${f(-r * 0.36)} L0,${f(-r * 0.86)}" stroke="${C.cream}" stroke-width="1" opacity=".8"/>`;
    }
    for (let i = 0; i < n2; i++) {
      const a = (i / n2) * 360 + 360 / n2 / 2;
      s += `<path transform="rotate(${f(a)})" d="M0,0 C${f(r * 0.28)},${f(-r * 0.2)} ${f(r * 0.24)},${f(-r * 0.6)} 0,${f(-r * 0.66)} C${f(-r * 0.24)},${f(-r * 0.6)} ${f(-r * 0.28)},${f(-r * 0.2)} 0,0Z" fill="${inner}" stroke="${C.kasimi}" stroke-width="1.3"/>`;
    }
    s += `<circle r="${f(r * 0.3)}" fill="${core}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    const nd = 12;
    for (let i = 0; i < nd; i++) {
      const a = (i / nd) * Math.PI * 2;
      s += `<circle cx="${f(Math.cos(a) * r * 0.21)}" cy="${f(Math.sin(a) * r * 0.21)}" r="${f(Math.max(1, r * 0.028))}" fill="${C.kasimi}"/>`;
    }
    s += `<circle r="${f(r * 0.1)}" fill="${C.madder}" stroke="${C.kasimi}" stroke-width="1"/>`;
    return s + "</g>";
  }

  function lotusSide(x, y, r, rot) {
    // side-view lotus / bud at a branch tip
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">`;
    const petals = [[-0.9, C.madder], [0.9, C.madder], [-0.45, C.cream], [0.45, C.cream], [0, C.madder2]];
    petals.forEach(([k, col]) => {
      s += `<path d="M0,0 C${f(k * r * 0.9 - r * 0.25)},${f(-r * 0.2)} ${f(k * r * 0.7)},${f(-r * 0.9)} ${f(k * r * 0.35)},${f(-r * 1.15)} C${f(k * r * 0.2 + r * 0.25)},${f(-r * 0.6)} ${f(k * r * 0.2)},${f(-r * 0.2)} 0,0Z" fill="${col}" stroke="${C.kasimi}" stroke-width="1.5"/>`;
    });
    s += `<path d="M${f(-r * 0.5)},${f(r * 0.05)} Q0,${f(r * 0.35)} ${f(r * 0.5)},${f(r * 0.05)}" fill="${C.green}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    return s + "</g>";
  }

  function paisley(x, y, s0, rot, fill) {
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${s0})">`;
    s += `<path d="M0,20 C-14,20 -18,4 -10,-6 C-2,-16 12,-18 16,-30 C22,-12 20,8 8,16 C5,18 3,20 0,20Z" fill="${fill}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    s += `<path d="M0,14 C-8,14 -10,4 -5,-2 C0,-8 8,-10 11,-18" fill="none" stroke="${C.cream}" stroke-width="1.1"/>`;
    s += `<circle cx="-1" cy="6" r="3" fill="${C.cream}" stroke="${C.kasimi}" stroke-width="1"/>`;
    return s + "</g>";
  }

  function peacock(x, y, sc, flip) {
    const t = `translate(${f(x)},${f(y)}) scale(${flip ? -sc : sc},${sc})`;
    let s = `<g transform="${t}">`;
    // tail
    s += `<path d="M2,18 C-40,26 -110,52 -168,118 C-150,120 -128,112 -108,100 C-70,78 -30,52 6,34Z" fill="${C.green}" stroke="${C.kasimi}" stroke-width="1.8" stroke-linejoin="round"/>`;
    s += `<path d="M2,20 C-50,40 -100,70 -150,114" fill="none" stroke="${C.cream}" stroke-width="1"/>`;
    [[-40, 42], [-78, 64], [-112, 88], [-142, 108], [-60, 58], [-96, 80]].forEach(([ex, ey], i) => {
      const r = i < 4 ? 8 : 6;
      s += `<ellipse cx="${ex}" cy="${ey}" rx="${r + 2}" ry="${r}" fill="${C.mustard}" stroke="${C.kasimi}" stroke-width="1.2"/>`;
      s += `<ellipse cx="${ex}" cy="${ey}" rx="${r - 2}" ry="${r - 3}" fill="${C.indigo}"/>`;
      s += `<circle cx="${ex + 1}" cy="${ey}" r="1.8" fill="${C.cream}"/>`;
    });
    // legs
    s += `<path d="M14,40 L12,60 M12,60 L4,64 M12,60 L16,66 M26,40 L28,60 M28,60 L20,65 M28,60 L34,64" stroke="${C.kasimi}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    // body
    s += `<path d="M0,2 C24,-12 48,6 42,30 C34,46 6,44 -4,30 C-10,20 -8,8 0,2Z" fill="${C.indigo}" stroke="${C.kasimi}" stroke-width="1.8"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${6 + (i % 3) * 10},${10 + Math.floor(i / 3) * 9} q4,4 8,0" fill="none" stroke="${C.cream}" stroke-width=".9" opacity=".8"/>`;
    // wing
    s += `<path d="M8,14 C22,10 34,20 30,34 C22,30 12,26 8,14Z" fill="${C.mustard}" stroke="${C.kasimi}" stroke-width="1.3"/>`;
    s += `<path d="M13,17 L27,31 M17,15 L30,26" stroke="${C.kasimi}" stroke-width=".8"/>`;
    // neck + head
    s += `<path d="M30,8 C36,-8 34,-30 44,-46" fill="none" stroke="${C.kasimi}" stroke-width="11" stroke-linecap="round"/>`;
    s += `<path d="M30,8 C36,-8 34,-30 44,-46" fill="none" stroke="${C.indigo}" stroke-width="8" stroke-linecap="round"/>`;
    s += `<circle cx="46" cy="-50" r="8" fill="${C.indigo}" stroke="${C.kasimi}" stroke-width="1.6"/>`;
    s += `<path d="M53,-52 L64,-48 L53,-45Z" fill="${C.mustard}" stroke="${C.kasimi}" stroke-width="1.2"/>`;
    s += `<circle cx="49" cy="-52" r="2" fill="${C.cream}"/><circle cx="49.5" cy="-52" r="1" fill="${C.kasimi}"/>`;
    [[-8, -18], [0, -20], [8, -17]].forEach(([dx, dy]) => {
      s += `<path d="M44,-57 L${44 + dx},${-57 + dy}" stroke="${C.kasimi}" stroke-width="1.2"/><circle cx="${44 + dx}" cy="${-57 + dy}" r="2.6" fill="${C.madder}" stroke="${C.kasimi}" stroke-width="1"/>`;
    });
    return s + "</g>";
  }

  function parrot(x, y, sc, flip) {
    let s = `<g transform="translate(${f(x)},${f(y)}) scale(${flip ? -sc : sc},${sc})">`;
    s += `<path d="M-4,10 C-20,26 -34,44 -44,62 C-30,50 -16,38 0,24Z" fill="${C.green}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    s += `<path d="M0,0 C14,-10 28,0 26,16 C22,28 4,30 -4,20 C-8,12 -6,4 0,0Z" fill="${C.green}" stroke="${C.kasimi}" stroke-width="1.5"/>`;
    s += `<path d="M4,6 C14,6 20,14 16,24 C10,20 6,14 4,6Z" fill="${C.mustard}" stroke="${C.kasimi}" stroke-width="1"/>`;
    s += `<circle cx="20" cy="-4" r="7" fill="${C.green}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    s += `<path d="M25,-6 C32,-6 33,2 28,4 C27,1 26,-2 25,-1Z" fill="${C.madder}" stroke="${C.kasimi}" stroke-width="1"/>`;
    s += `<circle cx="21" cy="-6" r="1.6" fill="${C.kasimi}"/>`;
    s += `<path d="M18,2 C22,4 24,4 26,3" stroke="${C.madder}" stroke-width="1.5" fill="none"/>`;
    return s + "</g>";
  }

  /* ---------- Warli motifs (rice-white) ---------- */
  const WS = `stroke="${C.rice}" stroke-linecap="round" stroke-linejoin="round"`;
  function warliFigure(x, y, rot, sc, opt = {}) {
    // origin at waist, "up" = -y
    const skirt = opt.fill || C.rice;
    let s = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${sc})">`;
    s += `<circle cx="0" cy="-22" r="4.6" fill="${C.rice}"/>`;
    s += `<path d="M-7,-16 L7,-16 L0,-2Z" fill="${C.rice}"/>`;
    s += `<path d="M0,-2 L-7.5,11 L7.5,11Z" fill="${skirt}" ${skirt !== C.rice ? `stroke="${C.rice}" stroke-width="1.2"` : ""}/>`;
    const legs = opt.dance ? "M-3.5,11 L-8,17 L-6,23 M3.5,11 L8,17 L7,23" : "M-3.5,11 L-5,23 M3.5,11 L5,23";
    s += `<path d="${legs}" fill="none" ${WS} stroke-width="1.8"/>`;
    const arms = opt.arms || "M-6,-15 L-15,-8 M6,-15 L15,-8";
    s += `<path d="${arms}" fill="none" ${WS} stroke-width="1.8"/>`;
    if (opt.pot) s += `<circle cx="0" cy="-33" r="5.5" fill="none" ${WS} stroke-width="1.6"/><path d="M-5,-15 L-4,-28 M5,-15 L4,-28" fill="none" ${WS} stroke-width="1.6"/>`;
    return s + "</g>";
  }
  function warliAnimal(x, y, sc, flip, kind) {
    let s = `<g transform="translate(${f(x)},${f(y)}) scale(${flip ? -sc : sc},${sc})">`;
    if (kind === "deer") {
      s += `<path d="M-14,-4 L12,-4 L-1,6Z M-1,6 L-14,-4 M12,-4 L-1,6" fill="${C.rice}"/>`;
      s += `<path d="M-12,-2 L-14,12 M-8,0 L-7,12 M6,-2 L6,12 M10,-3 L12,12" ${WS} stroke-width="1.5" fill="none"/>`;
      s += `<path d="M12,-4 L17,-12 L22,-10" ${WS} stroke-width="1.8" fill="none"/><circle cx="21" cy="-11" r="2.5" fill="${C.rice}"/>`;
      s += `<path d="M18,-14 L16,-22 M16,-22 L13,-26 M16,-22 L19,-27 M20,-14 L22,-22 M22,-22 L20,-27 M22,-22 L26,-25" ${WS} stroke-width="1.1" fill="none"/>`;
      s += `<path d="M-14,-4 L-19,-7" ${WS} stroke-width="1.3"/>`;
    } else { // bullock
      s += `<path d="M-16,-6 L14,-6 L10,6 L-12,6Z" fill="${C.rice}"/>`;
      s += `<path d="M-12,6 L-13,18 M-6,6 L-6,18 M5,6 L6,18 M10,6 L12,18" ${WS} stroke-width="1.6" fill="none"/>`;
      s += `<path d="M14,-6 L20,-12 L24,-4 L18,0Z" fill="${C.rice}"/>`;
      s += `<path d="M20,-12 L18,-19 M21,-12 L25,-18" ${WS} stroke-width="1.5" fill="none"/>`;
      s += `<path d="M-16,-4 L-21,4" ${WS} stroke-width="1.3"/>`;
    }
    return s + "</g>";
  }
  function warliHut(x, y, sc) {
    let s = `<g transform="translate(${f(x)},${f(y)}) scale(${sc})">`;
    s += `<path d="M-38,-8 L0,-40 L38,-8Z" fill="none" ${WS} stroke-width="2"/>`;
    for (let i = -3; i <= 3; i++) s += `<path d="M${i * 8},-8 L${i * 4},-30" ${WS} stroke-width="1" opacity=".85"/>`;
    s += `<path d="M-30,-8 L-30,26 L30,26 L30,-8" fill="none" ${WS} stroke-width="2"/>`;
    s += `<path d="M-7,26 L-7,6 L7,6 L7,26" fill="none" ${WS} stroke-width="1.6"/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${-24 + i * 9.5}" cy="0" r="1.3" fill="${C.rice}"/>`;
    s += `<path d="M-26,14 L-14,14 M14,14 L26,14" ${WS} stroke-width="1.2"/>`;
    return s + "</g>";
  }
  function warliTree(x, y, h, R) {
    let s = `<g transform="translate(${f(x)},${f(y)})">`;
    s += `<path d="M0,0 L0,${-h}" ${WS} stroke-width="2.4"/>`;
    for (let i = 0; i < 9; i++) {
      const yy = -h * (0.25 + i * 0.085), l = 12 + (9 - i) * 2.2 + R() * 4;
      s += `<path d="M0,${f(yy)} L${f(-l)},${f(yy - 10)} M0,${f(yy)} L${f(l)},${f(yy - 10)}" ${WS} stroke-width="1.4"/>`;
      for (let k = 1; k <= 3; k++) {
        const px = (l / 3.4) * k;
        s += `<path d="M${f(-px)},${f(yy - (10 * px) / l)} l-2,-5 M${f(px)},${f(yy - (10 * px) / l)} l2,-5" ${WS} stroke-width="1"/>`;
      }
    }
    return s + "</g>";
  }
  function warliBird(x, y, sc) {
    return `<g transform="translate(${f(x)},${f(y)}) scale(${sc})"><path d="M-12,-4 Q-6,-10 0,0 Q6,-10 12,-4" fill="none" ${WS} stroke-width="1.8"/><circle cx="0" cy="1" r="2.2" fill="${C.rice}"/></g>`;
  }

  /* ---------- Geometry of the composition ---------- */
  const FIELD = { x0: 128, y0: 128, x1: 872, y1: 1172, spring: 360, apex: 150 };
  const archPath = `M${FIELD.x0},${FIELD.y1} L${FIELD.x0},${FIELD.spring} C${FIELD.x0},250 330,212 430,190 C470,182 490,168 500,${FIELD.apex} C510,168 530,182 570,190 C670,212 ${FIELD.x1},250 ${FIELD.x1},${FIELD.spring} L${FIELD.x1},${FIELD.y1}Z`;
  const DANCE = { cx: 500, cy: 988, rings: [72, 116, 158] };

  /* ---------- Layer builders ---------- */
  function layerCloth() {
    let s = `<rect width="${W}" height="${H}" fill="${C.cream}"/>`;
    s += `<rect width="${W}" height="${H}" fill="${C.cream}" filter="url(#clothTex)"/>`;
    return s;
  }

  function layerBorder(R) {
    let s = `<g ${tip("K", "Kalamkari border", "A madder-red band dyed with chay root and alum mordant, with a meandering flowering vine — the classic frame of a Coromandel-coast palampore.")}>`;
    // main madder band
    s += `<path d="M14,14 H${W - 14} V${H - 14} H14Z M92,92 V${H - 92} H${W - 92} V92Z" fill="${C.madder}" fill-rule="evenodd"/>`;
    s += `<rect x="8" y="8" width="${W - 16}" height="${H - 16}" fill="none" stroke="${C.kasimi}" stroke-width="3"/>`;
    s += `<rect x="14" y="14" width="${W - 28}" height="${H - 28}" fill="none" stroke="${C.kasimi}" stroke-width="1.5"/>`;
    s += `<rect x="92" y="92" width="${W - 184}" height="${H - 184}" fill="none" stroke="${C.kasimi}" stroke-width="2"/>`;
    s += `<rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="${C.mustard}" stroke-width="1.2" stroke-dasharray="2 5"/>`;
    // meandering vine along each side
    const sides = [
      { x: 110, y: 53, dx: 1, dy: 0, len: W - 220 },
      { x: W - 53, y: 110, dx: 0, dy: 1, len: H - 220 },
      { x: W - 110, y: H - 53, dx: -1, dy: 0, len: W - 220 },
      { x: 53, y: H - 110, dx: 0, dy: -1, len: H - 220 },
    ];
    sides.forEach((sd) => {
      const period = 96, amp = 17, n = Math.max(1, Math.round(sd.len / period)), per = sd.len / n;
      const nx = -sd.dy, ny = sd.dx;
      const pts = [];
      for (let i = 0; i <= n * 8; i++) {
        const t = (i / 8) * per, w = Math.sin((i / 8) * Math.PI) * amp;
        pts.push([sd.x + sd.dx * t + nx * w, sd.y + sd.dy * t + ny * w]);
      }
      s += `<path d="${crPath(pts)}" fill="none" stroke="${C.kasimi}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<path d="${crPath(pts)}" fill="none" stroke="${C.cream}" stroke-width="2.6" stroke-linecap="round"/>`;
      for (let i = 0; i < n; i++) {
        for (let half = 0; half < 2; half++) {
          const t = (i + 0.5 * half + 0.25) * per, side = half ? -1 : 1;
          const bx = sd.x + sd.dx * t + nx * amp * side * 0.95, by = sd.y + sd.dy * t + ny * amp * side * 0.95;
          const col = (i + half) % 2 ? C.indigo : C.mustard;
          s += blossom(bx + nx * side * 2, by + ny * side * 2, 13, R() * 40, [C.cream, col, C.madder], R);
          const la = Math.atan2(ny * -side, nx * -side);
          s += leaf(bx - nx * side * 6 + sd.dx * 14, by - ny * side * 6 + sd.dy * 14, 17, la + 0.6, C.green, { w: 0.34 });
          s += leaf(bx - nx * side * 6 - sd.dx * 14, by - ny * side * 6 - sd.dy * 14, 17, la - 0.6 + Math.PI * 0, C.indigo, { w: 0.34 });
        }
      }
    });
    // corner medallions
    [[53, 53], [W - 53, 53], [W - 53, H - 53], [53, H - 53]].forEach(([x, y]) => {
      s += `<rect x="${x - 38}" y="${y - 38}" width="76" height="76" fill="${C.indigo}" stroke="${C.kasimi}" stroke-width="2"/>`;
      s += `<rect x="${x - 32}" y="${y - 32}" width="64" height="64" fill="none" stroke="${C.cream}" stroke-width="1" stroke-dasharray="3 3"/>`;
      s += blossom(x, y, 27, 0, [C.madder, C.mustard, C.cream], R);
    });
    return s + "</g>";
  }

  function layerFrieze() {
    // Fusion: a Warli chain of dancers running inside the Kalamkari frame
    let s = `<g ${tip("F", "Warli frieze in a Kalamkari frame", "Fusion: a Warli chain of dancers runs through the inner band of a Kalamkari border — two grammars sharing one edge.")}>`;
    s += `<path d="M92,92 H${W - 92} V${H - 92} H92Z M${FIELD.x0 - 8},${FIELD.x0 - 8} V${H - FIELD.x0 + 8} H${W - FIELD.x0 + 8} V${FIELD.x0 - 8}Z" fill="${C.geru2}" fill-rule="evenodd"/>`;
    const y0 = 110, sc = 0.52;
    const runs = [
      { x: 132, y: y0, dx: 1, dy: 0, len: W - 264, rot: 0 },
      { x: W - y0, y: 132, dx: 0, dy: 1, len: H - 264, rot: 90 },
      { x: W - 132, y: H - y0, dx: -1, dy: 0, len: W - 264, rot: 180 },
      { x: y0, y: H - 132, dx: 0, dy: -1, len: H - 264, rot: 270 },
    ];
    runs.forEach((r) => {
      const n = Math.floor(r.len / 17);
      for (let i = 0; i <= n; i++) {
        const t = (i / n) * r.len;
        s += warliFigure(r.x + r.dx * t, r.y + r.dy * t, r.rot, sc, { arms: "M-6,-15 L-16,-6 M6,-15 L16,-6", dance: i % 2 === 0 });
      }
    });
    s += `<rect x="${FIELD.x0 - 8}" y="${FIELD.x0 - 8}" width="${W - 2 * FIELD.x0 + 16}" height="${H - 2 * FIELD.x0 + 16}" fill="none" stroke="${C.kasimi}" stroke-width="2"/>`;
    return s + "</g>";
  }

  function layerField(R) {
    let s = "";
    // spandrels (Kalamkari indigo) above the arch
    s += `<g ${tip("K", "Indigo spandrels", "Indigo-dyed corners with madder blossoms and a paisley (mango) motif — Kalamkari's second great dye comes from the Indigofera plant.")}>`;
    s += `<rect x="${FIELD.x0}" y="${FIELD.y0}" width="${FIELD.x1 - FIELD.x0}" height="${FIELD.spring - FIELD.y0 + 2}" fill="${C.indigo}"/>`;
    for (const side of [-1, 1]) {
      const bx = side < 0 ? 205 : 795;
      s += blossom(bx, 205, 34, 10 * side, [C.madder, C.mustard, C.cream], R);
      s += leaf(bx + 30 * side, 252, 36, side < 0 ? 0.3 : Math.PI - 0.3, C.green);
      s += leaf(bx - 8 * side, 262, 32, side < 0 ? 1.4 : Math.PI - 1.4, C.mustard);
      s += paisley(bx + 64 * side, 170, 1.05, side * 40, C.madder);
    }
    s += "</g>";
    // geru mud wall (Warli ground)
    s += `<path d="${archPath}" fill="${C.geru}" ${tip("W", "Geru mud wall", "Warli paintings live on hut walls washed with mud and cow-dung, then red ochre (geru).")}/>`;
    s += `<path d="${archPath}" fill="${C.geru}" filter="url(#mudTex)" pointer-events="none"/>`;
    s += `<path d="${archPath}" fill="none" stroke="${C.kasimi}" stroke-width="3"/>`;
    s += `<path d="${archPath}" fill="none" stroke="${C.cream}" stroke-width="1.2" transform="translate(0,6) scale(1,0.995)" opacity=".5" stroke-dasharray="1 6" stroke-linecap="round"/>`;
    return s;
  }

  function layerSky(R) {
    let s = "";
    // Fusion sun: Warli circle-and-triangle sun whose rays open like Kalamkari petals
    const sx = 216, sy = 420;
    let sun = `<g ${tip("F", "Fusion sun", "Warli draws the sun as a circle ringed with triangles. Here each triangle ray becomes a Kalamkari petal in madder and mustard.")}>`;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * 360;
      sun += `<path transform="translate(${sx},${sy}) rotate(${a})" d="M-7,-36 L0,-60 L7,-36Z" fill="${i % 2 ? C.mustard : C.madder}" stroke="${C.kasimi}" stroke-width="1.4"/>`;
    }
    sun += `<circle cx="${sx}" cy="${sy}" r="36" fill="${C.rice}" stroke="${C.kasimi}" stroke-width="1.6"/>`;
    sun += `<circle cx="${sx}" cy="${sy}" r="27" fill="none" stroke="${C.madder}" stroke-width="1.4" stroke-dasharray="3 3"/>`;
    sun += blossom(sx, sy, 20, 0, [C.madder, C.mustard, C.cream], R);
    sun += "</g>";
    s += sun;
    // Warli moon
    s += `<g ${tip("W", "Warli moon", "The crescent moon — Warli cosmology pairs sun and moon above every scene of village life.")}><path d="M790,386 A40,40 0 1,0 790,466 A48,48 0 0,1 790,386Z" fill="${C.rice}"/>`;
    for (let i = 0; i < 7; i++) s += `<circle cx="${700 + R() * 140}" cy="${370 + R() * 60}" r="${1.2 + R() * 1.4}" fill="${C.rice}" opacity=".85"/>`;
    s += "</g>";
    // birds
    let birds = `<g ${tip("W", "Warli birds", "Birds reduced to a single curving stroke and a dot — Warli's economy of line.")}>`;
    [[300, 330, 0.9], [340, 300, 0.7], [700, 320, 0.85], [660, 292, 0.65], [440, 236, 0.55], [566, 226, 0.5]].forEach(([x, y, k]) => (birds += warliBird(x, y, k)));
    s += birds + "</g>";
    return s;
  }

  function branchSet() {
    // centre-lines of trunk and branches (hand-placed for a palampore silhouette)
    return {
      trunk: [[500, 972], [486, 900], [512, 830], [492, 760], [508, 690], [496, 610], [503, 530], [498, 452]],
      branches: [
        { pts: [[490, 905], [400, 875], [300, 850], [215, 800], [185, 720]], w: 15, r: 46 },
        { pts: [[510, 860], [600, 845], [700, 815], [785, 765], [815, 690]], w: 15, r: 46 },
        { pts: [[494, 772], [420, 735], [340, 690], [280, 630], [252, 556]], w: 13, r: 42 },
        { pts: [[508, 720], [580, 690], [660, 650], [720, 590], [745, 520]], w: 13, r: 42 },
        { pts: [[498, 640], [440, 600], [385, 548], [345, 480], [336, 410]], w: 11, r: 38 },
        { pts: [[502, 616], [560, 580], [615, 530], [655, 465], [664, 398]], w: 11, r: 38 },
        { pts: [[500, 470], [468, 408], [426, 350], [398, 290]], w: 9, r: 36 },
        { pts: [[500, 470], [532, 408], [574, 350], [602, 290]], w: 9, r: 36 },
        { pts: [[499, 452], [500, 380], [502, 300], [500, 226]], w: 9, r: 52 },
        { pts: [[300, 850], [255, 880], [205, 878], [168, 852]], w: 7 },
        { pts: [[700, 815], [745, 845], [795, 848], [832, 822]], w: 7 },
        { pts: [[340, 690], [290, 706], [236, 694], [198, 662]], w: 7 },
        { pts: [[660, 650], [710, 668], [765, 662], [802, 634]], w: 7 },
        { pts: [[385, 548], [336, 562], [282, 552], [258, 520]], w: 6 },
        { pts: [[615, 530], [664, 546], [722, 540], [748, 506]], w: 6 },
        { pts: [[426, 350], [380, 352], [346, 330]], w: 5 },
        { pts: [[574, 350], [620, 352], [654, 330]], w: 5 },
      ],
    };
  }

  function layerTree(R) {
    const { trunk, branches } = branchSet();
    let s = `<g ${tip("K", "Kalamkari Tree of Life", "The kalpavriksha of the palampore: a sinuous trunk drawn with the kalam (bamboo pen) and dyed cream, madder and indigo.")}>`;
    // roots
    for (let i = -3; i <= 3; i++) {
      const ex = 500 + i * 22, ey = 1000 + Math.abs(i) * 2;
      s += `<path d="M${500 + i * 5},968 C${500 + i * 10},985 ${ex - i * 6},${ey - 10} ${ex},${ey}" fill="none" stroke="${C.kasimi}" stroke-width="6" stroke-linecap="round"/>`;
      s += `<path d="M${500 + i * 5},968 C${500 + i * 10},985 ${ex - i * 6},${ey - 10} ${ex},${ey}" fill="none" stroke="${C.cream2}" stroke-width="3" stroke-linecap="round"/>`;
    }
    // branches: dark outline stroke then cream
    const bpaths = branches.map((b) => ({ d: crPath(b.pts), w: b.w }));
    bpaths.forEach((b) => (s += `<path d="${b.d}" fill="none" stroke="${C.kasimi}" stroke-width="${b.w + 4}" stroke-linecap="round"/>`));
    bpaths.forEach((b) => (s += `<path d="${b.d}" fill="none" stroke="${C.cream}" stroke-width="${b.w}" stroke-linecap="round"/>`));
    bpaths.forEach((b) => (s += `<path d="${b.d}" fill="none" stroke="${C.madder}" stroke-width="${Math.max(1, b.w * 0.18)}" stroke-dasharray="2 5" stroke-linecap="round" opacity=".8"/>`));
    // trunk: tapered polygon
    const tp = sampler(crPath(trunk));
    const left = [], right = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const t = i / N, p = tp.at(t);
      const w = 30 * (1 - t) + 7;
      const nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
      const wob = Math.sin(t * 19) * 1.6;
      left.push([p.x + nx * (w + wob), p.y + ny * (w + wob)]);
      right.push([p.x - nx * (w - wob), p.y - ny * (w - wob)]);
    }
    const poly = [...left, ...right.reverse()];
    s += `<path d="${crPath(poly, true)}" fill="${C.cream}" stroke="${C.kasimi}" stroke-width="3.4" stroke-linejoin="round"/>`;
    // bark: chevrons in madder + kasimi
    for (let i = 2; i < N - 2; i += 2) {
      const t = i / N, p = tp.at(t), w = (30 * (1 - t) + 7) * 0.75;
      const nx = -Math.sin(p.ang), ny = Math.cos(p.ang);
      const tx = Math.cos(p.ang) * 5, ty = Math.sin(p.ang) * 5;
      const col = i % 6 === 0 ? C.madder : C.kasimi;
      s += `<path d="M${f(p.x + nx * w)},${f(p.y + ny * w)} Q${f(p.x - tx)},${f(p.y - ty)} ${f(p.x - nx * w)},${f(p.y - ny * w)}" fill="none" stroke="${col}" stroke-width="${col === C.madder ? 2 : 1}" opacity=".75"/>`;
    }
    // leaves along branches
    const cols = [C.green, C.indigo, C.green, C.mustard];
    branches.forEach((b, bi) => {
      const sp = sampler(crPath(b.pts));
      const count = Math.max(3, Math.floor(sp.len / 24));
      for (let i = 1; i < count; i++) {
        const t = i / count + (R() - 0.5) * 0.02, p = sp.at(t);
        const side = i % 2 ? 1 : -1;
        const len = 30 + R() * 18 + b.w * 1.3;
        s += leaf(p.x, p.y, len, p.ang + side * (0.9 + R() * 0.4), cols[(i + bi) % cols.length]);
      }
    });
    s += "</g>";
    return s;
  }

  function layerBlooms(R) {
    const { branches } = branchSet();
    let s = `<g ${tip("K", "Kalamkari blossoms", "Composite flowers built ring by ring — outer madder petals, inner indigo, a mustard core stippled with kasimi (iron-black) dots.")}>`;
    const pals = [[C.madder, C.indigo, C.mustard], [C.indigo, C.madder, C.cream], [C.madder, C.mustard, C.cream], [C.mustard, C.madder, C.indigo]];
    branches.forEach((b, i) => {
      const end = b.pts[b.pts.length - 1];
      if (b.r) {
        s += blossom(end[0], end[1], b.r, R() * 60, pals[i % pals.length], R);
      } else {
        const prev = b.pts[b.pts.length - 2];
        const ang = deg(Math.atan2(end[1] - prev[1], end[0] - prev[0])) + 90;
        if (i % 3 === 0) s += lotusSide(end[0], end[1], 26, ang);
        else s += blossom(end[0], end[1], 26, R() * 60, pals[(i + 1) % pals.length], R);
      }
    });
    // mid-branch buds
    [[410, 878, 18], [596, 846, 18], [420, 736, 16], [584, 690, 16], [340, 848, 15], [660, 818, 15], [440, 600, 14], [560, 580, 14]].forEach(([x, y, r], k) => {
      s += lotusSide(x, y - r * 0.6, r, (k % 2 ? 12 : -12));
    });
    s += "</g>";
    // Fusion fruit: Warli circles hanging like pomegranates
    let fr = `<g ${tip("F", "Warli-circle fruit", "Fusion: the tree bears fruit drawn in Warli geometry — pure circles with rice-white dot rings — hanging from Kalamkari branches.")}>`;
    [[330, 780], [668, 752], [318, 612], [690, 600], [440, 478], [562, 470], [456, 704], [548, 664], [380, 440], [624, 432], [228, 760], [776, 736]].forEach(([x, y]) => {
      fr += `<path d="M${x},${y - 18} L${x},${y - 8}" stroke="${C.kasimi}" stroke-width="1.6"/>`;
      fr += `<circle cx="${x}" cy="${y}" r="10" fill="${C.geru}" stroke="${C.kasimi}" stroke-width="1.6"/>`;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        fr += `<circle cx="${f(x + Math.cos(a) * 6)}" cy="${f(y + Math.sin(a) * 6)}" r="1.2" fill="${C.rice}"/>`;
      }
    });
    s += fr + "</g>";
    return s;
  }

  function layerBirds() {
    let s = `<g ${tip("K", "Peacocks", "The peacock, beloved of both Mughal textile ateliers and temple kalamkaris, perched in the palampore manner.")}>`;
    s += peacock(300, 806, 0.86, false);
    s += peacock(684, 772, 0.86, true);
    s += "</g>";
    s += `<g ${tip("K", "Parrots", "Parrots — the messengers of love in Indian poetry — in green overdyed from indigo and myrobalan yellow.")}>`;
    s += parrot(372, 522, 0.8, false) + parrot(628, 500, 0.8, true) + parrot(452, 328, 0.62, false) + parrot(270, 598, 0.62, false) + parrot(724, 566, 0.62, true);
    s += "</g>";
    return s;
  }

  function layerDance(R) {
    let s = "";
    const { cx, cy, rings } = DANCE;
    s += `<g ${tip("W", "Tarpa dance", "The tarpa dance: villagers link arms and spiral around the tarpa player, like the cycle of seasons. Drawn, as in Warli, with heads facing outward.")}>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${rings[rings.length - 1] + 22}" fill="none" stroke="${C.rice}" stroke-width="1.2" stroke-dasharray="2 6" opacity=".7"/>`;
    rings.forEach((r, ri) => {
      const n = Math.round((2 * Math.PI * r) / 27);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + ri * 0.3;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        // keep the trunk and tarpa player clear on the innermost ring
        if (ri === 0 && Math.sin(a) < -0.55) continue;
        if (Math.abs(x - cx) < 40 && y < cy - 10) continue;
        const fuse = (i + ri) % 4 === 0;
        s += warliFigure(x, y, deg(a) + 90, 0.78 + ri * 0.06, {
          dance: true,
          arms: "M-6,-15 L-14,-7 M6,-15 L14,-7",
          fill: fuse ? (ri % 2 ? "url(#kpatIndigo)" : "url(#kpatRed)") : undefined,
        });
      }
    });
    s += "</g>";
    // tarpa player
    s += `<g ${tip("W", "The tarpa player", "At the centre stands the musician with the tarpa — a long trumpet made from a dried gourd — setting the rhythm of the dance.")}>`;
    s += warliFigure(cx + 2, cy + 20, 0, 1.15, { arms: "M-6,-15 L4,-22 M6,-15 L10,-20" });
    s += `<path d="M${cx + 6},${cy - 8} C${cx + 30},${cy - 4} ${cx + 40},${cy + 14} ${cx + 46},${cy + 32}" fill="none" ${WS} stroke-width="3.4"/>`;
    s += `<path d="M${cx + 36},${cy + 34} Q${cx + 46},${cy + 26} ${cx + 56},${cy + 36} Q${cx + 46},${cy + 44} ${cx + 36},${cy + 34}Z" fill="${C.rice}"/>`;
    s += "</g>";
    return s;
  }

  function layerVillage(R) {
    let s = `<g ${tip("W", "Village life", "Huts, ploughing, water-carrying and deer — the everyday world Warli painters record on their walls at harvest and weddings.")}>`;
    s += warliHut(222, 1004, 1.25);
    s += warliHut(290, 1062, 0.85);
    s += warliTree(160, 1150, 150, R);
    // ploughing
    s += warliAnimal(236, 1142, 1.3, false, "bull") + warliAnimal(290, 1146, 1.2, false, "bull");
    s += `<path d="M186,1142 L214,1138" ${WS} stroke-width="2.2"/>`;
    s += warliFigure(170, 1124, 0, 1.1, { arms: "M-6,-15 L12,-6 M6,-15 L16,-10" });
    // right side
    s += warliTree(842, 1150, 160, R);
    s += warliFigure(740, 1018, 0, 1.15, { pot: true, arms: "M-6,-15 L-5,-28 M6,-15 L5,-28" });
    s += warliFigure(778, 1030, 0, 1.05, { pot: true, arms: "M-6,-15 L-5,-28 M6,-15 L5,-28" });
    s += warliFigure(804, 1040, 0, 0.8, { arms: "M-6,-15 L-12,-6 M6,-15 L12,-6" });
    s += warliAnimal(718, 1140, 1.3, true, "deer") + warliAnimal(782, 1128, 1.05, false, "deer");
    // ground lines
    s += `<path d="M150,1168 L350,1168 M650,1168 L850,1168" ${WS} stroke-width="1.4" stroke-dasharray="4 5"/>`;
    s += "</g>";
    return s;
  }

  /* ---------- Assemble ---------- */
  const LAYERS = [
    { id: "cloth", origin: "K", title: "Kalamkari cloth & border", build: (R) => layerCloth() + layerBorder(R) },
    { id: "wall", origin: "W", title: "Warli geru wall", build: (R) => layerField(R) },
    { id: "tree", origin: "K", title: "Kalamkari Tree of Life", build: (R) => layerTree(R) + layerBlooms(R) + layerBirds() },
    { id: "life", origin: "W", title: "Warli life & tarpa dance", build: (R) => layerSky(R) + layerDance(R) + layerVillage(R) },
    { id: "frieze", origin: "F", title: "Fusion frieze", build: () => layerFrieze() },
  ];

  function render(container, opts = {}) {
    const R = rng(opts.seed || 2026);
    container.innerHTML = "";
    const out = [];
    LAYERS.forEach((L, i) => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("class", `art-layer art-layer--${L.id}`);
      svg.setAttribute("data-layer", L.id);
      svg.setAttribute("data-layer-origin", L.origin);
      svg.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      if (i === 0) { svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "The Tree of Life and the Tarpa Dance — a fusion of Warli and Kalamkari painting"); }
      svg.innerHTML = defs() + L.build(R);
      container.appendChild(svg);
      out.push(svg);
    });
    return out;
  }

  // Flatten all layers into one SVG string (for download / studio)
  function flatten(layers) {
    let body = "";
    layers.forEach((svg) => { body += svg.innerHTML.replace(/<defs>[\s\S]*?<\/defs>/, ""); });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}${body}</svg>`;
  }

  window.Sangam = {
    W, H, C, LAYERS, render, flatten, defs,
    motifs: { leaf, blossom, lotusSide, paisley, peacock, parrot, warliFigure, warliAnimal, warliHut, warliTree, warliBird },
    rng,
  };
})();
