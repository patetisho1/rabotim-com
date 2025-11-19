import { Page } from '@playwright/test';

/**
 * Helper functions for task-related testing
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
) {
  await page.goto('/post-task');
  
  // Fill in task form
  await page.selectOption('select[name="category"], select', { value: taskData.category });
  await page.fill('input[name="title"], input[placeholder*="Заглавие"]', taskData.title);
  await page.fill('textarea[name="description"], textarea[placeholder*="Описание"]', taskData.description);
  await page.fill('input[name="location"], input[placeholder*="Локация"]', taskData.location);
  await page.fill('input[name="price"], input[type="number"]', taskData.price.toString());
  
  // Submit form
  await page.click('button[type="submit"], button:has-text("Публикувай"), button:has-text("Създай")');
  
  // Wait for submission
  await page.waitForTimeout(3000);
  
  // Check for success message or navigation
  const successMessage = page.locator('text=/успешно|публикуван|създаден/i');
  return await successMessage.isVisible({ timeout: 5000 }).catch(() => false);
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

export async function getTaskCount(page: Page): Promise<number> {
  await page.goto('/my-tasks');
  await page.waitForTimeout(1000);
  
  // Try to find task count or task cards
  const taskCards = await page.locator('[data-testid="task-card"], .task-card, article').all();
  return taskCards.length;
}

