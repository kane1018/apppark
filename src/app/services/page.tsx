import type { Metadata } from "next";
import { getAllServices, getAllTags } from "@/data/services";
import { buildMetadata, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";
import type { FilterState, SortKey } from "@/lib/filters";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServicesExplorer } from "@/components/ServicesExplorer";
import { SponsorBanner } from "@/components/SponsorBanner";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "サービス一覧",
  description:
    "掲載されているWebサービスを、キーワード・カテゴリ・目的・タグ・料金・運営状況で絞り込んで探せます。",
  path: "/services",
});

const validSorts: SortKey[] = ["new", "views", "clicks", "helpful"];

export default function ServicesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const services = getAllServices();
  const tags = getAllTags();

  const sortParam = typeof searchParams.sort === "string" ? searchParams.sort : "";
  const initial: Partial<FilterState> = {
    keyword: typeof searchParams.q === "string" ? searchParams.q : "",
    category: typeof searchParams.category === "string" ? searchParams.category : "",
    purpose: typeof searchParams.purpose === "string" ? searchParams.purpose : "",
    tag: typeof searchParams.tag === "string" ? searchParams.tag : "",
    sort: validSorts.includes(sortParam as SortKey) ? (sortParam as SortKey) : "new",
  };

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "サービス一覧", path: "/services" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={collectionPageJsonLd({
          name: "サービス一覧",
          description: "AppParkに掲載されているWebサービスの一覧。",
          path: "/services",
          items: services,
        })}
      />

      <Breadcrumbs items={crumbs} />

      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
          サービス一覧
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          やりたいこと・分野・料金などで絞り込んで、あなたに合うWebサービスを見つけましょう。
        </p>
      </header>

      {/* 一覧上部のスポンサー枠（セクション26） */}
      <div className="mb-6">
        <SponsorBanner label="広告" />
      </div>

      <ServicesExplorer allServices={services} allTags={tags} initial={initial} />
    </div>
  );
}
