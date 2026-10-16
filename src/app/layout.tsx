import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { TabBar } from "@/components/TabBar";
import { DesktopHeader } from "@/components/DesktopHeader";
import { BagDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gap Storefront Demo",
  description: "Mobile-first demo storefront. Demo app, not affiliated with Gap.",
  appleWebApp: { capable: true, title: "Gap Demo", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <CartProvider>
          <DesktopHeader />
          <main className="min-h-dvh">{children}</main>
          <Footer />
          <TabBar />
          <BagDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
