import Link from "next/link";

/**
 * 投稿者向け：AppPark内ミニツール作成の訴求＋安全性の注意文。
 * トップページ下部・投稿申請ページで使用。
 */
export function MiniToolPromo({ showCta = false }: { showCta?: boolean }) {
  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-6 sm:p-8">
      <span className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
        ノーコードで作れる
      </span>
      <h2 className="mt-3 text-xl font-black text-brand-900 sm:text-2xl">
        ノーコードで、自分のWebツールを作成・公開できます。
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        プログラミングの知識は不要です。診断、計算、チェックリスト、テンプレート生成などの小さなWebツールを、フォーム入力だけで作成・公開できます。公開URLやサーバー、ドメインを用意していなくても、AppPark上で使えるツールとして掲載できます。
      </p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900/90">
        安全性確保のため、自由なHTMLやJavaScriptを実行する形式ではなく、テンプレート型ミニツールとして公開する仕組みです。
      </div>

      {showCta && (
        <div className="mt-5">
          <Link href="/submit" className="btn-primary">
            ミニツールを作る
          </Link>
        </div>
      )}
    </section>
  );
}
