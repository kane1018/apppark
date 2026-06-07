import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { getServicesByCategory } from "@/data/services";
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
    title: `${category.name}のWebサービス`,
    description: `${category.name}カテゴリのWebサービス一覧。${category.description}`,
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
