"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export function PromoCodeField() {
  const { promo, applyPromo } = useCart();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (res.ok) {
        applyPromo(data.promo);
        setStatus({ ok: true, message: `${data.promo.code} applied — ${data.promo.description}` });
        setCode("");
      } else {
        setStatus({ ok: false, message: data.error ?? "That code isn’t valid." });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code"
          aria-label="Promo code"
          className="h-11 flex-1 rounded-sm border border-gap-line px-3 text-[15px] uppercase placeholder:normal-case"
          data-testid="promo-input"
        />
        <button type="submit" disabled={busy} className="h-11 rounded-sm border border-gap-ink px-4 text-sm font-medium disabled:opacity-50" data-testid="promo-apply">
          Apply
        </button>
      </form>
      {status && (
        <p className={`mt-2 text-[13px] ${status.ok ? "text-green-700" : "text-red-700"}`} role="status">
          {status.message}
        </p>
      )}
      {promo && (
        <p className="mt-2 flex items-center justify-between text-[13px]">
          <span>
            Applied: <span className="font-medium">{promo.code}</span>
          </span>
          <button type="button" className="underline" onClick={() => applyPromo(null)}>
            Remove
          </button>
        </p>
      )}
    </div>
  );
}
