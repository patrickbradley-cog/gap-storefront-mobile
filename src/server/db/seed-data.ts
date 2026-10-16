export type SeedColor = { name: string; hex: string };

export type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  department: "Women" | "Men" | "Girls" | "Boys" | "Baby";
  garment:
    | "tee"
    | "shirt"
    | "hoodie"
    | "sweater"
    | "pants"
    | "jeans"
    | "dress"
    | "skirt"
    | "jacket"
    | "vest"
    | "tank"
    | "onesie"
    | "overalls"
    | "pajamas";
  price: number;
  compareAt?: number;
  promoLabel?: string;
  badge?: string;
  isNew?: boolean;
  fabric: string;
  fit?: string;
  description: string;
  colors: SeedColor[];
  sizes: string[];
};

export const categories = [
  { slug: "women", name: "Women", parent: null, sort: 1 },
  { slug: "men", name: "Men", parent: null, sort: 2 },
  { slug: "kids", name: "Kids", parent: null, sort: 3 },
  { slug: "baby", name: "Baby", parent: null, sort: 4 },
  { slug: "girls", name: "Girls", parent: "kids", sort: 5 },
  { slug: "boys", name: "Boys", parent: "kids", sort: 6 },
];

const ADULT = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST = ["26", "28", "29", "30", "31", "32", "33", "34", "36"];
const KIDS = ["XS (4-5)", "S (6-7)", "M (8)", "L (10)", "XL (12)", "XXL (14-16)"];
const BABY = ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"];
const TODDLER = ["2T", "3T", "4T", "5T"];

const PROMO = "40% off at checkout";

