import { queryOne } from "../db/client";
import type { PromoCode } from "./types";

export async function findActivePromo(code: string): Promise<PromoCode | null> {
  return queryOne<PromoCode>(
    `SELECT code, kind, value, description FROM promo_codes WHERE code = $1 AND active`,
    [code.trim().toUpperCase()]
  );
}
