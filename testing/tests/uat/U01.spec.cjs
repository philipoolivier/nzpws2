const { test, expect } = require('@playwright/test');
const { finder, openFinder, search } = require('../../support/address-finder.cjs');

test('U01 shows the reviewed suggestions for 122 kerwyn', async ({ page }) => {
  await openFinder(page);
  await search(page, '122 kerwyn');

  const suggestions = finder(page).getByRole('listitem');
  const firstSuggestion = suggestions.filter({ hasText: '122 Kerwyn Avenue' });
  await expect(firstSuggestion).toHaveCount(1);
  await expect(firstSuggestion).toContainText('122 Kerwyn Avenue');
  await expect(firstSuggestion).toContainText('East Tamaki');
  await expect(firstSuggestion).toContainText('Auckland 2013');
  await expect(firstSuggestion).toContainText('Postcode');
  await expect(firstSuggestion).toContainText('2013');

  const secondSuggestion = suggestions.filter({ hasText: '122A Kerwyn Avenue' });
  await expect(secondSuggestion).toHaveCount(1);
  await expect(secondSuggestion).toContainText('122A Kerwyn Avenue');
  await expect(secondSuggestion).toContainText('East Tamaki');
  await expect(secondSuggestion).toContainText('Auckland 2013');
  await expect(secondSuggestion).toContainText('Postcode');
  await expect(secondSuggestion).toContainText('2013');
});
