import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/data/services";
import { getCategory, getCategoryName } from "@/data/categories";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { IconGlyph } from "@/components/icons";
import { toolRegistry } from "@/components/tools/registry";

export function generateStaticParams() {
  return Object.keys(toolRegistry).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: "ツール", path: "/services" });
  return buildMetadata({
    title: `${service.name}｜無料ツール`,
    description: service.shortDescription,
    path: `/tools/${service.slug}`,
  });
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const Tool = toolRegistry[params.slug];
  const service = getServiceBySlug(params.slug);
  if (!Tool || !service) notFound();

  const category = getCategory(service.category);
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "サービス一覧", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
    { name: "ツールを使う", path: `/tools/${service.slug}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-3xl">
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              運営作成
            </span>
            <Link
              href={`/categories/${service.category}`}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700"
            >
              {category?.icon && <IconGlyph name={category.icon} size={13} />}
              {getCategoryName(service.category)}
            </Link>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              無料・ブラウザ内で完結
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-black text-brand-900 sm:text-3xl">{service.name}</h1>
          <p className="mt-2 text-sm text-ink-soft">{service.shortDescription}</p>
        </header>

        {/* ツール本体 */}
        <section className="card p-5 sm:p-6">
          <Tool />
        </section>

        {/* 案内ページへ */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gray-50 px-5 py-4">
          <p className="text-sm text-ink-soft">
            このツールの使い方・注意点・感想（コメント）は紹介ページから。
          </p>
          <Link href={`/services/${service.slug}`} className="btn-outline">
            紹介ページを見る
          </Link>
        </div>
      </div>
    </div>
  );
}
