import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const routes = [
    "/", "/ja", "/en",
    "/ja/news", "/en/news",
    "/ja/events", "/en/events",
    "/ja/research", "/en/research",
    "/ja/weapons", "/en/weapons",
    "/ja/characters", "/en/characters",
    "/ja/base", "/en/base",
    "/ja/field", "/en/field",
    "/ja/enemies", "/en/enemies",
    "/ja/legal/terms", "/en/legal/terms",
    "/ja/legal/privacy", "/en/legal/privacy",
    "/ja/legal/ads", "/en/legal/ads",
    "/ja/legal/disclaimer", "/en/legal/disclaimer",
    "/ja/legal/cookies", "/en/legal/cookies",
    "/ja/legal/copyright", "/en/legal/copyright",
    "/ja/legal/contact", "/en/legal/contact"
  ];
  const now = new Date();
  return routes.map((r) => ({
    url: `${base}${r === "/" ? "" : r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "/" ? 1 : 0.6
  }));
}