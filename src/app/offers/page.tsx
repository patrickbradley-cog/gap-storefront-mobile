import Link from "next/link";
import { MobileHeader } from "@/components/MobileHeader";

const offers = [
  { kicker: "Friends & Family", title: "40% off everything", note: "Online & in stores. Excludes collaborations." },
  { kicker: "Friends & Family", title: "50% off matching PJs", note: "Select styles." },
  { kicker: "Encore Credit Card", title: "Extra 20% off", note: "Your first purchase with your new Encore Credit Card." },
];

export default function OffersPage() {
  return (
    <div>
      <MobileHeader title="Offers" back={false} actions={<span />} />
      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-2 md:pt-8">
        <h1 className="hidden text-2xl font-semibold md:block">Offers</h1>
        {offers.map((o) => (
          <div key={o.title} className="rounded-sm border border-gap-ink/70">
            <div className="p-4">
              <p className="text-[15px] font-medium text-gap-blue">{o.kicker}</p>
              <p className="mt-3 text-[28px] font-medium leading-tight">{o.title}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  ["Women", "/c/women"],
                  ["Men", "/c/men"],
                  ["Kids", "/c/kids"],
                  ["Baby", "/c/baby"],
                ].map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-sm border border-gap-ink px-4 py-1.5 text-[13px] font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-gap-line px-4 py-3 text-[13px]">
              <span>{o.note}</span>
              <span className="text-gap-muted">Details</span>
            </div>
          </div>
        ))}
        <p className="pt-2 text-[12px] text-gap-muted">Use promo code GAPDEMO20 for 20% off, FREESHIP for free shipping, or WELCOME10 for $10 off.</p>
      </div>
    </div>
  );
}
