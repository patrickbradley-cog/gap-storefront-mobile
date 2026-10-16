import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/server/repositories";
import { formatPrice } from "@/lib/format";
import { OrderSummaryLines } from "@/components/OrderSummaryLines";
import { CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 md:pt-16" data-testid="confirmation">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
          <CheckIcon width={28} height={28} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Thanks, {order.shipping.firstName}!</h1>
        <p className="mt-2 text-[15px] text-gap-muted">Your order is confirmed.</p>
        <p className="mt-1 text-[15px]">
          Order number <span className="font-semibold" data-testid="order-number">{order.orderNumber}</span>
        </p>
        <p className="mt-1 text-[13px] text-gap-muted">A confirmation email is on its way to {order.email}.</p>
      </div>

      <section className="mt-8 rounded-sm border border-gap-line p-4">
        <h2 className="text-[15px] font-semibold">Items</h2>
        <ul className="mt-2 divide-y divide-gap-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt="" className="h-20 w-15 rounded-sm bg-gap-gray object-cover" />
              <div className="min-w-0 flex-1 text-[13px]">
                <p className="truncate font-medium">{item.productName}</p>
                <p className="text-gap-muted">
                  {item.colorName} · {item.sizeLabel} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-[13px] font-medium">{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-gap-line p-4 text-[13px]">
          <h2 className="text-[15px] font-semibold">Shipping to</h2>
          <p className="mt-2">
            {order.shipping.firstName} {order.shipping.lastName}
            <br />
            {order.shipping.address1}
            {order.shipping.address2 ? `, ${order.shipping.address2}` : ""}
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
          </p>
          <p className="mt-2 text-gap-muted">
            {order.shippingMethod === "express" ? "Express" : "Standard"} shipping · {order.payment.brand} ending in {order.payment.last4}
          </p>
        </div>
        <div className="rounded-sm border border-gap-line p-4">
          <h2 className="text-[15px] font-semibold">Summary</h2>
          <div className="mt-2">
            <OrderSummaryLines totals={order} promoCode={order.promoCode} />
          </div>
        </div>
      </section>

      <Link href="/" className="mt-8 block w-full rounded-sm bg-gap-blue py-4 text-center text-[15px] font-semibold text-white">
        Continue shopping
      </Link>
    </div>
  );
}
