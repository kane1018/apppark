import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { IdeaProvider } from "@/components/ideas/IdeaProvider";
import { IdeasExplorer } from "@/components/ideas/IdeasExplorer";

export const metadata: Metadata = buildMetadata({
  title: "アイデア掲示板｜こんなのあったらいいな",
  description:
    "「こういうWebツールが欲しい」「この作業をもっと楽にしたい」など、利用者のアイデアを投稿・閲覧できる掲示板です。投稿されたアイデアは、個人開発者や投稿者が新しいツールを作るヒントになります。",
  path: "/ideas",
});

export default function IdeasPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "アイデア掲示板", path: "/ideas" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "アイデア掲示板",
          description: "利用者が欲しいWebツールのアイデアを投稿・閲覧できる掲示板。",
          path: "/ideas",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6">
        <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-bold text-accent-700">
          こんなのあったらいいな掲示板
        </span>
        <h1 className="mt-3 text-2xl font-black text-brand-900 sm:text-3xl">
          こんなのあったらいいな、を投稿しよう。
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          日々の不便、仕事の面倒、生活の小さな困りごと。あなたの「こういうツールが欲しい」が、誰かの開発アイデアになるかもしれません。
        </p>
      </header>

      {/* 投稿者・開発者向け */}
      <section className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-brand-800">アイデアを見つけて、作ってみよう。</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          AppParkのアイデア掲示板には、利用者が欲しいWebツールのヒントが集まります。個人開発やAppPark内ミニツール作成のテーマ探しに活用できます。
        </p>
      </section>

      <IdeaProvider>
        <IdeasExplorer />
      </IdeaProvider>
    </div>
  );
}
