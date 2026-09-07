const fs = require('node:fs');
const path = require('node:path');
function uatEnvironment(credentialFile) {
  const selected = credentialFile || process.env.WORKSHOP_CREDENTIAL_FILE || path.resolve(__dirname, '../.env');
  let values = { ...process.env };
  if (fs.existsSync(selected)) {
    const content = fs.readFileSync(selected, 'utf8').replace(/^\uFEFF/, '').trim();
    const lines = content.split(/\r?\n/);
    if (lines.length === 2 && !lines.some(line => /^\s*[A-Za-z_]\w*\s*=/.test(line))) {
      // Support the user's existing two-line file: username then password.
      values.UAT_USERNAME = lines[0]; values.UAT_PASSWORD = lines[1];
    } else {
      const { parseEnv } = require('node:util');
      values = { ...values, ...parseEnv(content) };
    }
  }
  const baseURL = values.UAT_BASE_URL || 'https://uat.nzpost.co.nz';
  const target = new URL(baseURL);
  if (target.protocol !== 'https:' || target.origin !== baseURL.replace(/\/$/, '') || target.username || target.password) throw Error('UAT_BASE_URL must be an HTTPS origin without credentials.');
  if (!values.UAT_USERNAME || !values.UAT_PASSWORD) throw Error('UAT credentials are missing. Configure testing/.env privately or WORKSHOP_CREDENTIAL_FILE.');
  return { baseURL: target.origin, path: values.UAT_PATH || '/tools/address-postcode-finder', httpCredentials: { username: values.UAT_USERNAME, password: values.UAT_PASSWORD, origin: target.origin } };
}
module.exports = { uatEnvironment };
