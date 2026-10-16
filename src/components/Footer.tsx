"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const onCheckout = pathname.startsWith("/checkout");

  return (
    <footer
      className={`mt-12 border-t border-gap-line bg-gap-gray px-5 pb-28 pt-8 text-xs text-gap-muted md:pb-10 ${
        onCheckout ? "hidden md:block" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl space-y-3">
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-medium text-gap-ink">
          <span>Customer Service</span>
          <span>Shipping &amp; Returns</span>
          <span>Store Locator</span>
          <span>Gift Cards</span>
        </div>
        <p>© {new Date().getFullYear()} Gap Storefront Demo.</p>
        <p className="font-medium">Demo app, not affiliated with Gap.</p>
      </div>
    </footer>
  );
}
