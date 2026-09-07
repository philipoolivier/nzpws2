const { test, expect } = require('@playwright/test');
const { finder } = require('../../support/address-finder.cjs');

test('U02 applies and clears the reviewed Pay a bill service filter', async ({ page }) => {
  await page.goto('/tools/find-nz-post');

  const findNzPost = finder(page);
  await findNzPost.getByRole('link', { name: 'Auckland', exact: true }).click();

  const filter = findNzPost.getByRole('button').filter({ hasText: 'Filter by' });
  await expect(filter).toBeVisible();
  await filter.click();
  await page.getByRole('menuitem', { name: 'Pay a bill', exact: true }).click();
  await expect(filter).toHaveText('Filter by: Pay a bill');

  await filter.click();
  await page.getByRole('menuitem', { name: 'All', exact: true }).click();
  await expect(filter).toHaveText('Filter by');
});