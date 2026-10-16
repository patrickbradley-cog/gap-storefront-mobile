import { expect, test, type Page } from "@playwright/test";

const shopper = {
  email: "demo.shopper@example.com",
  firstName: "Demo",
  lastName: "Shopper",
  address: "2 Folsom St",
  city: "San Francisco",
  state: "CA",
  zip: "94105",
  card: "4242 4242 4242 4242",
  expiry: "12/29",
  cvv: "123",
};

async function snap(page: Page, name: string) {
  await page.screenshot({ path: test.info().outputPath(`${name}.png`), fullPage: false });
}

test("full checkout flow: home → product → bag → checkout → place order", async ({ page }) => {
  await test.step("Home", async () => {
    await page.goto("/");
    await expect(page.getByTestId("hero")).toBeVisible();
    await expect(page.getByTestId("category-tile").first()).toBeVisible();
    await snap(page, "01-home");
  });

  await test.step("Category → product page", async () => {
    await page.getByTestId("category-tile").filter({ hasText: "Men" }).first().click();
    await expect(page.getByTestId("result-count")).toBeVisible();
    await snap(page, "02-category");
    await page.getByTestId("product-card").first().click();
    await expect(page.getByTestId("pdp-name")).toBeVisible();
    await snap(page, "03-product");
  });

  await test.step("Add to bag", async () => {
    await page.getByRole("radiogroup", { name: "Size" }).getByRole("radio", { disabled: false }).first().click();
    await page.getByTestId("add-to-bag").click();
    await expect(page.getByTestId("bag-drawer")).toBeVisible();
    await expect(page.getByTestId("bag-item")).toHaveCount(1);
    await snap(page, "04-bag-drawer");
  });

  await test.step("Bag → checkout", async () => {
    await page.getByTestId("drawer-view-bag").click();
    await expect(page).toHaveURL(/\/bag$/);
    await expect(page.getByTestId("bag-item")).toHaveCount(1);
    await snap(page, "05-bag");
    await page.getByTestId("checkout-button").click();
    await expect(page).toHaveURL(/\/checkout$/);
    await expect(page.getByTestId("order-review")).toBeVisible();
    await snap(page, "06-checkout");
  });

  await test.step("Fill shipping and payment", async () => {
    await page.getByLabel("Email").fill(shopper.email);
    await page.getByLabel("First name").fill(shopper.firstName);
    await page.getByLabel("Last name").fill(shopper.lastName);
    await page.getByLabel("Address", { exact: true }).fill(shopper.address);
    await page.getByLabel("City").fill(shopper.city);
    await page.getByLabel("State").selectOption(shopper.state);
    await page.getByLabel("ZIP code").fill(shopper.zip);
    await page.getByLabel("Card number").fill(shopper.card);
    await page.getByLabel("Name on card").fill(`${shopper.firstName} ${shopper.lastName}`);
    await page.getByLabel("Expiry (MM/YY)").fill(shopper.expiry);
    await page.getByLabel("CVV").fill(shopper.cvv);
    await snap(page, "07-checkout-filled");
  });

  await test.step("Place order", async () => {
    const placeOrder = page.getByTestId("place-order");
    await placeOrder.scrollIntoViewIfNeeded();
    await snap(page, "08-place-order");
    await placeOrder.click({ timeout: 10_000 });
    await expect(page.getByTestId("confirmation")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("order-number")).toContainText(/GP-/);
    await snap(page, "09-confirmation");
  });
});
