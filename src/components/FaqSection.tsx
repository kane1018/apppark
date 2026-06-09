import { JsonLd } from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/seo";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * よくある質問（FAQ）セクション。
 * 画面表示と同時に FAQPage 構造化データ（JSON-LD）を出力します。
 * サーバーコンポーネント（フックなし）なので、各ページに直接置けます。
 */
export function FaqSection({
  items,
  title = "よくある質問",
}: {
  items: FaqItem[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <JsonLd data={faqPageJsonLd(items)} />
      <h2 className="section-title">{title}</h2>
      <dl className="mt-3 space-y-3">
        {items.map((f) => (
          <div key={f.q} className="card p-4 sm:p-5">
            <dt className="text-sm font-bold text-brand-900">Q. {f.q}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">A. {f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
