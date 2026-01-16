import { getSiteUrl } from "@/lib/seo";
export default function robots() {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio"]
    },
    sitemap: `${base}/sitemap.xml`,
    host: base
  }
}