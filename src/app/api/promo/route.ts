import { NextResponse } from "next/server";
import { findActivePromo } from "@/server/repositories";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { code?: string };
  if (!body.code?.trim()) return NextResponse.json({ error: "Enter a promo code." }, { status: 400 });
  const promo = await findActivePromo(body.code);
  if (!promo) return NextResponse.json({ error: "That code isn’t valid or has expired." }, { status: 404 });
  return NextResponse.json({ promo });
}
