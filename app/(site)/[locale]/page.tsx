"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import clsx from "clsx";

type IndexItem = {
  type: "news" | "research" | "event" | "update";
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
};

type Props = {
  locale: string;
  placeholder?: string;
  className?: string;
};

const TYPE_TO_PATH: Record<IndexItem["type"], string> = {
  news: "news",
  research: "research",
  event: "events",
  update: "updates",
};

function formatDate(iso?: string, locale?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function SearchBox({ locale, placeholder, className }: Props) {
  const baseLocale = (locale || "ja").split("-")[0];
  const [q, setQ] = useState("");
  const [items, setItems] = useState<IndexItem[] | null>(null);
  const [results, setResults] = useState<IndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const boxRef = useRef<HTMLDivElement | null>(null);

  const fuse = useMemo(() => {
    if (!items?.length) return null;
    return new Fuse(items, {
      keys: [
        { name: "title", weight: 0.75 },
        { name: "excerpt", weight: 0.25 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [items]);

  // インデックス取得（sessionStorageキャッシュ）
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const key = `search-index:${baseLocale}`;
      const cached = sessionStorage.getItem(key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as IndexItem[];
          if (!cancelled) setItems(parsed);
          return;
        } catch {}
      }

      setLoading(true);
      try {
        // ✅ /api/search は { items: [...] } を返す想定（配列直返しにも対応）
        const res = await fetch(`/api/search?locale=${encodeURIComponent(baseLocale)}`, {
          cache: "force-cache",
        });
        const json = await res.json();
        const list = Array.isArray(json) ? (json as IndexItem[]) : (json.items as IndexItem[]);

        if (!cancelled) {
          setItems(list);
          sessionStorage.setItem(key, JSON.stringify(list));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!items) load();
    return () => {
      cancelled = true;
    };
  }, [baseLocale, items]);

  // debounce検索
  useEffect(() => {
    const qq = q.trim();
    if (!qq) {
      setResults([]);
      return;
    }
    const id = window.setTimeout(() => {
      if (!fuse) return;
      const out = fuse.search(qq).slice(0, 12).map((r) => r.item);
      setResults(out);
    }, 150);

    return () => window.clearTimeout(id);
  }, [q, fuse]);

  // 外クリックで閉じる
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const el = boxRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showPanel = open && q.trim().length >= 1;

  return (
    <div ref={boxRef} className={clsx("relative", className)}>
      <div className="relative">
        <span className="input-icon">🔍</span>
        <input
          className="input has-icon text-sm w-full"
          placeholder={placeholder ?? "Search"}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          name="q"
        />
      </div>

      {showPanel && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950 shadow-lg overflow-hidden">
          <div className="px-3 py-2 text-xs text-neutral-500 border-b border-neutral-800">
            {loading ? "Loading..." : items ? `${items.length} items` : "No index"}
          </div>

          {results.length === 0 ? (
            <div className="px-3 py-3 text-sm text-neutral-500">
              {q.trim().length < 2 ? "Type 2+ characters" : "No results"}
            </div>
          ) : (
            <ul className="max-h-[360px] overflow-auto">
              {results.map((r) => {
                const basePath = TYPE_TO_PATH[r.type];
                const href = `/${baseLocale}/${basePath}/${r.slug}`;

                return (
                  <li key={`${r.type}:${r.slug}`}>
                    <Link
                      href={href as any} // ✅ typed routes 回避（動的URLなので必要）
                      prefetch={false}
                      className="block px-3 py-2 hover:bg-neutral-900/60 transition"
                      onClick={() => setOpen(false)}
                    >
                      <div className="text-sm text-neutral-100">{r.title}</div>
                      <div className="mt-0.5 text-xs text-neutral-500 flex gap-2">
                        <span className="uppercase">{r.type}</span>
                        <span>{formatDate(r.date, baseLocale)}</span>
                      </div>
                      {r.excerpt ? (
                        <div className="mt-1 text-xs text-neutral-400 line-clamp-2">
                          {r.excerpt}
                        </div>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
