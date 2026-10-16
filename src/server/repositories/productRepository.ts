import { query, queryOne } from "../db/client";
import type { Product, ProductColor, ProductFilters, ProductSize, ProductSummary } from "./types";

type SummaryRow = {
  id: number;
  slug: string;
  name: string;
  category_slug: string;
  department: string;
  price_cents: number;
  compare_at_cents: number | null;
  promo_label: string | null;
  badge: string | null;
  is_new: boolean;
  colors: ProductColor[];
};

type DetailRow = SummaryRow & {
  garment: string;
  fabric: string | null;
  fit: string | null;
  description: string;
  sizes: ProductSize[];
};

const SUMMARY_SELECT = `
  SELECT p.id, p.slug, p.name, p.category_slug, p.department, p.price_cents,
         p.compare_at_cents, p.promo_label, p.badge, p.is_new,
         COALESCE(
           (SELECT json_agg(json_build_object(
                     'slug', c.slug, 'name', c.name, 'hex', c.hex, 'imageUrl', c.image_url)
                   ORDER BY c.sort_order)
              FROM product_colors c WHERE c.product_id = p.id),
           '[]'::json) AS colors
  FROM products p
`;

function toSummary(r: SummaryRow): ProductSummary {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    categorySlug: r.category_slug,
    department: r.department,
    priceCents: r.price_cents,
    compareAtCents: r.compare_at_cents,
    promoLabel: r.promo_label,
    badge: r.badge,
    isNew: r.is_new,
    imageUrl: r.colors[0]?.imageUrl ?? "",
    colors: r.colors,
  };
}

export async function listProducts(filters: ProductFilters = {}): Promise<ProductSummary[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  const add = (value: unknown) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (filters.category) {
    where.push(
      `(p.category_slug = ${add(filters.category)} OR p.category_slug IN
         (SELECT slug FROM categories WHERE parent_slug = ${add(filters.category)}))`
    );
  }
  if (filters.department) where.push(`p.department = ${add(filters.department)}`);
  if (filters.sizes?.length) {
    where.push(
      `EXISTS (SELECT 1 FROM product_sizes s WHERE s.product_id = p.id AND s.label = ANY(${add(filters.sizes)}))`
    );
  }
  if (filters.colors?.length) {
    where.push(
      `EXISTS (SELECT 1 FROM product_colors c WHERE c.product_id = p.id AND c.slug = ANY(${add(filters.colors)}))`
    );
  }
  if (filters.minPriceCents != null) where.push(`p.price_cents >= ${add(filters.minPriceCents)}`);
  if (filters.maxPriceCents != null) where.push(`p.price_cents <= ${add(filters.maxPriceCents)}`);
  if (filters.search) where.push(`p.name ILIKE ${add(`%${filters.search}%`)}`);

  const orderBy = {
    featured: "p.is_new DESC, p.badge IS NULL, p.id",
    "price-asc": "p.price_cents ASC, p.id",
    "price-desc": "p.price_cents DESC, p.id",
    newest: "p.is_new DESC, p.created_at DESC, p.id",
  }[filters.sort ?? "featured"];

  const sql = `${SUMMARY_SELECT} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${orderBy}`;
  const rows = await query<SummaryRow>(sql, params);
  return rows.map(toSummary);
}

export async function listFeaturedProducts(limit = 8): Promise<ProductSummary[]> {
  const rows = await query<SummaryRow>(
    `${SUMMARY_SELECT} WHERE p.is_new OR p.badge IS NOT NULL ORDER BY p.is_new DESC, p.id LIMIT $1`,
    [limit]
  );
  return rows.map(toSummary);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await queryOne<DetailRow>(
    `SELECT p.garment, p.fabric, p.fit, p.description,
            COALESCE(
              (SELECT json_agg(json_build_object('label', s.label, 'inStock', s.in_stock) ORDER BY s.sort_order)
                 FROM product_sizes s WHERE s.product_id = p.id),
              '[]'::json) AS sizes,
            base.*
     FROM (${SUMMARY_SELECT} WHERE p.slug = $1) base
     JOIN products p ON p.id = base.id`,
    [slug]
  );
  if (!row) return null;
  return {
    ...toSummary(row),
    garment: row.garment,
    fabric: row.fabric,
    fit: row.fit,
    description: row.description,
    sizes: row.sizes,
  };
}

export async function getProductsByIds(ids: number[]): Promise<ProductSummary[]> {
  if (!ids.length) return [];
  const rows = await query<SummaryRow>(`${SUMMARY_SELECT} WHERE p.id = ANY($1)`, [ids]);
  return rows.map(toSummary);
}

export type FilterOptions = {
  sizes: string[];
  colors: { slug: string; name: string; hex: string }[];
  priceRange: { minCents: number; maxCents: number };
};

export async function getFilterOptions(category?: string): Promise<FilterOptions> {
  const params: unknown[] = [];
  let scope = "";
  if (category) {
    params.push(category);
    scope = `WHERE p.category_slug = $1 OR p.category_slug IN (SELECT slug FROM categories WHERE parent_slug = $1)`;
  }
  const sizes = await query<{ label: string }>(
    `SELECT DISTINCT s.label, MIN(s.sort_order) AS o FROM product_sizes s
     JOIN products p ON p.id = s.product_id ${scope} GROUP BY s.label ORDER BY o`,
    params
  );
  const colors = await query<{ slug: string; name: string; hex: string }>(
    `SELECT DISTINCT ON (c.slug) c.slug, c.name, c.hex FROM product_colors c
     JOIN products p ON p.id = c.product_id ${scope} ORDER BY c.slug`,
    params
  );
  const range = await queryOne<{ min: number; max: number }>(
    `SELECT MIN(p.price_cents) AS min, MAX(p.price_cents) AS max FROM products p ${scope}`,
    params
  );
  return {
    sizes: sizes.map((s) => s.label),
    colors,
    priceRange: { minCents: range?.min ?? 0, maxCents: range?.max ?? 0 },
  };
}
