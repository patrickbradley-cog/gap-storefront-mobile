import { Pool } from "pg";

declare global {
  var __gapPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!global.__gapPool) {
    const connectionString =
      process.env.DATABASE_URL ?? "postgres://gap:gap@localhost:5432/gap_demo";
    global.__gapPool = new Pool({ connectionString, max: 10 });
  }
  return global.__gapPool;
}

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
