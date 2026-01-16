"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { locale: string };

type Crumb = {
  href: string;
  label: string;
  current?: boolean;
};

const LABELS: Record<string, { ja: string; en: string }> = {
  home: { ja: "ホーム", en: "Home" },
  news: { ja: "ニュース", en: "News" },
  events: { ja: "イベント", en: "Events" },
  research: { ja: "研究・検証", en: "Research" },
  characters: { ja: "キャラクター", en: "Characters" },
  party: { ja: "編成・パーティ", en: "Party" },
  weapons: { ja: "武器", en: "Weapons" },
  base: { ja: "基地", en: "Base" },
  field: { ja: "フィールド", en: "Field" },
  legal: { ja: "ポリシー", en: "Legal" },
};

function tLabel(key: string, locale: string): string {
  const base = (locale || "ja").split("-")[0];
  const entry = LABELS[key];
  if (!entry) return key;
  return base === "ja" ? entry.ja : entry.en;
}

export default function Breadcrumbs({ locale }: Props) {
  const pathname = usePathname() || "/";
  const segments = pathname.split("/").filter(Boolean);

  // ルートにいる場合はパンくずを表示しない
  if (segments.length === 0) {
    return null;
  }

  // 1つ目は locale (/ja/..., /en/...)
  const [currentLocale, ...rest] = segments;
  const basePrefix = `/${currentLocale || "ja"}`;
  const crumbs: Crumb[] = [];

  if (rest.length === 0) {
    // /ja だけなら「Home」のみ
    crumbs.push({
      href: basePrefix,
      label: tLabel("home", locale),
      current: true,
    });
  } else {
    // 最初に Home を置く
    crumbs.push({
      href: basePrefix,
      label: tLabel("home", locale),
      current: false,
    });

    let acc = basePrefix;
    rest.forEach((seg, index) => {
      acc += `/${seg}`;
      const isLast = index === rest.length - 1;
      crumbs.push({
        href: acc,
        label: tLabel(seg, locale),
        current: isLast,
      });
    });
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-neutral-400">
      <ol className="flex flex-wrap gap-1 items-center">
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            {i > 0 && <span className="opacity-60">/</span>}
            {c.current ? (
              <span className="text-neutral-300">{c.label}</span>
            ) : (
              <Link className="nav-link" href={c.href as any}>
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}