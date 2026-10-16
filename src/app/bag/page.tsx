"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { computeTotals } from "@/lib/pricing";
import { BagLineItem } from "@/components/BagLineItem";
import { MobileHeader } from "@/components/MobileHeader";
import { OrderSummaryLines } from "@/components/OrderSummaryLines";
import { PromoCodeField } from "@/components/PromoCodeField";
import { LockIcon } from "@/components/icons";

export default function BagPage() {
  const { items, count, subtotalCents, promo, ready } = useCart();
  const totals = computeTotals(subtotalCents, promo);

  return (
    <div>
      <MobileHeader title={`Bag${count ? ` (${count})` : ""}`} back={false} actions={<span />} />
      <div className="mx-auto max-w-6xl px-4 md:grid md:grid-cols-[1fr_360px] md:gap-10 md:px-6 md:pt-8">
        <section>
          <h1 className="hidden text-2xl font-semibold md:block">Your bag ({count})</h1>
          {!ready ? null : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-base font-medium">Your bag is empty</p>
              <Link href="/" className="mt-4 inline-block rounded-sm bg-gap-blue px-6 py-3 text-sm font-semibold text-white">
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gap-line" data-testid="bag-items">
              {items.map((item) => (
                <BagLineItem key={item.key} item={item} />
              ))}
            </ul>
          )}
        </section>

        {items.length > 0 && (
          <aside className="mt-4 space-y-5 border-t border-gap-line pt-5 md:mt-0 md:border-0 md:pt-0">
            <PromoCodeField />
            <OrderSummaryLines totals={totals} promoCode={promo?.code} />
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-gap-blue py-4 text-[15px] font-semibold text-white"
              data-testid="checkout-button"
            >
              <LockIcon width={18} height={18} /> Checkout
            </Link>
            <p className="text-center text-[12px] text-gap-muted">Promotions and shipping are applied at checkout.</p>
          </aside>
        )}
      </div>
    </div>
  );
}
