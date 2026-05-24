# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: userFlow.spec.ts >> AuraAI Deadliner E2E User Flow >> should register, login, create task, trigger AI analysis to receive notification, and logout
- Location: e2e\userFlow.spec.ts:8:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('div').filter({ hasText: /^E2E Test Task/ }).first().getByRole('button', { name: 'Analyze' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e5]:
        - link "AuraAI Deadliner" [ref=e6] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e9]
          - generic [ref=e13]:
            - generic [ref=e14]: AuraAI
            - generic [ref=e15]: Deadliner
        - button [ref=e16]:
          - img [ref=e17]
      - navigation [ref=e19]:
        - link "Dashboard" [ref=e20] [cursor=pointer]:
          - /url: /dashboard
          - generic [ref=e21]:
            - img [ref=e22]
            - generic [ref=e27]: Dashboard
        - link "Deadlines" [ref=e28] [cursor=pointer]:
          - /url: /deadlines
          - generic [ref=e29]:
            - img [ref=e31]
            - generic [ref=e34]: Deadlines
        - link "AI Insights" [ref=e35] [cursor=pointer]:
          - /url: /ai-insights
          - generic [ref=e36]:
            - img [ref=e37]
            - generic [ref=e45]: AI Insights
        - link "Courses" [ref=e46] [cursor=pointer]:
          - /url: /courses
          - generic [ref=e47]:
            - img [ref=e48]
            - generic [ref=e50]: Courses
        - link "Calendar" [ref=e51] [cursor=pointer]:
          - /url: /calendar
          - generic [ref=e52]:
            - img [ref=e53]
            - generic [ref=e55]: Calendar
        - link "Settings" [ref=e56] [cursor=pointer]:
          - /url: /settings
          - generic [ref=e57]:
            - img [ref=e58]
            - generic [ref=e61]: Settings
      - generic [ref=e62]:
        - link "Playwright Test User e2e_1779609425786@example.com" [ref=e63] [cursor=pointer]:
          - /url: /profile
          - generic [ref=e64]:
            - img [ref=e66]
            - generic [ref=e70]:
              - paragraph [ref=e71]: Playwright Test User
              - paragraph [ref=e72]: e2e_1779609425786@example.com
        - button "Logout" [ref=e73]:
          - img [ref=e74]
          - generic [ref=e77]: Logout
    - generic [ref=e78]:
      - banner [ref=e79]:
        - generic [ref=e81]:
          - img [ref=e82]
          - textbox "Search tasks, courses..." [ref=e85]
        - generic [ref=e86]:
          - button [ref=e88]:
            - img [ref=e89]
          - button "New Task" [ref=e92]:
            - img [ref=e93]
            - generic [ref=e94]: New Task
      - main [ref=e95]:
        - generic [ref=e96]:
          - generic [ref=e97]:
            - generic [ref=e98]:
              - heading "Deadlines & Tasks" [level=1] [ref=e99]:
                - img [ref=e100]
                - text: Deadlines & Tasks
              - paragraph [ref=e104]: 1 total tasks · 0 overdue
            - button "Priority ↑" [ref=e105]:
              - img [ref=e106]
              - text: Priority ↑
          - generic [ref=e108]:
            - button "All Tasks 1" [ref=e109]:
              - img [ref=e110]
              - text: All Tasks
              - generic [ref=e112]: "1"
            - button "Pending 1" [ref=e113]:
              - img [ref=e114]
              - text: Pending
              - generic [ref=e117]: "1"
            - button "In Progress 0" [ref=e118]:
              - img [ref=e119]
              - text: In Progress
              - generic [ref=e122]: "0"
            - button "Completed 0" [ref=e123]:
              - img [ref=e124]
              - text: Completed
              - generic [ref=e127]: "0"
            - button "Overdue 0" [ref=e128]:
              - img [ref=e129]
              - text: Overdue
              - generic [ref=e131]: "0"
          - generic [ref=e134] [cursor=pointer]:
            - generic [ref=e135]:
              - generic [ref=e136]:
                - img [ref=e137]
                - text: medium
              - generic [ref=e139]: pending
            - heading "E2E Test Task" [level=3] [ref=e140]
            - generic [ref=e141]:
              - img [ref=e142]
              - generic [ref=e145]: 4d 23h left
            - generic [ref=e147]:
              - generic [ref=e148]: Progress
              - generic [ref=e149]: 0%
            - img [ref=e152]
  - button "Open Next.js Dev Tools" [ref=e159] [cursor=pointer]:
    - img [ref=e160]
  - alert [ref=e163]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('AuraAI Deadliner E2E User Flow', () => {
  4  |   const email = `e2e_${Date.now()}@example.com`;
  5  |   const name = 'Playwright Test User';
  6  |   const password = 'Password123!';
  7  | 
  8  |   test('should register, login, create task, trigger AI analysis to receive notification, and logout', async ({ page }) => {
  9  |     // 1. Go to register page
  10 |     await page.goto('/register');
  11 |     await expect(page).toHaveURL(/\/register/);
  12 | 
  13 |     // 2. Register
  14 |     await page.getByPlaceholder('John Doe').fill(name);
  15 |     await page.getByPlaceholder('you@example.com').fill(email);
  16 |     // There are two password fields (Password and Confirm Password)
  17 |     const passwordInputs = page.locator('input[type="password"]');
  18 |     await passwordInputs.nth(0).fill(password);
  19 |     await passwordInputs.nth(1).fill(password);
  20 |     
  21 |     // Click register button
  22 |     await page.getByRole('button', { name: 'Create Account' }).click();
  23 | 
  24 |     // 3. Redirected to dashboard
  25 |     await expect(page).toHaveURL(/\/dashboard/);
  26 |     await expect(page.getByText('Good morning').or(page.getByText('Good afternoon')).or(page.getByText('Good evening'))).toBeVisible();
  27 |     await expect(page.getByText(name)).toBeVisible();
  28 | 
  29 |     // 4. Create a task
  30 |     await page.getByRole('button', { name: 'New Task' }).click();
  31 |     await page.getByPlaceholder('e.g., Complete Machine Learning Assignment').fill('E2E Test Task');
  32 |     await page.getByPlaceholder('Describe your task...').fill('Created via automated Playwright test.');
  33 |     
  34 |     // Formulate a future date
  35 |     const futureDate = new Date();
  36 |     futureDate.setDate(futureDate.getDate() + 5);
  37 |     const deadlineString = futureDate.toISOString().slice(0, 16); // e.g. "2026-05-29T14:30"
  38 |     await page.locator('input[type="datetime-local"]').fill(deadlineString);
  39 | 
  40 |     await page.getByRole('button', { name: 'Create Task' }).click();
  41 |     
  42 |     // Wait for the modal to be hidden, meaning task creation succeeded
  43 |     await expect(page.getByText('Create New Task')).toBeHidden({ timeout: 10000 });
  44 | 
  45 |     // 5. Navigate to Deadlines page
  46 |     await page.goto('/deadlines');
  47 |     await expect(page).toHaveURL(/\/deadlines/);
  48 |     await expect(page.getByText('E2E Test Task')).toBeVisible();
  49 | 
  50 |     // 6. Trigger AI analysis on the task
  51 |     // Locate the task element and click its "Analyze" button
  52 |     const taskContainer = page.locator('div').filter({ hasText: /^E2E Test Task/ }).first();
> 53 |     await taskContainer.getByRole('button', { name: 'Analyze' }).click();
     |                                                                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  54 | 
  55 |     // 7. Open notification bell dropdown
  56 |     // Let's locate the notification bell button.
  57 |     const bellButton = page.locator('button').filter({ has: page.locator('svg') }).first(); // Bell is the notification button
  58 |     await bellButton.click();
  59 | 
  60 |     // Wait a brief moment for the notification to be fetched/rendered
  61 |     // Let's check for the notification dropdown item.
  62 |     await expect(page.getByText('AI Workload Analysis').or(page.getByText('optimal subject focus').or(page.getByText('recommendation')))).toBeVisible({ timeout: 10000 });
  63 | 
  64 |     // 8. Logout
  65 |     await page.getByRole('button', { name: 'Logout' }).click();
  66 |     await expect(page).toHaveURL(/\/login/);
  67 |   });
  68 | });
  69 | 
```