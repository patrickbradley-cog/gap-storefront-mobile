import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/server/repositories";
import { MobileHeader } from "@/components/MobileHeader";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = (await listProducts({ category: product.categorySlug })).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      <MobileHeader title={product.department} />
      <ProductDetail product={product} />
      <section className="mx-auto mt-10 max-w-6xl px-4 md:px-6">
        <h2 className="text-base font-semibold">You may also like</h2>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
