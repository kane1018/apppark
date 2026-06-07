import { ImageResponse } from "next/og";
import { getServiceBySlug } from "@/data/services";
import { getCategoryName } from "@/data/categories";
import { siteConfig } from "@/config/site";
import { OG_SIZE, OG_CONTENT_TYPE, loadJaFont } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AppPark";

/**
 * サービス詳細のOG画像（サービス名入り）。SNSシェア時のクリック率向上のため、
 * サービスごとに固有のOGP画像を動的生成します（PNG・日本語対応）。
 */
export default async function OgImage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  const name = service?.name ?? siteConfig.name;
  const desc = service?.shortDescription ?? siteConfig.tagline;
  const category = service ? getCategoryName(service.category) : "";

  // 描画に必要な文字を集めてサブセットフォントを取得
  const text = `${siteConfig.name}${name}${desc}${category}カテゴリこのサービスでできることをチェック`;
  const [bold, heavy] = await Promise.all([
    loadJaFont(text, 700),
    loadJaFont(text, 900),
  ]);

  const fonts = [
    ...(heavy ? [{ name: "JP", data: heavy, weight: 900 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "JP", data: bold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #142238 0%, #0e1828 100%)",
          fontFamily: "JP",
          color: "#ffffff",
        }}
      >
        {/* ヘッダー：ロゴ＋カテゴリ */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "#243c61",
                padding: 9,
                gap: 6,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: "#fff" }} />
              ))}
            </div>
            <div style={{ fontSize: 38, fontWeight: 900 }}>{siteConfig.name}</div>
          </div>
          {category ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#ffd199",
                background: "rgba(255,255,255,0.08)",
                padding: "8px 20px",
                borderRadius: 999,
              }}
            >
              {category}
            </div>
          ) : null}
        </div>

        {/* サービス名＋一言説明 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.15 }}>{name}</div>
          <div style={{ marginTop: 20, fontSize: 30, color: "#aabbd1", lineHeight: 1.4 }}>
            {desc}
          </div>
        </div>

        {/* フッター */}
        <div style={{ fontSize: 24, color: "#7f96b6" }}>
          このサービスでできることをチェック →
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
