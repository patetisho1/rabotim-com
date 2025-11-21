import { Page } from '@playwright/test';

/**
 * Helper functions for task-related testing
 */

/**
 * Creates a new task
 * @param page Playwright page object
 * @param taskData Task data to fill in the form
 * @returns true if task was created successfully, false otherwise
 */
export async function createTask(
  page: Page,
  taskData: {
    title: string;
    description: string;
    category: string;
    location: string;
    price: number;
  }
): Promise<boolean> {
  await page.goto('/post-task');
  
  // Wait for form to load
  await page.waitForLoadState('networkidle');
  
  // Fill in task form
  try {
    await page.selectOption('select[name="category"], select', { value: taskData.category }).catch(() => {
      // If select doesn't exist, try finding it differently
      return page.selectOption('select', { label: taskData.category }).catch(() => {});
    });
    
    await page.fill('input[name="title"], input[placeholder*="Заглавие"]', taskData.title);
    await page.fill('textarea[name="description"], textarea[placeholder*="Описание"]', taskData.description);
    await page.fill('input[name="location"], input[placeholder*="Локация"]', taskData.location);
    await page.fill('input[name="price"], input[type="number"]', taskData.price.toString());
    
    // Submit form
    await page.click('button[type="submit"], button:has-text("Публикувай"), button:has-text("Създай")');
    
    // Wait for submission - check for navigation or success message
    await Promise.race([
      page.waitForURL(/\/task\/[^/]+/, { timeout: 10000 }).catch(() => false),
      page.waitForSelector('text=/успешно|публикуван|създаден/i', { timeout: 10000 }).catch(() => false),
      page.waitForTimeout(3000)
    ]);
    
    // Check for success indicators
    const successMessage = page.locator('text=/успешно|публикуван|създаден/i');
    const successVisible = await successMessage.isVisible({ timeout: 2000 }).catch(() => false);
    
    // Check if we navigated to a task detail page
    const isOnTaskPage = page.url().includes('/task/');
    
    return successVisible || isOnTaskPage;
  } catch (error) {
    console.error('Error creating task:', error);
    return false;
  }
}

export async function applyForTask(page: Page, taskId: string) {
  await page.goto(`/task/${taskId}`);
  
  // Find and click apply button
  const applyButton = page.locator('button:has-text("Кандидатствай"), button:has-text("Кандидатствай"), a:has-text("Кандидатствай")').first();
  
  if (await applyButton.isVisible({ timeout: 5000 })) {
    await applyButton.click();
    await page.waitForTimeout(2000);
    
    // Check for success message
    const successMessage = page.locator('text=/успешно|кандидатствахте/i');
    return await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
  }
  
  return false;
}

/**
 * Gets the count of tasks for the logged-in user
 * @param page Playwright page object
 * @returns Number of task cards found
 */
export async function getTaskCount(page: Page): Promise<number> {
  await page.goto('/my-tasks');
  await page.waitForTimeout(1000);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Try to find task count or task cards
  const taskCards = await page.locator('[data-testid="task-card"], .task-card, article, [class*="task-card"]').all();
  return taskCards.length;
}

