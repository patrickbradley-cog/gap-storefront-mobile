import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCategoryBySlug, getFilterOptions, listProducts } from "@/server/repositories";
import type { ProductFilters } from "@/server/repositories/types";
import { FilterBar } from "@/components/FilterBar";
import { MobileHeader } from "@/components/MobileHeader";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner } from "@/components/PromoBanner";

export const dynamic = "force-dynamic";

type Params = { slug: string };
type Search = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const DEPARTMENTS: Record<string, string[]> = {
  all: ["Women", "Men", "Girls", "Boys", "Baby"],
  women: ["Women"],
  men: ["Men"],
  kids: ["Girls", "Boys"],
  girls: ["Girls"],
  boys: ["Boys"],
  baby: ["Baby"],
};

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const isAll = slug === "all";
  const category = isAll ? null : await getCategoryBySlug(slug);
  if (!isAll && !category) notFound();

  const filters: ProductFilters = {
    category: isAll ? undefined : slug,
    department: one(sp.department),
    sizes: list(sp.size),
    colors: list(sp.color),
    minPriceCents: one(sp.min) ? Number(one(sp.min)) : undefined,
    maxPriceCents: one(sp.max) ? Number(one(sp.max)) : undefined,
    sort: (one(sp.sort) as ProductFilters["sort"]) ?? "featured",
    search: one(sp.q),
  };

  const [products, options] = await Promise.all([listProducts(filters), getFilterOptions(isAll ? undefined : slug)]);
  const title = category?.name ?? (filters.search ? `Results for “${filters.search}”` : "All products");

  return (
    <div>
      <MobileHeader title={<span>{title}</span>} />
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-6 pt-6 text-sm text-gap-muted">
          <Link href="/">Home</Link> / <span className="text-gap-ink">{title}</span>
        </div>
      </div>
      <PromoBanner tone="black" />
      <div className="mx-auto max-w-6xl md:px-2">
        <Suspense>
          <FilterBar
            options={options}
            resultCount={products.length}
            categoryLabel={category?.name ?? null}
            departments={DEPARTMENTS[slug] ?? DEPARTMENTS.all}
          />
        </Suspense>
        {products.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-gap-muted">No products match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 px-4 pb-8 md:grid-cols-4 md:gap-x-5" data-testid="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
