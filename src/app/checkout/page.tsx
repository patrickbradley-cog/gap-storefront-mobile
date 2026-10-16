import { CheckoutForm } from "@/components/CheckoutForm";
import { MobileHeader } from "@/components/MobileHeader";
import { LockIcon } from "@/components/icons";

export default function CheckoutPage() {
  return (
    <div>
      <MobileHeader
        title={
          <span className="inline-flex items-center gap-1.5">
            <LockIcon width={16} height={16} /> Checkout
          </span>
        }
        actions={<span />}
      />
      <CheckoutForm />
    </div>
  );
}
