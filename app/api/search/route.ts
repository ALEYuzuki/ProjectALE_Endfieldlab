export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import groq from "groq";

export const runtime = "nodejs"; // 髫ｱ・ｭ邵ｺ・ｿ陷ｿ謔ｶ・顔ｸｺ・ｮ邵ｺ・ｿEdge邵ｺ・ｧ

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const locale = (searchParams.get("locale") || "ja") as "ja"|"en";
  if (!q) return NextResponse.json({ hits: [] });

  const types = [
    locale==="ja" ? "news_ja" : "news_en",
    locale==="ja" ? "events_ja" : "events_en",
    locale==="ja" ? "research_ja" : "research_en",
  ];

  const query = groq`*[_type in $types && (title match $m || excerpt match $m)][0...20]{
    _id, _createdAt, title, excerpt, "slug": slug.current, _type
  }`;
  const hits = await sanityClient.fetch(query, { types, m: `*${q}*` });
  return NextResponse.json({ hits });
}