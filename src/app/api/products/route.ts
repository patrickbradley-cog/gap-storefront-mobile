import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/server/repositories";
import type { ProductFilters } from "@/server/repositories/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: ProductFilters = {
    category: sp.get("category") ?? undefined,
    department: sp.get("department") ?? undefined,
    sizes: sp.getAll("size"),
    colors: sp.getAll("color"),
    minPriceCents: sp.get("min") ? Number(sp.get("min")) : undefined,
    maxPriceCents: sp.get("max") ? Number(sp.get("max")) : undefined,
    sort: (sp.get("sort") as ProductFilters["sort"]) ?? "featured",
    search: sp.get("q") ?? undefined,
  };
  const products = await listProducts(filters);
  return NextResponse.json({ products });
}