export const products: SeedProduct[] = [
  // ---- Women ----
  {
    slug: "womens-linen-blend-shirt",
    name: "Linen-Blend Big Shirt",
    category: "women",
    department: "Women",
    garment: "shirt",
    price: 59.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "55% linen, 45% cotton",
    fit: "Relaxed",
    description:
      "Our favorite oversized shirt in a breezy linen blend. Drop shoulders, a curved hem and a roomy fit made for untucking.",
    colors: [
      { name: "Optic white", hex: "#f3f1ec" },
      { name: "Chambray blue", hex: "#8fa6c2" },
      { name: "Black", hex: "#1f1f1f" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-high-rise-vintage-slim-jeans",
    name: "High Rise Vintage Slim Jeans",
    category: "women",
    department: "Women",
    garment: "jeans",
    price: 79.95,
    promoLabel: PROMO,
    fabric: "99% cotton, 1% elastane",
    fit: "Vintage slim",
    description:
      "A high rise with a slim leg that sits right at the ankle. Washed for a lived-in look with just enough stretch.",
    colors: [
      { name: "Medium indigo", hex: "#4a6189" },
      { name: "Light wash", hex: "#a7b8cf" },
      { name: "Black wash", hex: "#2c2c30" },
    ],
    sizes: WAIST,
  },
  {
    slug: "womens-cashsoft-crewneck-sweater",
    name: "CashSoft Crewneck Sweater",
    category: "women",
    department: "Women",
    garment: "sweater",
    price: 69.95,
    promoLabel: PROMO,
    badge: "Bestseller",
    fabric: "CashSoft: 50% nylon, 30% viscose, 20% polyamide",
    fit: "Classic",
    description:
      "The feel of cashmere without the fuss. A soft, ribbed crewneck that layers under everything.",
    colors: [
      { name: "Oatmeal heather", hex: "#d8cfc2" },
      { name: "Sage", hex: "#8d9c86" },
      { name: "Navy", hex: "#22305a" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-vintage-soft-hoodie",
    name: "Vintage Soft Logo Hoodie",
    category: "women",
    department: "Women",
    garment: "hoodie",
    price: 64.95,
    promoLabel: PROMO,
    fabric: "77% cotton, 23% polyester",
    fit: "Relaxed",
    description:
      "Garment-washed fleece with the arch logo. Brushed inside for the kind of softness you reach for every weekend.",
    colors: [
      { name: "Light heather grey", hex: "#c9c7c4" },
      { name: "Burgundy", hex: "#6b2d3a" },
      { name: "Black", hex: "#1f1f1f" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-modern-rib-tank",
    name: "Modern Rib Tank",
    category: "women",
    department: "Women",
    garment: "tank",
    price: 24.95,
    promoLabel: PROMO,
    fabric: "95% cotton, 5% spandex",
    fit: "Fitted",
    description: "A fitted rib tank with a scoop neck. The layering piece that works year-round.",
    colors: [
      { name: "White", hex: "#f6f5f2" },
      { name: "Black", hex: "#1f1f1f" },
      { name: "Terra brown", hex: "#7a4a33" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-wide-leg-trousers",
    name: "High Rise Wide-Leg Trousers",
    category: "women",
    department: "Women",
    garment: "pants",
    price: 89.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "64% polyester, 34% viscose, 2% elastane",
    fit: "Wide leg",
    description:
      "A tailored high rise with a fluid wide leg. Pressed creases and a clean front make these the dressed-up pant.",
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Khaki", hex: "#b7a27e" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-lightweight-puffer-vest",
    name: "Lightweight Puffer Vest",
    category: "women",
    department: "Women",
    garment: "vest",
    price: 79.95,
    promoLabel: PROMO,
    fabric: "100% recycled polyester",
    fit: "Regular",
    description:
      "Lightweight warmth with a stand collar and zip pockets. Packs down small for travel.",
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Olive", hex: "#5c6440" },
    ],
    sizes: ADULT,
  },
  {
    slug: "womens-satin-midi-skirt",
    name: "Satin Midi Slip Skirt",
    category: "women",
    department: "Women",
    garment: "skirt",
    price: 69.95,
    promoLabel: PROMO,
    fabric: "100% polyester satin",
    fit: "Bias cut",
    description: "A bias-cut midi skirt in liquid satin. Elastic waistband, fully lined.",
    colors: [
      { name: "Champagne", hex: "#d9c9a9" },
      { name: "Black", hex: "#1f1f1f" },
    ],
    sizes: ADULT,
  },

  // ---- Men ----
  {
    slug: "mens-everyday-oxford-shirt",
    name: "Everyday Oxford Shirt",
    category: "men",
    department: "Men",
    garment: "shirt",
    price: 59.95,
    promoLabel: PROMO,
    fabric: "100% cotton oxford",
    fit: "Standard",
    description:
      "A soft, garment-washed oxford with a button-down collar. The shirt that goes from office to weekend.",
    colors: [
      { name: "White", hex: "#f6f5f2" },
      { name: "Light blue", hex: "#b8cbe0" },
      { name: "Navy stripe", hex: "#3c4f78" },
    ],
    sizes: ADULT,
  },
  {
    slug: "mens-straight-jeans",
    name: "Straight Jeans in GapFlex",
    category: "men",
    department: "Men",
    garment: "jeans",
    price: 69.95,
    promoLabel: PROMO,
    badge: "Bestseller",
    fabric: "98% cotton, 2% elastane",
    fit: "Straight",
    description: "Our classic straight leg with four-way stretch. Sits at the waist, straight through the leg.",
    colors: [
      { name: "Dark wash", hex: "#2f3f5e" },
      { name: "Medium wash", hex: "#5d7398" },
      { name: "Black", hex: "#262629" },
    ],
    sizes: WAIST,
  },
  {
    slug: "mens-arch-logo-fleece-hoodie",
    name: "Arch Logo Fleece Hoodie",
    category: "men",
    department: "Men",
    garment: "hoodie",
    price: 59.95,
    promoLabel: PROMO,
    fabric: "77% cotton, 23% polyester",
    fit: "Relaxed",
    description:
      "Heavyweight fleece with the arch logo across the chest. Kangaroo pocket, ribbed cuffs and hem.",
    colors: [
      { name: "Heather grey", hex: "#b9b7b4" },
      { name: "Navy", hex: "#22305a" },
      { name: "Forest", hex: "#2f4a3a" },
    ],
    sizes: ADULT,
  },
  {
    slug: "mens-vintage-soft-tee",
    name: "Vintage Soft Crewneck T-Shirt",
    category: "men",
    department: "Men",
    garment: "tee",
    price: 24.95,
    promoLabel: PROMO,
    fabric: "100% cotton",
    fit: "Classic",
    description: "Washed-down jersey that feels like your favorite old tee from day one.",
    colors: [
      { name: "White", hex: "#f6f5f2" },
      { name: "Black", hex: "#1f1f1f" },
      { name: "Olive", hex: "#5c6440" },
      { name: "Burgundy", hex: "#6b2d3a" },
    ],
    sizes: ADULT,
  },
  {
    slug: "mens-modern-khaki-chinos",
    name: "Modern Khakis in Slim Fit",
    category: "men",
    department: "Men",
    garment: "pants",
    price: 69.95,
    promoLabel: PROMO,
    fabric: "98% cotton, 2% spandex",
    fit: "Slim",
    description: "Our best-selling khaki with GapFlex stretch. Sits below the waist, slim through the leg.",
    colors: [
      { name: "Classic khaki", hex: "#c2ad85" },
      { name: "Black", hex: "#1f1f1f" },
      { name: "Olive", hex: "#5c6440" },
    ],
    sizes: WAIST,
  },
  {
    slug: "mens-brushed-flannel-shirt",
    name: "Brushed Flannel Shirt",
    category: "men",
    department: "Men",
    garment: "shirt",
    price: 64.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "100% cotton flannel",
    fit: "Standard",
    description: "Double-brushed flannel in a classic plaid. Chest pocket, button cuffs, built for layering.",
    colors: [
      { name: "Red plaid", hex: "#8a3b36" },
      { name: "Green plaid", hex: "#3f5a46" },
    ],
    sizes: ADULT,
  },
  {
    slug: "mens-quilted-liner-jacket",
    name: "Quilted Liner Jacket",
    category: "men",
    department: "Men",
    garment: "jacket",
    price: 98.0,
    promoLabel: PROMO,
    fabric: "100% recycled nylon",
    fit: "Regular",
    description: "A lightweight quilted jacket with snap front and a corduroy collar. Wear alone or as a layer.",
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Khaki", hex: "#b7a27e" },
    ],
    sizes: ADULT,
  },
  {
    slug: "mens-corduroy-overshirt",
    name: "Corduroy Overshirt",
    category: "men",
    department: "Men",
    garment: "shirt",
    price: 79.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "100% cotton corduroy",
    fit: "Relaxed",
    description: "A heavyweight corduroy shirt-jacket with two chest pockets. The in-between-seasons layer.",
    colors: [
      { name: "Terra brown", hex: "#7a4a33" },
      { name: "Black", hex: "#1f1f1f" },
    ],
    sizes: ADULT,
  },

  // ---- Boys ----
  {
    slug: "kids-corduroy-utility-shirt",
    name: "Kids Corduroy Utility Shirt",
    category: "boys",
    department: "Boys",
    garment: "shirt",
    price: 49.95,
    promoLabel: PROMO,
    badge: "Matching set",
    isNew: true,
    fabric: "100% cotton corduroy",
    fit: "Relaxed",
    description:
      "A soft corduroy utility shirt with two chest pockets. Pairs with the Corduroy '90s Loose Pants for the full set.",
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Terra brown", hex: "#7a4a33" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-corduroy-90s-loose-pants",
    name: "Kids Corduroy '90s Loose Pants",
    category: "boys",
    department: "Boys",
    garment: "pants",
    price: 54.95,
    promoLabel: PROMO,
    badge: "Matching set",
    isNew: true,
    fabric: "100% cotton corduroy",
    fit: "'90s loose",
    description:
      "Roomy '90s-inspired corduroy pants with an adjustable waist. Pairs with the Corduroy Utility Shirt.",
    colors: [
      { name: "Black", hex: "#1f1f1f" },
      { name: "Khaki", hex: "#c2ad85" },
      { name: "Terra brown", hex: "#7a4a33" },
      { name: "Navy", hex: "#22305a" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-new-york-graphic-tee",
    name: "Kids New York Original Graphic T-Shirt",
    category: "boys",
    department: "Boys",
    garment: "tee",
    price: 19.95,
    promoLabel: PROMO,
    fabric: "100% cotton",
    fit: "Classic",
    description: "Soft jersey with a vintage New York graphic. Crewneck, short sleeves, easy to wash.",
    colors: [
      { name: "Navy", hex: "#22305a" },
      { name: "White", hex: "#f6f5f2" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-arch-logo-hoodie",
    name: "Kids Arch Logo Hoodie",
    category: "boys",
    department: "Boys",
    garment: "hoodie",
    price: 44.95,
    promoLabel: PROMO,
    fabric: "77% cotton, 23% polyester",
    fit: "Relaxed",
    description: "Cozy fleece with the arch logo. Kangaroo pocket and a lined hood.",
    colors: [
      { name: "Heather grey", hex: "#b9b7b4" },
      { name: "Navy", hex: "#22305a" },
      { name: "Red", hex: "#b3362f" },
    ],
    sizes: KIDS,
  },

  // ---- Girls ----
  {
    slug: "kids-icon-denim-jacket",
    name: "Kids Icon Denim Jacket",
    category: "girls",
    department: "Girls",
    garment: "jacket",
    price: 59.95,
    promoLabel: PROMO,
    badge: "Bestseller",
    fabric: "100% cotton denim",
    fit: "Classic",
    description: "The classic denim jacket, kid-sized. Button front, chest pockets and a soft washed feel.",
    colors: [
      { name: "Medium wash", hex: "#5d7398" },
      { name: "Light wash", hex: "#a7b8cf" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-high-rise-flare-jeans",
    name: "Kids High Rise '70s Flare Jeans",
    category: "girls",
    department: "Girls",
    garment: "jeans",
    price: 44.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "99% cotton, 1% elastane",
    fit: "Flare",
    description: "High rise with a '70s flare and a little stretch. Adjustable waistband inside.",
    colors: [
      { name: "Medium indigo", hex: "#4a6189" },
      { name: "Black wash", hex: "#2c2c30" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-puff-sleeve-dress",
    name: "Kids Puff-Sleeve Knit Dress",
    category: "girls",
    department: "Girls",
    garment: "dress",
    price: 39.95,
    promoLabel: PROMO,
    fabric: "95% cotton, 5% spandex",
    fit: "A-line",
    description: "A soft knit dress with puff sleeves and a twirl-ready skirt.",
    colors: [
      { name: "Lilac", hex: "#b7a4cf" },
      { name: "Navy", hex: "#22305a" },
      { name: "Pink", hex: "#e2a1b4" },
    ],
    sizes: KIDS,
  },
  {
    slug: "kids-cozy-pajama-set",
    name: "Kids Cozy Pajama Set",
    category: "girls",
    department: "Girls",
    garment: "pajamas",
    price: 39.95,
    promoLabel: "50% off at checkout",
    badge: "Matching PJs",
    fabric: "100% organic cotton",
    fit: "Snug",
    description: "Two-piece pajamas in a snug fit. Part of the family Matching PJ Shop.",
    colors: [
      { name: "Winter forest", hex: "#e9e4d6" },
      { name: "Navy stripe", hex: "#3c4f78" },
    ],
    sizes: KIDS,
  },

  // ---- Baby ----
  {
    slug: "baby-brannan-bear-onesie",
    name: "Baby Brannan Bear Onesie",
    category: "baby",
    department: "Baby",
    garment: "onesie",
    price: 29.95,
    promoLabel: PROMO,
    badge: "Bestseller",
    fabric: "100% organic cotton",
    description: "Our softest footed onesie with a tiny Brannan Bear on the chest. Snap closures for easy changes.",
    colors: [
      { name: "Oatmeal", hex: "#e3dccd" },
      { name: "Light blue", hex: "#b8cbe0" },
      { name: "Blush", hex: "#efc5ca" },
    ],
    sizes: BABY,
  },
  {
    slug: "baby-organic-bodysuit-3-pack",
    name: "Baby Organic Cotton Bodysuit (3-Pack)",
    category: "baby",
    department: "Baby",
    garment: "onesie",
    price: 24.95,
    promoLabel: PROMO,
    fabric: "100% organic cotton",
    description: "Three everyday short-sleeve bodysuits with lap shoulders and snap closures.",
    colors: [
      { name: "White multi", hex: "#f3f1ec" },
      { name: "Grey multi", hex: "#c9c7c4" },
    ],
    sizes: BABY,
  },
  {
    slug: "baby-denim-overalls",
    name: "Baby Denim Overalls",
    category: "baby",
    department: "Baby",
    garment: "overalls",
    price: 39.95,
    promoLabel: PROMO,
    isNew: true,
    fabric: "100% cotton denim",
    description: "Classic denim overalls with adjustable straps and inseam snaps.",
    colors: [
      { name: "Medium wash", hex: "#5d7398" },
      { name: "Light wash", hex: "#a7b8cf" },
    ],
    sizes: BABY,
  },
  {
    slug: "baby-sherpa-bunting",
    name: "Baby Sherpa Bunting",
    category: "baby",
    department: "Baby",
    garment: "onesie",
    price: 54.95,
    promoLabel: PROMO,
    fabric: "100% recycled polyester sherpa",
    description: "A cozy sherpa bunting with a hood and fold-over cuffs for hands and feet.",
    colors: [
      { name: "Oatmeal", hex: "#e3dccd" },
      { name: "Navy", hex: "#22305a" },
    ],
    sizes: BABY,
  },
  {
    slug: "baby-knit-cardigan",
    name: "Baby Pointelle Knit Cardigan",
    category: "baby",
    department: "Baby",
    garment: "sweater",
    price: 34.95,
    promoLabel: PROMO,
    fabric: "100% organic cotton",
    description: "A delicate pointelle cardigan with wooden-look buttons.",
    colors: [
      { name: "Ivory", hex: "#f1ece0" },
      { name: "Sage", hex: "#8d9c86" },
    ],
    sizes: BABY,
  },
  {
    slug: "toddler-matching-pajama-set",
    name: "Toddler Matching Family Pajama Set",
    category: "baby",
    department: "Baby",
    garment: "pajamas",
    price: 34.95,
    promoLabel: "50% off at checkout",
    badge: "Matching PJs",
    fabric: "100% organic cotton",
    description: "Snug-fit two-piece pajamas in our family print. Part of the Matching PJ Shop.",
    colors: [
      { name: "Winter forest", hex: "#e9e4d6" },
      { name: "Navy stripe", hex: "#3c4f78" },
    ],
    sizes: TODDLER,
  },
];

export const promoCodes = [
  { code: "GAPDEMO20", kind: "percent", value: 20, description: "20% off your order" },
  { code: "FREESHIP", kind: "free_shipping", value: 0, description: "Free standard shipping" },
  { code: "WELCOME10", kind: "fixed", value: 1000, description: "$10 off your order" },
] as const;

export function imageUrl(productSlug: string, colorName: string) {
  return `/products/${productSlug}--${colorName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
}
