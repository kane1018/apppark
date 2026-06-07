import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

/**
 * 規約・ポリシー系ページの共通レイアウト。
 */
export function LegalPage({
  title,
  lead,
  crumbs,
  lastUpdated,
  children,
  width = "narrow",
}: {
  title: string;
  lead?: string;
  crumbs: Crumb[];
  lastUpdated?: string;
  children: React.ReactNode;
  width?: "narrow" | "wide";
}) {
  const current = crumbs[crumbs.length - 1];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description: lead ?? siteConfig.description,
          path: current?.path ?? "/",
        })}
      />
      <Breadcrumbs items={crumbs} />
      <div className={`mx-auto mt-4 ${width === "wide" ? "max-w-4xl" : "max-w-3xl"}`}>
        <header className="mb-6">
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">{title}</h1>
          {lead && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{lead}</p>}
          {lastUpdated && (
            <p className="mt-2 text-xs text-ink-faint">最終更新日：{lastUpdated}</p>
          )}
        </header>
        {children}
      </div>
    </div>
  );
}
