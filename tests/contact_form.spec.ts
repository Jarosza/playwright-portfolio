import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  
  let nameInput, emailInput, messageInput, submitBtn;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://jarosza.github.io/portfolio/');

    nameInput = page.getByRole('textbox', { name: 'Name' });
    emailInput = page.getByRole('textbox', { name: 'Email' });
    messageInput = page.getByRole('textbox', { name: 'Message' });
    submitBtn = page.getByRole('button', { name: 'Submit' });
  });

  test('Contact form - correct data', async ({ page }) => {
    await nameInput.fill('Anna Test');
    await emailInput.fill('test@test.pl');
    await messageInput.fill('To jest automatyczny test wysyłki formularza.');

    await submitBtn.click();

    await expect(page.getByText('The form was submitted successfully.')).toBeVisible();

   
  });

  test('Contact form - incorrect data (invalid email)', async ({ page }) => {
    await nameInput.fill('Anna Test');
    await emailInput.fill('test@'); // Incorrect email format
    await messageInput.fill('This is automatical message.');

    await submitBtn.click();
    
    const isInvalid = await emailInput.evaluate((el) => !el.checkValidity());
    expect(isInvalid).toBe(true);
    const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
    expect(validationMessage).toContain('Please enter a part following');
  });
});