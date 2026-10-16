import Link from "next/link";
import type { ProductSummary } from "@/server/repositories/types";
import { formatPrice } from "@/lib/format";
import { HeartIcon } from "./icons";

export function ProductCard({ product }: { product: ProductSummary }) {
  const extraColors = product.colors.length - 4;
  return (
    <Link href={`/p/${product.slug}`} className="group block" data-testid="product-card">
      <div className="relative overflow-hidden rounded-sm bg-gap-gray">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <HeartIcon width={18} height={18} />
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5">
        {product.colors.slice(0, 4).map((c) => (
          <span
            key={c.slug}
            title={c.name}
            className="h-4 w-4 rounded-[2px] ring-1 ring-black/10"
            style={{ backgroundColor: c.hex }}
          />
        ))}
        {extraColors > 0 && <span className="text-xs text-gap-muted">+{extraColors}</span>}
      </div>
      {product.badge && (
        <span className="mt-2 inline-block bg-gap-gray px-1.5 py-0.5 text-[11px] font-medium">{product.badge}</span>
      )}
      <p className="mt-1.5 text-[13px] leading-snug">{product.name}</p>
      <p className="mt-1 text-[13px] font-semibold">{formatPrice(product.priceCents)}</p>
      {product.promoLabel && <p className="mt-0.5 text-[12px] text-gap-muted">{product.promoLabel}</p>}
    </Link>
  );
}
