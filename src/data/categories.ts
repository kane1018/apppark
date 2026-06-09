import type { Category } from "@/types";

/**
 * 大カテゴリ一覧（3層構造の最上位）。
 *   1. 大カテゴリ（この配列）
 *   2. 詳細カテゴリ（各カテゴリの subCategories）
 *   3. 目的タグ・利用シーンタグ（purposes / tags）
 *
 * slug は URL（/categories/[slug]）・検索フィルター・投稿フォームに使われます。
 * isMajor: true のものだけトップページの「主要カテゴリ」に表示します。
 * 既存サービスが参照している slug（ai-tools / productivity / writing /
 * image-design / video-audio / education / lifestyle / calc-diagnosis /
 * dev / creator / mini-tools）は変更しないでください。
 */
export const categories: Category[] = [
  {
    slug: "ai-tools",
    name: "AIツール",
    description: "文章生成、画像生成、動画生成、要約、翻訳など、AIを活用したWebサービスを探せます。",
    icon: "bot",
    isMajor: true,
    relatedPurposes: ["try-ai", "write", "create-image", "work-efficiency"],
    subCategories: [
      "AIチャット", "AI文章生成", "AI要約", "AI翻訳", "AI検索", "AI画像生成",
      "AI動画生成", "AI音声生成", "AI議事録", "AI資料作成", "AIコーディング",
      "AIエージェント", "AI自動化", "AI診断", "AIプロンプト支援",
    ],
  },
  {
    slug: "productivity",
    name: "業務効率化",
    description: "タスク管理、書類作成、問い合わせ対応、情報整理など、日々の仕事を効率化するツールを探せます。",
    icon: "zap",
    isMajor: true,
    relatedPurposes: ["work-efficiency", "business-tools"],
    subCategories: [
      "タスク管理", "スケジュール管理", "メモ・ノート", "情報整理", "自動化",
      "フォーム作成", "申請管理", "顧客管理", "問い合わせ管理", "議事録",
      "社内共有", "業務チェックリスト", "書類作成", "データ整理",
    ],
  },
  {
    slug: "writing",
    name: "文章・ライティング",
    description: "メール・記事・応募書類・コピーなど、文章づくりと手直しに役立つツールを探せます。",
    icon: "pen-line",
    isMajor: true,
    relatedPurposes: ["write", "polish-writing", "creative"],
    subCategories: [
      "メール作成", "応募書類作成", "履歴書・職務経歴書", "志望動機作成",
      "SNS投稿文", "ブログ記事", "商品説明文", "キャッチコピー", "要約",
      "校正", "敬語変換", "文章整形", "台本作成", "小説・創作",
    ],
  },
  {
    slug: "image-design",
    name: "画像・デザイン",
    description: "画像生成・編集・圧縮・ロゴ・配色など、画像とデザインに役立つツールを探せます。",
    icon: "image",
    isMajor: true,
    relatedPurposes: ["create-image", "edit-image"],
    subCategories: [
      "画像生成", "画像編集", "画像圧縮", "背景削除", "サムネイル作成",
      "ロゴ作成", "アイコン作成", "バナー作成", "配色", "UIデザイン",
      "写真加工", "画像拡大", "イラスト作成",
    ],
  },
  {
    slug: "video-audio",
    name: "動画・音声",
    description: "動画生成・編集・字幕・音声合成・文字起こしなど、動画と音声づくりのツールを探せます。",
    icon: "clapperboard",
    isMajor: true,
    relatedPurposes: ["make-video", "make-audio", "grow-sns"],
    subCategories: [
      "動画生成", "動画編集", "ショート動画", "字幕作成", "台本作成",
      "音声合成", "文字起こし", "BGM作成", "ナレーション", "動画要約",
      "YouTube支援", "TikTok支援", "Instagram Reels支援",
    ],
  },
  {
    slug: "education",
    name: "学習・教育",
    description: "勉強計画・暗記・資格試験・語学など、学習と教育に役立つツールを探せます。",
    icon: "graduation-cap",
    isMajor: true,
    relatedPurposes: ["study", "language-support"],
    subCategories: [
      "勉強計画", "暗記", "英語学習", "資格試験", "プログラミング学習",
      "文章読解", "要約学習", "クイズ", "単語帳", "問題作成",
      "学習記録", "子ども向け学習", "大人の学び直し",
    ],
  },
  {
    slug: "lifestyle",
    name: "生活便利",
    description: "家事・料理・健康・家計など、毎日の暮らしを少し便利にするツールを探せます。",
    icon: "house",
    isMajor: true,
    relatedPurposes: ["daily-life", "manage-money"],
    subCategories: [
      "家事", "料理", "献立", "買い物", "掃除", "健康管理", "予定管理",
      "旅行", "引っ越し", "防災", "家計", "生活チェックリスト", "日常メモ",
    ],
  },
  {
    slug: "calc-diagnosis",
    name: "計算・診断",
    description: "料金計算・見積もり・診断・シミュレーションなど、計算と診断のツールを探せます。",
    icon: "calculator",
    isMajor: true,
    relatedPurposes: ["calculate", "diagnose"],
    subCategories: [
      "料金計算", "見積もり", "家計計算", "給与・手取り", "税金", "割合計算",
      "作業時間計算", "診断ツール", "適性診断", "チェックツール",
      "シミュレーター", "比較ツール",
    ],
  },
  {
    slug: "dev",
    name: "サイト制作・開発",
    description: "LP制作・ノーコード・コード生成・SEOチェックなど、サイト制作と開発に役立つツールを探せます。",
    icon: "code-2",
    isMajor: true,
    relatedPurposes: ["build-site", "no-code", "realize-idea"],
    subCategories: [
      "LP制作", "ホームページ制作", "ノーコード", "コード生成", "UI改善",
      "SEOチェック", "OGP作成", "ドメイン・公開", "GitHub支援",
      "Vercel・Netlify支援", "バグ確認", "開発補助", "API連携",
    ],
  },
  {
    slug: "marketing",
    name: "マーケティング・集客",
    description: "SEO・広告・LP改善・アクセス解析など、マーケティングと集客に役立つツールを探せます。",
    icon: "megaphone",
    relatedPurposes: ["get-customers", "grow-sns"],
    subCategories: [
      "SEO", "SNS運用", "広告文作成", "LP改善", "アクセス解析", "キーワード調査",
      "競合分析", "メルマガ", "LINE運用", "YouTube集客", "ショート動画集客",
      "商品紹介", "アフィリエイト支援",
    ],
  },
  {
    slug: "business",
    name: "事業者向け",
    description: "事業計画・請求・顧客管理・予約など、事業者の実務に使えるツールを探せます。",
    icon: "building-2",
    relatedPurposes: ["business-tools", "manage-money"],
    subCategories: [
      "事業計画", "顧客管理", "請求書", "見積書", "契約管理", "問い合わせ対応",
      "業務マニュアル", "採用管理", "店舗運営", "予約管理", "士業向け",
      "個人事業主向け", "小規模法人向け",
    ],
  },
  {
    slug: "creator",
    name: "クリエイター支援",
    description: "ネタ出し・サムネイル・投稿管理・収益化など、クリエイターの制作と発信を助けるツールを探せます。",
    icon: "palette",
    relatedPurposes: ["creative", "grow-sns", "make-video"],
    subCategories: [
      "ネタ出し", "台本作成", "サムネイル作成", "タイトル作成", "音声作成",
      "動画素材", "画像素材", "投稿管理", "ファン管理", "ポートフォリオ",
      "作品紹介", "収益化支援",
    ],
  },
  {
    slug: "entertainment",
    name: "ミニゲーム・エンタメ",
    description: "ブラウザゲーム・クイズ・診断・占いなど、息抜きと遊びに使えるツールを探せます。",
    icon: "gamepad-2",
    relatedPurposes: ["kill-time", "with-friends", "diagnose"],
    subCategories: [
      "ブラウザゲーム", "クイズ", "診断ゲーム", "ランダム生成", "占い",
      "お題生成", "創作支援", "キャラクター作成", "物語生成", "暇つぶし",
      "友達と遊べる", "パーティー向け",
    ],
  },
  {
    slug: "legal",
    name: "法務・契約・士業",
    description: "契約書・規約作成・許認可・士業業務など、法務と契約に役立つツールを探せます。",
    icon: "scale",
    relatedPurposes: ["legal-contract", "gov-procedure"],
    subCategories: [
      "契約書チェック", "契約書作成補助", "利用規約作成", "プライバシーポリシー",
      "許認可", "行政手続き", "在留資格", "相続", "会社設立", "補助金",
      "法務相談準備", "士業業務効率化",
    ],
  },
  {
    slug: "finance",
    name: "お金・家計・経理",
    description: "家計・収支・経費・確定申告・税金計算など、お金まわりの管理に役立つツールを探せます。",
    icon: "wallet",
    relatedPurposes: ["manage-money", "calculate"],
    subCategories: [
      "家計管理", "収支計算", "経費管理", "請求書", "見積書", "確定申告準備",
      "税金計算", "売上管理", "副業管理", "投資メモ", "料金比較", "支出チェック",
    ],
  },
  {
    slug: "hr",
    name: "人事・採用・転職",
    description: "履歴書・面接対策・採用管理・労務など、人事と採用・転職に役立つツールを探せます。",
    icon: "users",
    relatedPurposes: ["hr-job", "work-efficiency"],
    subCategories: [
      "履歴書", "職務経歴書", "志望動機", "面接対策", "求人比較", "採用管理",
      "スカウト文", "日程調整", "社内評価", "入社手続き", "労務チェック", "退職準備",
    ],
  },
  {
    slug: "language",
    name: "翻訳・語学",
    description: "翻訳・英文作成・語学学習・多言語対応など、言葉まわりのツールを探せます。",
    icon: "languages",
    relatedPurposes: ["language-support", "study"],
    subCategories: [
      "翻訳", "英文作成", "日本語校正", "英語学習", "中国語", "韓国語",
      "多言語対応", "発音", "単語帳", "海外向け文章", "外国人対応", "やさしい日本語",
    ],
  },
  {
    slug: "notes",
    name: "情報整理・メモ",
    description: "メモ・ノート・ブックマーク・要約など、情報整理に役立つツールを探せます。",
    icon: "notebook-pen",
    relatedPurposes: ["work-efficiency", "realize-idea"],
    subCategories: [
      "メモ", "ノート", "ブックマーク", "要約", "タグ管理", "文章整理",
      "PDF整理", "URL整理", "アイデア管理", "読書メモ", "会議メモ", "ナレッジ管理",
    ],
  },
  {
    slug: "sns",
    name: "SNS運用",
    description: "各SNSの投稿づくり・台本・分析など、SNS運用に役立つツールを探せます。",
    icon: "share-2",
    relatedPurposes: ["grow-sns", "get-customers"],
    subCategories: [
      "X投稿", "Instagram投稿", "TikTok投稿", "YouTube Shorts", "YouTube動画",
      "ハッシュタグ", "投稿カレンダー", "画像投稿", "リール台本",
      "ショート動画台本", "アカウント分析", "コメント返信",
    ],
  },
  {
    slug: "mini-tools",
    name: "AppPark内ミニツール",
    description: "公開URLがなくても、AppPark上で使える診断、計算、チェックリスト、テンプレート生成などのミニツールを探せます。",
    icon: "layout-grid",
    isMajor: true,
    relatedPurposes: ["publish-tool", "no-code", "try-first"],
    subCategories: [
      "診断ツール", "計算ツール", "テンプレート生成", "チェックリスト", "文章変換",
      "比較表", "ランダム生成", "ステップ案内", "Q&Aナビ", "募集フォーム", "受付フォーム",
    ],
  },
];

/** トップページに表示する主要カテゴリ（出しすぎ防止のため絞り込み） */
export const majorCategories: Category[] = categories.filter((c) => c.isMajor);

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryMap.get(slug);
}

export function getCategoryName(slug: string): string {
  return categoryMap.get(slug)?.name ?? slug;
}

/** カテゴリのSEOタイトル（未指定なら name から生成） */
export function categorySeoTitle(c: Category): string {
  return c.seoTitle ?? `${c.name}一覧`;
}

/** カテゴリのSEO説明（未指定なら description を使用） */
export function categorySeoDescription(c: Category): string {
  return c.seoDescription ?? c.description;
}
