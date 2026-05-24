import { test, expect } from '@playwright/test';

test.describe('AuraAI Deadliner E2E User Flow', () => {
  const email = `e2e_${Date.now()}@example.com`;
  const name = 'Playwright Test User';
  const password = 'Password123!';

  test('should register, login, create task, trigger AI analysis to receive notification, and logout', async ({ page }) => {
    // 1. Go to register page
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register/);

    // 2. Register
    await page.getByPlaceholder('John Doe').fill(name);
    await page.getByPlaceholder('you@example.com').fill(email);
    // There are two password fields (Password and Confirm Password)
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(password);
    await passwordInputs.nth(1).fill(password);
    
    // Click register button
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 3. Redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Good morning').or(page.getByText('Good afternoon')).or(page.getByText('Good evening'))).toBeVisible();
    await expect(page.getByText(name)).toBeVisible();

    // 4. Create a task
    await page.getByRole('button', { name: 'New Task' }).click();
    await page.getByPlaceholder('e.g., Complete Machine Learning Assignment').fill('E2E Test Task');
    await page.getByPlaceholder('Describe your task...').fill('Created via automated Playwright test.');
    
    // Formulate a future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deadlineString = futureDate.toISOString().slice(0, 16); // e.g. "2026-05-29T14:30"
    await page.locator('input[type="datetime-local"]').fill(deadlineString);

    await page.getByRole('button', { name: 'Create Task' }).click();
    
    // Wait for the modal to be hidden, meaning task creation succeeded
    await expect(page.getByText('Create New Task')).toBeHidden({ timeout: 10000 });

    // 5. Navigate to Deadlines page
    await page.goto('/deadlines');
    await expect(page).toHaveURL(/\/deadlines/);
    await expect(page.getByText('E2E Test Task')).toBeVisible();

    // 6. Trigger AI analysis on the task
    // Click the task card to expand it first
    await page.getByText('E2E Test Task').click();

    // Locate the task element and click its "Analyze" button
    const taskContainer = page.locator('div').filter({ hasText: /^E2E Test Task/ }).first();
    await taskContainer.getByRole('button', { name: 'Analyze' }).click();

    // 7. Open notification bell dropdown
    // Let's locate the notification bell button.
    const bellButton = page.locator('button').filter({ has: page.locator('svg') }).first(); // Bell is the notification button
    await bellButton.click();

    // Wait a brief moment for the notification to be fetched/rendered
    // Let's check for the notification dropdown item.
    await expect(page.getByText('AI Workload Analysis').or(page.getByText('optimal subject focus').or(page.getByText('recommendation')))).toBeVisible({ timeout: 10000 });

    // 8. Logout
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
