import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllServices,
  getServiceBySlug,
  isInternalToolUrl,
  isConfigMiniTool,
} from "@/data/services";
import { getSeedCommentsForService } from "@/data/comments";
import { getCategory, getCategoryName } from "@/data/categories";
import { getPurposeName } from "@/data/purposes";
import { getTagDef } from "@/data/tags";
import { getSeedIdeaById } from "@/data/ideas";
import { getSimilarServices } from "@/lib/filters";
import { formatDate } from "@/lib/labels";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { siteConfig, SERVICE_DISCLAIMER } from "@/config/site";
import { PricingBadge, SponsorTag, StatusBadge } from "@/components/badges";
import { recruitmentMeta, hasConsultation } from "@/lib/recruitment";
import { RecruitmentStatusBadges } from "@/components/recruitment/RecruitmentStatusBadges";
import { RecruitmentNotice } from "@/components/recruitment/RecruitmentNotice";
import { StatsDisplay } from "@/components/StatsDisplay";
import { Thumbnail } from "@/components/Thumbnail";
import { TagList } from "@/components/TagList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalServiceButton } from "@/components/ExternalServiceButton";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SimilarServices } from "@/components/SimilarServices";
import { ServiceGallery } from "@/components/ServiceGallery";
import { HelpfulButton } from "@/components/HelpfulButton";
import { MiniTool } from "@/components/minitool/MiniTool";
import { CommentSection } from "@/components/comments/CommentSection";
import { SponsorBanner } from "@/components/SponsorBanner";
import { JsonLd } from "@/components/JsonLd";
import { IconGlyph } from "@/components/icons";

