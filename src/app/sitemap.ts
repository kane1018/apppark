import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllServices } from "@/data/services";
import { categories } from "@/data/categories";
import { purposes } from "@/data/purposes";
import { allTagDefs } from "@/data/tags";
import { seedIdeas } from "@/data/ideas";

/**
 * sitemap.xml を生成（セクション22）。
 * 静的ページ＋サービス・カテゴリ・目的の動的ページを列挙します。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPaths = [
    "/",
    "/services",
    "/categories",
    "/purposes",
    "/ideas",
    "/submit",
    "/sponsor",
    "/guidelines",
    "/report",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/disclaimer",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = getAllServices().map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const purposeEntries: MetadataRoute.Sitemap = purposes.map((p) => ({
    url: `${base}/purposes/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagEntries: MetadataRoute.Sitemap = allTagDefs.map((t) => ({
    url: `${base}/tags/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const ideaEntries: MetadataRoute.Sitemap = seedIdeas.map((i) => ({
    url: `${base}/ideas/${i.id}`,
    lastModified: new Date(i.updatedAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...categoryEntries,
    ...purposeEntries,
    ...tagEntries,
    ...ideaEntries,
  ];
}
