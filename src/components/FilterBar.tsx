"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { FilterOptions } from "@/server/repositories/productRepository";
import { formatPrice } from "@/lib/format";
import { ChevronRightIcon, CloseIcon, GridIcon } from "./icons";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const PRICE_BUCKETS = [
  { label: "Under $25", min: 0, max: 2499 },
  { label: "$25 – $50", min: 2500, max: 5000 },
  { label: "$50 – $75", min: 5001, max: 7500 },
  { label: "$75+", min: 7501, max: 100000 },
];

export function FilterBar({
  options,
  resultCount,
  categoryLabel,
  departments,
}: {
  options: FilterOptions;
  resultCount: number;
  categoryLabel: string | null;
  departments: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  const selectedSizes = params.getAll("size");
  const selectedColors = params.getAll("color");
  const department = params.get("department");
  const sort = params.get("sort") ?? "featured";
  const minPrice = params.get("min");
  const maxPrice = params.get("max");

  const activeCount =
    selectedSizes.length + selectedColors.length + (department ? 1 : 0) + (minPrice || maxPrice ? 1 : 0) + (sort !== "featured" ? 1 : 0);

  function update(mutate: (p: URLSearchParams) => void) {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function toggleMulti(key: string, value: string) {
    update((p) => {
      const values = p.getAll(key);
      p.delete(key);
      const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      next.forEach((v) => p.append(key, v));
    });
  }

  function clearAll() {
    router.replace(pathname, { scroll: false });
  }

  const chip = "shrink-0 rounded-sm border border-gap-ink/50 bg-white px-3 py-2 text-[13px] font-medium";

  return (
    <>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        <button type="button" className={`${chip} flex items-center gap-1.5`} onClick={() => setOpen(true)} data-testid="filter-sort">
          Filter &amp; Sort
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center bg-gap-blue px-1 text-[11px] text-white">{activeCount}</span>
          )}
        </button>
        {["Department", "Size", "Color", "Price"].map((s) => (
          <button
            key={s}
            type="button"
            className={chip}
            onClick={() => {
              setSection(s);
              setOpen(true);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel && (
            <span className="inline-flex items-center gap-2 bg-gap-gray px-2.5 py-1.5 text-[13px]" data-testid="applied-category">
              {categoryLabel}
              <Link href="/c/all" aria-label={`Remove ${categoryLabel} filter`}>
                <CloseIcon width={14} height={14} />
              </Link>
            </span>
          )}
          {department && (
            <button type="button" className="inline-flex items-center gap-2 bg-gap-gray px-2.5 py-1.5 text-[13px]" onClick={() => update((p) => p.delete("department"))}>
              {department}
              <CloseIcon width={14} height={14} />
            </button>
          )}
          {selectedSizes.map((s) => (
            <button key={s} type="button" className="inline-flex items-center gap-2 bg-gap-gray px-2.5 py-1.5 text-[13px]" onClick={() => toggleMulti("size", s)}>
              {s}
              <CloseIcon width={14} height={14} />
            </button>
          ))}
          <span className="text-[13px] text-gap-muted" data-testid="result-count">
            {resultCount} results
          </span>
        </div>
        <GridIcon width={20} height={20} className="text-gap-muted" />
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filter and sort">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-2xl bg-white md:inset-y-0 md:left-auto md:right-0 md:w-[420px] md:max-h-none md:rounded-none">
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gap-line md:hidden" />
            <div className="flex items-center justify-between border-b border-gap-line px-4 py-4">
              {section ? (
                <button type="button" className="text-[15px] font-medium" onClick={() => setSection(null)}>
                  ‹ {section}
                </button>
              ) : (
                <h2 className="text-[15px] font-medium">Filter &amp; Sort {activeCount > 0 && `(${activeCount})`}</h2>
              )}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              {!section && (
                <>
                  <div className="flex items-center justify-between border-b border-gap-line py-5">
                    <span className="text-xl">Store pickup</span>
                    <span className="h-7 w-12 rounded-full bg-gap-line p-1">
                      <span className="block h-5 w-5 rounded-full bg-white shadow" />
                    </span>
                  </div>
                  {[
                    ["Sort By", SORTS.find((s) => s.value === sort)?.label],
                    ["Department", department],
                    ["Size", selectedSizes.join(", ")],
                    ["Color", selectedColors.length ? `${selectedColors.length} selected` : ""],
                    ["Price", minPrice || maxPrice ? PRICE_BUCKETS.find((b) => String(b.min) === minPrice)?.label : ""],
                  ].map(([label, value]) => (
                    <button
                      key={label}
                      type="button"
                      className="flex w-full items-center justify-between border-b border-gap-line py-5 text-left"
                      onClick={() => setSection(label as string)}
                    >
                      <span className="text-xl">{label}</span>
                      <span className="flex items-center gap-2 text-sm text-gap-muted">
                        {value}
                        <ChevronRightIcon className="text-gap-ink" />
                      </span>
                    </button>
                  ))}
                </>
              )}

              {section === "Sort By" && (
                <ul className="py-2">
                  {SORTS.map((s) => (
                    <li key={s.value}>
                      <label className="flex items-center justify-between py-3.5 text-[15px]">
                        {s.label}
                        <input
                          type="radio"
                          name="sort"
                          checked={sort === s.value}
                          onChange={() => update((p) => (s.value === "featured" ? p.delete("sort") : p.set("sort", s.value)))}
                          className="h-5 w-5 accent-gap-blue"
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {section === "Department" && (
                <ul className="py-2">
                  {departments.map((d) => (
                    <li key={d}>
                      <label className="flex items-center justify-between py-3.5 text-[15px]">
                        {d}
                        <input
                          type="radio"
                          name="department"
                          checked={department === d}
                          onChange={() => update((p) => p.set("department", d))}
                          className="h-5 w-5 accent-gap-blue"
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {section === "Size" && (
                <div className="grid grid-cols-3 gap-2 py-4">
                  {options.sizes.map((s) => {
                    const on = selectedSizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleMulti("size", s)}
                        className={`rounded-sm border px-2 py-3 text-[13px] ${on ? "border-gap-ink bg-gap-ink text-white" : "border-gap-line"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}

              {section === "Color" && (
                <ul className="py-2">
                  {options.colors.map((c) => {
                    const on = selectedColors.includes(c.slug);
                    return (
                      <li key={c.slug}>
                        <label className="flex items-center gap-3 py-3 text-[15px]">
                          <input type="checkbox" checked={on} onChange={() => toggleMulti("color", c.slug)} className="h-5 w-5 accent-gap-blue" />
                          <span className="h-5 w-5 rounded-sm ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}

              {section === "Price" && (
                <ul className="py-2">
                  <li className="pb-2 text-sm text-gap-muted">
                    Range in this category: {formatPrice(options.priceRange.minCents)} – {formatPrice(options.priceRange.maxCents)}
                  </li>
                  {PRICE_BUCKETS.map((b) => (
                    <li key={b.label}>
                      <label className="flex items-center justify-between py-3.5 text-[15px]">
                        {b.label}
                        <input
                          type="radio"
                          name="price"
                          checked={minPrice === String(b.min)}
                          onChange={() =>
                            update((p) => {
                              p.set("min", String(b.min));
                              p.set("max", String(b.max));
                            })
                          }
                          className="h-5 w-5 accent-gap-blue"
                        />
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="safe-bottom flex gap-3 border-t border-gap-line px-4 pb-4 pt-4">
              <button type="button" onClick={clearAll} className="rounded-sm border border-gap-ink/50 px-5 py-3.5 text-sm font-medium">
                Clear all
              </button>
              <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-sm bg-gap-blue py-3.5 text-sm font-semibold text-white">
                Show {resultCount} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
