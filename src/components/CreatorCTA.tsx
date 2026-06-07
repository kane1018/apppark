import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * トップページ中盤〜下部に置く、掲載者向けの横長CTAセクション。
 *
 * 方針：サイトの主役は「探す閲覧者」のまま。ここは目立たせすぎず、
 * しかし作った人が見れば「ここに掲載できる」とすぐ分かる明確さにする。
 * id="for-creators" はヘッダーメニューの「Webサービスを作った方へ」から飛んできます。
 */
export function CreatorCTA() {
  return (
    <section
      id="for-creators"
      className="scroll-mt-24 overflow-hidden rounded-2xl bg-brand-800 text-white"
    >
      <div className="relative p-6 sm:p-10">
        <span className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_60%_at_85%_0%,rgba(249,127,18,0.22),transparent_70%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90 ring-1 ring-inset ring-white/15">
              Webサービスを作った方へ
            </p>
            <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
              作ったWebサービスを、見つけてもらいませんか？
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {siteConfig.name}では、個人開発・AIツール・便利なWebサービスの掲載申請を受け付けています。掲載されたサービスは、目的別・カテゴリ別ページから見つけてもらいやすくなり、利用者の感想・改善要望・バグ報告を受け取れるようになります。
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/submit" className="btn-primary whitespace-nowrap">
              無料で掲載申請する
            </Link>
            <Link
              href="/guidelines"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/15"
            >
              掲載基準を見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
