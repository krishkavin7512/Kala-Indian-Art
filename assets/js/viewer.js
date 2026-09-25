/* =========================================================
   Deep-zoom image viewer — wheel / pinch / drag / double-click.
   Shows the light card image instantly, then swaps in the
   full-resolution file when it arrives.
   ========================================================= */
(function () {
  "use strict";
  class DeepZoom {
    constructor(root, opts = {}) {
      this.root = root;
      this.wrap = document.createElement("div");
      this.wrap.className = "detail__imgwrap";
      this.low = new Image(); this.low.alt = "";
      this.full = new Image(); this.full.className = "full"; this.full.alt = "";
      this.wrap.append(this.low, this.full);
      root.appendChild(this.wrap);
      this.onZoom = opts.onZoom || (() => {});
      this.onLoaded = opts.onLoaded || (() => {});
      this.s = 1; this.x = 0; this.y = 0; this.base = { w: 1, h: 1 }; this.natural = { w: 1, h: 1 };
      this.pointers = new Map();
      this._bind();
      this._ro = new ResizeObserver(() => this.fit(false));
      this._ro.observe(root);
    }
    load(lowSrc, fullSrc, alt, dims) {
      this.full.classList.remove("is-loaded");
      this.full.removeAttribute("src");
      this.wrap.style.opacity = "";
      this.low.alt = alt || "";
      this.natural = dims ? { w: dims[0], h: dims[1] } : { w: 1, h: 1 };
      const token = (this._token = Symbol());
      const afterLow = () => {
        if (token !== this._token) return;
        if (!dims) this.natural = { w: this.low.naturalWidth, h: this.low.naturalHeight };
        this.fit(false);
        this.full.onload = () => {
          if (token !== this._token) return;
          this.natural = { w: this.full.naturalWidth, h: this.full.naturalHeight };
          this.full.classList.add("is-loaded");
          this.onLoaded(this.natural);
        };
        this.full.src = fullSrc;
      };
      this.low.onload = afterLow;
      this.low.src = lowSrc;
      if (this.low.complete && this.low.naturalWidth) afterLow();
    }
    fit(animate) {
      const r = this.root.getBoundingClientRect();
      const ar = this.natural.w / this.natural.h;
      const pad = r.width < 700 ? 16 : 56;
      let w = r.width - pad * 2, h = w / ar;
      if (h > r.height - pad * 2) { h = r.height - pad * 2; w = h * ar; }
      this.base = { w, h };
      this.wrap.style.width = w + "px";
      this.wrap.style.height = h + "px";
      this.s = 1; this.x = (r.width - w) / 2; this.y = (r.height - h) / 2;
      this.apply(animate);
    }
    maxScale() { return Math.max(1, (this.natural.w / this.base.w) * 1.6); }
    apply(animate) {
      const r = this.root.getBoundingClientRect();
      const W = this.base.w * this.s, H = this.base.h * this.s;
      // keep the image on screen
      if (W <= r.width) this.x = (r.width - W) / 2; else this.x = Math.min(0, Math.max(r.width - W, this.x));
      if (H <= r.height) this.y = (r.height - H) / 2; else this.y = Math.min(0, Math.max(r.height - H, this.y));
      const t = `translate(${this.x}px,${this.y}px) scale(${this.s})`;
      if (animate && window.gsap) gsap.to(this.wrap, { transform: t, duration: 0.6, ease: "power3.out" });
      else { if (window.gsap) gsap.killTweensOf(this.wrap); this.wrap.style.transform = t; }
      this.onZoom(this.s * (this.base.w / this.natural.w));
    }
    zoomAt(px, py, factor, animate) {
      const ns = Math.min(this.maxScale(), Math.max(1, this.s * factor));
      const k = ns / this.s;
      this.x = px - (px - this.x) * k;
      this.y = py - (py - this.y) * k;
      this.s = ns;
      this.apply(animate);
    }
    zoomBy(f) { const r = this.root.getBoundingClientRect(); this.zoomAt(r.width / 2, r.height / 2, f, true); }
    _bind() {
      const el = this.root;
      el.addEventListener("wheel", (e) => {
        e.preventDefault();
        const r = el.getBoundingClientRect();
        this.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0016), false);
      }, { passive: false });
      el.addEventListener("dblclick", (e) => {
        const r = el.getBoundingClientRect();
        if (this.s > 1.05) this.fit(true);
        else this.zoomAt(e.clientX - r.left, e.clientY - r.top, Math.min(3, this.maxScale()), true);
      });
      let last = null, pinch = null;
      el.addEventListener("pointerdown", (e) => {
        el.setPointerCapture(e.pointerId);
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.pointers.size === 1) { last = { x: e.clientX, y: e.clientY }; el.classList.add("is-drag"); }
        if (this.pointers.size === 2) {
          const [a, b] = [...this.pointers.values()];
          pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) };
        }
      });
      el.addEventListener("pointermove", (e) => {
        if (!this.pointers.has(e.pointerId)) return;
        this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (this.pointers.size === 2 && pinch) {
          const [a, b] = [...this.pointers.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const r = el.getBoundingClientRect();
          this.zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, d / pinch.d, false);
          pinch.d = d;
        } else if (last) {
          this.x += e.clientX - last.x; this.y += e.clientY - last.y;
          last = { x: e.clientX, y: e.clientY };
          this.apply(false);
        }
      });
      const end = (e) => {
        this.pointers.delete(e.pointerId);
        if (this.pointers.size < 2) pinch = null;
        if (this.pointers.size === 0) { last = null; el.classList.remove("is-drag"); }
        else { const p = [...this.pointers.values()][0]; last = { x: p.x, y: p.y }; }
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
    }
  }
  window.DeepZoom = DeepZoom;
})();
