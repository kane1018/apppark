import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getCategory,
  categorySeoTitle,
  categorySeoDescription,
} from "@/data/categories";
import { getServicesByCategory } from "@/data/services";
import { getPurposeName } from "@/data/purposes";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryNav } from "@/components/CategoryNav";
import { ServiceGrid } from "@/components/ServiceGrid";
import { SponsorBanner } from "@/components/SponsorBanner";
import { JsonLd } from "@/components/JsonLd";
import { IconBadge } from "@/components/icons";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = getCategory(params.slug);
  if (!category) return buildMetadata({ title: "カテゴリ", path: "/categories" });
  return buildMetadata({
    title: categorySeoTitle(category),
    description: categorySeoDescription(category),
    path: `/categories/${category.slug}`,
  });
}

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const items = getServicesByCategory(category.slug);
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "カテゴリ一覧", path: "/categories" },
    { name: category.name, path: `/categories/${category.slug}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={collectionPageJsonLd({
          name: `${category.name}のWebサービス`,
          description: category.description,
          path: `/categories/${category.slug}`,
          items,
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6 flex items-start gap-4">
        <IconBadge name={category.icon} tone="navy" size="lg" />
        <div>
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
            {category.name}
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">{category.description}</p>
        </div>
      </header>

      {/* 詳細カテゴリ（このカテゴリ内で絞り込む導線） */}
      {category.subCategories && category.subCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-brand-800">詳細カテゴリから探す</h2>
          <ul className="flex flex-wrap gap-1.5">
            {category.subCategories.map((sub) => (
              <li key={sub}>
                <Link
                  href={`/services?category=${category.slug}&sub=${encodeURIComponent(sub)}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                >
                  {sub}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 関連する目的タグ */}
      {category.relatedPurposes && category.relatedPurposes.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold text-brand-800">目的から探す</h2>
          <ul className="flex flex-wrap gap-1.5">
            {category.relatedPurposes.map((p) => (
              <li key={p}>
                <Link
                  href={`/purposes/${p}`}
                  className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
                >
                  {getPurposeName(p)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* カテゴリページ上部のスポンサー枠（セクション26） */}
      <div className="mb-6">
        <SponsorBanner label="広告" />
      </div>

      <div className="mb-6">
        <CategoryNav activeSlug={category.slug} />
      </div>

      <p className="mb-4 text-sm text-ink-soft">
        <span className="font-bold text-brand-800">{items.length}</span> 件のサービス
      </p>

      <ServiceGrid
        services={items}
        emptyMessage="このカテゴリにはまだサービスがありません。"
      />
    </div>
  );
}
