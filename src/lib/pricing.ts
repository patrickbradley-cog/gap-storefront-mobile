import type { PromoCode } from "@/server/repositories/types";

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard", eta: "5–7 business days", cents: 700, freeOverCents: 5000 },
  { id: "express", label: "Express", eta: "2–3 business days", cents: 1500, freeOverCents: null },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export const TAX_RATE = 0.0825;

export type Totals = {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
};

export function computeTotals(
  subtotalCents: number,
  promo: PromoCode | null,
  shippingMethod: ShippingMethodId = "standard"
): Totals {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0];
  let discountCents = 0;
  if (promo?.kind === "percent") discountCents = Math.round((subtotalCents * promo.value) / 100);
  if (promo?.kind === "fixed") discountCents = Math.min(subtotalCents, promo.value);

  let shippingCents =
    method.freeOverCents != null && subtotalCents >= method.freeOverCents ? 0 : method.cents;
  if (promo?.kind === "free_shipping") shippingCents = 0;

  const taxable = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.round(taxable * TAX_RATE);
  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents: taxable + shippingCents + taxCents,
  };
}
