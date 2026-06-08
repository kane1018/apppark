/**
 * SEO / 構造化データ（JSON-LD）のヘルパー（セクション22）。
 * WebSite / CollectionPage / BreadcrumbList を生成します。
 */
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Service } from "@/types";

interface PageMetaInput {
  title: string;
  description?: string;
  /** サイトルートからのパス（例: "/services"） */
  path?: string;
  /** OGP の type（記事系は "article"）。既定は "website" */
  ogType?: "website" | "article";
  /**
   * true のとき og:image / twitter:image を出力しません。
   * （opengraph-image.tsx などのファイル規約で動的に画像を生成するページ用。重複防止）
   */
  omitOgImage?: boolean;
}

/**
 * 各ページの Metadata（title / description / canonical / OGP / Twitter Card）を生成。
 * canonical は絶対URLで出力するため、Google が正規URLを判定しやすくなります。
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogType = "website",
  omitOgImage = false,
}: PageMetaInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const desc = description ?? siteConfig.description;
  const fullTitle =
    path === "/"
      ? `${siteConfig.name}｜${siteConfig.titleTagline}`
      : `${title}｜${siteConfig.name}`;

  const ogImages = omitOgImage
    ? undefined
    : [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }];

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    // β版/デモ公開中は noindex（siteConfig.noIndex）
    robots: siteConfig.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: ogType,
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: siteConfig.twitterCard,
      title: fullTitle,
      description: desc,
      ...(siteConfig.twitterSite ? { site: siteConfig.twitterSite } : {}),
      ...(omitOgImage ? {} : { images: [siteConfig.ogImage] }),
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** WebSite 構造化データ（トップページ用） */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "ja",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Organization 構造化データ（運営者。サイト全体の発行元として使用） */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.organization.logo}`,
    ...(siteConfig.organization.contactEmail
      ? { email: siteConfig.organization.contactEmail }
      : {}),
  };
}

/** WebPage 構造化データ（個別の通常ページ用） */
export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    inLanguage: "ja",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
  };
}

/** CollectionPage 構造化データ（一覧系ページ用） */
export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: Service[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: `${siteConfig.url}${input.path}`,
    inLanguage: "ja",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.items.length,
      itemListElement: input.items.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteConfig.url}/services/${s.slug}`,
        name: s.name,
      })),
    },
  };
}

/** BreadcrumbList 構造化データ */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteConfig.url}${c.path}`,
    })),
  };
}

/** コピーライト年表記（開始年〜現在） */
export function copyrightYears(): string {
  const current = new Date().getFullYear();
  const start = siteConfig.copyrightStartYear;
  return current > start ? `${start}–${current}` : `${start}`;
}
