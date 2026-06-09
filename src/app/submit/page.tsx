import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SubmitForm } from "@/components/SubmitForm";
import { CreatorBenefits } from "@/components/CreatorBenefits";
import { MiniToolPromo } from "@/components/MiniToolPromo";
import { JsonLd } from "@/components/JsonLd";
import { AuthGate } from "@/components/auth/AuthGate";

export const metadata: Metadata = buildMetadata({
  title: "サービス掲載申請",
  description:
    "作ったWebサービスをAppParkに掲載申請できます。掲載は審査制です。掲載基準・利用規約をご確認のうえお申し込みください。",
  path: "/submit",
});

export default function SubmitPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "サービス掲載申請", path: "/submit" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "サービス掲載申請",
          description:
            "作ったWebサービスをAppParkに掲載申請できます。掲載は審査制です。",
          path: "/submit",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
            あなたのWebサービスを掲載しませんか？
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {siteConfig.name}は、面白いWebサービス・便利ツールを探している人に向けて、個人開発・AIツール・業務効率化ツールなどを紹介するサイトです。作ったサービスを掲載することで、最初のユーザー、フィードバック、改善要望に出会える可能性があります。
          </p>
        </header>

        {/* 掲載者向けメリット */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold text-brand-800">掲載するメリット</h2>
          <CreatorBenefits />
        </section>

        {/* 公開URLがなくてもミニツールを公開できる */}
        <div className="mb-6">
          <MiniToolPromo />
        </div>

        {/* 注意文（審査制） */}
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm leading-relaxed text-amber-900/90">
          掲載申請いただいたすべてのサービスが掲載されるわけではありません。掲載基準に基づき、運営が確認したうえで掲載可否を判断します。
          <a
            href="/guidelines"
            className="ml-1 font-semibold text-amber-800 underline-offset-2 hover:underline"
          >
            掲載基準を見る
          </a>
        </div>

        <AuthGate
          returnTo="/submit"
          heading="サービスを掲載するにはログインが必要です。"
          body="AppParkでは、掲載内容の確認や投稿者への連絡のため、サービス投稿にはログインをお願いしています。ログイン後、Webサービス・便利ツールの掲載申請ができます。"
        >
          <h2 className="mb-3 text-lg font-bold text-brand-900">掲載申請フォーム</h2>
          <SubmitForm />
        </AuthGate>
      </div>
    </div>
  );
}
