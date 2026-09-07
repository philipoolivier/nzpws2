const {chromium}=require('@playwright/test');
const {uatEnvironment}=require('./credentials.cjs');
(async()=>{
  const env=uatEnvironment();
  const browser=await chromium.launch({channel:process.env.WORKSHOP_BROWSER_CHANNEL||undefined});
  try {
    const context=await browser.newContext({httpCredentials:env.httpCredentials});
    const page=await context.newPage();
    const response=await page.goto(env.baseURL+env.path,{waitUntil:'domcontentloaded',timeout:30000});
    if(!response?.ok())throw Error('UAT returned HTTP '+response?.status());
    if(new URL(page.url()).origin!==env.baseURL)throw Error('Unexpected redirect away from UAT');
    if(!(await page.locator('body').innerText()).trim())throw Error('UAT page body is empty');
    console.log('PASS: UAT page loaded with HTTP '+response.status()+'. Review the actual application with MCP next.');
  } finally {await browser.close();}
})().catch(error=>{console.error('FAIL: '+error.message.split('\n')[0]);process.exitCode=1;});
