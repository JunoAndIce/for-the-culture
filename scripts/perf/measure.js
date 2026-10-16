// Measures GPU allocations, main-thread long tasks, frame timing and page-change heap growth.
// Run `npx next build && npx next start -p 3100`, then the Playwright MCP run_code tool with filename scripts/perf/measure.js.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- the MCP tool runs a bare function expression
async (page) => {
  const BASE = 'http://localhost:3100';

  // Tallies GPU allocations by wrapping WebGL calls, plus long tasks and a frame sampler.
  const INIT = () => {
    if (window.__gpu) return;
    const BPP = { 0x1908: 4, 0x8058: 4, 0x8C43: 4, 0x1903: 1, 0x8229: 1, 0x1907: 3, 0x8051: 3, 0x88F0: 4, 0x81A6: 3, 0x81A5: 2, 0x8CAC: 4, 0x8D48: 1, 0x8CAD: 8, 0x8D40: 4, 0x822B: 2, 0x8227: 2, 0x8D62: 2, 0x8056: 2, 0x8057: 2, 0x881A: 8, 0x8814: 16, 0x822E: 4, 0x8230: 8 };
    const gpu = (window.__gpu = { tex: 0, buf: 0, rb: 0, texCalls: [], contexts: 0 });
    const P = WebGL2RenderingContext.prototype;
    const levelsBytes = (w, h, levels, bpp) => { let b = 0; for (let l = 0; l < levels; l++) { b += Math.max(1, w >> l) * Math.max(1, h >> l) * bpp; } return b; };
    const oStorage = P.texStorage2D;
    P.texStorage2D = function (t, levels, fmt, w, h) { const b = levelsBytes(w, h, levels, BPP[fmt] || 4); gpu.tex += b; gpu.texCalls.push(['storage', w, h, levels, fmt.toString(16), b]); return oStorage.apply(this, arguments); };
    const oImage = P.texImage2D;
    P.texImage2D = function (t, level, ifmt) {
      let w, h;
      if (arguments.length >= 8 && typeof arguments[3] === 'number') { w = arguments[3]; h = arguments[4]; }
      else { const src = arguments[arguments.length - 1]; w = src && (src.width || src.videoWidth); h = src && (src.height || src.videoHeight); }
      if (level === 0 && w && h) { const b = w * h * (BPP[ifmt] || 4); gpu.tex += b; gpu.texCalls.push(['image', w, h, ifmt.toString(16), b]); }
      return oImage.apply(this, arguments);
    };
    const oGen = P.generateMipmap;
    P.generateMipmap = function () { const last = gpu.texCalls[gpu.texCalls.length - 1]; if (last && last[0] === 'image') { const extra = Math.round(last[4] / 3); gpu.tex += extra; last.push('mips+' + extra); } return oGen.apply(this, arguments); };
    const oBuf = P.bufferData;
    P.bufferData = function (t, data) { gpu.buf += typeof data === 'number' ? data : (data && data.byteLength) || 0; return oBuf.apply(this, arguments); };
    const oRb = P.renderbufferStorageMultisample;
    P.renderbufferStorageMultisample = function (t, s, f, w, h) { gpu.rb += w * h * Math.max(1, s) * (BPP[f] || 4); return oRb.apply(this, arguments); };
    const oGet = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attrs) { if (/webgl/.test(type)) { gpu.contexts++; gpu.lastAttrs = attrs || {}; } return oGet.apply(this, arguments); };
    window.__long = [];
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
  };

  const sampleFrames = (ms) => new Promise((resolve) => {
    const t = []; const start = performance.now();
    const tick = (now) => { t.push(now); if (now - start < ms) requestAnimationFrame(tick); else {
      const d = t.slice(1).map((v, i) => v - t[i]).sort((a, b) => a - b);
      const mean = d.reduce((a, b) => a + b, 0) / d.length;
      resolve({ fps: Math.round(1000 / mean), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), max: +d[d.length - 1].toFixed(1), janky: d.filter((x) => x > 25).length, frames: d.length });
    } };
    requestAnimationFrame(tick);
  });

  // One persistent page: viewport and pixel density come from DevTools overrides.
  const p = page;
  if (!globalThis.__ftcInit) { await p.context().addInitScript(INIT); globalThis.__ftcInit = true; }
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Performance.enable');
  // An occluded or minimised window throttles rAF to ~1Hz, so bring it up first.
  await p.bringToFront();
  try { const { windowId } = await cdp.send('Browser.getWindowForTarget'); await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } }); } catch {}
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  const emulate = async (dpr, w = 1440, h = 900, mobile = false) => {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile });
    await p.goto('about:blank');
  };
  const heap = async () => { await cdp.send('HeapProfiler.collectGarbage'); const m = (await cdp.send('Performance.getMetrics')).metrics; const g = (n) => m.find((x) => x.name === n).value; return { heapMB: +(g('JSHeapUsedSize') / 1048576).toFixed(1), nodes: g('Nodes'), listeners: g('JSEventListeners') }; };

  const out = {};
  for (const dpr of [1, 2]) {
    await emulate(dpr);
    const r = (out['dpr' + dpr] = {});

    // Home: load through the intro.
    await p.goto(BASE + '/', { waitUntil: 'load' });
    await p.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50') && !document.documentElement.classList.contains('intro-lock'), null, { timeout: 30000 });
    await p.waitForTimeout(500);
    r.home = await p.evaluate(() => ({ longTasks: window.__long.length, blockingMs: window.__long.reduce((a, b) => a + Math.max(0, b - 50), 0), maxTask: Math.max(0, ...window.__long), gpuTexMB: +(window.__gpu.tex / 1048576).toFixed(1), gpuBufMB: +(window.__gpu.buf / 1048576).toFixed(1), gpuRbMB: +(window.__gpu.rb / 1048576).toFixed(1), canvas: (() => { const c = document.querySelector('canvas'); return c && [c.width, c.height]; })(), antialias: window.__gpu.lastAttrs && window.__gpu.lastAttrs.antialias, tex: window.__gpu.texCalls.filter((c) => c[c.length - 1] > 1e6 || String(c[c.length - 1]).startsWith('mips')) }));
    Object.assign(r.home, await heap());
    r.home.idle = await p.evaluate(sampleFrames, 3000);
    // Scroll through every panel the way the snap would: one panel per step.
    r.home.scroll = await p.evaluate(async () => {
      const frames = new Promise((res) => { const t = []; const start = performance.now(); const tick = (now) => { t.push(now); if (now - start < 9000) requestAnimationFrame(tick); else { const d = t.slice(1).map((v, i) => v - t[i]).sort((a, b) => a - b); const mean = d.reduce((a, b) => a + b, 0) / d.length; res({ fps: Math.round(1000 / mean), p95: +d[Math.floor(d.length * 0.95)].toFixed(1), max: +d[d.length - 1].toFixed(1), janky: d.filter((x) => x > 25).length, frames: d.length }); } }; requestAnimationFrame(tick); });
      const panels = [...document.querySelectorAll('[data-panel]')];
      for (const el of panels.slice(1)) { window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); await new Promise((s) => setTimeout(s, 1400)); }
      return frames;
    });

    // Overview: idle, then a deck glide.
    await p.goto(BASE + '/overview', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    r.overview = await p.evaluate(() => ({ gpuTexMB: +(window.__gpu.tex / 1048576).toFixed(1), longTasks: window.__long.length, blockingMs: window.__long.reduce((a, b) => a + Math.max(0, b - 50), 0) }));
    Object.assign(r.overview, await heap());
    r.overview.idle = await p.evaluate(sampleFrames, 3000);

    // Client-side navigation loop: heap and contexts should not grow.
    await p.goto(BASE + '/', { waitUntil: 'load' });
    await p.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50'), null, { timeout: 30000 });
    await p.waitForTimeout(500);
    const before = await heap();
    const navLongBefore = await p.evaluate(() => window.__long.length);
    for (let k = 0; k < 4; k++) {
      await p.evaluate(() => document.querySelector('nav a[href="/overview"]').click());
      await p.waitForURL('**/overview'); await p.waitForTimeout(1500);
      await p.evaluate(() => document.querySelector('nav a[href="/"]').click());
      await p.waitForURL(BASE + '/'); await p.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50'), null, { timeout: 30000 }); await p.waitForTimeout(800);
    }
    const after = await heap();
    r.navLoop = { heapBefore: before.heapMB, heapAfter: after.heapMB, contexts: await p.evaluate(() => window.__gpu.contexts), gpuTexMBTotalUploaded: await p.evaluate(() => +(window.__gpu.tex / 1048576).toFixed(1)), navLongTasks: await p.evaluate((n) => window.__long.slice(n), navLongBefore) };
  }

  // Low-end CPU: 4x throttle, desktop DPR 1, load and scroll.
  {
    await emulate(1);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await p.goto(BASE + '/', { waitUntil: 'load' });
    await p.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50') && !document.documentElement.classList.contains('intro-lock'), null, { timeout: 60000 });
    await p.waitForTimeout(500);
    out.cpu4x = await p.evaluate(() => ({ longTasks: window.__long.length, blockingMs: window.__long.reduce((a, b) => a + Math.max(0, b - 50), 0), maxTask: Math.max(0, ...window.__long) }));
    out.cpu4x.idle = await p.evaluate(sampleFrames, 3000);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }

  // Phone: 390x844 at DPR 3 (canvas caps at 2).
  {
    await emulate(3, 390, 844, true);
    await p.goto(BASE + '/', { waitUntil: 'load' });
    await p.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50') && !document.documentElement.classList.contains('intro-lock'), null, { timeout: 30000 });
    await p.waitForTimeout(500);
    out.phone = await p.evaluate(() => ({ gpuTexMB: +(window.__gpu.tex / 1048576).toFixed(1), gpuBufMB: +(window.__gpu.buf / 1048576).toFixed(1), canvas: (() => { const c = document.querySelector('canvas'); return c && [c.width, c.height]; })(), blockingMs: window.__long.reduce((a, b) => a + Math.max(0, b - 50), 0) }));
    out.phone.idle = await p.evaluate(sampleFrames, 3000);
    await cdp.send('Emulation.clearDeviceMetricsOverride');
  }

  out.renderer = await page.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; });
  return out;
}