export function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: "サービス詳細", path: "/services" });
  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
    ogType: "article",
    // og:image / twitter:image は opengraph-image.tsx（サービス別の動的PNG）が提供
    omitOgImage: true,
  });
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const similar = getSimilarServices(getAllServices(), service, 3);
  const comments = getSeedCommentsForService(service.id);
  const configTool = isConfigMiniTool(service);
  const internalRoute = !configTool && isInternalToolUrl(service.url);
  const isDev = service.listingType === "development";
  const isIframe = service.listingType === "iframe_embed";
  const iframeApproved = isIframe && service.iframeEmbed.approved && !!service.iframeEmbed.url;

  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "サービス一覧", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  // 構造化データ：SoftwareApplication（掲載サービス）
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: service.name,
    description: service.shortDescription,
    applicationCategory: getCategoryName(service.category),
    url: `${siteConfig.url}/services/${service.slug}`,
    // 無料サービスのみ価格0のOfferを付与（有料は価格不明のため offers を出さない）
    ...(service.pricing === "free"
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } }
      : {}),
  };

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={appJsonLd} />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-4xl space-y-10">
        {/* 1. 基本情報 */}
        <section>
          <div className="card overflow-hidden">
            <div className="relative">
              <Thumbnail service={service} rounded="rounded-none" />
              <div className="absolute left-3 top-3 flex gap-1.5">
                {service.isSponsored && (
                  <SponsorTag label={service.sponsorLabel ?? "PR"} />
                )}
                {service.isFirstParty && (
                  <span className="rounded-md bg-brand-900/70 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
                    運営作成
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-1.5">
                <PricingBadge pricing={service.pricing} />
                <StatusBadge status={service.status} />
                <Link
                  href={`/categories/${service.category}`}
                  className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                >
                  {getCategory(service.category)?.icon && (
                    <IconGlyph name={getCategory(service.category)!.icon} size={13} />
                  )}
                  {getCategoryName(service.category)}
                </Link>
              </div>

              <div>
                <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">
                  {service.name}
                </h1>
                <p className="mt-2 text-sm text-ink-soft sm:text-base">
                  {service.shortDescription}
                </p>
              </div>

              {/* 詳細カテゴリ */}
              {service.subCategories.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {service.subCategories.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`/services?category=${service.category}&sub=${encodeURIComponent(sub)}`}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* 目的タグ */}
              {service.purposes.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {service.purposes.map((p) => (
                    <li key={p}>
                      <Link
                        href={`/purposes/${p}`}
                        className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-100"
                      >
                        {getPurposeName(p)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* 利用者・ツール形式・料金・運営状態タグ（タグ単独ページへ） */}
              {(() => {
                const tagSlugs = [
                  ...service.toolTypeTags,
                  ...service.audienceTags,
                  ...service.pricingTags,
                  ...service.statusTags,
                ];
                const tagDefs = tagSlugs
                  .map((s) => getTagDef(s))
                  .filter((t): t is NonNullable<typeof t> => Boolean(t));
                if (tagDefs.length === 0) return null;
                return (
                  <ul className="flex flex-wrap gap-1.5">
                    {tagDefs.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/tags/${t.slug}`}
                          className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-ink-faint ring-1 ring-inset ring-gray-200 hover:bg-brand-50 hover:text-brand-700"
                        >
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
              })()}

              <TagList tags={service.tags} linkToSearch />

              {/* 利用実績の数値は、実データの集計が整ってから表示します（架空の数値は出しません） */}
              {siteConfig.showUsageStats && (
                <StatsDisplay
                  views={service.views}
                  clicks={service.clicks}
                  helpfulCount={service.helpfulCount}
                />
              )}

              <dl className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-faint">
                <div className="flex gap-1">
                  <dt>掲載日：</dt>
                  <dd className="font-semibold text-ink-soft">{formatDate(service.createdAt)}</dd>
                </div>
                <div className="flex gap-1">
                  <dt>更新日：</dt>
                  <dd className="font-semibold text-ink-soft">{formatDate(service.updatedAt)}</dd>
                </div>
                <div className="flex gap-1">
                  <dt>コメント：</dt>
                  <dd className="font-semibold text-ink-soft">{comments.length}件</dd>
                </div>
              </dl>

              {/* 2. メインCTA（掲載タイプ別） */}
              {configTool ? (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <a href="#mini-tool" className="btn-primary w-full sm:w-auto">
                    このページ内で使う ↓
                  </a>
                  <span className="text-[11px] text-ink-faint sm:ml-1">
                    ※ 外部サイトへ移動せず、このページ上で利用できます
                  </span>
                </div>
              ) : internalRoute ? (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <Link href={service.url} className="btn-primary w-full sm:w-auto">
                    このツールを使う
                  </Link>
                  <span className="text-[11px] text-ink-faint sm:ml-1">
                    ※ AppPark内で動くツールです（ブラウザ内で完結）
                  </span>
                </div>
              ) : isDev ? (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                    開発中のサービス
                  </span>
                  <span className="text-sm text-ink-soft">
                    {service.url
                      ? "下記の「サービスを見る」から開けます。"
                      : "現在準備中です。公開予定や進捗は下記をご覧ください。"}
                  </span>
                  {service.url ? (
                    <ExternalServiceButton url={service.url} serviceName={service.name} variant="primary">
                      サービスを見る ↗
                    </ExternalServiceButton>
                  ) : null}
                </div>
              ) : iframeApproved ? (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <a href="#embed" className="btn-primary w-full sm:w-auto">
                    このページ内で使う ↓
                  </a>
                  <ExternalServiceButton url={service.url} serviceName={service.name} variant="outline">
                    公式サイトを開く ↗
                  </ExternalServiceButton>
                </div>
              ) : (
                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                  <ExternalServiceButton url={service.url} serviceName={service.name} variant="primary">
                    サービスを見る ↗
                  </ExternalServiceButton>
                  <ExternalServiceButton url={service.url} serviceName={service.name} variant="outline">
                    公式サイトを開く ↗
                  </ExternalServiceButton>
                  <span className="text-[11px] text-ink-faint sm:ml-1">
                    ※ AppParkの外にある外部サービスが開きます
                  </span>
                </div>
              )}

              {/* 役に立った（ログイン必須） */}
              <HelpfulButton />
            </div>
          </div>
        </section>

        {/* アイデア掲示板から作られたサービス */}
        {service.relatedIdeaId && (
          <section className="rounded-2xl border border-accent-200 bg-accent-50/40 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-ink-soft">
              このサービスは、
              <Link href={`/ideas/${service.relatedIdeaId}`} className="font-bold text-brand-700 underline-offset-2 hover:underline">
                アイデア掲示板の投稿
              </Link>
              をもとに作成されました。
              {getSeedIdeaById(service.relatedIdeaId) && (
                <span className="mt-1 block text-xs text-ink-faint">
                  元のアイデア：「{getSeedIdeaById(service.relatedIdeaId)!.title}」
                </span>
              )}
            </p>
          </section>
        )}

        {/* 3. 何ができるサービスか */}
        <DetailBlock title="何ができるサービスか">
          <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">
            {service.description}
          </p>
        </DetailBlock>

        {/* AppPark内ミニツール本体（このページ内で使える） */}
        {configTool && (
          <section id="mini-tool" className="scroll-mt-24">
            <div className="mb-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-teal-800">このページ内で使えます</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                このミニツールは、AppPark内で作成・掲載されたツールです。外部サイトへ移動せず、このページ上で利用できます。
              </p>
            </div>
            <div className="card p-5 sm:p-6">
              <MiniTool
                type={service.miniTool.type}
                config={service.miniTool.config}
                storageKey={service.id}
              />
            </div>
          </section>
        )}

        {/* iframe埋め込み（管理者承認済みのみ・sandbox付き） */}
        {iframeApproved && (
          <section id="embed" className="scroll-mt-24">
            <DetailBlock
              title="サービス画面（埋め込み）"
              note="外部サイトの埋め込みです。AppParkは埋め込み先の内容・安全性を保証しません。"
            >
              <iframe
                src={service.iframeEmbed.url as string}
                title={`${service.name} の埋め込み`}
                sandbox="allow-scripts allow-forms allow-popups"
                referrerPolicy="no-referrer"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-xl border border-gray-200 bg-white"
              />
            </DetailBlock>
          </section>
        )}

        {/* 開発中サービス情報 */}
        {isDev && (
          <DetailBlock title="開発状況">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-xs font-semibold text-ink-faint">開発状況</dt>
                <dd className="mt-0.5 text-sm text-ink-soft">{service.developmentInfo.status ?? "—"}</dd>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <dt className="text-xs font-semibold text-ink-faint">公開予定</dt>
                <dd className="mt-0.5 text-sm text-ink-soft">{service.developmentInfo.plannedRelease ?? "未定"}</dd>
              </div>
            </dl>
            {!service.url && (
              <p className="mt-3 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-800">
                このサービスは現在準備中です。公開され次第、リンクを追加します。
              </p>
            )}
          </DetailBlock>
        )}

        {/* サービス画面（スクリーンショット）：画像がある場合のみ表示 */}
        {service.galleryImageUrls.length > 0 && (
          <DetailBlock title="サービス画面（スクリーンショット）">
            <ServiceGallery images={service.galleryImageUrls} serviceName={service.name} />
          </DetailBlock>
        )}

        {/* 4. こんな人におすすめ */}
        {service.recommendedFor.length > 0 && (
          <DetailBlock title="こんな人におすすめ">
            <ul className="grid gap-2 sm:grid-cols-2">
              {service.recommendedFor.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-2 rounded-xl bg-brand-50/60 px-3 py-2 text-sm text-ink-soft"
                >
                  <span className="mt-0.5 text-brand-500" aria-hidden>
                    ✓
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}

        {/* 5. 使い方 */}
        {service.howToUse.length > 0 && (
          <DetailBlock title="使い方">
            <ol className="space-y-2">
              {service.howToUse.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>
          </DetailBlock>
        )}

        {/* 6. 使用目的の例 */}
        {service.useCases.length > 0 && (
          <DetailBlock title="使用目的の例">
            <ul className="space-y-1.5">
              {service.useCases.map((u) => (
                <li key={u} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-0.5 text-accent-500" aria-hidden>
                    ●
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </DetailBlock>
        )}

        {/* 7. 注意点 */}
        <DetailBlock title="注意点">
          <ul className="space-y-1.5 text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500" aria-hidden>⚠</span>
              これは AppPark の外にある外部サービスです。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500" aria-hidden>⚠</span>
              利用前に、各サービスの利用規約・プライバシーポリシーをご確認ください。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500" aria-hidden>⚠</span>
              有料プランがある場合は、料金を必ずご確認ください。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-amber-500" aria-hidden>⚠</span>
              入力する情報（個人情報・機密情報など）にご注意ください。
            </li>
            {service.cautions.map((c) => (
              <li key={c} className="flex items-start gap-2">
                <span className="mt-0.5 text-amber-500" aria-hidden>⚠</span>
                {c}
              </li>
            ))}
          </ul>
        </DetailBlock>

        {/* 利用者の感想・質問はコメント欄で受け付けます（実際に投稿されたもののみ表示） */}
        <section>
          <CommentSection
            serviceId={service.id}
            serviceAuthorId={service.authorId}
            initialComments={comments}
          />
        </section>

        {/* 9. 改善要望・バグ報告・通報フォーム */}
        <DetailBlock
          title="改善要望・バグ報告・通報"
          note="気になる点や問題があればお知らせください。"
        >
          <FeedbackForm serviceName={service.name} />
        </DetailBlock>

        {/* 10. 類似サービス */}
        <DetailBlock title="類似サービス">
          <SimilarServices services={similar} />
        </DetailBlock>

        {/* 11. 作者情報 */}
        <DetailBlock title="作者情報">
          <div className="card p-5">
            <p className="text-sm font-bold text-brand-900">{service.authorName}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {service.authorComment}
            </p>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoRow label="作った理由" value={service.reasonCreated} />
              <InfoRow
                label="使用技術"
                value={service.techStack.length ? service.techStack.join("、") : "—"}
              />
              <InfoRow
                label="使用したAIツール"
                value={service.aiToolsUsed.length ? service.aiToolsUsed.join("、") : "—"}
              />
            </dl>

            {service.authorLinks.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-ink-faint">作者SNS・リンク</p>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {service.authorLinks.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                      >
                        {l.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DetailBlock>

        {/* 12. 募集・相談ステータス */}
        {service.recruitmentStatus.length > 0 && (
          <DetailBlock title="募集・相談ステータス">
            <RecruitmentStatusBadges statuses={service.recruitmentStatus} />

            {/* 各ステータスの補足説明 */}
            <ul className="mt-3 space-y-1.5">
              {service.recruitmentStatus.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink-soft">
                  <span className="mt-0.5 text-brand-400" aria-hidden>
                    ・
                  </span>
                  <span>
                    <span className="font-semibold text-ink">
                      {recruitmentMeta[r].label}
                    </span>
                    ：{recruitmentMeta[r].description}
                  </span>
                </li>
              ))}
            </ul>

            {/* 投稿者の補足 */}
            {service.recruitmentNote && (
              <div className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-ink-soft">
                <span className="mb-1 block text-xs font-semibold text-ink-faint">
                  投稿者からの補足
                </span>
                {service.recruitmentNote}
              </div>
            )}

            {/* 譲渡相談可・購入相談可がある場合の注意文 */}
            {hasConsultation(service.recruitmentStatus) && (
              <div className="mt-3">
                <RecruitmentNotice variant="detail" />
              </div>
            )}
          </DetailBlock>
        )}

        {/* 13. 免責表示 */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <h2 className="text-sm font-bold text-amber-800">免責について</h2>
          <p className="mt-2 text-xs leading-relaxed text-amber-900/90">
            {SERVICE_DISCLAIMER}
          </p>
        </section>

        {/* サービス詳細ページ下部のスポンサー枠（セクション26） */}
        <SponsorBanner label="スポンサー" />
      </div>
    </div>
  );
}

/** 詳細ページの汎用セクション（見出し付き） */
function DetailBlock({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      {note && <p className="mt-1 mb-3 text-xs text-ink-faint">{note}</p>}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2">
      <dt className="text-xs font-semibold text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-soft">{value}</dd>
    </div>
  );
}
