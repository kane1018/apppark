import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { getServicesByCategory } from "@/data/services";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryCard } from "@/components/CategoryCard";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "カテゴリ一覧",
  description: "AIツール・業務効率化・学習・生活便利など、分野ごとにWebサービスを探せます。",
  path: "/categories",
});

export default function CategoriesPage() {
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
            "AIツール・業務効率化・学習・生活便利など、分野ごとにWebサービスを探せます。",
          path: "/categories",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">カテゴリから探す</h1>
        <p className="mt-2 text-sm text-ink-soft">
          分野ごとにWebサービスをまとめています。気になるカテゴリを選んでください。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard
            key={c.slug}
            category={c}
            count={getServicesByCategory(c.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
