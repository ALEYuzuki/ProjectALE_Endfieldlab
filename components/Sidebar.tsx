"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import clsx from "clsx";
import SearchBox from "@/components/SearchBox";

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
      { href: `/${locale}/research/buffs`, i18n: "menu.buffs" }, // バフデバフ効果
    ],
  },

  // ✅ ここから下はいったん非表示（キャラクター以降）
  // {
  //   href: `/${locale}/characters`,
  //   i18n: "menu.characters",
  //   children: [
  //     { href: `/${locale}/characters/builds`, i18n: "menu.characters_builds" },
  //     { href: `/${locale}/characters/dps`, i18n: "menu.characters_dps" },
  //     { href: `/${locale}/characters/gear`, i18n: "menu.characters_gear" },
  //   ],
  // },
  // {
  //   href: `/${locale}/weapons`,
  //   i18n: "menu.weapons",
  //   children: [
  //     { href: `/${locale}/weapons/skills`, i18n: "menu.weapons_skills" },
  //     { href: `/${locale}/weapons/traits`, i18n: "menu.weapons_traits" },
  //   ],
  // },
  // {
  //   href: `/${locale}/base`,
  //   i18n: "menu.base",
  //   children: [
  //     { href: `/${locale}/base/production`, i18n: "menu.base_production" },
  //     { href: `/${locale}/base/agriculture`, i18n: "menu.base_agriculture" },
  //     { href: `/${locale}/base/materials`, i18n: "menu.base_materials" },
  //   ],
  // },
  // {
  //   href: `/${locale}/field`,
  //   i18n: "menu.field",
  //   children: [
  //     { href: `/${locale}/field/char-mats`, i18n: "menu.field_char_mats" },
  //     { href: `/${locale}/field/weapon-mats`, i18n: "menu.field_weapon_mats" },
  //     { href: `/${locale}/field/misc`, i18n: "menu.field_misc" },
  //   ],
  // },
  // {
  //   href: `/${locale}/enemies`,
  //   i18n: "menu.enemies",
  //   children: [
  //     { href: `/${locale}/enemies/boss`, i18n: "menu.enemies_boss" },
  //     { href: `/${locale}/enemies/medium`, i18n: "menu.enemies_medium" },
  //     { href: `/${locale}/enemies/small`, i18n: "menu.enemies_small" },
  //   ],
  // },
];

function normalizePath(p: string) {
  return p.replace(/\/+$/, "") || "/";
}

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return normalizePath(pathname) === normalizePath(href);
}

function isDescendantActive(
  pathname: string,
  parentHref?: string,
  children?: Item[]
) {
  if (!parentHref || !children?.length) return false;
  const p = normalizePath(pathname);
  const parent = normalizePath(parentHref);

  if (p === parent) return true;
  return children.some((c) => (c.href ? p === normalizePath(c.href) : false));
}

export function Sidebar({ locale, dict }: Props) {
  const pathname = usePathname() || "";
  const menu = useMemo(() => buildMenu(locale), [locale]);

  // 開閉状態：キーは parent.href（無い場合は i18n）
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  // 現在位置に応じて「該当グループは自動展開」
  useEffect(() => {
    setOpenMap((prev) => {
      const next = { ...prev };
      for (const m of menu) {
        if (!m.children?.length) continue;
        const key = m.href ?? m.i18n;
        if (isDescendantActive(pathname, m.href, m.children)) {
          next[key] = true;
        }
      }
      return next;
    });
  }, [pathname, menu]);

  const toggleGroup = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="inner">
      {/* 検索（SearchBox） */}
      <div className="label">{t(dict, "site.search")}</div>
      <SearchBox locale={locale} placeholder={t(dict, "site.search")} />

      <nav className="text-sm mt-2">
        <ul>
          {menu.map((m, i) => {
            const hasChildren = !!m.children?.length;
            const key = m.href ?? m.i18n;
            const isOpen = hasChildren ? !!openMap[key] : false;

            const parentActive = isActive(pathname, m.href);
            const childActive = hasChildren
              ? isDescendantActive(pathname, m.href, m.children)
              : false;

            return (
              <li key={i} className={clsx(hasChildren && "navgroup")}>
                {/* 親行：リンク + 展開ボタン（別） */}
                <div className="flex items-center gap-2">
                  {m.href ? (
                    <Link
                      href={m.href as any}
                      prefetch={false}
                      className={clsx("navitem flex-1", parentActive && "active")}
                    >
                      {t(dict, m.i18n)}
                    </Link>
                  ) : (
                    <div className="gtitle flex-1">{t(dict, m.i18n)}</div>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      aria-expanded={isOpen}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleGroup(key);
                      }}
                      className={clsx(
                        "shrink-0 w-7 h-7 grid place-items-center rounded-md text-sm font-semibold border border-neutral-800/60 bg-neutral-900/40 hover:bg-neutral-900/70 transition",
                        childActive && "border-neutral-700"
                      )}
                    >
                      {isOpen ? "−" : "+"}
                    </button>
                  )}
                </div>

                {/* 子：開いてる時だけ表示 */}
                {hasChildren && isOpen && (
                  <ul className="ml-3 mt-1">
                    {m.children!.map((c, j) => (
                      <li key={j}>
                        <Link
                          href={c.href as any}
                          prefetch={false}
                          className={clsx(
                            "navitem",
                            isActive(pathname, c.href) && "active"
                          )}
                        >
                          {t(dict, c.i18n)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
