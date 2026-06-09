import Link from "next/link";
import { siteConfig } from "@/config/site";
import { services, getCategoryCounts } from "@/data/services";
import { categories, majorCategories } from "@/data/categories";
import { featuredPurposes } from "@/data/purposes";
import { getFeaturedServices, getNewServices } from "@/lib/filters";
import { SearchBar } from "@/components/SearchBar";
import { ServiceGrid } from "@/components/ServiceGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { PurposeCard } from "@/components/PurposeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { CreatorCTA } from "@/components/CreatorCTA";
import { MiniToolPromo } from "@/components/MiniToolPromo";
import { IconBadge, type IconName } from "@/components/icons";

// 今すぐ使えるツール：AppPark内ミニツール中心（最大6件）
const internalTools = services.filter((s) => s.isInternalMiniTool);
const featured = getFeaturedServices(internalTools, 6);
const featuredIds = new Set(featured.map((s) => s.id));
// 新着：今すぐ使えるツールと重複しないものから（外部サービス＋新しいミニツールを混在）
const fresh = getNewServices(
  services.filter((s) => !featuredIds.has(s.id)),
  6
);

const categoryCounts = getCategoryCounts();

// ファーストビュー直下の主要導線（探す／使う／掲載／アイデア）
const hubCards: {
  icon: IconName;
  title: string;
  desc: string;
  cta: string;
  href: string;
  primary?: boolean;
}[] = [
  {
    icon: "globe",
    title: "ツールを探す",
    desc: "目的やカテゴリから、便利なWebサービスを探せます。",
    cta: "サービスを探す",
    href: "/services",
    primary: true,
  },
  {
    icon: "layout-grid",
    title: "ページ内ツールを使う",
    desc: "文字数カウント、画像圧縮、診断、計算など、AppPark内ですぐ使えるミニツールを試せます。",
    cta: "ミニツールを見る",
    href: "/services?internal=1",
  },
  {
    icon: "pen-line",
    title: "自分のツールを掲載する",
    desc: "個人開発サービスやAIツールを掲載できます。公開URLがない場合も、テンプレート型ミニツールとして投稿できます。",
    cta: "掲載申請する",
    href: "/submit",
  },
  {
    icon: "sparkles",
    title: "アイデアを投稿する",
    desc: "「こんなツールが欲しい」というアイデアを投稿できます。個人開発者が作るヒントになります。",
    cta: "アイデアを見る",
    href: "/ideas",
  },
];

const howToSteps = [
  { title: "目的やカテゴリから探す", desc: "やりたいことや分野から見つけます。" },
  { title: "気になるサービスを開く", desc: "何ができるか・料金・使い方を確認。" },
  { title: "ページ内ツールはそのまま使う", desc: "移動せずAppPark上で利用できます。" },
  { title: "外部サービスは公式サイトへ", desc: "外部のものは公式サイトを開いて使います。" },
  { title: "感想や改善要望をコメント", desc: "使ってみた感想や要望を残せます。" },
];

export default function HomePage() {
  return (
    <>
      {/* 1. ファーストビュー */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-800 to-brand-900 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_50%_at_50%_0%,rgba(249,127,18,0.25),transparent_70%)]" />
        <div className="container-content relative py-14 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/15">
            AIツール・便利なWebサービス・AppPark内ミニツールのカタログ
          </p>
          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            {siteConfig.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {siteConfig.heroSubtitle}
          </p>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/60 sm:text-sm">
            {siteConfig.heroLead}
          </p>

          <div className="mt-7 max-w-2xl">
            <SearchBar />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/services" className="btn-primary">
              探す
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
            >
              カテゴリから探す
            </Link>
          </div>
        </div>
      </section>

      <div className="container-content space-y-16 py-12 sm:py-16">
        {/* 2. 4つの主要導線カード */}
        <section aria-label="主要な導線" className="-mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {hubCards.map((c) => (
              <div
                key={c.title}
                className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <IconBadge name={c.icon} tone={c.primary ? "orange" : "navy"} size="md" />
                <h2 className="mt-3 text-base font-bold text-brand-900">{c.title}</h2>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-soft">{c.desc}</p>
                <Link
                  href={c.href}
                  className={`mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    c.primary
                      ? "bg-accent-500 text-white hover:bg-accent-600"
                      : "border border-gray-300 text-brand-700 hover:border-brand-400 hover:bg-brand-50"
                  }`}
                >
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 今すぐ使えるツール（AppPark内ミニツール中心・最大6件） */}
        <section>
          <SectionHeading
            title="今すぐ使えるツール"
            description="ブラウザで移動せず、AppPark内でそのまま使える無料ミニツール。"
            moreHref="/services?internal=1"
          />
          <ServiceGrid services={featured} />
        </section>

        {/* 4. 目的から探す（主要のみ・最大8件） */}
        <section>
          <SectionHeading
            title="目的から探す"
            description="「やりたいこと」からサービスを見つけられます。"
            moreHref="/purposes"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featuredPurposes.map((p) => (
              <PurposeCard key={p.slug} purpose={p} />
            ))}
          </div>
        </section>

        {/* 5. 主要カテゴリ（最大10件・すべては /categories へ） */}
        <section>
          <SectionHeading
            title="主要カテゴリ"
            description="分野ごとにWebサービスをまとめています。"
            moreHref="/categories"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {majorCategories.map((c) => (
              <CategoryCard key={c.slug} category={c} count={categoryCounts[c.slug] ?? 0} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
            >
              すべてのカテゴリを見る（全{categories.length}カテゴリ）→
            </Link>
          </div>
        </section>

        {/* 6. 新着（最大6件） */}
        {fresh.length > 0 && (
          <section>
            <SectionHeading
              title="新着"
              description="最近掲載されたサービス・ツール。"
              moreHref="/services?sort=new"
            />
            <ServiceGrid services={fresh} />
          </section>
        )}

        {/* 7. AppPark内ミニツールの説明（差別化ポイント） */}
        <MiniToolPromo />

        {/* 8. 投稿者向け（作ったサービスを届ける。掲載 or ミニツール作成の2択） */}
        <CreatorCTA />

        {/* 9. AppParkの使い方（5ステップ） */}
        <section className="rounded-2xl bg-brand-50/70 p-6 sm:p-8">
          <SectionHeading title={`${siteConfig.name}の使い方`} />
          <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {howToSteps.map((step, i) => (
              <li key={step.title} className="rounded-xl bg-white p-4 shadow-card">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-bold text-brand-900">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 10. スポンサー掲載について（最下部・控えめ） */}
        <CTASection
          title="スポンサー掲載について"
          description="Webサービスを探す人、AIツール利用者、個人開発に関心のある人へPRできる掲載枠を用意しています。"
          ctaLabel="スポンサー掲載を見る"
          ctaHref="/sponsor"
          tone="muted"
        />
      </div>
    </>
  );
}
