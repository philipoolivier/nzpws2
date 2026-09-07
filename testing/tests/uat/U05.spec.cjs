const { test, expect } = require('@playwright/test');
const { finder, openFinder, search } = require('../../support/address-finder.cjs');

test('U05 preserves the leading zero in the reviewed PO Box postcode', async ({ page }) => {
  await openFinder(page);
  await search(page, 'PO Box 101, Paihia 0247');

  const result = finder(page).getByRole('listitem').filter({ hasText: 'PO Box 101' });

  // Confirm exactly one matching PO Box result is shown.
  await expect(result).toHaveCount(1);
  // Confirm the matching result identifies the reviewed PO Box.
  await expect(result).toContainText('PO Box 101');
  // Confirm the postcode is displayed as literal text with its leading zero.
  await expect(result).toContainText('0247');
});