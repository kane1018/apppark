import type { Metadata } from "next";
import { seedIdeas, getSeedIdeaById } from "@/data/ideas";
import { services } from "@/data/services";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { IdeaProvider } from "@/components/ideas/IdeaProvider";
import { IdeaDetail } from "@/components/ideas/IdeaDetail";

export function generateStaticParams() {
  return seedIdeas.map((i) => ({ id: i.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const idea = getSeedIdeaById(params.id);
  if (!idea) {
    return buildMetadata({ title: "アイデア", description: "アイデア掲示板の投稿。", path: `/ideas/${params.id}` });
  }
  return buildMetadata({
    title: idea.title,
    description: idea.problem.slice(0, 120),
    path: `/ideas/${idea.id}`,
    ogType: "article",
  });
}

/** id から関連サービス（このアイデアから作られたサービス）を解決 */
function findRelatedService(ideaId: string) {
  const idea = getSeedIdeaById(ideaId);
  const svc =
    services.find((s) => s.relatedIdeaId === ideaId) ||
    (idea?.relatedServiceId ? services.find((s) => s.id === idea.relatedServiceId) : undefined);
  return svc ? { slug: svc.slug, name: svc.name } : null;
}

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  const seedIdea = getSeedIdeaById(params.id) ?? null;
  const relatedService = findRelatedService(params.id);

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "アイデア掲示板", path: "/ideas" },
    { name: seedIdea?.title ?? "アイデア", path: `/ideas/${params.id}` },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-3xl">
        <IdeaProvider>
          <IdeaDetail seedIdea={seedIdea} ideaId={params.id} relatedService={relatedService} />
        </IdeaProvider>
      </div>
    </div>
  );
}
