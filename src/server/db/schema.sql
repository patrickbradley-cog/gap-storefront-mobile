CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  parent_slug TEXT REFERENCES categories(slug),
  image_url   TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id               SERIAL PRIMARY KEY,
  slug             TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  category_slug    TEXT NOT NULL REFERENCES categories(slug),
  department       TEXT NOT NULL,
  garment          TEXT NOT NULL,
  price_cents      INT NOT NULL,
  compare_at_cents INT,
  promo_label      TEXT,
  badge            TEXT,
  is_new           BOOLEAN NOT NULL DEFAULT FALSE,
  fabric           TEXT,
  fit              TEXT,
  description      TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_colors (
  id         SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  slug       TEXT NOT NULL,
  name       TEXT NOT NULL,
  hex        TEXT NOT NULL,
  image_url  TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, slug)
);

CREATE TABLE IF NOT EXISTS product_sizes (
  id         SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  in_stock   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, label)
);

CREATE TABLE IF NOT EXISTS promo_codes (
  code          TEXT PRIMARY KEY,
  kind          TEXT NOT NULL CHECK (kind IN ('percent', 'fixed', 'free_shipping')),
  value         INT NOT NULL DEFAULT 0,
  description   TEXT NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  order_number      TEXT UNIQUE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'placed',
  email             TEXT NOT NULL,
  ship_first_name   TEXT NOT NULL,
  ship_last_name    TEXT NOT NULL,
  ship_address1     TEXT NOT NULL,
  ship_address2     TEXT,
  ship_city         TEXT NOT NULL,
  ship_state        TEXT NOT NULL,
  ship_zip          TEXT NOT NULL,
  ship_phone        TEXT,
  shipping_method   TEXT NOT NULL,
  payment_brand     TEXT NOT NULL,
  payment_last4     TEXT NOT NULL,
  promo_code        TEXT REFERENCES promo_codes(code),
  subtotal_cents    INT NOT NULL,
  discount_cents    INT NOT NULL DEFAULT 0,
  shipping_cents    INT NOT NULL DEFAULT 0,
  tax_cents         INT NOT NULL DEFAULT 0,
  total_cents       INT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id               SERIAL PRIMARY KEY,
  order_id         INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       INT NOT NULL REFERENCES products(id),
  product_name     TEXT NOT NULL,
  color_name       TEXT NOT NULL,
  size_label       TEXT NOT NULL,
  image_url        TEXT NOT NULL,
  quantity         INT NOT NULL CHECK (quantity > 0),
  unit_price_cents INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
