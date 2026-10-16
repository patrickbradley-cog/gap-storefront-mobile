"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { BagIcon, GapLogo, HeartIcon, SearchIcon, UserIcon } from "./icons";

const links = [
  { href: "/c/women", label: "Women" },
  { href: "/c/men", label: "Men" },
  { href: "/c/kids", label: "Kids" },
  { href: "/c/baby", label: "Baby" },
  { href: "/offers", label: "Offers" },
];

export function DesktopHeader() {
  const { count, openDrawer } = useCart();
  return (
    <header className="hidden border-b border-gap-line bg-white md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <Link href="/" aria-label="Home">
          <GapLogo className="h-10 w-10 text-[10px]" />
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <form action="/c/all" className="ml-auto flex h-10 w-72 items-center gap-2 rounded border border-gap-line px-3">
          <SearchIcon width={18} height={18} className="text-gap-muted" />
          <input name="q" placeholder="Search Gap" className="w-full bg-transparent text-sm outline-none" />
        </form>
        <Link href="/account" aria-label="Account">
          <UserIcon />
        </Link>
        <HeartIcon />
        <button type="button" onClick={openDrawer} className="relative" aria-label="Open bag">
          <BagIcon />
          {count > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gap-blue px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
