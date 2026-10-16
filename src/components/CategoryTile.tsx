import Link from "next/link";

export function CategoryTile({ href, label, imageUrl }: { href: string; label: string; imageUrl: string }) {
  return (
    <Link href={href} className="relative block overflow-hidden rounded-sm bg-gap-gray" data-testid="category-tile">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-2.5 text-center text-[15px] font-medium text-white">
        {label}
      </span>
    </Link>
  );
}
