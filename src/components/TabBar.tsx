"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { BagIcon, GapLogo, MenuIcon, TagIcon, UserIcon } from "./icons";

const tabs = [
  { href: "/", label: "Shop", Icon: MenuIcon, match: (p: string) => p === "/" || p.startsWith("/c/") || p.startsWith("/p/") },
  { href: "/offers", label: "Offers", Icon: TagIcon, match: (p: string) => p.startsWith("/offers") },
  { href: "/bag", label: "Bag", Icon: BagIcon, match: (p: string) => p.startsWith("/bag") },
  { href: "/account", label: "Account", Icon: UserIcon, match: (p: string) => p.startsWith("/account") },
];

export function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();
  if (pathname.startsWith("/checkout")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),12px)] md:hidden"
    >
      <div className="flex w-full max-w-[380px] items-center gap-1 rounded-full bg-white/95 p-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 backdrop-blur">
        <Link href="/" className="pl-1" aria-label="Home">
          <GapLogo className="h-11 w-11 text-[11px]" />
        </Link>
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium ${
                active ? "bg-[#e4e9f7] text-gap-ink" : "text-gap-ink"
              }`}
            >
              <Icon width={22} height={22} />
              <span>{label}</span>
              {label === "Bag" && count > 0 && (
                <span
                  data-testid="bag-count"
                  className="absolute right-3 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gap-blue px-1 text-[10px] font-semibold text-white"
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
