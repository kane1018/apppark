import type { Metadata } from "next";
import Link from "next/link";
import { purposes } from "@/data/purposes";
import { getServicesByPurpose } from "@/data/services";
import {
  audienceTags,
  toolTypeTags,
  pricingTags,
  statusTags,
} from "@/data/tags";
import type { TagDef } from "@/types";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PurposeCard } from "@/components/PurposeCard";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "目的・タグから探す",
  description:
    "「文章を作りたい」「AIを試したい」などの目的タグに加え、利用者・立場、ツール形式、料金形態、運営状態からWebサービスを探せます。",
  path: "/purposes",
});

export default function PurposesPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "目的・タグから探す", path: "/purposes" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "目的・タグから探す",
          description:
            "目的タグ・利用者別タグ・ツール形式タグ・料金タグ・運営状態タグから、やりたいことに合うWebサービスを探せます。",
          path: "/purposes",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">目的・タグから探す</h1>
        <p className="mt-2 text-sm text-ink-soft">
          「やりたいこと」や、利用シーン・立場・ツール形式・料金・運営状態など、いろいろな切り口でWebサービスを探せます。
        </p>
      </header>

      {/* 目的タグ */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold text-brand-900">目的から探す</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {purposes.map((p) => (
            <PurposeCard
              key={p.slug}
              purpose={p}
              count={getServicesByPurpose(p.slug).length}
            />
          ))}
        </div>
      </section>

      {/* 利用者別タグ */}
      <TagSection
        title="職種・立場から探す"
        description="自分の立場・職種に合わせて探せます。"
        tags={audienceTags}
      />

      {/* ツール形式タグ */}
      <TagSection
        title="ツール形式から探す"
        description="診断・計算・テンプレートなど、ツールの形式から探せます。"
        tags={toolTypeTags}
      />

      {/* 料金タグ */}
      <TagSection
        title="料金形態から探す"
        description="無料・有料・登録不要など、料金形態から探せます。"
        tags={pricingTags}
      />

      {/* 運営状態タグ */}
      <TagSection
        title="運営状態から探す"
        description="公開中・β版・開発中など、サービスの状態から探せます。"
        tags={statusTags}
      />
    </div>
  );
}

function TagSection({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: TagDef[];
}) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-brand-900">{title}</h2>
      <p className="mt-1 mb-3 text-sm text-ink-soft">{description}</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/tags/${t.slug}`}
              className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-ink-soft ring-1 ring-inset ring-gray-200 transition hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-200"
            >
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
