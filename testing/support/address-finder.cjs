const {expect}=require('@playwright/test');
function finder(page){return page.locator('#nzpost-js-tools');}
async function openFinder(page){
 const response=await page.goto('/tools/address-postcode-finder');
 expect(response?.ok(),'Authenticated UAT navigation must succeed').toBeTruthy();
 await expect(finder(page).getByRole('textbox',{name:'Address search input',exact:true})).toBeVisible();
}
async function search(page,query){
 // Wait for this query's real lookup, never an analytics URL containing "search".
 const responsePromise=page.waitForResponse(response=>{
  const url=new URL(response.url());
  return url.origin==='https://uat-tools.cf.nzpost.co.nz' && url.pathname==='/legacy/api/suggest' && url.searchParams.get('q')===query && response.request().method()==='GET';
 });
 await finder(page).getByRole('textbox',{name:'Address search input',exact:true}).fill(query);
 const response=await responsePromise;
 expect(response.ok(),'Address lookup must respond successfully').toBeTruthy();
 // Callers must still assert the user-visible result, not just the HTTP response.
}
module.exports={finder,openFinder,search};

