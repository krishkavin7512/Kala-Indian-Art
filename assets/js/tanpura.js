/* =========================================================
   Tanpura drone — synthesised live with the Web Audio API.
   Four strings tuned Pa · Sa · Sa · Sa (low), plucked in the
   classic cycle. A sweeping band-pass imitates the "jawari"
   (the buzzing bridge) that gives the tanpura its shimmer.
   No audio files, no copyright.
   ========================================================= */
(function () {
  "use strict";
  const SA = 130.81; // C3
  const STRINGS = [SA * 0.75, SA, SA, SA / 2]; // Pa (mandra), Sa, Sa, Sa (mandra)
  const CYCLE = 4.8; // seconds per full cycle
  const OFFSETS = [0, 1.1, 2.2, 3.3];

  let ctx = null, master = null, verb = null, timer = null, nextTime = 0, wave = null;

  function impulse(seconds, decay) {
    const rate = ctx.sampleRate, len = rate * seconds;
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    verb = ctx.createConvolver();
    verb.buffer = impulse(4.5, 2.4);
    const wet = ctx.createGain(); wet.gain.value = 0.55;
    const dry = ctx.createGain(); dry.gain.value = 0.7;
    master.connect(dry).connect(comp);
    master.connect(verb).connect(wet).connect(comp);
    comp.connect(ctx.destination);

    // Rich, slightly buzzy harmonic spectrum
    const N = 28, real = new Float32Array(N), imag = new Float32Array(N);
    for (let n = 1; n < N; n++) imag[n] = (1 / Math.pow(n, 0.85)) * (n % 7 === 0 ? 0.4 : 1);
    wave = ctx.createPeriodicWave(real, imag);
  }

  function pluck(freq, t) {
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    out.gain.exponentialRampToValueAtTime(0.05, t + 1.6);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 6.5);

    // Jawari: a resonant band sweeping up the harmonic series
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = 5;
    bp.frequency.setValueAtTime(freq * 2, t);
    bp.frequency.exponentialRampToValueAtTime(freq * 14, t + 1.8);
    bp.frequency.exponentialRampToValueAtTime(freq * 5, t + 5);
    const body = ctx.createBiquadFilter();
    body.type = "lowpass"; body.frequency.value = 2600;

    const mixBP = ctx.createGain(); mixBP.gain.value = 1.4;
    const mixBody = ctx.createGain(); mixBody.gain.value = 0.55;

    [0, 1.8].forEach((cents) => {
      const o = ctx.createOscillator();
      o.setPeriodicWave(wave);
      o.frequency.value = freq;
      o.detune.value = cents;
      o.connect(bp); o.connect(body);
      o.start(t); o.stop(t + 6.6);
    });
    bp.connect(mixBP).connect(out);
    body.connect(mixBody).connect(out);
    out.connect(master);
  }

  function schedule() {
    while (nextTime < ctx.currentTime + 1.2) {
      STRINGS.forEach((f, i) => pluck(f, nextTime + OFFSETS[i] + (Math.random() - 0.5) * 0.03));
      nextTime += CYCLE;
    }
  }

  const api = {
    playing: false,
    start() {
      if (!ctx) build();
      if (ctx.state === "suspended") ctx.resume();
      nextTime = ctx.currentTime + 0.1;
      schedule();
      timer = setInterval(schedule, 400);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5);
      api.playing = true;
      return true;
    },
    stop() {
      if (!ctx) return false;
      clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      api.playing = false;
      return false;
    },
    toggle() { return api.playing ? api.stop() : api.start(); },
  };
  window.Tanpura = api;
})();
