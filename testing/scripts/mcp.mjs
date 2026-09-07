import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import credentials from './credentials.cjs';
const { uatEnvironment } = credentials;
const require = createRequire(import.meta.url);

// Launched by Copilot using an absolute path; no secrets in the MCP registration.
const root = fileURLToPath(new URL('../', import.meta.url));
const localDir = join(root, '.local');
mkdirSync(localDir, { recursive: true, mode: 0o700 });
const session = mkdtempSync(join(localDir, 'mcp-'));
const config = { browser: { browserName: 'chromium', isolated: true,
  launchOptions: { channel: process.env.MCP_BROWSER_CHANNEL || 'chromium', headless: false }, contextOptions: {} },
  outputDir: join(root, '.mcp-output') };
try {
  if (process.argv[2] === 'uat') config.browser.contextOptions.httpCredentials = uatEnvironment().httpCredentials;
  else throw new Error('This workshop requires the uat argument.');
  const configFile = join(session, 'config.json');
  writeFileSync(configFile, JSON.stringify(config), { mode: 0o600 });
  const cli = join(dirname(require.resolve('@playwright/mcp/package.json')), 'cli.js');
  const child = spawn(process.execPath, [cli, '--config', configFile], { cwd: root, stdio: 'inherit' });
  let stopping = false;
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { stopping = true; child.kill(signal); });
  child.on('error', () => { console.error('Could not start Playwright MCP. Run npm ci from the participant package root.'); process.exitCode = 1; });
  child.on('close', code => { rmSync(session, { recursive: true, force: true }); process.exitCode = stopping ? 0 : (code ?? 1); });
  process.on('exit', () => rmSync(session, { recursive: true, force: true }));
} catch (error) {
  rmSync(session, { recursive: true, force: true });
  console.error(error.message); process.exitCode = 1;
}
