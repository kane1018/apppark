import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getCategoryCounts } from "@/data/services";
import { getPurposeName } from "@/data/purposes";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { IconBadge } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "カテゴリ一覧",
  description:
    "AIツール・業務効率化・文章・画像・動画・学習・生活便利・計算診断・サイト制作・AppPark内ミニツールなど、分野ごとに詳細カテゴリからWebサービスを探せます。",
  path: "/categories",
});

export default function CategoriesPage() {
  const counts = getCategoryCounts();
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "カテゴリ一覧", path: "/categories" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "カテゴリ一覧",
          description:
            "分野ごとに、詳細カテゴリ・関連する目的タグからWebサービスを探せます。",
          path: "/categories",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">カテゴリから探す</h1>
        <p className="mt-2 text-sm text-ink-soft">
          大カテゴリ → 詳細カテゴリの順に、{categories.length}の分野からWebサービス・便利ツールを探せます。気になる分野を選んでください。
        </p>
      </header>

      <div className="space-y-4">
        {categories.map((c) => (
          <section key={c.slug} className="card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <IconBadge name={c.icon} tone="navy" size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-lg font-bold text-brand-900">
                    <Link href={`/categories/${c.slug}`} className="hover:text-brand-600">
                      {c.name}
                    </Link>
                  </h2>
                  <span className="text-xs font-semibold text-ink-faint">
                    {counts[c.slug] ?? 0}件のサービス
                  </span>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-xs font-semibold text-brand-600 underline-offset-2 hover:underline"
                  >
                    このカテゴリを見る →
                  </Link>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{c.description}</p>

                {/* 詳細カテゴリ */}
                {c.subCategories && c.subCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                      詳細カテゴリ
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {c.subCategories.map((sub) => (
                        <li key={sub}>
                          <Link
                            href={`/services?category=${c.slug}&sub=${encodeURIComponent(sub)}`}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                          >
                            {sub}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 関連する目的タグ */}
                {c.relatedPurposes && c.relatedPurposes.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                      関連する目的
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {c.relatedPurposes.map((p) => (
                        <li key={p}>
                          <Link
                            href={`/purposes/${p}`}
                            className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
                          >
                            {getPurposeName(p)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
