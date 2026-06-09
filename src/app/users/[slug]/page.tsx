import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServices } from "@/data/services";
import { resolvePublicAuthor } from "@/lib/authors";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Avatar } from "@/components/Avatar";
import { ServiceGrid } from "@/components/ServiceGrid";
import { JsonLd } from "@/components/JsonLd";

/** 投稿者プロフィール：公開するのは nickname / avatar / 掲載物のみ（email等は出さない） */

function authorOf(slug: string) {
  const services = getAllServices();
  const matched = services.filter(
    (s) => resolvePublicAuthor(s.authorId, s.publicAuthorName).slug === slug
  );
  if (matched.length === 0) return null;
  const author = resolvePublicAuthor(matched[0].authorId, matched[0].publicAuthorName);
  return { author, services: matched };
}

export function generateStaticParams() {
  const slugs = new Set(
    getAllServices().map(
      (s) => resolvePublicAuthor(s.authorId, s.publicAuthorName).slug
    )
  );
  return Array.from(slugs).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const data = authorOf(params.slug);
  if (!data) return buildMetadata({ title: "投稿者", path: `/users/${params.slug}` });
  return buildMetadata({
    title: `${data.author.nickname}の掲載サービス・ミニツール一覧`,
    description: `${data.author.nickname}がAppParkに掲載しているWebサービス・AppPark内ミニツールの一覧です。`,
    path: `/users/${params.slug}`,
  });
}

export default function UserProfilePage({ params }: { params: { slug: string } }) {
  const data = authorOf(params.slug);
  if (!data) notFound();
  const { author, services } = data;

  const miniTools = services.filter((s) => s.isInternalMiniTool);
  const externalServices = services.filter((s) => !s.isInternalMiniTool);

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: `${author.nickname}の掲載一覧`, path: `/users/${params.slug}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: `${author.nickname}の掲載サービス・ミニツール一覧`,
          description: `${author.nickname}がAppParkに掲載しているWebサービス・ミニツールの一覧。`,
          path: `/users/${params.slug}`,
        })}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-8 flex items-center gap-4">
        <Avatar name={author.nickname} avatarUrl={author.avatarUrl} size="lg" />
        <div>
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">{author.nickname}</h1>
          <p className="mt-1 text-sm text-ink-soft">
            掲載 {services.length} 件（うちAppPark内ミニツール {miniTools.length} 件）
          </p>
        </div>
      </header>

      {miniTools.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-brand-900">AppPark内ミニツール</h2>
          <ServiceGrid services={miniTools} />
        </section>
      )}

      {externalServices.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-brand-900">掲載サービス</h2>
          <ServiceGrid services={externalServices} />
        </section>
      )}
    </div>
  );
}
