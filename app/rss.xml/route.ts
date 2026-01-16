import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  // 必要に応じて Sanity から記事一覧を取得してループしてください
  const items = [
    { title: "サンプル記事", link: "/ja/news", desc: "概要", pub: new Date().toUTCString() }
  ];

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>Endfield Lab RSS</title>
<link>${site}</link>
<description>最新情報フィード</description>
${items.map(i => `
<item>
<title>${i.title}</title>
<link>${site}${i.link}</link>
<description><![CDATA[${i.desc}]]></description>
<pubDate>${i.pub}</pubDate>
</item>`).join("")}
</channel>
</rss>`.trim();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}