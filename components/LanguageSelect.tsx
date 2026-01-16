"use client";

import { usePathname, useRouter } from "next/navigation";

function replaceLocale(pathname: string, next: string): string {
  if (!next) return pathname || "/";
  const segs = (pathname || "/").split("/").filter(Boolean);
  if (segs.length === 0) {
    return "/" + next;
  }
  // first segment is locale: ja, en, etc.
  segs[0] = next;
  return "/" + segs.join("/");
}

export default function LanguageSelect({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const value = (locale || "ja").split("-")[0];

  return (
    <select
      className="lang-select"
      value={value}
      onChange={(e) =>
        router.push(replaceLocale(pathname, e.target.value) as any)
      }
    >
      <option value="ja">JA</option>
      <option value="en">EN</option>
    </select>
  );
}