"use client";

import { useState } from "react";
import type { Product } from "@/server/repositories/types";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ChevronDownIcon } from "./icons";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("Details");

  function handleAdd() {
    if (!size) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      colorName: color.name,
      sizeLabel: size,
      imageUrl: color.imageUrl,
      unitPriceCents: product.priceCents,
      promoLabel: product.promoLabel,
    });
  }

  return (
    <div className="mx-auto max-w-6xl md:grid md:grid-cols-2 md:gap-10 md:px-6 md:pt-6">
      <div className="bg-gap-gray md:rounded-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={color.imageUrl}
          alt={`${product.name} in ${color.name}`}
          className="mx-auto aspect-[3/4] w-full max-w-[560px] object-cover"
          data-testid="pdp-image"
        />
        <div className="flex justify-center gap-1.5 py-2 md:hidden" aria-hidden>
          {product.colors.map((c) => (
            <span key={c.slug} className={`h-1.5 w-1.5 rounded-full ${c.slug === color.slug ? "bg-gap-ink" : "bg-gap-line"}`} />
          ))}
        </div>
      </div>

      <div className="px-4 pt-3 md:px-0">
        {product.badge && <span className="inline-block bg-gap-gray px-1.5 py-0.5 text-[11px] font-medium">{product.badge}</span>}
        <h1 className="mt-2 text-lg font-medium leading-snug md:text-2xl" data-testid="pdp-name">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-lg font-semibold">{formatPrice(product.priceCents)}</span>
          {product.compareAtCents && <span className="text-sm text-gap-muted line-through">{formatPrice(product.compareAtCents)}</span>}
        </div>
        {product.promoLabel && <p className="mt-1 text-[13px] text-gap-muted">{product.promoLabel}</p>}
        <div className="mt-2 flex items-center gap-1 text-[13px] text-gap-muted">
          <span aria-hidden className="text-gap-ink">
            ★★★★☆
          </span>
          <span>(1,284)</span>
        </div>

        <div className="mt-6">
          <p className="text-[13px]">
            Color: <span className="font-medium">{color.name}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.slug}
                type="button"
                aria-label={c.name}
                aria-pressed={c.slug === color.slug}
                onClick={() => setColor(c)}
                className={`h-9 w-9 rounded-full p-0.5 ring-2 ${c.slug === color.slug ? "ring-gap-ink" : "ring-transparent"}`}
              >
                <span className="block h-full w-full rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[13px]">
              Size{size ? ": " : ""}
              <span className="font-medium">{size}</span>
            </p>
            <button type="button" className="text-[13px] underline">
              Size guide
            </button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2 md:grid-cols-5" role="radiogroup" aria-label="Size">
            {product.sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                role="radio"
                aria-checked={size === s.label}
                disabled={!s.inStock}
                onClick={() => {
                  setSize(s.label);
                  setError(null);
                }}
                className={`rounded-sm border py-3 text-[13px] ${
                  size === s.label ? "border-gap-ink bg-gap-ink text-white" : "border-gap-line"
                } disabled:text-gap-line disabled:line-through`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-[13px] text-red-700" role="alert">
              {error}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 w-full rounded-sm bg-gap-blue py-4 text-[15px] font-semibold text-white"
          data-testid="add-to-bag"
        >
          Add to bag
        </button>
        <p className="mt-3 text-center text-[12px] text-gap-muted">Free shipping on orders over $50 · Free returns</p>

        <div className="mt-8 divide-y divide-gap-line border-y border-gap-line">
          {[
            ["Details", product.description],
            ["Fabric & care", `${product.fabric ?? ""}. Machine wash cold, tumble dry low.`],
            ["Fit & sizing", product.fit ? `${product.fit} fit. Model is wearing size M.` : "True to size."],
          ].map(([label, body]) => (
            <div key={label}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium"
                onClick={() => setOpenSection(openSection === label ? null : label)}
                aria-expanded={openSection === label}
              >
                {label}
                <ChevronDownIcon className={`transition-transform ${openSection === label ? "rotate-180" : ""}`} />
              </button>
              {openSection === label && <p className="pb-4 text-[13px] leading-relaxed text-gap-muted">{body}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
