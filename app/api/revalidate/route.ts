export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET || "";
  const got = req.nextUrl.searchParams.get("secret") || "";

  if (!secret || got !== secret) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tags: string[] =
    Array.isArray(body?.tags) && body.tags.length ? body.tags : ["news"];

  for (const t of tags) revalidateTag(t);

  return NextResponse.json({ ok: true, tags });
}
