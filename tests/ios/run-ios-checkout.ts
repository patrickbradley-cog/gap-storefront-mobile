import { spawn, type ChildProcess } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { remote, type Browser } from "webdriverio";
import { BUNDLE_ID, ensureSimulator, installAndLaunch } from "../../scripts/ios-sim";

const OUT = "test-results/ios";
const APPIUM_PORT = Number(process.env.APPIUM_PORT ?? 4723);
const shopper = { email: "demo.shopper@example.com", first: "Demo", last: "Shopper", address: "2 Folsom St", city: "San Francisco", state: "CA", zip: "94105", card: "4242424242424242", expiry: "12/29", cvv: "123" };

const log = (msg: string) => console.log(`[ios] ${msg}`);

async function waitForAppium(): Promise<ChildProcess | null> {
  const ok = await fetch(`http://127.0.0.1:${APPIUM_PORT}/status`).then((r) => r.ok).catch(() => false);
  if (ok) return null;
  const proc = spawn("appium", ["--port", String(APPIUM_PORT), "--log-level", "warn"], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await fetch(`http://127.0.0.1:${APPIUM_PORT}/status`).then((r) => r.ok).catch(() => false)) return proc;
  }
  throw new Error("Appium did not start");
}

function startRecording(udid: string, file: string) {
  return spawn("xcrun", ["simctl", "io", udid, "recordVideo", "--codec=h264", "--force", file], { stdio: "ignore" });
}

