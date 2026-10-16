export type Category = {
  id: number;
  slug: string;
  name: string;
  parentSlug: string | null;
  imageUrl: string | null;
};

export type ProductColor = { slug: string; name: string; hex: string; imageUrl: string };
export type ProductSize = { label: string; inStock: boolean };

export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  department: string;
  priceCents: number;
  compareAtCents: number | null;
  promoLabel: string | null;
  badge: string | null;
  isNew: boolean;
  imageUrl: string;
  colors: ProductColor[];
};

export type Product = ProductSummary & {
  garment: string;
  fabric: string | null;
  fit: string | null;
  description: string;
  sizes: ProductSize[];
};

export type ProductFilters = {
  category?: string;
  department?: string;
  sizes?: string[];
  colors?: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  search?: string;
};

export type PromoCode = {
  code: string;
  kind: "percent" | "fixed" | "free_shipping";
  value: number;
  description: string;
};

export type NewOrderItem = {
  productId: number;
  productName: string;
  colorName: string;
  sizeLabel: string;
  imageUrl: string;
  quantity: number;
  unitPriceCents: number;
};

export type NewOrder = {
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    phone?: string;
  };
  shippingMethod: string;
  payment: { brand: string; last4: string };
  promoCode?: string | null;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  items: NewOrderItem[];
};

export type Order = NewOrder & {
  id: number;
  orderNumber: string;
  status: string;
  createdAt: string;
};
