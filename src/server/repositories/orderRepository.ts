import { getPool, query, queryOne } from "../db/client";
import type { NewOrder, Order } from "./types";

type OrderRow = {
  id: number;
  order_number: string;
  status: string;
  email: string;
  ship_first_name: string;
  ship_last_name: string;
  ship_address1: string;
  ship_address2: string | null;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_phone: string | null;
  shipping_method: string;
  payment_brand: string;
  payment_last4: string;
  promo_code: string | null;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  created_at: string;
};

type ItemRow = {
  product_id: number;
  product_name: string;
  color_name: string;
  size_label: string;
  image_url: string;
  quantity: number;
  unit_price_cents: number;
};

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(3, "0");
  return `GP-${stamp}${rand}`;
}

export async function createOrder(order: NewOrder): Promise<Order> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const orderNumber = generateOrderNumber();
    const { rows } = await client.query<{ id: number; created_at: string }>(
      `INSERT INTO orders
         (order_number, email, ship_first_name, ship_last_name, ship_address1, ship_address2,
          ship_city, ship_state, ship_zip, ship_phone, shipping_method, payment_brand, payment_last4,
          promo_code, subtotal_cents, discount_cents, shipping_cents, tax_cents, total_cents)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       RETURNING id, created_at`,
      [
        orderNumber,
        order.email,
        order.shipping.firstName,
        order.shipping.lastName,
        order.shipping.address1,
        order.shipping.address2 ?? null,
        order.shipping.city,
        order.shipping.state,
        order.shipping.zip,
        order.shipping.phone ?? null,
        order.shippingMethod,
        order.payment.brand,
        order.payment.last4,
        order.promoCode ?? null,
        order.subtotalCents,
        order.discountCents,
        order.shippingCents,
        order.taxCents,
        order.totalCents,
      ]
    );
    const id = rows[0].id;
    for (const item of order.items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, color_name, size_label, image_url, quantity, unit_price_cents)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          id,
          item.productId,
          item.productName,
          item.colorName,
          item.sizeLabel,
          item.imageUrl,
          item.quantity,
          item.unitPriceCents,
        ]
      );
    }
    await client.query("COMMIT");
    return { ...order, id, orderNumber, status: "placed", createdAt: rows[0].created_at };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const row = await queryOne<OrderRow>(`SELECT * FROM orders WHERE order_number = $1`, [orderNumber]);
  if (!row) return null;
  const items = await query<ItemRow>(
    `SELECT product_id, product_name, color_name, size_label, image_url, quantity, unit_price_cents
     FROM order_items WHERE order_id = $1 ORDER BY id`,
    [row.id]
  );
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    createdAt: row.created_at,
    email: row.email,
    shipping: {
      firstName: row.ship_first_name,
      lastName: row.ship_last_name,
      address1: row.ship_address1,
      address2: row.ship_address2 ?? undefined,
      city: row.ship_city,
      state: row.ship_state,
      zip: row.ship_zip,
      phone: row.ship_phone ?? undefined,
    },
    shippingMethod: row.shipping_method,
    payment: { brand: row.payment_brand, last4: row.payment_last4 },
    promoCode: row.promo_code,
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    shippingCents: row.shipping_cents,
    taxCents: row.tax_cents,
    totalCents: row.total_cents,
    items: items.map((i) => ({
      productId: i.product_id,
      productName: i.product_name,
      colorName: i.color_name,
      sizeLabel: i.size_label,
      imageUrl: i.image_url,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
    })),
  };
}
