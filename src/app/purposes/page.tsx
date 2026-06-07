import type { Metadata } from "next";
import { purposes } from "@/data/purposes";
import { getServicesByPurpose } from "@/data/services";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PurposeCard } from "@/components/PurposeCard";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "目的から探す",
  description: "「仕事を効率化したい」「AIを試したい」など、やりたいことからWebサービスを探せます。",
  path: "/purposes",
});

export default function PurposesPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "目的から探す", path: "/purposes" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "目的から探す",
          description:
            "「仕事を効率化したい」「AIを試したい」など、やりたいことからWebサービスを探せます。",
          path: "/purposes",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">目的から探す</h1>
        <p className="mt-2 text-sm text-ink-soft">
          「やりたいこと」からWebサービスを見つけられます。
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {purposes.map((p) => (
          <PurposeCard
            key={p.slug}
            purpose={p}
            count={getServicesByPurpose(p.slug).length}
          />
        ))}
      </div>
    </div>
  );
}
