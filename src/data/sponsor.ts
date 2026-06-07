/**
 * スポンサー掲載の枠・仮料金（セクション16）。
 * 料金や枠を変更する場合はこのファイルを編集してください。
 * ※ あくまで仮料金です。初期キャンペーン価格は要相談。
 */

export interface SponsorPlan {
  name: string;
  /** 表示用の料金（円） */
  price: string;
  unit: string;
  description: string;
  highlight?: boolean;
}

export const sponsorPlans: SponsorPlan[] = [
  {
    name: "トップページスポンサー",
    price: "30,000",
    unit: "円 / 月",
    description: "最も目に触れるトップページの注目枠。認知拡大に。",
    highlight: true,
  },
  {
    name: "カテゴリページスポンサー",
    price: "10,000",
    unit: "円 / 月",
    description: "特定カテゴリの閲覧者に絞ってPRできます。",
  },
  {
    name: "サービス一覧ページスポンサー",
    price: "10,000",
    unit: "円 / 月",
    description: "サービスを比較検討している層にリーチ。",
  },
  {
    name: "サービス詳細ページ下部スポンサー",
    price: "5,000",
    unit: "円 / 月",
    description: "個別サービスを見ている関心の高い層へ。",
  },
  {
    name: "スポンサー記事",
    price: "30,000",
    unit: "円 / 本",
    description: "サービスの魅力をしっかり伝える記事広告。",
  },
];

/** スポンサー枠の種類（セクション16-2） */
export const sponsorSlots = [
  "トップページスポンサー",
  "カテゴリページスポンサー",
  "サービス一覧ページスポンサー",
  "サービス詳細ページ下部スポンサー",
  "スポンサー記事",
  "メルマガ・SNS掲載（予定）",
];

/** 想定スポンサー（セクション16-3） */
export const expectedSponsors = [
  "AIツール",
  "ノーコードツール",
  "サーバー・ホスティング",
  "ドメインサービス",
  "デザインツール",
  "動画生成AI",
  "開発者向けSaaS",
  "個人開発者向け講座",
  "士業・小規模事業者向けサービス",
];
