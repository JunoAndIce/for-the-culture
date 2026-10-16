// A/B check of the working build on :3100 against a frozen baseline copy on :3101: frozen views must match exactly.
// Run `npx next build && npx next start -p 3100` with the baseline served on :3101, then run_code with filename scripts/perf/visual.js.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- the MCP tool runs a bare function expression
async (page) => {
  const A = 'http://localhost:3101';
  const B = 'http://localhost:3100';
  const INIT = () => {
    if (!location.search.includes('freeze')) return;
    const t0 = 1000;
    performance.now = () => t0;
    Date.now = () => 1700000000000;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf(() => cb(t0));
    // The window is headed, so a passing real cursor could start a hover fade mid-shot.
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { pointer-events: none !important; transition: none !important; }';
    // Init scripts can run before the root element exists.
    const add = () => document.documentElement.appendChild(style);
    if (document.documentElement) add(); else document.addEventListener('DOMContentLoaded', add, { once: true });
  };
  if (!globalThis.__ftcVisualInitV3) { await page.context().addInitScript(INIT); globalThis.__ftcVisualInitV3 = true; }
  const cdp = await page.context().newCDPSession(page);
  await page.bringToFront();
  try { const { windowId } = await cdp.send('Browser.getWindowForTarget'); await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } }); } catch {}
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

  const CANVAS_ONLY = 'body * { visibility: hidden !important; } canvas { visibility: visible !important; }';
  const settledHome = () => page.waitForFunction(() => !document.querySelector('div.fixed.inset-0.z-50') && !document.documentElement.classList.contains('intro-lock'), null, { timeout: 30000 });

  // Each view returns a base64 PNG for one server.
  const VIEWS = {
    affiliations_dpr1: { dpr: 1, frozen: true, run: async (base) => { await page.goto(base + '/affiliations?freeze', { waitUntil: 'load' }); await page.waitForTimeout(2500); } },
    affiliations_dpr2: { dpr: 2, frozen: true, run: async (base) => { await page.goto(base + '/affiliations?freeze', { waitUntil: 'load' }); await page.waitForTimeout(2500); } },
    overview_dpr1: { dpr: 1, frozen: true, run: async (base) => { await page.goto(base + '/overview?freeze', { waitUntil: 'load' }); await page.waitForTimeout(2500); } },
    phone_overview: { dpr: 3, w: 390, h: 844, mobile: true, frozen: true, run: async (base) => { await page.goto(base + '/overview?freeze', { waitUntil: 'load' }); await page.waitForTimeout(2500); } },
    ...Object.fromEntries([0, 1, 2, 3, 4, 5].map((k) => ['home_panel' + k, { dpr: 1, frozen: false, run: async (base) => {
      await page.goto(base + '/', { waitUntil: 'load' }); await settledHome();
      await page.evaluate((k) => { const el = document.querySelectorAll('[data-panel]')[k]; window.scrollTo(0, el.offsetTop); }, k);
      await page.waitForTimeout(2600);
    } }])),
    // Reduced motion: the overview drift starts sooner without a canvas rebuild, so compare the pose, not the timing.
    home_to_overview_clientnav: { dpr: 1, frozen: false, reduced: true, run: async (base) => {
      await page.goto(base + '/', { waitUntil: 'load' }); await settledHome();
      await page.evaluate(() => { const el = document.querySelectorAll('[data-panel]')[4]; window.scrollTo(0, el.offsetTop); });
      await page.waitForTimeout(2000);
      await page.evaluate(() => document.querySelector('nav a[href="/overview"]').click());
      await page.waitForURL('**/overview'); await page.waitForTimeout(2500);
    } },
  };

  const shoot = async (view, base, canvasOnly) => {
    // Re-raised per shot: a covered or minimised window throttles frames mid-run.
    await page.bringToFront();
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: view.w || 1440, height: view.h || 900, deviceScaleFactor: view.dpr, mobile: !!view.mobile });
    await cdp.send('Emulation.setEmulatedMedia', { features: view.reduced ? [{ name: 'prefers-reduced-motion', value: 'reduce' }] : [] });
    await view.run(base);
    await page.evaluate(() => document.fonts.ready);
    if (canvasOnly) { await page.addStyleTag({ content: CANVAS_ONLY }); await page.waitForTimeout(250); }
    return (await page.screenshot({ scale: 'device' })).toString('base64');
  };

  const diff = (a, b, greyOnly) => page.evaluate(async ([a, b, greyOnly]) => {
    const load = async (s) => { const bm = await createImageBitmap(await (await fetch('data:image/png;base64,' + s)).blob()); const c = new OffscreenCanvas(bm.width, bm.height); const x = c.getContext('2d'); x.drawImage(bm, 0, 0); return [x.getImageData(0, 0, bm.width, bm.height).data, bm.width, bm.height]; };
    const [[p, w, h], [q, w2, h2]] = await Promise.all([load(a), load(b)]);
    if (w !== w2 || h !== h2) return { sizeMismatch: [w, h, w2, h2] };
    const grey = (d, i) => Math.abs(d[i] - d[i + 1]) < 14 && Math.abs(d[i + 1] - d[i + 2]) < 14;
    let n = 0, big = 0, sum = 0, px = 0;
    for (let i = 0; i < p.length; i += 4) {
      if (greyOnly && !(grey(p, i) && grey(q, i))) continue;
      px++;
      const d = Math.max(Math.abs(p[i] - q[i]), Math.abs(p[i + 1] - q[i + 1]), Math.abs(p[i + 2] - q[i + 2]));
      sum += d; if (d > 0) n++; if (d > 24) big++;
    }
    return { compared: px, changedPct: +(100 * n / px).toFixed(3), over24Pct: +(100 * big / px).toFixed(4), meanAbs: +(sum / px).toFixed(4) };
  }, [a, b, greyOnly]);

  const out = {};
  for (const [name, view] of Object.entries(VIEWS)) {
    const canvasOnly = true;
    const a = await shoot(view, A, canvasOnly);
    const b = await shoot(view, B, canvasOnly);
    out[name + (view.frozen ? '' : ' (grey px)')] = await diff(a, b, !view.frozen);
    if (view.frozen) {
      const fa = await shoot(view, A, false);
      const fb = await shoot(view, B, false);
      out[name + ' (full page)'] = await diff(fa, fb, false);
    }
  }
  await cdp.send('Emulation.setEmulatedMedia', { features: [] });
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  return out;
}
