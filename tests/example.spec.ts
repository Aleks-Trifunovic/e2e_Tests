import { test, expect, Page } from "@playwright/test";

test.describe("Circula QA Analyst Automation Task", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://circula-qa-challenge.vercel.app/users/sign_in");
  });

  test("User flow through the signup process", async ({ page }) => {
    const time = Date.now();
    await signupPageFirstStep(page, time);

    await signupPageSecondStep(page);

    await signupPageThirdStep(page, time);
  });
});

async function signupPageFirstStep(page: Page, time: number) {
  const startTrialLink = page.getByRole("link", { name: "Start a free trial" });
  const acceptCookiesButton = page.getByTestId("uc-accept-all-button");
  const workEmailInput = page.getByRole("textbox", { name: "Work email" });
  const passwordInput = page.getByRole("textbox", {
    name: "Password Show password",
  });
  const tosCheckbox = page.locator('input[type="checkbox"][name="acceptTos"]');
  const tryForFreeButton = page.getByRole("button", { name: "Try for free" });
  await startTrialLink.click();
  await expect(page).toHaveTitle("Signup - Circula");

  await acceptCookiesButton.waitFor({ state: "visible" });
  await acceptCookiesButton.click();

  await workEmailInput.click();
  await workEmailInput.fill(`work${time}@a.com`);

  await passwordInput.click();
  await passwordInput.fill("1Testing");

  await tosCheckbox.click({ force: true });
  await tryForFreeButton.click();
  await page.waitForTimeout(500);
  return time;
}

async function signupPageSecondStep(page: Page) {
  const stepIndicator = page.getByText("Step 2/");
  const heading = page.getByRole("heading", { name: "Your contact details" });
  const firstNameInput = page.getByRole("textbox", { name: "First name" });
  const lastNameInput = page.getByRole("textbox", { name: "Last name" });
  const phoneNumberInput = page.getByRole("textbox", { name: "Phone number" });
  const nextStepButton = page.getByRole("button", { name: "Next step" });
  await expect(stepIndicator).toBeVisible();
  await expect(heading).toBeVisible();

  await firstNameInput.click();
  await firstNameInput.fill("FirstName");

  await lastNameInput.click();
  await lastNameInput.fill("LastName");

  await phoneNumberInput.click();
  await phoneNumberInput.fill("1234567890");

  await nextStepButton.click();
}

async function signupPageThirdStep(page: Page, time: number) {
  const stepIndicator = page.getByText("Step 3/");
  const heading = page.getByRole("heading", { name: "Company information" });
  const companyNameInput = page.getByRole("textbox", { name: "Company name" });
  const companyLocationDropdown = page.getByRole("combobox", {
    name: "Where’s your company",
  });
  const countryOption = page.getByRole("option", { name: "Sweden" });
  const howDidYouHearDropdown = page
    .getByTestId("hdyhau-dropdown")
    .locator("div")
    .filter({ hasText: "Choose channel" });
  const datevOption = page.getByRole("menuitemradio", { name: "DATEV" });
  const createAccountButton = page.getByRole("button", {
    name: "Create an account",
  });
  const verificationText = page.getByText("Great! Now please verify your");
  const openGmailButton = page.getByTestId("open-gmail-button");
  const openOutlookButton = page.getByTestId("open-outlook-button");

  await expect(stepIndicator).toBeVisible();
  await expect(heading).toBeVisible();

  await companyNameInput.click();
  await companyNameInput.fill(`TestCompany${time}`);

  await companyLocationDropdown.click();
  await companyLocationDropdown.clear();
  await companyLocationDropdown.fill("Sweden");

  await page.waitForSelector('li[role="option"]:has-text("Sweden")');
  await countryOption.click({ force: true });
  await page.keyboard.press("Enter");

  await howDidYouHearDropdown.click({ force: true });
  await page.waitForTimeout(500);

  await datevOption.focus();
  await datevOption.click();
  await page.waitForTimeout(500);

  await createAccountButton.click();
  await page.waitForTimeout(5000);

  await expect(verificationText).toBeVisible();
  await expect(openGmailButton).toBeVisible();
  await expect(openOutlookButton).toBeVisible();
}
