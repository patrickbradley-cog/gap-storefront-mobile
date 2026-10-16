"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PromoCode } from "@/server/repositories/types";

export type CartItem = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  colorName: string;
  sizeLabel: string;
  imageUrl: string;
  unitPriceCents: number;
  promoLabel: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  promo: PromoCode | null;
};

type CartContextValue = CartState & {
  ready: boolean;
  count: number;
  subtotalCents: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  applyPromo: (promo: PromoCode | null) => void;
  clear: () => void;
};

const STORAGE_KEY = "gap-demo-bag";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], promo: null });
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const addItem = useCallback((item: Omit<CartItem, "key" | "quantity">, quantity = 1) => {
    const key = `${item.productId}:${item.colorName}:${item.sizeLabel}`;
    setState((s) => {
      const existing = s.items.find((i) => i.key === key);
      const items = existing
        ? s.items.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
        : [...s.items, { ...item, key, quantity }];
      return { ...s, items };
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setState((s) => ({
      ...s,
      items: quantity <= 0 ? s.items.filter((i) => i.key !== key) : s.items.map((i) => (i.key === key ? { ...i, quantity } : i)),
    }));
  }, []);

  const removeItem = useCallback((key: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.key !== key) }));
  }, []);

  const applyPromo = useCallback((promo: PromoCode | null) => setState((s) => ({ ...s, promo })), []);
  const clear = useCallback(() => setState({ items: [], promo: null }), []);

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((n, i) => n + i.quantity, 0);
    const subtotalCents = state.items.reduce((n, i) => n + i.quantity * i.unitPriceCents, 0);
    return {
      ...state,
      ready,
      count,
      subtotalCents,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      applyPromo,
      clear,
    };
  }, [state, ready, drawerOpen, addItem, updateQuantity, removeItem, applyPromo, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
