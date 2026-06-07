/**
 * 構造化データ（JSON-LD）を <script type="application/ld+json"> として埋め込む。
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // 構造化データは静的に生成した値のみを渡すため安全
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
