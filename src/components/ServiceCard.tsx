import Link from "next/link";
import type { Service } from "@/types";
import { getCategoryName } from "@/data/categories";
import { getPurposeName } from "@/data/purposes";
import { getTagDef } from "@/data/tags";
import { formatDate } from "@/lib/labels";
import { isInternalToolUrl, isConfigMiniTool } from "@/data/services";
import { PricingBadge, SponsorTag, StatusBadge } from "@/components/badges";
import { Thumbnail } from "@/components/Thumbnail";
import { RecruitmentStatusBadges } from "@/components/recruitment/RecruitmentStatusBadges";

/**
 * サービスカード。閲覧者が一目で判断できる情報を表示。
 * - 運営作成ツールは「運営作成」を明示し、「使ってみる」で内部ツールへ
 * - 外部サービスは「サービスを見る ↗」で別タブへ
 * - スポンサーは必ずラベルを明示
 */
export function ServiceCard({ service }: { service: Service }) {
  const configTool = isConfigMiniTool(service);
  const internalRoute = !configTool && isInternalToolUrl(service.url);
  const isDev = service.listingType === "development";

  // カードに出す補助タグ（ツール形式＋利用者）。バッジで表す形式は重複を避けて除外。
  const cardTags = [
    ...service.toolTypeTags.filter(
      (t) => t !== "internal-mini-tool" && t !== "external"
    ),
    ...service.audienceTags,
  ]
    .map((slug) => getTagDef(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-card-hover">
      <div className="relative">
        <Link href={`/services/${service.slug}`} aria-label={`${service.name}の詳細`}>
          <Thumbnail service={service} />
        </Link>
        <div className="absolute left-2 top-2 flex gap-1.5">
          {service.isSponsored && <SponsorTag label={service.sponsorLabel ?? "PR"} />}
          {service.isFirstParty && (
            <span className="rounded-md bg-brand-900/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
              運営作成
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <PricingBadge pricing={service.pricing} />
          <StatusBadge status={service.status} />
          {configTool && (
            <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700 ring-1 ring-inset ring-teal-600/20">
              ページ内ツール
            </span>
          )}
          {isDev && (
            <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-bold text-violet-700 ring-1 ring-inset ring-violet-600/20">
              開発中
            </span>
          )}
          <Link
            href={`/categories/${service.category}`}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
          >
            {getCategoryName(service.category)}
          </Link>
        </div>

        <div>
          <h3 className="text-base font-bold leading-snug text-brand-900">
            <Link href={`/services/${service.slug}`} className="hover:text-brand-600">
              {service.name}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
            {service.shortDescription}
          </p>
        </div>

        {service.purposes.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {service.purposes.slice(0, 2).map((p) => (
              <li key={p}>
                <Link
                  href={`/purposes/${p}`}
                  className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 transition hover:bg-brand-100"
                >
                  {getPurposeName(p)}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ツール形式・利用者タグ（最大3件、超過は「ほか◯件」） */}
        {cardTags.length > 0 && (
          <ul className="flex flex-wrap items-center gap-1">
            {cardTags.slice(0, 3).map((t) => (
              <li
                key={t.slug}
                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-ink-soft"
              >
                {t.name}
              </li>
            ))}
            {cardTags.length > 3 && (
              <li className="text-[11px] font-medium text-ink-faint">
                ほか{cardTags.length - 3}件
              </li>
            )}
          </ul>
        )}

        {/* 募集・相談ステータス（最大3件、超過は「ほか◯件」） */}
        {service.recruitmentStatus.length > 0 && (
          <RecruitmentStatusBadges statuses={service.recruitmentStatus} max={3} />
        )}

        <div className="mt-auto space-y-3 pt-1">
          <p className="text-[11px] text-ink-faint">更新日：{formatDate(service.updatedAt)}</p>

          <div className="flex gap-2">
            <Link
              href={`/services/${service.slug}`}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-xs font-bold text-ink transition hover:border-brand-400 hover:text-brand-600"
            >
              詳細を見る
            </Link>
            {configTool ? (
              <Link
                href={`/services/${service.slug}`}
                className="flex-1 rounded-lg bg-accent-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-accent-600"
              >
                使ってみる
              </Link>
            ) : internalRoute ? (
              <Link
                href={service.url}
                className="flex-1 rounded-lg bg-accent-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-accent-600"
              >
                使ってみる
              </Link>
            ) : isDev ? null : (
              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex-1 rounded-lg bg-accent-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-accent-600"
              >
                サービスを見る ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
