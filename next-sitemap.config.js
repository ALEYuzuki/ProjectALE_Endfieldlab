require("dotenv").config();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    // ここで必要に応じて優先度やlastmodを調整可能
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path.includes("/legal/") ? 0.3 : 0.7,
      lastmod: new Date().toISOString(),
    };
  }
};
