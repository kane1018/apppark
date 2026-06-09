import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { purposes, getPurpose } from "@/data/purposes";
import { categories } from "@/data/categories";
import { getServicesByPurpose } from "@/data/services";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import {
  purposeSeoTitle,
  purposeSeoDescription,
  purposeSeoLead,
  purposeFaq,
} from "@/lib/seoContent";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PurposeNav } from "@/components/PurposeNav";
import { ServiceGrid } from "@/components/ServiceGrid";
import { SponsorBanner } from "@/components/SponsorBanner";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { IconBadge } from "@/components/icons";

export function generateStaticParams() {
  return purposes.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const purpose = getPurpose(params.slug);
  if (!purpose) return buildMetadata({ title: "目的", path: "/purposes" });
  return buildMetadata({
    title: purposeSeoTitle(purpose),
    description: purposeSeoDescription(purpose),
    path: `/purposes/${purpose.slug}`,
  });
}

export default function PurposeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const purpose = getPurpose(params.slug);
  if (!purpose) notFound();

  const items = getServicesByPurpose(purpose.slug);
  // 関連カテゴリ：この目的を relatedPurposes に含むカテゴリ
  const relatedCategories = categories.filter((c) =>
    c.relatedPurposes?.includes(purpose.slug)
  );
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "目的から探す", path: "/purposes" },
    { name: purpose.name, path: `/purposes/${purpose.slug}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={collectionPageJsonLd({
          name: purposeSeoTitle(purpose),
          description: purposeSeoDescription(purpose),
          path: `/purposes/${purpose.slug}`,
          items,
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6 flex items-start gap-4">
        <IconBadge name={purpose.icon} tone="orange" size="lg" />
        <div>
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
            {purposeSeoTitle(purpose)}
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">{purpose.description}</p>
        </div>
      </header>

      {/* SEO本文冒頭 */}
      <section className="mb-6">
        <p className="text-sm leading-relaxed text-ink-soft">{purposeSeoLead(purpose)}</p>
      </section>

      {/* 関連カテゴリ（内部リンク強化） */}
      {relatedCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-brand-800">関連カテゴリ</h2>
          <ul className="flex flex-wrap gap-1.5">
            {relatedCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mb-6">
        <SponsorBanner label="広告" />
      </div>

      {/* 関連目的タグ（内部リンク強化） */}
      <div className="mb-6">
        <PurposeNav activeSlug={purpose.slug} />
      </div>

      <p className="mb-4 text-sm text-ink-soft">
        <span className="font-bold text-brand-800">{items.length}</span> 件のサービス
      </p>

      <ServiceGrid
        services={items}
        emptyMessage="この目的に合うサービスはまだありません。"
      />

      {/* FAQ（よくある質問）＋ FAQPage 構造化データ */}
      <div className="mt-12">
        <FaqSection items={purposeFaq(purpose)} />
      </div>
    </div>
  );
}
