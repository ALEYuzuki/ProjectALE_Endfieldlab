// components/RightRail.tsx
import Image from "next/image";
import { groq } from "next-sanity";
import { sanityClient } from "@/lib/sanityClient";
import { getDict, t } from "@/lib/i18n";

type Props = { locale: string };

// ===============================
// 公式アカウント URL 定義
// ===============================
const OFFICIAL_LINKS = {
  endfield: {
    youtube: {
      ja: "https://www.youtube.com/@ArknightsEndfieldJP",
      en: "https://www.youtube.com/@ArknightsEndfieldEN",
      default: "https://www.youtube.com/@ArknightsEndfield",
    },
    x: {
      ja: "https://x.com/AKEndfield_JP",
      en: "https://x.com/AKEndfield_EN",
      default: "https://x.com/AKEndfield",
    },
  },
  ale: {
    youtube: {
      ja: "https://www.youtube.com/@your-channel-jp",
      en: "https://www.youtube.com/@your-channel-en",
      default: "https://www.youtube.com/@your-channel",
    },
    x: {
      ja: "https://x.com/your_account_jp",
      en: "https://x.com/your_account_en",
      default: "https://twitter.com/your_account",
    },
  },
};

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

  // Sanity GROQ クエリ
  const query = groq`*[_type == $type][0]{ summary, description, content }`;
  const data = await sanityClient.fetch<{ summary?: string; description?: string; content?: any }>(
    query,
    { type: typeForLocale },
    { cache: "no-store" }
  );

  // Portable Text → プレーンテキスト化
  const fromPT = data?.content ? ptToPlainText(data.content) : "";
  const text = (data?.summary || data?.description || fromPT || "").trim();

  return text;
}

// ===============================
// コンポーネント本体
// ===============================
export default async function RightRail({ locale }: Props) {
  const dict = await getDict(locale);
  const D = ((dict?.right ?? dict?.common) || {}) as Record<string, string>;
  const txt = (k: string, fallback: string) => t(D, k, fallback);

  const overview = await fetchSiteOverviewText(locale);
  const base = (locale?.split("-")[0] ?? "ja") as "ja" | "en" | string;

  const getLink = (group: "endfield" | "ale", type: "youtube" | "x") =>
    OFFICIAL_LINKS[group][type][base as "ja" | "en"] ??
    OFFICIAL_LINKS[group][type].default;

  return (
    <aside className="space-y-4">
      {/* === サイト概要（Sanityで管理） === */}
      <section className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
        <h2 className="text-sm font-semibold mb-2">
          {txt("site_overview_title", "サイト概要")}
        </h2>
        {overview ? (
          <p className="text-sm text-neutral-400 whitespace-pre-line">{overview}</p>
        ) : (
          <p className="text-sm text-neutral-500 italic">
            {txt(
              "overview_fallback",
              "Sanity側でサイト概要を設定してください。"
            )}
          </p>
        )}
      </section>

      {/* === 公式アカウント === */}
      <section className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
        <h2 className="text-sm font-semibold mb-3">
          {txt("official_accounts_title", "公式アカウント")}
        </h2>

        {/* Endfield公式 */}
        <h3 className="text-xs font-semibold text-neutral-400 mb-2">
          {txt("endfield_official", "アークナイツ：エンドフィールド公式")}
        </h3>
        <div className="grid gap-2 mb-4">
          <a
            href={getLink("endfield", "youtube")}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg ring-1 ring-neutral-800 hover:ring-neutral-600 transition"
          >
            <Image
              src="/assets/social/endfield_button.svg"
              alt={txt("endfield_official_youtube", "Endfield Official YouTube")}
              width={180}
              height={44}
              className="mx-auto h-11 w-auto"
            />
          </a>
          <a
            href={getLink("endfield", "x")}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg ring-1 ring-neutral-800 hover:ring-neutral-600 transition"
          >
            <Image
              src="/assets/social/x_button.svg"
              alt={txt("endfield_official_x", "Endfield Official X")}
              width={180}
              height={44}
              className="mx-auto h-11 w-auto"
            />
          </a>
        </div>

        {/* ALE公式 */}
        <h3 className="text-xs font-semibold text-neutral-400 mb-2">
          {txt("ale_official", "ALE（サイト運営）アカウント")}
        </h3>
        <div className="grid gap-2">
          <a
            href={getLink("ale", "youtube")}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg ring-1 ring-neutral-800 hover:ring-neutral-600 transition"
          >
            <Image
              src="/assets/social/ale_button.svg"
              alt={txt("ale_official_youtube", "ALE Official YouTube")}
              width={180}
              height={44}
              className="mx-auto h-11 w-auto"
            />
          </a>
          <a
            href={getLink("ale", "x")}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg ring-1 ring-neutral-800 hover:ring-neutral-600 transition"
          >
            <Image
              src="/assets/social/x_button.svg"
              alt={txt("ale_official_x", "ALE Official X")}
              width={180}
              height={44}
              className="mx-auto h-11 w-auto"
            />
          </a>
        </div>
      </section>

      {/* === ポリシー === */}
      <section className="rounded-2xl border border-neutral-800 p-4 bg-neutral-950">
        <h2 className="text-sm font-semibold mb-2">{txt("policies_title", "ポリシー")}</h2>
        <ul className="text-sm grid gap-2">
          <li><a className="aside-link" href={`/${locale}/legal/terms`}>{txt("terms", "利用規約")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/privacy`}>{txt("privacy", "個人情報ガイドライン")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/ads`}>{txt("ads", "広告ガイドライン")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/disclaimer`}>{txt("disclaimer", "免責事項")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/cookies`}>{txt("cookies", "Cookieポリシー")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/copyright`}>{txt("copyright", "著作権・通報（DMCA等)")}</a></li>
          <li><a className="aside-link" href={`/${locale}/legal/contact`}>{txt("contact", "お問い合わせ")}</a></li>
        </ul>
      </section>
    </aside>
  );
}
