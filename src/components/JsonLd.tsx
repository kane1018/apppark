/**
 * 構造化データ（JSON-LD）を <script type="application/ld+json"> として埋め込む。
 *
 * JSON.stringify は "<" をエスケープしないため、値に "</script>" 等が含まれると
 * スクリプトタグを抜け出される恐れがあります（FAQ・サービス説明など、将来ユーザー由来の
 * 文字列が入りうる）。"<" ">" "&" を Unicode エスケープして安全に埋め込みます。
 */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
