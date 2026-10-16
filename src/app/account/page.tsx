import { MobileHeader } from "@/components/MobileHeader";
import { ChevronRightIcon } from "@/components/icons";

const rows = ["Orders", "Rewards", "Payment methods", "Addresses", "Store pickup", "Help"];

export default function AccountPage() {
  return (
    <div>
      <MobileHeader title="Account" back={false} actions={<span />} />
      <div className="mx-auto max-w-2xl px-4 md:pt-8">
        <div className="rounded-sm bg-gap-gray p-4">
          <p className="text-[15px] font-medium">Hi, Demo Shopper</p>
          <p className="text-[13px] text-gap-muted">Member since 2026 · 1,250 points</p>
        </div>
        <ul className="mt-4 divide-y divide-gap-line border-y border-gap-line">
          {rows.map((r) => (
            <li key={r} className="flex items-center justify-between py-4 text-[15px]">
              {r}
              <ChevronRightIcon />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
