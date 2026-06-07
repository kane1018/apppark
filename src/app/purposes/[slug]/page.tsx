import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { purposes, getPurpose } from "@/data/purposes";
import { getServicesByPurpose } from "@/data/services";
import {
  buildMetadata,
  breadcrumbJsonLd,
  collectionPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PurposeNav } from "@/components/PurposeNav";
import { ServiceGrid } from "@/components/ServiceGrid";
import { SponsorBanner } from "@/components/SponsorBanner";
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
    title: purpose.name,
    description: `「${purpose.name}」におすすめのWebサービス一覧。${purpose.description}`,
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
          name: purpose.name,
          description: purpose.description,
          path: `/purposes/${purpose.slug}`,
          items,
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6 flex items-start gap-4">
        <IconBadge name={purpose.icon} tone="orange" size="lg" />
        <div>
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
            {purpose.name}
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">{purpose.description}</p>
        </div>
      </header>

      <div className="mb-6">
        <SponsorBanner label="広告" />
      </div>

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
    </div>
  );
}
