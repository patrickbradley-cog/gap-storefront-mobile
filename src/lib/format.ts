export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
