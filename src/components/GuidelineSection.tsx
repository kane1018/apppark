/**
 * 掲載基準の中身（セクション15）。
 * 掲載しやすいサービス / 掲載を断る可能性が高いサービス / 必須文言。
 */
import { siteConfig } from "@/config/site";

const acceptable = [
  "AIツール",
  "業務効率化ツール",
  "学習・教育サービス",
  "生活便利ツール",
  "クリエイター支援ツール",
  "ミニゲーム",
  "事業者向けツール",
  "開発者向けツール",
  "計算・診断ツール",
  "文章作成ツール",
  "画像・動画関連ツール",
  "個人開発サービス",
  "小規模Webサービス",
];

const rejectable = [
  "違法または違法行為を助長するサービス",
  "詐欺的なサービス",
  "投資・仮想通貨・高リスク金融系",
  "副業・情報商材系",
  "医療・健康診断・薬機法リスクが高いサービス",
  "法律判断を断定するサービス",
  "出会い系・マッチング系",
  "ギャンブル系",
  "アダルト系",
  "著作権・商標権を侵害している可能性が高いサービス",
  "個人情報の取扱いが不明確なサービス",
  "フィッシング、マルウェア、スパム、迷惑行為に関係するサービス",
  "運営が不適切と判断したサービス",
];

export function GuidelineSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-emerald-800">
            <span aria-hidden>✓</span> 掲載しやすいサービス
          </h2>
          <ul className="mt-3 space-y-1.5">
            {acceptable.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-emerald-900/90">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ・
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-rose-800">
            <span aria-hidden>✕</span> 掲載を断る可能性が高いサービス
          </h2>
          <ul className="mt-3 space-y-1.5">
            {rejectable.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-rose-900/90">
                <span className="mt-0.5 text-rose-400" aria-hidden>
                  ・
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 必須文言（セクション15） */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm leading-relaxed text-amber-900/90">
        <p>
          {siteConfig.name}への掲載は、掲載サービスの安全性・合法性・品質・収益性を保証するものではありません。
        </p>
        <p className="mt-2">
          運営者は、掲載後であっても必要に応じて掲載内容の修正、非公開、削除を行うことがあります。
        </p>
      </div>
    </div>
  );
}