async function stopRecording(proc: ChildProcess) {
  proc.kill("SIGINT");
  await new Promise((r) => proc.once("exit", r));
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const udid = ensureSimulator();
  installAndLaunch(udid);
  const appium = await waitForAppium();

  const driver: Browser = await remote({
    hostname: "127.0.0.1",
    port: APPIUM_PORT,
    logLevel: "error",
    capabilities: {
      platformName: "iOS",
      "appium:automationName": "XCUITest",
      "appium:udid": udid,
      "appium:bundleId": BUNDLE_ID,
      "appium:noReset": true,
      "appium:wdaLaunchTimeout": 300_000,
      "appium:newCommandTimeout": 300,
    },
  });

  const recording = startRecording(udid, `${OUT}/checkout-iphone.mp4`);
  await driver.pause(1500);
  const shot = (name: string) => driver.saveScreenshot(`${OUT}/${name}.png`);
  const el = (predicate: string) => driver.$(`-ios predicate string:${predicate}`);
  const pause = (ms: number) => driver.pause(ms);
  async function reveal(predicate: string, timeout = 15_000) {
    const e = el(predicate);
    await e.waitForExist({ timeout });
    if ((await e.getAttribute("visible")) !== "true") {
      await driver.execute("mobile: scroll", { elementId: e.elementId, toVisible: true }).catch(() => {});
      await pause(700);
    }
    return e;
  }
  async function tap(predicate: string, timeout = 15_000) {
    const e = await reveal(predicate, timeout);
    await e.click();
    return e;
  }
  async function tapUntil(predicate: string, expected: string) {
    for (let attempt = 0; attempt < 3; attempt++) {
      await tap(predicate);
      if (await el(expected).waitForExist({ timeout: 6_000 }).catch(() => false)) return;
    }
    throw new Error(`Tapped ${predicate} but ${expected} never appeared`);
  }
  async function type(predicate: string, value: string) {
    const e = await reveal(predicate);
    await e.click();
    await e.setValue(value);
  }
  let step = "start";
  let failed: unknown = null;
  try {
    step = "Home";
    await el(`name == "Shop" AND type == "XCUIElementTypeStaticText"`).waitForExist({ timeout: 60_000 });
    await pause(1500);
    await shot("01-home");

    step = "Category";
    await tap(`type == "XCUIElementTypeLink" AND name BEGINSWITH "Men"`);
    await el(`name CONTAINS "results"`).waitForExist({ timeout: 15_000 });
    await pause(1200);
    await shot("02-category");

    step = "Product page";
    await tap(`type == "XCUIElementTypeLink" AND name CONTAINS "$"`);
    await el(`name == "Add to bag"`).waitForExist({ timeout: 15_000 });
    await pause(1200);
    await shot("03-product");

    step = "Add to bag";
    await tap(`type == "XCUIElementTypeOther" AND name IN {"M", "L", "S", "32x32", "M (8)", "6-7Y", "3-6M"} AND enabled == 1`);
    await tap(`name == "Add to bag" AND type == "XCUIElementTypeButton"`);
    await el(`name BEGINSWITH "Added to bag"`).waitForExist({ timeout: 15_000 });
    await pause(1200);
    await shot("04-bag-drawer");

    step = "Bag";
    await tapUntil(`name == "View bag & checkout"`, `name BEGINSWITH "Bag ("`);
    await pause(1200);
    await shot("05-bag");

    step = "Checkout";
    await tapUntil(`name == "Checkout" AND type == "XCUIElementTypeLink"`, `name == "Review your order"`);
    await pause(1000);
    await shot("06-checkout");

    step = "Fill shipping";
    await type(`type == "XCUIElementTypeTextField" AND label == "Email"`, shopper.email);
    await type(`type == "XCUIElementTypeTextField" AND label == "First name"`, shopper.first);
    await type(`type == "XCUIElementTypeTextField" AND label == "Last name"`, shopper.last);
    await type(`type == "XCUIElementTypeTextField" AND label == "Address"`, shopper.address);
    await type(`type == "XCUIElementTypeTextField" AND label == "City"`, shopper.city);
    await tap(`type == "XCUIElementTypeOther" AND name == "State" AND value == "Select"`);
    await pause(600);
    await tap(`name == "${shopper.state}" AND visible == 1`, 10_000);
    await pause(600);
    await type(`type == "XCUIElementTypeTextField" AND label == "ZIP code"`, shopper.zip);

    step = "Fill payment";
    await type(`type == "XCUIElementTypeTextField" AND label == "Card number"`, shopper.card);
    await type(`type == "XCUIElementTypeTextField" AND label == "Name on card"`, `${shopper.first} ${shopper.last}`);
    await type(`type == "XCUIElementTypeTextField" AND label == "Expiry (MM/YY)"`, shopper.expiry);
    await type(`type == "XCUIElementTypeTextField" AND label == "CVV"`, shopper.cvv);
    await driver.execute("mobile: tap", { x: 196, y: 120 }).catch(() => {});
    await pause(800);
    await shot("07-checkout-filled");

    step = "Place order";
    const placeOrder = el(`type == "XCUIElementTypeButton" AND name BEGINSWITH "Place order"`);
    await placeOrder.waitForExist({ timeout: 15_000 });
    await driver.execute("mobile: scroll", { elementId: placeOrder.elementId, toVisible: true }).catch(() => {});
    await driver.execute("mobile: swipe", { direction: "up" }).catch(() => {});
    await pause(800);
    await shot("08-place-order");
    await placeOrder.click();
    await el(`name BEGINSWITH "Thanks,"`).waitForExist({ timeout: 10_000, timeoutMsg: 'Tapped "Place order" but the confirmation screen never appeared' });
    await pause(1500);
    await shot("09-confirmation");
    log("PASS: order placed and confirmed in the Gap Demo iPhone app");
  } catch (err) {
    failed = err;
    await shot("failed").catch(() => {});
    writeFileSync(`${OUT}/page-source.xml`, await driver.getPageSource().catch(() => ""));
    log(`FAIL at step "${step}": ${(err as Error).message}`);
  } finally {
    await pause(1000);
    await driver.deleteSession().catch(() => {});
    await stopRecording(recording);
    appium?.kill();
    log(`Recording: ${OUT}/checkout-iphone.mp4`);
  }
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
