import Link from "next/link";

/**
 * 投稿者向け：AppPark内ミニツール作成の訴求＋安全性の注意文。
 * トップページ下部・投稿申請ページで使用。
 */
export function MiniToolPromo({ showCta = false }: { showCta?: boolean }) {
  return (
    <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-6 sm:p-8">
      <span className="inline-flex items-center rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white">
        AppPark内ミニツール
      </span>
      <h2 className="mt-3 text-xl font-black text-brand-900 sm:text-2xl">
        コードを書けなくても、小さなツールを公開できます。
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        AppParkでは、外部サービスURLを掲載するだけでなく、診断、計算、チェックリスト、テンプレート生成などの小さなWebツールを、AppPark内で作成・公開できます。公開URLやサーバー、ドメインを用意していなくても、フォームに沿って入力するだけで、自分のアイデアを使えるツールとして掲載できます。
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          "「AIでアイデアは作ったけれど、公開方法が分からない」",
          "「本格的なアプリ開発は難しい」",
          "「まずは小さなツールとして反応を見たい」",
        ].map((q) => (
          <li key={q} className="rounded-xl bg-white px-3 py-3 text-xs leading-relaxed text-ink-soft shadow-card">
            {q}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm font-semibold text-brand-800">
        そのような人でも、AppPark上でミニツールを公開できます。
      </p>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900/90">
        安全性確保のため、AppPark内ミニツールはテンプレート形式で作成する仕組みです。投稿者が自由にHTMLやJavaScriptを実行できる形式ではありません。
      </div>

      {showCta && (
        <div className="mt-5">
          <Link href="/submit" className="btn-primary">
            ミニツールを作る／掲載申請する
          </Link>
        </div>
      )}
    </section>
  );
}
