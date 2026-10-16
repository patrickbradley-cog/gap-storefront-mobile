import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getPool } from "./client";
import { categories, imageUrl, products, promoCodes } from "./seed-data";

async function main() {
  const pool = getPool();
  const schema = readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(schema);
    await client.query(
      "TRUNCATE order_items, orders, product_sizes, product_colors, products, promo_codes, categories RESTART IDENTITY CASCADE"
    );

    for (const c of categories) {
      await client.query(
        `INSERT INTO categories (slug, name, parent_slug, image_url, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [c.slug, c.name, c.parent, `/categories/${c.slug}.svg`, c.sort]
      );
    }

    for (const p of products) {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO products
           (slug, name, category_slug, department, garment, price_cents, compare_at_cents,
            promo_label, badge, is_new, fabric, fit, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         RETURNING id`,
        [
          p.slug,
          p.name,
          p.category,
          p.department,
          p.garment,
          Math.round(p.price * 100),
          p.compareAt ? Math.round(p.compareAt * 100) : null,
          p.promoLabel ?? null,
          p.badge ?? null,
          p.isNew ?? false,
          p.fabric,
          p.fit ?? null,
          p.description,
        ]
      );
      const productId = rows[0].id;
      for (const [i, color] of p.colors.entries()) {
        await client.query(
          `INSERT INTO product_colors (product_id, slug, name, hex, image_url, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            productId,
            color.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            color.name,
            color.hex,
            imageUrl(p.slug, color.name),
            i,
          ]
        );
      }
      for (const [i, size] of p.sizes.entries()) {
        const inStock = !(p.slug.endsWith("jeans") && i === p.sizes.length - 1);
        await client.query(
          `INSERT INTO product_sizes (product_id, label, in_stock, sort_order) VALUES ($1,$2,$3,$4)`,
          [productId, size, inStock, i]
        );
      }
    }

    for (const promo of promoCodes) {
      await client.query(
        `INSERT INTO promo_codes (code, kind, value, description) VALUES ($1,$2,$3,$4)`,
        [promo.code, promo.kind, promo.value, promo.description]
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${categories.length} categories, ${products.length} products, ${promoCodes.length} promo codes.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
