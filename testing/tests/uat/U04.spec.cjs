const { test, expect } = require('@playwright/test');
const { finder, openFinder, search } = require('../../support/address-finder.cjs');

test('U04 shows the reviewed Private Bag result', async ({ page }) => {
  await openFinder(page);
  await search(page, 'Private Bag 37006, Te Karaka 4042');

  const result = finder(page).getByRole('listitem').filter({ hasText: 'Private Bag 37006' });

  // Confirm exactly one matching Private Bag result is shown.
  await expect(result).toHaveCount(1);
  // Confirm the matching result identifies the reviewed Private Bag number.
  await expect(result).toContainText('Private Bag 37006');
  // Confirm the matching result keeps the reviewed locality and postcode together.
  await expect(result).toContainText('Te Karaka 4042');
  // Confirm the matching result displays the reviewed postcode value.
  await expect(result).toContainText('4042');
});