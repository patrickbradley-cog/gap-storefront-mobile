import { query, queryOne } from "../db/client";
import type { Category } from "./types";

type Row = {
  id: number;
  slug: string;
  name: string;
  parent_slug: string | null;
  image_url: string | null;
};

const toCategory = (r: Row): Category => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  parentSlug: r.parent_slug,
  imageUrl: r.image_url,
});

export async function listCategories(): Promise<Category[]> {
  const rows = await query<Row>(
    `SELECT id, slug, name, parent_slug, image_url FROM categories ORDER BY sort_order`
  );
  return rows.map(toCategory);
}

export async function listTopLevelCategories(): Promise<Category[]> {
  const rows = await query<Row>(
    `SELECT id, slug, name, parent_slug, image_url FROM categories
     WHERE parent_slug IS NULL ORDER BY sort_order`
  );
  return rows.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await queryOne<Row>(
    `SELECT id, slug, name, parent_slug, image_url FROM categories WHERE slug = $1`,
    [slug]
  );
  return row ? toCategory(row) : null;
}
