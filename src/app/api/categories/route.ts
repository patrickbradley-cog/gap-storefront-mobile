import { NextResponse } from "next/server";
import { listCategories } from "@/server/repositories";

export async function GET() {
  return NextResponse.json({ categories: await listCategories() });
}
