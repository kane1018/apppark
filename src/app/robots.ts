import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt を生成（セクション22）。
 */
export default function robots(): MetadataRoute.Robots {
  // β版/デモ公開中（noIndex）はクロールを全面的に禁止し、検索に出にくくする。
  if (siteConfig.noIndex) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
