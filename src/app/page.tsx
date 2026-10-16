import Link from "next/link";
import { listFeaturedProducts, listTopLevelCategories } from "@/server/repositories";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductCard } from "@/components/ProductCard";
import { PromoBanner } from "@/components/PromoBanner";
import { BarcodeIcon, HeartIcon, SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([listTopLevelCategories(), listFeaturedProducts(8)]);

  return (
    <div>
      <header className="safe-top px-4 pt-3 md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-[15px] font-medium">Shop</h1>
          <span className="flex h-10 w-10 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
            <HeartIcon width={20} height={20} />
          </span>
        </div>
        <form action="/c/all" className="mt-3 flex items-center gap-2">
          <label className="flex h-11 flex-1 items-center gap-2 rounded border border-gap-ink/40 px-3">
            <SearchIcon width={20} height={20} />
            <input name="q" placeholder="Search Gap" className="w-full bg-transparent text-[15px] outline-none" />
          </label>
          <BarcodeIcon width={26} height={26} />
        </form>
      </header>

      <div className="mt-3">
        <PromoBanner />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-4 md:px-6 md:pt-8">
        <Link href="/c/all?sort=newest" className="relative block overflow-hidden rounded-sm bg-gap-gray" data-testid="hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.svg" alt="" className="aspect-[3/2] w-full object-cover md:aspect-[3/1]" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5 text-white md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">New arrivals</p>
            <h2 className="mt-1 text-2xl font-semibold md:text-4xl">The Cozy Edit</h2>
            <p className="mt-1 text-sm md:text-base">Fleece, corduroy and CashSoft for the whole family.</p>
            <span className="mt-3 inline-block w-fit bg-white px-4 py-2 text-sm font-semibold text-gap-ink">Shop now</span>
          </div>
        </Link>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map((c) => (
            <CategoryTile key={c.slug} href={`/c/${c.slug}`} label={c.name} imageUrl={c.imageUrl ?? ""} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 md:px-6" data-testid="featured">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Featured</h2>
          <Link href="/c/all" className="text-sm underline">
            Shop all
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-x-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
