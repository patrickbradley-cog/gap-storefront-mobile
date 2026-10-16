import { formatPrice } from "@/lib/format";
import type { Totals } from "@/lib/pricing";

export function OrderSummaryLines({ totals, promoCode }: { totals: Totals; promoCode?: string | null }) {
  return (
    <dl className="space-y-2 text-[14px]">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd data-testid="subtotal">{formatPrice(totals.subtotalCents)}</dd>
      </div>
      {totals.discountCents > 0 && (
        <div className="flex justify-between text-green-700">
          <dt>Promo {promoCode ? `(${promoCode})` : ""}</dt>
          <dd>-{formatPrice(totals.discountCents)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt>Shipping</dt>
        <dd>{totals.shippingCents === 0 ? "Free" : formatPrice(totals.shippingCents)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Estimated tax</dt>
        <dd>{formatPrice(totals.taxCents)}</dd>
      </div>
      <div className="flex justify-between border-t border-gap-line pt-3 text-[15px] font-semibold">
        <dt>Estimated total</dt>
        <dd data-testid="total">{formatPrice(totals.totalCents)}</dd>
      </div>
    </dl>
  );
}
