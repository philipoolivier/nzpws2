const { test, expect } = require('@playwright/test');
const { finder, openFinder, search } = require('../../support/address-finder.cjs');

test('U03 clears prior suggestions when a nonsense query replaces 122 kerwyn', async ({ page }) => {
  await openFinder(page);
  await search(page, '122 kerwyn');

  const suggestions = finder(page).getByRole('listitem');
  const firstSuggestion = suggestions.filter({ hasText: '122 Kerwyn Avenue' });
  const secondSuggestion = suggestions.filter({ hasText: '122A Kerwyn Avenue' });

  // Confirm the first real suggestion was shown before the query changed.
  await expect(firstSuggestion).toHaveCount(1);
  // Confirm the second real suggestion was also shown before the query changed.
  await expect(secondSuggestion).toHaveCount(1);

  await search(page, '172863 aksdhj');

  // Confirm the earlier first suggestion is no longer rendered.
  await expect(firstSuggestion).toHaveCount(0);
  // Confirm the earlier second suggestion is no longer rendered.
  await expect(secondSuggestion).toHaveCount(0);
  // Confirm the finder has no remaining result items for the nonsense query.
  await expect(suggestions).toHaveCount(0);
});