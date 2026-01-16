// app/(site)/[locale]/layout.tsx
export const revalidate = 1800; // 30分ごとにISR

import type { Metadata } from "next";
import { getDict } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import RightRail from "@/components/RightRail";
import Breadcrumbs from "@/components/Breadcrumbs";

import {
  getLang,
  getSiteUrl,
  getLocaleBaseUrl,
  orgJsonLd,
  webSiteJsonLd,
  toJsonLdHtml,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const uiLocale: "ja" | "en" = locale === "en" ? "en" : "ja";
  const dict = await getDict(uiLocale);

  // ※ ここは最小限。URLが確定していれば canonical/alternates も入れるとベスト
  return {
    title: dict.site.title,
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const uiLocale: "ja" | "en" = locale === "en" ? "en" : "ja";
  const dict = await getDict(uiLocale);

  // --- Schema.org（サイト共通） ---
  const siteUrl = getSiteUrl();
  const lang = getLang(locale);

  // 検索ページが “実在する” ときだけ有効化（嘘は出さない）
  // 例）/ja/search, /en/search を作ったらコメントアウト外す
  // const localeBase = getLocaleBaseUrl(siteUrl, lang);
  // const searchTargetUrl = `${localeBase}/search?q={search_term_string}`;
  const searchTargetUrl: string | undefined = undefined;

  const siteWideJsonLd = [
    webSiteJsonLd({
      siteUrl,
      lang,
      siteName: dict.site.title ?? "ProjectALE EndfieldLab",
      searchTargetUrl,
    }),
    orgJsonLd({
      siteUrl,
      name: "ProjectALE",
      // logoUrl: `${siteUrl}/og/default.png`, // 実在URLなら推奨（あなたの現状に合わせるならこれが無難）
      // sameAs: ["https://www.youtube.com/@...", "https://twitter.com/..."], // 実在のみ
    }),
  ].filter(Boolean);

  return (
    <>
      {/* ✅ Schema.org（全ページ共通で1回だけ） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdHtml(siteWideJsonLd) }}
      />

      <Header locale={uiLocale} dict={dict} />

      <div className="container-pro">
        <div className="site-grid">
          <aside className="left-rail">
            <div className="sticky-rail">
              <Sidebar locale={uiLocale} dict={dict} />
            </div>
          </aside>

          <main>
            <div className="py-5">
              <Breadcrumbs locale={uiLocale} />
              {children}
            </div>
          </main>

          <RightRail locale={uiLocale} />
        </div>
      </div>
    </>
  );
}
