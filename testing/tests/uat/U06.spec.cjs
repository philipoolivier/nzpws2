const { test, expect } = require('@playwright/test');
const { finder, openFinder, search } = require('../../support/address-finder.cjs');

test('U06 shows the reviewed suburb and city together', async ({ page }) => {
  await openFinder(page);
  await search(page, 'Auckland Central, Auckland');

  const result = finder(page).getByRole('listitem').filter({ hasText: 'Auckland Central' });

  // Confirm exactly one matching suburb result is shown.
  await expect(result).toHaveCount(1);
  // Confirm the matching result identifies the reviewed suburb.
  await expect(result).toContainText('Auckland Central');
  // Confirm the matching result also contains the reviewed city.
  await expect(result).toContainText('Auckland');
});