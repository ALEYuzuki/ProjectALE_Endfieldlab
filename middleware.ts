import { NextRequest, NextResponse } from "next/server";

/**
 * 安全な i18n ミドルウェア
 * - 対応言語: ja / en
 * - 除外: /_next, /static, /images 等のアセット、/api、/studio
 * - 先頭に言語がなければ /ja を付けてリダイレクト
 * - 配列に .some() 等をかける前に Array.isArray で防御
 */

const SUPPORTED_LOCALES = ["ja", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function getLocaleFromPath(pathname: string): Locale | null {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg) return null;
  return (SUPPORTED_LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : null;
}

function isExcludedPath(pathname: string): boolean {
  // 静的アセットやAPI、Studioは除外
  const EXCLUDES = [
    "/api",
    "/studio",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/static",
    "/images",
    "/assets"
  ];
  // ここで .some() を使う前に必ず配列チェック
  if (!Array.isArray(EXCLUDES)) return false;
  return EXCLUDES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 除外対象は素通し
  if (isExcludedPath(pathname) || /\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // すでに言語セグメントがあるか？
  const current = getLocaleFromPath(pathname);
  if (current) {
    return NextResponse.next();
  }

  // ない場合は /ja へ付け替え
  const url = req.nextUrl.clone();
  // 先頭/重複スラッシュを吸収
  const normalized = (pathname || "/").replace(/\/{2,}/g, "/");
  url.pathname = `/ja${normalized === "/" ? "" : normalized}`;
  // 検索クエリは維持
  url.search = search || "";
  return NextResponse.redirect(url);
}

// _next などを自動で除外する matcher（静的ファイルを避ける）
export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)"]
};