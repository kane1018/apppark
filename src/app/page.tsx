import Link from "next/link";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { categories } from "@/data/categories";
import { purposes } from "@/data/purposes";
import { getFeaturedServices, getNewServices } from "@/lib/filters";
import { SearchBar } from "@/components/SearchBar";
import { ServiceGrid } from "@/components/ServiceGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { PurposeCard } from "@/components/PurposeCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SponsorBanner } from "@/components/SponsorBanner";
import { CTASection } from "@/components/CTASection";
import { CreatorCTA } from "@/components/CreatorCTA";

const featured = getFeaturedServices(services, 6);
// 新着は「注目」と重複しないよう、注目に含まれないサービスから選ぶ
const featuredIds = new Set(featured.map((s) => s.id));
const fresh = getNewServices(
  services.filter((s) => !featuredIds.has(s.id)),
  6
);

const howToSteps = [
  { title: "目的やカテゴリから探す", desc: "やりたいことや分野から、気になるサービスを見つけます。" },
  { title: "詳細ページで確認する", desc: "何ができるか・料金・使い方・注意点をチェックします。" },
  { title: "そのまま使う／公式サイトへ", desc: "運営ツールはその場で、外部サービスは公式サイトを開いて使います。" },
  { title: "コメントで感想を伝える", desc: "使ってみた感想・改善要望・質問をコメントで残せます。" },
  { title: "問題があれば報告する", desc: "リンク切れや不適切な内容は通報できます。" },
];

export default function HomePage() {
  return (
    <>
      {/* 1. ファーストビュー */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-800 to-brand-900 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_50%_at_50%_0%,rgba(249,127,18,0.25),transparent_70%)]" />
        <div className="container-content relative py-14 sm:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/15">
            Webサービス・便利ツール・AIツール・個人開発サービスのカタログ
          </p>
          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
            {siteConfig.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
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
              ツールを探す
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
            >
              カテゴリから探す
            </Link>
          </div>

          {/* 補助導線（控えめ・自然に折り返す） */}
          <p className="mt-6 text-xs leading-relaxed text-white/60">
            <span className="mr-1">Webサービスを作った方は</span>
            <Link href="/submit" className="font-semibold text-white/90 underline-offset-2 hover:underline">
              掲載申請はこちら
            </Link>
            <span aria-hidden className="mx-1.5 text-white/40">
              /
            </span>
            <Link href="/sponsor" className="whitespace-nowrap font-semibold text-white/90 underline-offset-2 hover:underline">
              スポンサー掲載
            </Link>
          </p>
        </div>
      </section>

      <div className="container-content space-y-16 py-12 sm:py-16">
        {/* 2. 目的別に探す */}
        <section>
          <SectionHeading
            title="目的から探す"
            description="「やりたいこと」からサービスを見つけられます。"
            moreHref="/purposes"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {purposes.map((p) => (
              <PurposeCard key={p.slug} purpose={p} />
            ))}
          </div>
        </section>

        {/* 3. 人気カテゴリ */}
        <section>
          <SectionHeading
            title="人気カテゴリ"
            description="分野ごとにWebサービスをまとめています。"
            moreHref="/categories"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>

        {/* 4. 今すぐ使えるツール */}
        <section>
          <SectionHeading
            title="今すぐ使えるツール"
            description="運営が作成した、ブラウザですぐ使える無料ツール。"
            moreHref="/services"
          />
          <div className="mb-4">
            <SponsorBanner label="スポンサー" />
          </div>
          <ServiceGrid services={featured} />
        </section>

        {/* 5. 新着 */}
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

        {/* 7. 使い方 */}
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

        {/* 8. Webサービスを作った方へ（掲載者向けの横長CTA。閲覧者導線の邪魔をしない位置） */}
        <CreatorCTA />

        {/* 9. スポンサー掲載について（最下部） */}
        <CTASection
          title="スポンサー掲載について"
          description="Webサービスを探す人・AIツール利用者・個人開発に関心のある人・小規模事業者にリーチできるスポンサー枠を用意しています。"
          ctaLabel="スポンサー掲載について見る"
          ctaHref="/sponsor"
          tone="muted"
        />
      </div>
    </>
  );
}
