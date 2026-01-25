// components/RightRail.tsx
import { groq } from "next-sanity";
import { sanityClient } from "@/lib/sanityClient";
import { getDict, t } from "@/lib/i18n";

type Props = { locale: string };

// ===============================
// Sanity サイト概要取得
// ===============================
const LOCALE_TO_TYPE: Record<string, string> = {
  ja: "site_overview_ja",
  en: "site_overview_en",
  zh: "site_overview_zh",
  "zh-TW": "site_overview_zhTW",
  ko: "site_overview_ko",
  de: "site_overview_de",
  fr: "site_overview_fr",
  es: "site_overview_es",
  pt: "site_overview_pt",
  ru: "site_overview_ru",
  it: "site_overview_it",
};

// Portable Text から素テキストを抽出（概要のみ簡易処理）
function ptToPlainText(blocks: any): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((b) =>
      Array.isArray(b?.children)
        ? b.children.map((c: any) => c?.text ?? "").join("")
        : ""
    )
    .join("\n")
    .trim();
}

// Sanity からサイト概要テキストを取得
async function fetchSiteOverviewText(locale: string): Promise<string> {
  const typeForLocale =
    LOCALE_TO_TYPE[locale] ??
    LOCALE_TO_TYPE[locale.split("-")[0]] ??
    "site_overview_en";

  const query = groq`*[_type == $type][0]{ summary, description, content }`;

  const data = await sanityClient.fetch<{
    summary?: string;
    description?: string;
    content?: any;
  }>(query, { type: typeForLocale }, { cache: "no-store" });

  const fromPT = data?.content ? ptToPlainText(data.content) : "";
  const text = (data?.summary || data?.description || fromPT || "").trim();
  return text;
}

// ===============================
// コンポーネント本体（サイト概要のみ表示）
// ===============================
export default async function RightRail({ locale }: Props) {
  const dict = await getDict(locale);
  const D = ((dict?.right ?? dict?.common) || {}) as Record<string, string>;
  const txt = (k: string, fallback: string) => t(D, k, fallback);

  const overview = await fetchSiteOverviewText(locale);

  return (
    <aside className="space-y-4">
      {/* === サイト概要（Sanityで管理） === */}
      <section className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
        <h2 className="text-sm font-semibold mb-2">
          {txt("site_overview_title", "サイト概要")}
        </h2>

        {overview ? (
          <p className="text-sm text-neutral-400 whitespace-pre-line">
            {overview}
          </p>
        ) : (
          <p className="text-sm text-neutral-500 italic">
            {txt("overview_fallback", "Sanity側でサイト概要を設定してください。")}
          </p>
        )}
      </section>
    </aside>
  );
}
