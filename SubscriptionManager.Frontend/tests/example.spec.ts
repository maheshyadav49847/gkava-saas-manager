import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5180/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SaaS/i); // Replace with actual title expectation if different
});
