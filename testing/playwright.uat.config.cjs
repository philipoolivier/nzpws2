const { defineConfig } = require('@playwright/test');
const { uatEnvironment } = require('./scripts/credentials.cjs');
const env = uatEnvironment();
module.exports = defineConfig({
  testDir:'./tests/uat', workers:1, retries:0, forbidOnly:!!process.env.CI,
  reporter:[['list'],['html',{open:'never'}],['junit',{outputFile:'test-results/uat-results.xml'}]],
  use:{baseURL:env.baseURL,browserName:'chromium',channel:process.env.WORKSHOP_BROWSER_CHANNEL||undefined,httpCredentials:env.httpCredentials,trace:'off',screenshot:'off',video:'off'}
});
