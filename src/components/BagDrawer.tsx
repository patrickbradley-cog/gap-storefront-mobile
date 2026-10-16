"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "./icons";
import { BagLineItem } from "./BagLineItem";

export function BagDrawer() {
  const { drawerOpen, closeDrawer, items, count, subtotalCents } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your bag" data-testid="bag-drawer">
      <button type="button" aria-label="Close bag" className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:w-[420px] md:max-h-none md:rounded-none">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gap-line md:hidden" />
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-base font-semibold">
            Added to bag <span className="font-normal text-gap-muted">({count})</span>
          </h2>
          <button type="button" onClick={closeDrawer} aria-label="Close" className="p-1">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-gap-muted">Your bag is empty.</p>
          ) : (
            <ul className="divide-y divide-gap-line">
              {items.map((item) => (
                <BagLineItem key={item.key} item={item} compact />
              ))}
            </ul>
          )}
        </div>
        <div className="safe-bottom border-t border-gap-line px-5 pb-4 pt-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotalCents)}</span>
          </div>
          <Link
            href="/bag"
            onClick={closeDrawer}
            data-testid="drawer-view-bag"
            className="block w-full rounded bg-gap-blue py-3.5 text-center text-sm font-semibold text-white"
          >
            View bag &amp; checkout
          </Link>
          <button type="button" onClick={closeDrawer} className="mt-3 w-full py-2 text-center text-sm font-medium underline">
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
