import { NextResponse } from "next/server";
import { createOrder, findActivePromo, getProductsByIds } from "@/server/repositories";
import { computeTotals, SHIPPING_METHODS, type ShippingMethodId } from "@/lib/pricing";

type Body = {
  email?: string;
  shipping?: Record<string, string | undefined>;
  shippingMethod?: string;
  payment?: { cardNumber?: string; nameOnCard?: string; expiry?: string; cvv?: string };
  promoCode?: string | null;
  items?: { productId: number; colorName: string; sizeLabel: string; imageUrl: string; quantity: number }[];
};

const required = ["firstName", "lastName", "address1", "city", "state", "zip"] as const;

function cardBrand(number: string) {
  if (/^4/.test(number)) return "Visa";
  if (/^5[1-5]/.test(number)) return "Mastercard";
  if (/^3[47]/.test(number)) return "Amex";
  return "Card";
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const errors: string[] = [];

  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) errors.push("A valid email is required.");
  for (const key of required) if (!body.shipping?.[key]?.trim()) errors.push(`Shipping ${key} is required.`);
  const digits = (body.payment?.cardNumber ?? "").replace(/\s+/g, "");
  if (!/^\d{15,16}$/.test(digits)) errors.push("Card number must be 15–16 digits.");
  if (!body.payment?.expiry) errors.push("Card expiry is required.");
  if (!/^\d{3,4}$/.test(body.payment?.cvv ?? "")) errors.push("CVV is required.");
  if (!body.items?.length) errors.push("Your bag is empty.");
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  const products = await getProductsByIds(body.items!.map((i) => i.productId));
  const items = body.items!.map((i) => {
    const p = products.find((x) => x.id === i.productId);
    if (!p) throw new Error(`Unknown product ${i.productId}`);
    return {
      productId: p.id,
      productName: p.name,
      colorName: i.colorName,
      sizeLabel: i.sizeLabel,
      imageUrl: i.imageUrl,
      quantity: Math.max(1, Math.floor(i.quantity)),
      unitPriceCents: p.priceCents,
    };
  });

  const promo = body.promoCode ? await findActivePromo(body.promoCode) : null;
  const shippingMethod = (SHIPPING_METHODS.some((m) => m.id === body.shippingMethod) ? body.shippingMethod : "standard") as ShippingMethodId;
  const subtotalCents = items.reduce((n, i) => n + i.quantity * i.unitPriceCents, 0);
  const totals = computeTotals(subtotalCents, promo, shippingMethod);

  const order = await createOrder({
    email: body.email!,
    shipping: {
      firstName: body.shipping!.firstName!,
      lastName: body.shipping!.lastName!,
      address1: body.shipping!.address1!,
      address2: body.shipping!.address2,
      city: body.shipping!.city!,
      state: body.shipping!.state!,
      zip: body.shipping!.zip!,
      phone: body.shipping!.phone,
    },
    shippingMethod,
    payment: { brand: cardBrand(digits), last4: digits.slice(-4) },
    promoCode: promo?.code ?? null,
    ...totals,
    items,
  });

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}
