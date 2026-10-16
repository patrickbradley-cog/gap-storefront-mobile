"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function BagLineItem({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { updateQuantity, removeItem } = useCart();
  return (
    <li className="flex gap-4 py-4" data-testid="bag-item">
      <Link href={`/p/${item.slug}`} className="block w-24 shrink-0 overflow-hidden rounded bg-gap-gray">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.name} className="aspect-[3/4] w-full object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="mt-0.5 text-xs text-gap-muted">
              Color: {item.colorName} · Size: {item.sizeLabel}
            </p>
            {item.promoLabel && <p className="mt-0.5 text-xs text-gap-muted">{item.promoLabel}</p>}
          </div>
          <p className="text-sm font-semibold">{formatPrice(item.unitPriceCents * item.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded border border-gap-line" aria-label={`Quantity for ${item.name}`}>
            <button
              type="button"
              className="h-9 w-9 text-lg leading-none"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium" data-testid="qty">
              {item.quantity}
            </span>
            <button
              type="button"
              className="h-9 w-9 text-lg leading-none"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
            >
              +
            </button>
          </div>
          {!compact && (
            <button type="button" className="text-xs font-medium underline" onClick={() => removeItem(item.key)}>
              Remove
            </button>
          )}
          {compact && (
            <button type="button" className="text-xs font-medium underline" onClick={() => removeItem(item.key)}>
              Remove
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
