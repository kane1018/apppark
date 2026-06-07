/**
 * OG画像（next/og）共通ヘルパー。
 * 日本語を描画するため、Google Fonts から「必要な文字だけ」を含む
 * Noto Sans JP（truetype）を取得します（軽量・Vercelで動作）。
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * 指定テキストに必要なグリフのみを含む Noto Sans JP を取得。
 * 取得できない場合は null（その場合 next/og は既定フォントで描画＝英数字のみ正常）。
 */
export async function loadJaFont(
  text: string,
  weight: 400 | 500 | 700 | 900 = 700
): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    // 古い User-Agent を指定すると truetype(ttf) が返る（Satori は woff2 非対応）
    const css = await fetch(api, {
      headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 8.0)" },
    }).then((r) => r.text());
    const url = css.match(
      /src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}
