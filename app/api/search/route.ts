// app/api/search/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import groq from "groq";

export const runtime = "nodejs";

type Locale = "ja" | "en";

type RawDoc = {
  _type: string;
  title?: string;
  excerpt?: string;
  slug?: string;
  date?: string;
};

type IndexItem = {
  type: "news" | "research" | "event" | "update";
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
};

function normalizeLocale(v: string): Locale {
  const base = (v || "ja").split("-")[0];
  return base === "en" ? "en" : "ja";
}

function normalizeType(t: string): IndexItem["type"] | null {
  // 例: news_ja / news_en を news に寄せる
  if (t.startsWith("news")) return "news";
  if (t.startsWith("events") || t.startsWith("event")) return "event";
  if (t.startsWith("research")) return "research";
  if (t.startsWith("updates") || t.startsWith("update")) return "update";
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = normalizeLocale(searchParams.get("locale") || "ja");

  // あなたの現行設計（言語別_type）に合わせる
  const types =
    locale === "ja"
      ? ["news_ja", "events_ja", "research_ja", "updates_ja", "update_ja", "event_ja"]
      : ["news_en", "events_en", "research_en", "updates_en", "update_en", "event_en"];

  const query = groq`
*[_type in $types]
| order(coalesce(publishedAt, startAt, _updatedAt, _createdAt) desc)[0...2000]{
  _type,
  title,
  excerpt,
  "slug": slug.current,
  "date": coalesce(publishedAt, startAt, _updatedAt, _createdAt)
}
`;

  const docs = await sanityClient.fetch<RawDoc[]>(query, { types });

  // フロント検索用に整形（title/slug必須）
  const items: IndexItem[] = (docs || [])
    .map((d) => {
      const type = normalizeType(d._type);
      if (!type) return null;

      const title = (d.title || "").trim();
      const slug = (d.slug || "").trim();
      if (!title || !slug) return null;

      return {
        type,
        title,
        slug,
        date: d.date,
        excerpt: d.excerpt,
      } satisfies IndexItem;
    })
    .filter(Boolean) as IndexItem[];

  return NextResponse.json(
    { items },
    {
      headers: {
        // ブラウザは毎回取り直さず、CDN/ブラウザに任せる
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
