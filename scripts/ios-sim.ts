import { execFileSync, spawnSync } from "node:child_process";

const DEVICE_NAME = process.env.IOS_SIM_NAME ?? "iPhone 15";
const DEVICE_TYPE = "com.apple.CoreSimulator.SimDeviceType.iPhone-15";
export const BUNDLE_ID = "com.cognition.gapdemo";
export const APP_PATH = "ios/build/Build/Products/Debug-iphonesimulator/App.app";

type SimDevice = { udid: string; name: string; state: string; isAvailable: boolean; deviceTypeIdentifier: string };

function simctl(...args: string[]) {
  return execFileSync("xcrun", ["simctl", ...args], { encoding: "utf8" });
}

function listDevices(): SimDevice[] {
  const json = JSON.parse(simctl("list", "devices", "available", "-j")) as { devices: Record<string, SimDevice[]> };
  return Object.values(json.devices).flat();
}

export function ensureSimulator(): string {
  if (process.env.IOS_SIM_UDID) return process.env.IOS_SIM_UDID;
  let device = listDevices().find((d) => d.name === DEVICE_NAME) ?? listDevices().find((d) => d.deviceTypeIdentifier === DEVICE_TYPE);
  if (!device) {
    const runtime = JSON.parse(simctl("list", "runtimes", "-j")).runtimes.filter((r: { platform: string; isAvailable: boolean }) => r.platform === "iOS" && r.isAvailable).at(-1);
    const udid = simctl("create", DEVICE_NAME, DEVICE_TYPE, runtime.identifier).trim();
    device = { udid, name: DEVICE_NAME, state: "Shutdown", isAvailable: true, deviceTypeIdentifier: DEVICE_TYPE };
  }
  if (device.state !== "Booted") {
    spawnSync("xcrun", ["simctl", "boot", device.udid], { stdio: "ignore" });
    simctl("bootstatus", device.udid, "-b");
  }
  spawnSync("open", ["-a", "Simulator", "--args", "-CurrentDeviceUDID", device.udid], { stdio: "ignore" });
  spawnSync("xcrun", ["simctl", "status_bar", device.udid, "override", "--time", "9:41", "--dataNetwork", "wifi", "--wifiMode", "active", "--wifiBars", "3", "--batteryState", "charged", "--batteryLevel", "100"], { stdio: "ignore" });
  return device.udid;
}

export function installAndLaunch(udid: string) {
  spawnSync("xcrun", ["simctl", "uninstall", udid, BUNDLE_ID], { stdio: "ignore" });
  simctl("install", udid, APP_PATH);
  spawnSync("xcrun", ["simctl", "terminate", udid, BUNDLE_ID], { stdio: "ignore" });
  simctl("launch", udid, BUNDLE_ID);
}

if (process.argv[1]?.endsWith("ios-sim.ts")) {
  const udid = ensureSimulator();
  installAndLaunch(udid);
  console.log(`Launched ${BUNDLE_ID} on ${udid}`);
}
