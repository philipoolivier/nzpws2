// Read-only observation helper. It does not turn current behaviour into requirements.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { uatEnvironment } = require('./credentials.cjs');
const cases = require('../docs/customer-cases.json');
(async () => {
  const arg = process.argv.indexOf('--credentials');
  const env = uatEnvironment(arg >= 0 ? process.argv[arg + 1] : undefined);
  const browser = await chromium.launch({ headless: !process.argv.includes('--headed'), channel: process.env.WORKSHOP_BROWSER_CHANNEL || undefined });
  const observations = { capturedAt: new Date().toISOString(), target: env.baseURL + env.path, purpose: 'Observations only; human acceptance review required', cases: [] };
  const directory = path.resolve(__dirname, '../.local/uat-observations');
  fs.mkdirSync(directory, { recursive: true });
  try {
    const context = await browser.newContext({ httpCredentials: env.httpCredentials });
    for (const item of cases) {
      if (item.id === 'U02') { observations.cases.push({ id: item.id, status: 'NEEDS_ROUTE_CONFIRMATION', note: 'Confirm the live service-filter route and controls; do not assume address finder contains them.' }); continue; }
      const page = await context.newPage();
      const response = await page.goto(env.baseURL + env.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response?.ok()) throw Error('UAT navigation returned HTTP ' + response?.status() + '. Stop and verify access privately.');
      let targetFrame;
      for (const frame of page.frames()) {
        const candidates = frame.getByRole('textbox', { name: /address|postcode/i });
        await candidates.first().waitFor({ state:'visible', timeout:5000 }).catch(() => {});
        if (await candidates.count() === 1) { targetFrame = frame; break; }
      }
      if (!targetFrame) {
        observations.cases.push({ id: item.id, status: 'NEEDS_MANUAL_INSPECTION', note: 'No unique address/postcode textbox was visible. Inspect the page and frames manually.' });
        fs.writeFileSync(path.join(directory, item.id + '-page.txt'), await page.locator('body').ariaSnapshot());
        await page.close(); continue;
      }
      const input = targetFrame.getByRole('textbox', { name: /address|postcode/i });
      const before = await targetFrame.locator('body').ariaSnapshot();
      const responseWait = page.waitForResponse(r => new URL(r.url()).origin === 'https://uat-tools.cf.nzpost.co.nz' && new URL(r.url()).pathname === '/legacy/api/suggest' && new URL(r.url()).searchParams.get('q') === item.query && r.request().method() === 'GET', { timeout: 8000 }).then(r => ({ status: r.status(), path: new URL(r.url()).pathname })).catch(() => null);
      await input.fill(item.query);
      const observedResponse = await responseWait;
      const after = await targetFrame.locator('body').ariaSnapshot();
      fs.writeFileSync(path.join(directory, item.id + '-before.txt'), before);
      fs.writeFileSync(path.join(directory, item.id + '-after.txt'), after);
      observations.cases.push({ id: item.id, query: item.query, status: 'OBSERVED_NOT_ASSERTED', frameUrl: targetFrame.url(), response: observedResponse, note: 'Autocomplete observation only. Selection, submit, result semantics and expected outcome still need human/MCP review.' });
      await page.close();
    }
  } catch (error) {
    observations.error = error.message.split('\n')[0]; process.exitCode = 1;
  } finally {
    await browser.close();
    fs.writeFileSync(path.join(directory, 'summary.json'), JSON.stringify(observations, null, 2));
    console.log('Observation files written to lab/.local/uat-observations. Review before sharing; credentials are not exported.');
    if (observations.error) console.log('Exploration stopped: ' + observations.error);
  }
})().catch(error => { console.error(error.message.split('\n')[0]); process.exitCode = 1; });
