/* =========================================================
   KALĀ — hub page
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Gold dust ---------- */
  function dust() {
    const cv = $(".h-hero canvas");
    const ctx = cv.getContext("2d");
    let W, H, dpr, parts = [];
    const mouse = { x: -9999, y: -9999 };
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 9000);
      parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.3, vx: (Math.random() - 0.5) * 0.15, vy: -Math.random() * 0.25 - 0.04, a: Math.random() * 0.6 + 0.15, t: Math.random() * Math.PI * 2 }));
    }
    resize();
    addEventListener("resize", resize);
    cv.parentElement.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    cv.parentElement.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(cv);
    (function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.t += 0.02;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 16000) { const f = (16000 - d2) / 16000; p.vx += (dx / 140) * f * 0.04; p.vy += (dy / 140) * f * 0.04; }
        p.vx *= 0.985; p.vy = p.vy * 0.985 - 0.0025;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; p.vy = -Math.random() * 0.25 - 0.04; }
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        const tw = 0.6 + Math.sin(p.t) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(233, 207, 133, ${p.a * tw})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    })();
  }

  /* ---------- Mandala ---------- */
  function mandala() {
    let s = '<svg viewBox="-200 -200 400 400" aria-hidden="true">';
    [196, 188, 150, 110, 70, 40].forEach((r) => (s += `<circle r="${r}"/>`));
    for (let ring = 0; ring < 3; ring++) {
      const n = [32, 24, 16][ring], r1 = [150, 110, 70][ring], r2 = [188, 150, 110][ring];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, w = Math.PI / n * 0.9;
        const p = (ang, r) => `${(Math.cos(ang) * r).toFixed(1)},${(Math.sin(ang) * r).toFixed(1)}`;
        s += `<path d="M${p(a, r1)} Q${p(a - w, (r1 + r2) / 2)} ${p(a, r2)} Q${p(a + w, (r1 + r2) / 2)} ${p(a, r1)}"/>`;
      }
    }
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; s += `<path d="M0,0 L${(Math.cos(a) * 40).toFixed(1)},${(Math.sin(a) * 40).toFixed(1)}"/>`; }
    $(".h-hero__mandala").innerHTML = s + "</svg>";
  }

  function intro() {
    if (KALA.reduced) return;
    const h1 = $(".h-hero h1");
    h1.classList.remove("gold-text");
    h1.innerHTML = Array.from(h1.textContent.normalize("NFC")).map((c) => `<span class="char gold-text">${c}</span>`).join("");
    const tl = gsap.timeline();
    tl.from(".h-hero h1 .char", { yPercent: 100, opacity: 0, rotateX: -80, duration: 1.6, ease: "kala", stagger: 0.09 })
      .from(".h-hero .eyebrow, .h-hero__deva, .h-hero__sub, .h-hero__words a", { y: 30, opacity: 0, duration: 1.2, ease: "kala", stagger: 0.08 }, 0.5)
      .from(".h-hero__mandala", { scale: 0.6, opacity: 0, rotate: -40, duration: 3, ease: "kala" }, 0);
    gsap.to(".h-hero__mandala", { rotate: 360, duration: 240, ease: "none", repeat: -1 });
    gsap.to(".h-hero__inner", { yPercent: 30, opacity: 0, ease: "none", scrollTrigger: { trigger: ".h-hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.set(".portal", { y: 80, opacity: 0 });
    KALA.onView($(".portals"), () => gsap.to(".portal", { y: 0, opacity: 1, duration: 1.4, ease: "kala", stagger: 0.12 }), 0.1);
    return tl;
  }

  mandala();
  dust();
  KALA.intro(intro);
})();
