import ja from "@/dictionaries/ja.json";
import en from "@/dictionaries/en.json";

/** 言語コードから辞書を返す */
export async function getDict(locale: string) {
  switch (locale) {
    case "ja":
      return ja as any;
    default:
      return en as any;
  }
}

/** ネストキーを安全に参照する（"menu.home" → 値） */
export function t(dict: any, key: string, fallback?: string): string {
  const value = key.split(".").reduce((acc: any, cur: string) => acc?.[cur], dict);
  if (typeof value === "string" && value.trim().length > 0) return value;
  return fallback ?? key;
}