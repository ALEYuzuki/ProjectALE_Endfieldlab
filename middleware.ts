import { NextRequest, NextResponse } from "next/server";

/**
 * i18n middleware (optimized)
 * - Supported: ja / en
 * - Exclude: /api, /studio, /_next, sitemap/robots/favicon, static asset dirs
 * - If locale missing:
 *    - "/" only: rewrite to "/ja" (no extra round trip)
 *    - other paths: redirect to "/ja/<path>" (URL is normalized)
 */

const SUPPORTED_LOCALES = ["ja", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "ja";

// RegExp は毎回生成しない（軽量化）
const FILE_EXT_RE = /\.[a-zA-Z0-9]+$/;
const MULTI_SLASH_RE = /\/{2,}/g;

function getLocaleFromPathname(pathname: string): Locale | null {
  // split を避けて startsWith で判定（割と効く）
  for (const l of SUPPORTED_LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return l;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 念のため：拡張子付きは素通し（matcherでも大半は除外済み）
  if (FILE_EXT_RE.test(pathname)) return NextResponse.next();

  // すでに /ja or /en なら何もしない
  if (getLocaleFromPathname(pathname)) return NextResponse.next();

  // 1) ルート "/" は rewrite にして“往復ゼロ”
  //    -> Google検索結果から / を踏んだときの「移動開始が遅い」を削りやすい
  if (pathname === "/") {
    const rewriteUrl = url.clone();
    rewriteUrl.pathname = `/${DEFAULT_LOCALE}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // 2) それ以外はURLを /ja/<path> に統一（SEO的にURLを揃える）
  //    - // を正規化
  //    - クエリは url に残っているので触らなくてOK
  const normalized = pathname.replace(MULTI_SLASH_RE, "/");
  const redirectUrl = url.clone();
  redirectUrl.pathname = `/${DEFAULT_LOCALE}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;

  // 308 = 恒久リダイレクト（/ja が固定ならこちらが無難）
  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: [
    /**
     * 重要：middleware が “無駄に” 走らないように除外を matcher 側に寄せる
     * - api / studio / _next
     * - favicon, robots, sitemap（sitemap-0.xml なども）
     * - 静的っぽいディレクトリ
     * - 拡張子付き全般
     */
    "/((?!api|studio|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-.*\\.xml|static|images|assets|.*\\..*).*)",
  ],
};
