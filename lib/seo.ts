// lib/seo.ts
export type Locale = "ja" | "en";

/** 末尾の / を統一して落とす */
function cleanUrl(url: string) {
  return url.replace(/\/+$/, "");
}

/** サイトURL（prodではNEXT_PUBLIC_SITE_URL、無ければlocalhost） */
export function getSiteUrl() {
  return cleanUrl(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
}

/** 表示名（サイト名） */
export const siteName = "Endfield Lab";

/** locale文字列を ja/en に正規化 */
export function getLang(locale?: string): Locale {
  return locale === "en" ? "en" : "ja";
}

/** /ja /en のベースURL（例: https://.../ja） */
export function getLocaleBaseUrl(siteUrl: string, lang: Locale) {
  return `${siteUrl}/${lang}`;
}

/** Organization（運営主体） */
export function orgJsonLd(params?: {
  siteUrl?: string;
  name?: string;
  logoUrl?: string; // 実在URL推奨
  sameAs?: string[]; // 実在URLのみ
}) {
  const url = cleanUrl(params?.siteUrl ?? getSiteUrl());
  const name = params?.name ?? siteName;

  const obj: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    url,
  };

  if (params?.logoUrl) obj.logo = params.logoUrl;
  if (params?.sameAs?.length) obj.sameAs = params.sameAs;

  return obj;
}

/** WebSite（サイト全体） */
export function webSiteJsonLd(params?: {
  siteUrl?: string;
  siteName?: string;
  lang?: Locale;
  /** 検索ページがある場合のみ： `${siteUrl}/${lang}/search?q={search_term_string}` */
  searchTargetUrl?: string;
}) {
  const url = cleanUrl(params?.siteUrl ?? getSiteUrl());
  const name = params?.siteName ?? siteName;

  const obj: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
  };

  if (params?.lang) obj.inLanguage = params.lang;

  // 検索が実装されている場合のみ入れる（嘘は出さない）
  if (params?.searchTargetUrl) {
    obj.potentialAction = {
      "@type": "SearchAction",
      target: params.searchTargetUrl,
      "query-input": "required name=search_term_string",
    };
  }

  return obj;
}

/** WebPage（ページ固有） */
export function webPageJsonLd(params: {
  pageUrl: string;
  pageName: string;
  siteUrl?: string;
  lang?: Locale;
}) {
  const siteUrl = cleanUrl(params.siteUrl ?? getSiteUrl());

  const obj: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${params.pageUrl}#webpage`,
    url: params.pageUrl,
    name: params.pageName,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
  };

  if (params.lang) obj.inLanguage = params.lang;

  return obj;
}

/** BreadcrumbList（安全版：配列じゃなければ null を返す） */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
  params?: { lang?: Locale }
) {
  if (!Array.isArray(items)) return null;

  const obj: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };

  if (params?.lang) obj.inLanguage = params.lang;

  return obj;
}

/** JSON-LD を script に入れる用（配列/単体どちらもOK） */
export function toJsonLdHtml(jsonLd: unknown) {
  return JSON.stringify(jsonLd);
}
