"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import clsx from "clsx";

type Props = { locale: string; dict: any };
type Item = { href?: string; i18n: string; children?: Item[] };

const buildMenu = (locale: string): Item[] => [
  { href: `/${locale}`, i18n: "menu.home" },
  { href: `/${locale}/news`, i18n: "menu.news" },
  { href: `/${locale}/events`, i18n: "menu.events" },

  // 検証情報（見出しページに直リンク + 子）
  {
    href: `/${locale}/research`,
    i18n: "menu.research",
    children: [
      { href: `/${locale}/research/calc`, i18n: "menu.calc" }, // ダメージ計算式
      { href: `/${locale}/research/buffs`, i18n: "menu.buffs" } // バフデバフ効果
    ]
  },

  // キャラクター（見出し + 子）
  {
    href: `/${locale}/characters`,
    i18n: "menu.characters",
    children: [
      {
        href: `/${locale}/characters/builds`,
        i18n: "menu.characters_builds"
      }, // おすすめ編成
      {
        href: `/${locale}/characters/dps`,
        i18n: "menu.characters_dps"
      }, // DPSデータ
      {
        href: `/${locale}/characters/gear`,
        i18n: "menu.characters_gear"
      } // 装備・アクセサリー
    ]
  },

  // 武器（見出し + 子）
  {
    href: `/${locale}/weapons`,
    i18n: "menu.weapons",
    children: [
      {
        href: `/${locale}/weapons/skills`,
        i18n: "menu.weapons_skills"
      }, // 武器スキル
      {
        href: `/${locale}/weapons/traits`,
        i18n: "menu.weapons_traits"
      } // 基質
    ]
  },

  // 基地（見出し + 子）
  {
    href: `/${locale}/base`,
    i18n: "menu.base",
    children: [
      {
        href: `/${locale}/base/production`,
        i18n: "menu.base_production"
      }, // 生産・加工施設
      {
        href: `/${locale}/base/agriculture`,
        i18n: "menu.base_agriculture"
      }, // 農業
      {
        href: `/${locale}/base/materials`,
        i18n: "menu.base_materials"
      } // 素材
    ]
  },

  // フィールド（見出し + 子）
  {
    href: `/${locale}/field`,
    i18n: "menu.field",
    children: [
      {
        href: `/${locale}/field/char-mats`,
        i18n: "menu.field_char_mats"
      }, // 強化素材（キャラクター）
      {
        href: `/${locale}/field/weapon-mats`,
        i18n: "menu.field_weapon_mats"
      }, // 強化素材（武器）
      {
        href: `/${locale}/field/misc`,
        i18n: "menu.field_misc"
      } // その他
    ]
  },

  // 敵情報（見出し + 子）
  {
    href: `/${locale}/enemies`,
    i18n: "menu.enemies",
    children: [
      {
        href: `/${locale}/enemies/boss`,
        i18n: "menu.enemies_boss"
      }, // ボス
      {
        href: `/${locale}/enemies/medium`,
        i18n: "menu.enemies_medium"
      }, // 中型
      {
        href: `/${locale}/enemies/small`,
        i18n: "menu.enemies_small"
      } // 小型
    ]
  }
];

export function Sidebar({ locale, dict }: Props) {
  const pathname = usePathname() || "";
  const menu = buildMenu(locale);

  return (
    <div className="inner">
      {/* 既存の検索UIはそのまま */}
      <div className="label">{t(dict, "site.search")}</div>
      <form className="relative" role="search">
        <span className="input-icon">🔍</span>
        <input
          className="input has-icon text-sm"
          placeholder={t(dict, "site.search")}
          name="q"
        />
      </form>

      <nav className="text-sm mt-2">
        <ul>
          {menu.map((m, i) => (
            <li key={i} className={clsx(m.children && "navgroup")}>
              {m.href ? (
                <Link
                  href={m.href as any}
                  className={clsx(
                    "navitem",
                    pathname === m.href && "active"
                  )}
                >
                  {t(dict, m.i18n)}
                </Link>
              ) : (
                <div className="gtitle">{t(dict, m.i18n)}</div>
              )}

              {m.children && (
                <ul className="ml-3">
                  {m.children.map((c, j) => (
                    <li key={j}>
                      <Link
                        href={c.href as any}
                        className={clsx(
                          "navitem",
                          pathname === c.href && "active"
                        )}
                      >
                        {t(dict, c.i18n)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
