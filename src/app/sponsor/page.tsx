import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/SectionHeading";
import { SponsorPricingTable } from "@/components/SponsorPricingTable";
import { JsonLd } from "@/components/JsonLd";
import { expectedSponsors, sponsorSlots } from "@/data/sponsor";

export const metadata: Metadata = buildMetadata({
  title: "スポンサー掲載について",
  description:
    "Webサービスを探す人・AIツール利用者・個人開発に関心のある人・小規模事業者にリーチできるスポンサー枠のご案内。",
  path: "/sponsor",
});

export default function SponsorPage() {
  const crumbs = [
    { name: "ホーム", path: "/" },
    { name: "スポンサー掲載について", path: "/sponsor" },
  ];

  return (
    <div className="container-content py-8">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={webPageJsonLd({
          name: "スポンサー掲載について",
          description:
            "Webサービスを探す人・AIツール利用者・個人開発に関心のある人・小規模事業者にリーチできるスポンサー枠のご案内。",
          path: "/sponsor",
        })}
      />
      <Breadcrumbs items={crumbs} />

      <div className="mx-auto mt-4 max-w-4xl space-y-12">
        <header>
          <span className="inline-flex items-center rounded-md bg-accent-100 px-2 py-0.5 text-xs font-bold text-accent-700">
            広告・スポンサー
          </span>
          <h1 className="mt-2 text-2xl font-black text-brand-900 sm:text-3xl">
            スポンサー掲載について
          </h1>

          {/* β版の案内（柔らかく・初期パートナー募集を強調） */}
          <div className="mt-4 rounded-2xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-black text-white">
                β版
              </span>
              <span className="text-sm font-bold text-brand-900">
                初期掲載パートナーを募集しています
              </span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              AppParkは現在β版です。下記の料金は<strong className="font-bold text-ink">仮料金</strong>で、
              枠・料金・内容は<strong className="font-bold text-ink">要相談</strong>です。立ち上げ期をご一緒いただける
              初期パートナーには、特別条件やショート動画紹介など柔軟にご相談します。まずはお気軽にお問い合わせください。
            </p>
          </div>
        </header>

        {/* 1. スポンサー掲載とは */}
        <section>
          <SectionHeading title="スポンサー掲載とは" />
          <div className="prose-legal">
            <p>
              スポンサー掲載は、AppParkの閲覧者に向けて、あなたのサービスやツールをPRできる広告枠です。AppParkには、Webサービスを探している人、AIツールの利用者、個人開発に関心のある人、小規模事業者が集まります。
            </p>
            <p>
              これらの層に、サービスの認知拡大・利用促進を図ることができます。スポンサー枠は通常のおすすめ掲載とは区別し、必ず「スポンサー」「PR」「広告」と明示します。
            </p>
          </div>
        </section>

        {/* 2. スポンサー枠の種類 */}
        <section>
          <SectionHeading title="スポンサー枠の種類" />
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {sponsorSlots.map((slot) => (
              <li
                key={slot}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-ink-soft"
              >
                <span className="text-accent-500" aria-hidden>
                  ◆
                </span>
                {slot}
              </li>
            ))}
          </ul>
        </section>

        {/* 3. 想定スポンサー */}
        <section>
          <SectionHeading title="想定スポンサー" />
          <ul className="flex flex-wrap gap-2">
            {expectedSponsors.map((s) => (
              <li
                key={s}
                className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* 4. 仮料金表 */}
        <section>
          <SectionHeading title="仮料金表" description="掲載枠ごとの目安料金です。" />
          <SponsorPricingTable />
        </section>

        {/* 5. 広告表示ルール */}
        <section>
          <SectionHeading title="広告表示ルール" />
          <ul className="space-y-2">
            {[
              "スポンサー枠には必ず「スポンサー」「PR」「広告」と明示します。",
              "通常掲載とスポンサー掲載を明確に区別します。",
              "運営が選ぶおすすめサービスと、広告を混同させません。",
            ].map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-ink-soft"
              >
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* 6. CTA */}
        <section className="rounded-2xl bg-brand-800 p-6 text-white sm:p-8">
          <h2 className="text-lg font-bold sm:text-xl">初期掲載パートナーのご相談</h2>
          <p className="mt-2 text-sm text-white/85">
            β版のいま、立ち上げをご一緒いただける初期掲載パートナーを募集しています。掲載枠・料金・期間・ショート動画紹介など、柔軟にご相談ください。広告資料のご請求も承ります。
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary">
              初期掲載パートナーとして相談する
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
            >
              広告資料を請求する
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
