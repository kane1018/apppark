import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BetaBanner } from "@/components/BetaBanner";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}｜${siteConfig.titleTagline}`,
    template: `%s｜${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    title: `${siteConfig.name}｜${siteConfig.tagline}`,
    description: siteConfig.ogDescription,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: siteConfig.twitterCard,
    ...(siteConfig.twitterSite ? { site: siteConfig.twitterSite } : {}),
    title: `${siteConfig.name}｜${siteConfig.tagline}`,
    description: siteConfig.ogDescription,
    images: [siteConfig.ogImage],
  },
  // β版/デモ公開中は noindex（siteConfig.noIndex）。正式公開時に false にすると index 許可。
  robots: siteConfig.noIndex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  alternates: { canonical: "/" },
  // Google Search Console「HTMLタグ」確認用（環境変数が設定されている場合のみ出力）
  verification: siteConfig.googleSiteVerification
    ? { google: siteConfig.googleSiteVerification }
    : undefined,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b2e4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={siteConfig.lang}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />
        <AuthProvider>
          <BetaBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
