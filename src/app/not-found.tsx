import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-content flex flex-col items-center py-24 text-center">
      <p className="text-6xl font-black text-brand-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-900">
        ページが見つかりませんでした
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        お探しのページは移動または削除された可能性があります。
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          トップへ戻る
        </Link>
        <Link href="/services" className="btn-outline">
          サービスを探す
        </Link>
      </div>
    </div>
  );
}
