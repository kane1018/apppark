/**
 * スポンサー掲載の枠・参考価格。
 * 料金や枠を変更する場合はこのファイルを編集してください。
 * ※ いずれも参考価格です（要相談）。初期掲載パートナーには特別条件で相談可。
 */

export interface SponsorPlan {
  name: string;
  /** 表示用の料金（数値文字列。"要相談" 等の非数値も可） */
  price: string;
  unit: string;
  description: string;
  highlight?: boolean;
  /** 将来提供予定のプラン（「将来プラン」バッジを表示） */
  upcoming?: boolean;
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
  {
    name: "ショート動画紹介付き掲載",
    price: "要相談",
    unit: "参考価格",
    description: "サービスをショート動画で紹介＋掲載。内容に応じてご相談します。",
    upcoming: true,
  },
  {
    name: "SNS紹介付き掲載",
    price: "要相談",
    unit: "参考価格",
    description: "AppPark公式SNSでの紹介＋掲載。リーチに応じてご相談します。",
    upcoming: true,
  },
];

/** スポンサー枠の種類（セクション16-2） */
export const sponsorSlots = [
  "トップページスポンサー",
  "カテゴリページスポンサー",
  "サービス一覧ページスポンサー",
  "サービス詳細ページ下部スポンサー",
  "スポンサー記事",
  "ショート動画紹介付き掲載（将来プラン）",
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
