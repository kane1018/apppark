import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReportForm } from "@/components/ReportForm";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "通報・削除依頼",
  description:
    "掲載サービスに関する違法・権利侵害・危険・リンク切れ等の通報や、削除依頼を受け付けます。",
  path: "/report",
});

export default function ReportPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "通報・削除依頼", path: "/report" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "通報・削除依頼",
          description:
            "掲載サービスに関する違法・権利侵害・危険・リンク切れ等の通報や、削除依頼を受け付けます。",
          path: "/report",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
            通報・削除依頼
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            掲載サービスについて、違法の可能性・権利侵害・危険・リンク切れ・内容の相違などがあればご連絡ください。内容を確認し、必要に応じて掲載内容の修正・非公開・削除を検討します。
          </p>
        </header>

        <div className="card p-5 sm:p-6">
          <ReportForm />
        </div>
      </div>
    </div>
  );
}
