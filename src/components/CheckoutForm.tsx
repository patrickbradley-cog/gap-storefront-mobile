"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { computeTotals, SHIPPING_METHODS, type ShippingMethodId } from "@/lib/pricing";
import { ChevronDownIcon, LockIcon } from "./icons";
import { OrderSummaryLines } from "./OrderSummaryLines";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const inputClass =
  "h-12 w-full rounded-sm border border-gap-line bg-white px-3 text-[15px] outline-none focus:border-gap-ink";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] text-gap-muted">
        {label}
        {!required && " (optional)"}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={inputClass}
      />
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotalCents, promo, clear, ready } = useCart();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("standard");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const totals = computeTotals(subtotalCents, promo, shippingMethod);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => String(form.get(k) ?? "").trim();
    setSubmitting(true);
    setErrors([]);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: get("email"),
          shipping: {
            firstName: get("firstName"),
            lastName: get("lastName"),
            address1: get("address1"),
            address2: get("address2"),
            city: get("city"),
            state: get("state"),
            zip: get("zip"),
            phone: get("phone"),
          },
          shippingMethod,
          payment: {
            cardNumber: get("cardNumber"),
            nameOnCard: get("nameOnCard"),
            expiry: get("expiry"),
            cvv: get("cvv"),
          },
          promoCode: promo?.code ?? null,
          items: items.map((i) => ({
            productId: i.productId,
            colorName: i.colorName,
            sizeLabel: i.sizeLabel,
            imageUrl: i.imageUrl,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? [data.error ?? "Something went wrong."]);
        return;
      }
      clear();
      router.push(`/checkout/confirmation/${data.orderNumber}`);
    } catch {
      setErrors(["We couldn’t reach the server. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  }

  if (ready && items.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-base font-medium">Your bag is empty</p>
        <Link href="/" className="mt-4 inline-block rounded-sm bg-gap-blue px-6 py-3 text-sm font-semibold text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-6xl md:grid md:grid-cols-[1fr_380px] md:gap-12 md:px-6 md:pt-8" noValidate>
      <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+7rem)] md:px-0 md:pb-12">
        <h1 className="hidden text-2xl font-semibold md:block">Checkout</h1>

        <section className="pt-4">
          <h2 className="text-[15px] font-semibold">Contact</h2>
          <div className="mt-3">
            <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">Shipping address</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="First name" name="firstName" autoComplete="given-name" />
            <Field label="Last name" name="lastName" autoComplete="family-name" />
            <div className="col-span-2">
              <Field label="Address" name="address1" autoComplete="address-line1" />
            </div>
            <div className="col-span-2">
              <Field label="Apt, suite, etc." name="address2" autoComplete="address-line2" required={false} />
            </div>
            <Field label="City" name="city" autoComplete="address-level2" />
            <label className="block">
              <span className="mb-1 block text-[13px] text-gap-muted">State</span>
              <select name="state" required defaultValue="" autoComplete="address-level1" className={inputClass}>
                <option value="" disabled>
                  Select
                </option>
                {US_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <Field label="ZIP code" name="zip" autoComplete="postal-code" inputMode="numeric" maxLength={10} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required={false} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-[15px] font-semibold">Shipping method</h2>
          <div className="mt-3 divide-y divide-gap-line rounded-sm border border-gap-line">
            {SHIPPING_METHODS.map((m) => {
              const free = m.freeOverCents != null && subtotalCents >= m.freeOverCents;
              return (
                <label key={m.id} className="flex items-center gap-3 px-3 py-3.5 text-[14px]">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={m.id}
                    checked={shippingMethod === m.id}
                    onChange={() => setShippingMethod(m.id)}
                    className="h-5 w-5 accent-gap-blue"
                  />
                  <span className="flex-1">
                    <span className="font-medium">{m.label}</span>
                    <span className="block text-[12px] text-gap-muted">{m.eta}</span>
                  </span>
                  <span className="font-medium">{free ? "Free" : formatPrice(m.cents)}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Payment</h2>
            <span className="flex items-center gap-1 text-[12px] text-gap-muted">
              <LockIcon width={14} height={14} /> Secure
            </span>
          </div>
          <p className="mt-1 text-[12px] text-gap-muted">Demo checkout — use any test card, e.g. 4242 4242 4242 4242.</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Card number" name="cardNumber" autoComplete="cc-number" inputMode="numeric" placeholder="1234 1234 1234 1234" maxLength={19} />
            </div>
            <div className="col-span-2">
              <Field label="Name on card" name="nameOnCard" autoComplete="cc-name" />
            </div>
            <Field label="Expiry (MM/YY)" name="expiry" autoComplete="cc-exp" placeholder="MM/YY" inputMode="numeric" maxLength={5} />
            <Field label="CVV" name="cvv" autoComplete="cc-csc" inputMode="numeric" maxLength={4} />
          </div>
        </section>

        <section className="mt-8" data-testid="order-review">
          <h2 className="text-[15px] font-semibold">Review your order</h2>
          <ul className="mt-3 divide-y divide-gap-line">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imageUrl} alt="" className="h-20 w-15 shrink-0 rounded-sm bg-gap-gray object-cover" />
                <div className="min-w-0 flex-1 text-[13px]">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-gap-muted">
                    {item.colorName} · {item.sizeLabel} · Qty {item.quantity}
                  </p>
                </div>
                <span className="text-[13px] font-medium">{formatPrice(item.unitPriceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </section>

        {errors.length > 0 && (
          <ul className="mt-6 space-y-1 rounded-sm border border-red-300 bg-red-50 p-3 text-[13px] text-red-800" role="alert">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <p className="mb-3 text-center text-[12px] text-gap-muted">
            By placing your order you agree to the demo terms. No real payment is taken.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-gap-blue py-4 text-[15px] font-semibold text-white disabled:opacity-60"
            data-testid="place-order"
          >
            <LockIcon width={18} height={18} />
            {submitting ? "Placing order…" : `Place order · ${formatPrice(totals.totalCents)}`}
          </button>
        </div>
      </div>

      <aside className="hidden md:block">
        <div className="sticky top-24 rounded-sm border border-gap-line p-5">
          <h2 className="text-[15px] font-semibold">Order summary</h2>
          <div className="mt-4">
            <OrderSummaryLines totals={totals} promoCode={promo?.code} />
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gap-line bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.08)] md:hidden" data-testid="checkout-summary-bar">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
        >
          <span className="text-[13px] text-gap-muted">
            {items.length} item{items.length === 1 ? "" : "s"} · {summaryOpen ? "Hide" : "View"} summary
          </span>
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            {formatPrice(totals.totalCents)}
            <ChevronDownIcon className={`transition-transform ${summaryOpen ? "" : "rotate-180"}`} />
          </span>
        </button>
        {summaryOpen && (
          <div className="border-t border-gap-line px-4 py-3">
            <OrderSummaryLines totals={totals} promoCode={promo?.code} />
          </div>
        )}
        <div className="safe-bottom" />
      </div>
    </form>
  );
}
