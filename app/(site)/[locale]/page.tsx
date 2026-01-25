// app/(site)/[locale]/page.tsx
import Link from "next/link";
import groq from "groq";

import { getDict } from "@/lib/i18n";
import { sanityClient } from "@/lib/sanityClient";
import {
  getLang,
  getSiteUrl,
  getLocaleBaseUrl,
  webPageJsonLd,
  breadcrumbJsonLd,
  toJsonLdHtml,
} from "@/lib/seo";

// ✅ ホームはISR（まずは5分）
export const revalidate = 300;

type ListItem = {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
};

function formatDate(iso?: string, locale?: "ja" | "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function label(locale: "ja" | "en", ja: string, en: string) {
  return locale === "en" ? en : ja;
}

function CardList({
  locale,
  basePath,
  items,
  emptyText,
}: {
  locale: "ja" | "en";
  basePath: "news" | "research" | "events" | "updates";
  items: ListItem[];
  emptyText: string;
}) {
  if (!items?.length) {
    return (
      <div className="h-40 rounded-lg bg-neutral-900/60 border border-neutral-800/60 flex items-center justify-center text-sm text-neutral-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {items.map((it, idx) => {
        const title = it.title ?? "(no title)";
        const date = formatDate(it.date, locale);
        const slug = it.slug; // ✅ ここで取り出すと型が安定する

        const content = (
          <div className="p-3">
            <div className="text-sm font-medium text-neutral-100">{title}</div>
            {date ? <div className="mt-1 text-xs text-neutral-500">{date}</div> : null}
            {it.excerpt ? (
              <div className="mt-2 text-xs text-neutral-400 line-clamp-2">
                {it.excerpt}
              </div>
            ) : null}
          </div>
        );

        const className =
          "block rounded-md border border-neutral-800/60 bg-neutral-900/40 hover:bg-neutral-900/70 transition";

        // ✅ slugが無いものはリンクにしない（壊れたURLを作らない）
        if (!slug) {
          return (
            <div key={`${title}-${idx}`} className={className}>
              {content}
            </div>
          );
        }

        const href = `/${locale}/${basePath}/${slug}`;

        // ✅ typed routes で string が弾かれるのを避ける：UrlObject を渡す
        return (
          <Link
            key={slug}
            href={{ pathname: href }}
            prefetch={false}
            className={className}
          >
            {content}
          </Link>
        );
      })}
    </div>
  );
}

// ✅ Next 15.5: PageProps helper（グローバル）で props を一致させる
export default async function Home(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  const uiLocale: "ja" | "en" = locale === "en" ? "en" : "ja";
  const dict = await getDict(uiLocale);

  const siteUrl = getSiteUrl();
  const lang = getLang(locale);
  const localeBase = getLocaleBaseUrl(siteUrl, lang);

  const homeUrl = `${localeBase}/`;
  const pageName = dict.site.title ?? "ProjectALE EndfieldLab";

  const homeJsonLd = [
    webPageJsonLd({ pageUrl: homeUrl, pageName, lang, siteUrl }),
    breadcrumbJsonLd([{ name: label(uiLocale, "ホーム", "Home"), url: homeUrl }], { lang }),
  ].filter(Boolean);

  // ✅ locale別 Sanity type（あなたの /api/search と合わせる）
  const newsType = uiLocale === "ja" ? "news_ja" : "news_en";
  const eventsType = uiLocale === "ja" ? "events_ja" : "events_en";
  const researchType = uiLocale === "ja" ? "research_ja" : "research_en";
  const updatesType = uiLocale === "ja" ? "updates_ja" : "updates_en"; // 無ければ空でOK

  const qList = groq`*[_type == $type] | order(coalesce(publishedAt, startAt, _createdAt) desc)[0...5]{
    "title": title,
    "slug": slug.current,
    "date": coalesce(publishedAt, startAt, _createdAt),
    "excerpt": excerpt
  }`;

  const [latestNews, research, events, updates] = await Promise.all([
    sanityClient.fetch<ListItem[]>(
      qList,
      { type: newsType },
      { next: { tags: [`home:${uiLocale}`, `news:${uiLocale}`], revalidate: 300 } }
    ),
    sanityClient.fetch<ListItem[]>(
      qList,
      { type: researchType },
      { next: { tags: [`home:${uiLocale}`, `research:${uiLocale}`], revalidate: 300 } }
    ),
    sanityClient.fetch<ListItem[]>(
      qList,
      { type: eventsType },
      { next: { tags: [`home:${uiLocale}`, `events:${uiLocale}`], revalidate: 300 } }
    ),
    sanityClient.fetch<ListItem[]>(
      qList,
      { type: updatesType },
      { next: { tags: [`home:${uiLocale}`, `updates:${uiLocale}`], revalidate: 300 } }
    ),
  ]);

  const emptyText = label(uiLocale, "準備中", "Coming soon");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdHtml(homeJsonLd) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="card md:col-span-1">
          <h2 className="card-title">{label(uiLocale, "最新ニュース", "Latest News")}</h2>
          <CardList locale={uiLocale} basePath="news" items={latestNews ?? []} emptyText={emptyText} />
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{label(uiLocale, "検証情報", "Research")}</h2>
          <CardList locale={uiLocale} basePath="research" items={research ?? []} emptyText={emptyText} />
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{label(uiLocale, "開催中イベント", "Active Events")}</h2>
          <CardList locale={uiLocale} basePath="events" items={events ?? []} emptyText={emptyText} />
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{label(uiLocale, "アップデート情報", "Updates")}</h2>
          <CardList locale={uiLocale} basePath="updates" items={updates ?? []} emptyText={emptyText} />
        </section>

        {/* 広告スペース（仮）は表示しない */}
      </div>
    </>
  );
}
