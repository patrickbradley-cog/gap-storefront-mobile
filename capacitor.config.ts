import type { CapacitorConfig } from "@capacitor/cli";

const serverUrl = process.env.CAP_SERVER_URL ?? "http://localhost:3000";

const config: CapacitorConfig = {
  appId: "com.cognition.gapdemo",
  appName: "Gap Demo",
  webDir: "capacitor-www",
  server: {
    url: serverUrl,
    cleartext: true,
  },
  ios: {
    contentInset: "never",
    allowsLinkPreview: false,
    backgroundColor: "#ffffff",
  },
};

export default config;
