// app/(site)/[locale]/page.tsx
import { getDict, t } from "@/lib/i18n";
import {
  getLang,
  getSiteUrl,
  getLocaleBaseUrl,
  webPageJsonLd,
  breadcrumbJsonLd,
  toJsonLdHtml,
} from "@/lib/seo";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const uiLocale: "ja" | "en" = locale === "en" ? "en" : "ja";
  const dict = await getDict(uiLocale);

  const siteUrl = getSiteUrl();
  const lang = getLang(locale);
  const localeBase = getLocaleBaseUrl(siteUrl, lang);

  // ✅ URL表記は揃える（ホームは末尾/ありで統一）
  const homeUrl = `${localeBase}/`;

  const pageName = dict.site.title ?? "ProjectALE EndfieldLab";

  // ✅ ホーム固有の JSON-LD（WebPage + Breadcrumb）
  const homeJsonLd = [
    webPageJsonLd({
      pageUrl: homeUrl,
      pageName,
      lang,
      siteUrl,
    }),
    breadcrumbJsonLd(
      [
        { name: "Home", url: homeUrl },
      ],
      { lang }
    ),
  ].filter(Boolean); // breadcrumb が null の時も安全

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLdHtml(homeJsonLd) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.latestNews")}</h2>
          <div className="h-40 rounded-lg bg-neutral-900/60 border border-neutral-800/60" />
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.featuredGuide")}</h2>
          <p className="text-sm text-neutral-400">{t(dict, "home.notReady")}</p>
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.featuredChar")}</h2>
          <p className="text-sm text-neutral-400">{t(dict, "home.preparing")}</p>
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.trends")}</h2>
          <div className="h-40 rounded-lg bg-neutral-900/60 border border-neutral-800/60" />
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.updates")}</h2>
          <div className="space-y-1 text-sm">
            <div>テスト分析</div>
            <div className="text-neutral-500">2025/09/21 00:00:00</div>
          </div>
        </section>

        <section className="card md:col-span-1">
          <h2 className="card-title">{t(dict, "home.ad")}</h2>
          <div className="flex items-center justify-center h-40 text-xs text-neutral-500">
            300×250
          </div>
        </section>

        <div className="col-span-full text-center text-xs text-neutral-500">
          {t(dict, "home.copy")}
        </div>
      </div>
    </>
  );
}
