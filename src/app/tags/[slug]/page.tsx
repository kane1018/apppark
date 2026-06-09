import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allTagDefs, getTagDef, tagGroupLabels } from "@/data/tags";
import { getServicesByTagSlug } from "@/data/services";
import type { TagDef, TagGroup } from "@/types";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceGrid } from "@/components/ServiceGrid";
import { SponsorBanner } from "@/components/SponsorBanner";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return allTagDefs.map((t) => ({ slug: t.slug }));
}

/** タググループ → /services のクエリ名 */
const GROUP_QUERY: Record<TagGroup, string> = {
  audience: "audience",
  toolType: "toolType",
  pricing: "pricing",
  status: "status",
};

function tagTitle(tag: TagDef): string {
  return `${tag.name}のWebサービス・便利ツール`;
}

function tagDescription(tag: TagDef): string {
  return `AppParkで「${tag.name}」（${tagGroupLabels[tag.group]}）に当てはまるWebサービス・便利ツールの一覧です。目的・カテゴリと組み合わせて探せます。`;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tag = getTagDef(params.slug);
  if (!tag) return buildMetadata({ title: "タグ", path: "/purposes" });
  return buildMetadata({
    title: tagTitle(tag),
    description: tagDescription(tag),
    path: `/tags/${tag.slug}`,
  });
}

export default function TagDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tag = getTagDef(params.slug);
  if (!tag) notFound();

  const items = getServicesByTagSlug(tag.slug);
  const moreHref = `/services?${GROUP_QUERY[tag.group]}=${tag.slug}`;
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "目的・タグから探す", path: "/purposes" },
    { name: tag.name, path: `/tags/${tag.slug}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={collectionPageJsonLd({
          name: tagTitle(tag),
          description: tagDescription(tag),
          path: `/tags/${tag.slug}`,
          items,
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6">
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          {tagGroupLabels[tag.group]}
        </span>
        <h1 className="mt-2 text-2xl font-black text-brand-900 sm:text-3xl">
          {tag.name}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">{tagDescription(tag)}</p>
      </header>

      <div className="mb-6">
        <SponsorBanner label="広告" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink-soft">
          <span className="font-bold text-brand-800">{items.length}</span> 件のサービス
        </p>
        <Link
          href={moreHref}
          className="text-xs font-semibold text-brand-600 underline-offset-2 hover:underline"
        >
          このタグで詳しく絞り込む →
        </Link>
      </div>

      <ServiceGrid
        services={items}
        emptyMessage="このタグに当てはまるサービスはまだありません。"
      />
    </div>
  );
}
