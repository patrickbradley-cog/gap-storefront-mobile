/**
 * Generates placeholder SVG artwork for every product colorway, the category tiles
 * and the home hero. Nothing here is scraped; everything is drawn procedurally.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { products, categories, imageUrl, type SeedProduct } from "../src/server/db/seed-data";

const W = 600;
const H = 800;

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (shift: number) => {
    const v = (n >> shift) & 0xff;
    const out = Math.max(0, Math.min(255, Math.round(v + 255 * amount)));
    return out.toString(16).padStart(2, "0");
  };
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b > 200;
}

// Garment silhouettes drawn in a 600x800 box, centered.
const garments: Record<SeedProduct["garment"], (c: string) => string> = {
  tee: (c) => `
    <path d="M190 190 L300 150 L410 190 L480 250 L425 310 L395 285 L395 640 L205 640 L205 285 L175 310 L120 250 Z" fill="${c}"/>
    <path d="M250 165 Q300 215 350 165" fill="none" stroke="${shade(c, -0.25)}" stroke-width="10" stroke-linecap="round"/>`,
  tank: (c) => `
    <path d="M225 160 L250 160 Q300 240 350 160 L375 160 L385 300 L385 650 L215 650 L215 300 Z" fill="${c}"/>
    <path d="M232 170 Q300 260 368 170" fill="none" stroke="${shade(c, -0.2)}" stroke-width="8"/>`,
  shirt: (c) => `
    <path d="M195 175 L270 150 L300 185 L330 150 L405 175 L485 245 L430 305 L400 280 L400 660 L200 660 L200 280 L170 305 L115 245 Z" fill="${c}"/>
    <path d="M270 150 L300 215 L330 150" fill="none" stroke="${shade(c, -0.3)}" stroke-width="6"/>
    <line x1="300" y1="215" x2="300" y2="660" stroke="${shade(c, -0.18)}" stroke-width="4"/>
    ${[280, 340, 400, 460, 520, 580].map((y) => `<circle cx="300" cy="${y}" r="5" fill="${shade(c, -0.4)}"/>`).join("")}
    <rect x="235" y="280" width="50" height="55" rx="4" fill="none" stroke="${shade(c, -0.2)}" stroke-width="4"/>
    <rect x="315" y="280" width="50" height="55" rx="4" fill="none" stroke="${shade(c, -0.2)}" stroke-width="4"/>`,
  hoodie: (c) => `
    <path d="M185 200 L300 140 L415 200 L495 270 L440 330 L405 300 L405 660 L195 660 L195 300 L160 330 L105 270 Z" fill="${c}"/>
    <path d="M235 205 Q300 120 365 205 Q300 260 235 205 Z" fill="${shade(c, -0.22)}"/>
    <path d="M225 500 L375 500 L385 600 L215 600 Z" fill="${shade(c, -0.1)}"/>
    <line x1="285" y1="235" x2="285" y2="300" stroke="${shade(c, -0.35)}" stroke-width="5"/>
    <line x1="315" y1="235" x2="315" y2="300" stroke="${shade(c, -0.35)}" stroke-width="5"/>
    <rect x="195" y="630" width="210" height="30" fill="${shade(c, -0.12)}"/>`,
  sweater: (c) => `
    <path d="M190 185 L300 150 L410 185 L490 260 L440 320 L400 295 L400 660 L200 660 L200 295 L160 320 L110 260 Z" fill="${c}"/>
    <path d="M255 165 Q300 205 345 165 Q300 230 255 165 Z" fill="${shade(c, -0.18)}"/>
    <rect x="200" y="625" width="200" height="35" fill="${shade(c, -0.12)}"/>
    ${Array.from({ length: 9 }, (_, i) => `<line x1="${215 + i * 22}" y1="625" x2="${215 + i * 22}" y2="660" stroke="${shade(c, -0.25)}" stroke-width="3"/>`).join("")}`,
  jacket: (c) => `
    <path d="M185 190 L270 160 L300 200 L330 160 L415 190 L500 270 L440 330 L410 300 L410 670 L190 670 L190 300 L160 330 L100 270 Z" fill="${c}"/>
    <path d="M300 200 L255 300 L255 670 L300 670 Z" fill="${shade(c, -0.12)}"/>
    <path d="M300 200 L345 300 L345 670 L300 670 Z" fill="${shade(c, -0.06)}"/>
    <path d="M270 160 L300 200 L330 160 L350 185 L300 250 L250 185 Z" fill="${shade(c, -0.3)}"/>
    <rect x="200" y="420" width="55" height="70" rx="6" fill="${shade(c, -0.15)}"/>
    <rect x="345" y="420" width="55" height="70" rx="6" fill="${shade(c, -0.15)}"/>`,
  vest: (c) => `
    <path d="M210 190 L280 160 L300 195 L320 160 L390 190 L400 240 L400 650 L200 650 L200 240 Z" fill="${c}"/>
    ${[260, 330, 400, 470, 540, 610].map((y) => `<line x1="205" y1="${y}" x2="395" y2="${y}" stroke="${shade(c, -0.18)}" stroke-width="4"/>`).join("")}
    <line x1="300" y1="195" x2="300" y2="650" stroke="${shade(c, -0.35)}" stroke-width="6"/>`,
  pants: (c) => `
    <path d="M205 140 L395 140 L405 300 L390 700 L315 700 L300 380 L285 700 L210 700 L195 300 Z" fill="${c}"/>
    <rect x="205" y="140" width="190" height="30" fill="${shade(c, -0.15)}"/>
    <line x1="300" y1="170" x2="300" y2="380" stroke="${shade(c, -0.3)}" stroke-width="4"/>
    <circle cx="300" cy="158" r="6" fill="${shade(c, -0.45)}"/>
    <path d="M215 180 L255 250" stroke="${shade(c, -0.25)}" stroke-width="4" fill="none"/>
    <path d="M385 180 L345 250" stroke="${shade(c, -0.25)}" stroke-width="4" fill="none"/>`,
  jeans: (c) => `
    <path d="M205 140 L395 140 L405 300 L390 700 L315 700 L300 380 L285 700 L210 700 L195 300 Z" fill="${c}"/>
    <rect x="205" y="140" width="190" height="30" fill="${shade(c, -0.15)}"/>
    <path d="M300 175 L300 380" stroke="${shade(c, -0.3)}" stroke-width="4"/>
    <circle cx="300" cy="158" r="6" fill="#c9a24a"/>
    <path d="M215 185 Q260 185 262 250" stroke="#d6a75c" stroke-width="3" fill="none" stroke-dasharray="6 6"/>
    <path d="M385 185 Q340 185 338 250" stroke="#d6a75c" stroke-width="3" fill="none" stroke-dasharray="6 6"/>
    <path d="M212 300 L285 700" stroke="#d6a75c" stroke-width="3" stroke-dasharray="7 7" fill="none"/>
    <path d="M388 300 L315 700" stroke="#d6a75c" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`,
  dress: (c) => `
    <path d="M215 170 L265 150 Q300 200 335 150 L385 170 L415 240 L380 260 L370 360 L450 690 L150 690 L230 360 L220 260 L185 240 Z" fill="${c}"/>
    <path d="M215 170 Q185 180 190 230 Q215 250 240 230 Z" fill="${shade(c, -0.12)}"/>
    <path d="M385 170 Q415 180 410 230 Q385 250 360 230 Z" fill="${shade(c, -0.12)}"/>
    <line x1="230" y1="360" x2="370" y2="360" stroke="${shade(c, -0.2)}" stroke-width="4"/>`,
  skirt: (c) => `
    <path d="M215 220 L385 220 L460 690 L140 690 Z" fill="${c}"/>
    <rect x="215" y="220" width="170" height="26" fill="${shade(c, -0.15)}"/>
    <path d="M250 246 L215 690" stroke="${shade(c, -0.08)}" stroke-width="3"/>
    <path d="M350 246 L385 690" stroke="${shade(c, -0.08)}" stroke-width="3"/>`,
  onesie: (c) => `
    <path d="M205 230 L265 200 Q300 240 335 200 L395 230 L450 300 L410 345 L390 325 L395 560 L350 560 L350 650 L310 650 L300 560 L290 650 L250 650 L250 560 L205 560 L210 325 L190 345 L150 300 Z" fill="${c}"/>
    <path d="M250 205 Q300 255 350 205" stroke="${shade(c, -0.2)}" stroke-width="8" fill="none"/>
    ${[560, 590, 620].map((y) => `<circle cx="300" cy="${y}" r="5" fill="${shade(c, -0.4)}"/>`).join("")}
    <circle cx="300" cy="400" r="34" fill="${shade(c, -0.1)}"/>
    <circle cx="287" cy="392" r="5" fill="${shade(c, -0.5)}"/>
    <circle cx="313" cy="392" r="5" fill="${shade(c, -0.5)}"/>
    <path d="M288 412 Q300 422 312 412" stroke="${shade(c, -0.5)}" stroke-width="4" fill="none"/>`,
  overalls: (c) => `
    <rect x="240" y="160" width="22" height="130" fill="${shade(c, -0.12)}"/>
    <rect x="338" y="160" width="22" height="130" fill="${shade(c, -0.12)}"/>
    <path d="M215 280 L385 280 L400 420 L390 690 L315 690 L300 450 L285 690 L210 690 L200 420 Z" fill="${c}"/>
    <rect x="265" y="300" width="70" height="60" rx="6" fill="${shade(c, -0.1)}"/>
    <circle cx="251" cy="292" r="8" fill="#c9a24a"/>
    <circle cx="349" cy="292" r="8" fill="#c9a24a"/>`,
  pajamas: (c) => `
    <path d="M195 180 L300 150 L405 180 L470 245 L420 300 L395 275 L395 440 L205 440 L205 275 L180 300 L130 245 Z" fill="${c}"/>
    <path d="M215 455 L385 455 L390 700 L315 700 L300 540 L285 700 L210 700 Z" fill="${c}"/>
    <rect x="215" y="455" width="170" height="22" fill="${shade(c, -0.15)}"/>
    ${[200, 260, 320, 380].map((y) => `<circle cx="300" cy="${y}" r="5" fill="${shade(c, -0.4)}"/>`).join("")}
    ${[200, 240, 280, 320, 360, 400].map((y) => `<g>${[230, 270, 330, 370].map((x) => `<circle cx="${x}" cy="${y}" r="4" fill="${shade(c, isLight(c) ? -0.35 : 0.3)}"/>`).join("")}</g>`).join("")}
    ${[500, 560, 620, 680].map((y) => `<g>${[240, 280, 320, 360].map((x) => `<circle cx="${x}" cy="${y}" r="4" fill="${shade(c, isLight(c) ? -0.35 : 0.3)}"/>`).join("")}</g>`).join("")}`,
};

function productSvg(p: SeedProduct, hex: string) {
  const bg = "#f1efeb";
  const garment = garments[p.garment](hex);
  const outline = isLight(hex) ? `<g fill="none" stroke="#c9c4ba" stroke-width="3">${garment.replace(/fill="[^"]*"/g, "")}</g>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#e6e2da"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <ellipse cx="300" cy="720" rx="190" ry="22" fill="#000" opacity="0.06"/>
  ${garment}
  ${outline}
  <text x="300" y="770" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" letter-spacing="4" fill="#9a958c">GAP DEMO</text>
</svg>`;
}

const categoryArt: Record<string, { bg: string; fg: string; garment: SeedProduct["garment"] }> = {
  women: { bg: "#d9d3c9", fg: "#3b2f2a", garment: "jacket" },
  men: { bg: "#c8ccd2", fg: "#6b2d3a", garment: "hoodie" },
  kids: { bg: "#d4dde6", fg: "#22305a", garment: "tee" },
  baby: { bg: "#e3e8e0", fg: "#4a6189", garment: "onesie" },
  girls: { bg: "#e6dbe3", fg: "#b7a4cf", garment: "dress" },
  boys: { bg: "#d4dde6", fg: "#22305a", garment: "tee" },
};

function categorySvg(slug: string) {
  const art = categoryArt[slug];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <rect width="600" height="600" fill="${art.bg}"/>
  <g transform="translate(0,-60) scale(1,0.9)">${garments[art.garment](art.fg)}</g>
</svg>`;
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e4da"/><stop offset="1" stop-color="#cfd5df"/></linearGradient></defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <g transform="translate(120,40) scale(0.9)">${garments.hoodie("#22305a")}</g>
  <g transform="translate(420,60) scale(0.9)">${garments.jeans("#4a6189")}</g>
  <g transform="translate(720,40) scale(0.9)">${garments.sweater("#d8cfc2")}</g>
</svg>`;
}

const outProducts = path.join(process.cwd(), "public", "products");
const outCategories = path.join(process.cwd(), "public", "categories");
mkdirSync(outProducts, { recursive: true });
mkdirSync(outCategories, { recursive: true });

let count = 0;
for (const p of products) {
  for (const color of p.colors) {
    const file = path.join(process.cwd(), "public", imageUrl(p.slug, color.name));
    writeFileSync(file, productSvg(p, color.hex));
    count++;
  }
}
for (const c of categories) {
  writeFileSync(path.join(outCategories, `${c.slug}.svg`), categorySvg(c.slug));
}
writeFileSync(path.join(process.cwd(), "public", "hero.svg"), heroSvg());
console.log(`Wrote ${count} product images, ${categories.length} category tiles and hero.svg`);
