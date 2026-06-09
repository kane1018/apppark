import type { MiniToolType } from "@/lib/minitool/types";
import type { Service } from "@/types";

/**
 * 掲載サービスデータ。
 *
 * 公開初期は、AppPark運営が作成した「実際に動くWebツール」を掲載しています
 * （isFirstParty: true、url は AppPark内の /tools/<slug>）。
 * 外部の投稿サービスは、掲載申請を運営が確認のうえ追加します（isFirstParty: false）。
 *
 * 後から Supabase / Firebase / Notion / スプレッドシート等に移行する場合も、
 * この Service 型に合わせてデータを返すようにすれば、UIは変更不要です。
 */

/** ミニツールの種類 → ツール形式タグ slug */
const MINI_TOOL_TYPE_TAG: Record<MiniToolType, string | null> = {
  diagnosis: "diagnosis",
  calculator: "calculator",
  template_generator: "template",
  checklist: "checklist",
  text_transform: "text-transform",
  none: null,
};

/** 料金（enum）→ 料金タグ slug */
function derivePricingTags(s: Service): string[] {
  switch (s.pricing) {
    case "free":
      return ["free"];
    case "paid":
      return ["paid"];
    case "freemium":
      return ["freemium"];
    default:
      return [];
  }
}

/** 運営状況・属性 → 運営状態タグ slug */
function deriveStatusTags(s: Service): string[] {
  const tags = new Set<string>();
  if (s.listingType === "development") tags.add("developing");
  else if (s.status === "active") tags.add("published");
  else if (s.status === "beta") tags.add("beta");
  else if (s.status === "development") tags.add("developing");
  else if (s.status === "paused") tags.add("discontinued");
  tags.add(s.isFirstParty ? "official" : "indie");
  if (s.isSponsored) tags.add("sponsor");
  return Array.from(tags);
}

/** 掲載タイプ・ミニツール種別 → ツール形式タグ slug */
function deriveToolTypeTags(s: Service): string[] {
  const tags = new Set<string>();
  switch (s.listingType) {
    case "external":
      tags.add("external");
      break;
    case "internal_mini_tool": {
      tags.add("internal-mini-tool");
      const mt = MINI_TOOL_TYPE_TAG[s.miniTool.type];
      if (mt) tags.add(mt);
      break;
    }
    case "iframe_embed":
      tags.add("iframe");
      break;
    case "development":
      tags.add("dev-service");
      break;
  }
  return Array.from(tags);
}

/** AI対応かどうかの自動判定 */
function deriveIsAiEnabled(s: Service): boolean {
  return (
    s.category === "ai-tools" ||
    s.purposes.includes("try-ai") ||
    s.aiToolsUsed.length > 0 ||
    s.toolTypeTags.includes("ai-chat")
  );
}

function tool(
  partial: Omit<
    Service,
    | "pricing"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "thumbnailUrl"
    | "galleryImageUrls"
    | "imageAlt"
    | "views"
    | "clicks"
    | "helpfulCount"
    | "authorId"
    | "publicAuthorName"
    | "authorName"
    | "authorLinks"
    | "aiToolsUsed"
    | "recruitmentNote"
    | "isSponsored"
    | "isFirstParty"
    | "listingType"
    | "miniTool"
    | "iframeEmbed"
    | "developmentInfo"
    | "moderationState"
    | "ctaLabel"
    | "ctaUrl"
    | "voices"
    | "subCategories"
    | "audienceTags"
    | "toolTypeTags"
    | "pricingTags"
    | "statusTags"
    | "isAiEnabled"
    | "isInternalMiniTool"
  > &
    Partial<Service>
): Service {
  const merged: Service = {
    pricing: "free",
    status: "active",
    createdAt: "2026-06-09",
    updatedAt: "2026-06-09",
    thumbnailUrl: null,
    galleryImageUrls: [],
    imageAlt: null,
    views: 0,
    clicks: 0,
    helpfulCount: 0,
    authorId: "apppark-official",
    publicAuthorName: "AppPark運営",
    authorName: "AppPark運営",
    authorLinks: [],
    aiToolsUsed: [],
    recruitmentNote: null,
    isSponsored: false,
    isFirstParty: true,
    listingType: "internal_mini_tool",
    miniTool: { enabled: false, type: "none", config: null },
    iframeEmbed: { requested: false, url: null, approved: false },
    developmentInfo: { enabled: false, status: null, plannedRelease: null },
    moderationState: "published",
    ctaLabel: null,
    ctaUrl: null,
    voices: [],
    subCategories: [],
    audienceTags: [],
    toolTypeTags: [],
    pricingTags: [],
    statusTags: [],
    isAiEnabled: false,
    isInternalMiniTool: false,
    ...partial,
  } as Service;

  // 未指定のタグ・フラグは他のフィールドから自動導出（指定があれば尊重）
  if (merged.toolTypeTags.length === 0)
    merged.toolTypeTags = deriveToolTypeTags(merged);
  if (merged.pricingTags.length === 0)
    merged.pricingTags = derivePricingTags(merged);
  if (merged.statusTags.length === 0)
    merged.statusTags = deriveStatusTags(merged);
  if (partial.isInternalMiniTool === undefined)
    merged.isInternalMiniTool = merged.listingType === "internal_mini_tool";
  if (partial.isAiEnabled === undefined)
    merged.isAiEnabled = deriveIsAiEnabled(merged);

  return merged;
}

export const services: Service[] = [
  tool({
    id: "tool-char-count",
    slug: "char-count",
    name: "文字数カウント",
    shortDescription: "文章の文字数・文字種・行数・単語数をその場で数えます。",
    description:
      "入力した文章の文字数（スペース込み／除く）、行数、単語数、原稿用紙の枚数の目安を、ブラウザ上でリアルタイムに数えるツールです。SNSの文字数制限の確認や、原稿のボリューム把握に使えます。入力内容はサーバーに送信されません（ブラウザ内で処理）。",
    category: "writing",
    subCategories: ["文章整形", "校正"],
    purposes: ["write", "work-efficiency", "polish-writing"],
    audienceTags: ["individual", "worker", "student", "creator-audience"],
    toolTypeTags: ["internal-mini-tool", "calculator"],
    pricingTags: ["free", "no-signup"],
    tags: ["文字数", "カウント", "文章", "無料"],
    url: "/tools/char-count",
    createdAt: "2026-06-08",
    updatedAt: "2026-06-08",
    recommendedFor: [
      "SNSやフォームの文字数制限を確認したい人",
      "原稿のボリュームを把握したい人",
      "ブログ・メールの文字数を整えたい人",
    ],
    howToUse: [
      "テキスト欄に文章を貼り付ける",
      "文字数・行数・単語数が自動で表示される",
      "必要に応じてコピー・クリアする",
    ],
    useCases: ["投稿前の文字数チェック", "原稿量の見積もり"],
    cautions: ["入力内容はブラウザ内でのみ処理され、保存されません"],
    authorComment: "「あと何文字？」をすぐ確認できるよう、シンプルさを重視しました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "投稿前の文字数確認を、広告だらけのサイトに頼らず素早く行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-image-compress",
    slug: "image-compress",
    name: "画像圧縮・リサイズ",
    shortDescription: "画像をブラウザ内で圧縮・リサイズ。アップロード不要。",
    description:
      "JPEG・PNG・WebP画像を、ブラウザ内（あなたの端末上）でリサイズ・再圧縮してファイルサイズを小さくするツールです。最大幅と画質を選ぶだけ。画像はサーバーへアップロードされないため、安心して使えます。ブログやサイトの表示高速化、メール添付の軽量化に。",
    category: "image-design",
    subCategories: ["画像圧縮", "画像編集"],
    purposes: ["edit-image", "work-efficiency"],
    audienceTags: ["individual", "creator-audience", "marketer", "engineer"],
    toolTypeTags: ["internal-mini-tool"],
    pricingTags: ["free", "no-signup"],
    tags: ["画像圧縮", "リサイズ", "ブラウザ完結", "無料"],
    url: "/tools/image-compress",
    createdAt: "2026-06-08",
    updatedAt: "2026-06-08",
    recommendedFor: [
      "ブログ・サイトの画像を軽くしたい人",
      "アップロードせず手元で圧縮したい人",
      "メール添付の画像サイズを下げたい人",
    ],
    howToUse: [
      "画像ファイルを選ぶ（またはドラッグ＆ドロップ）",
      "最大幅と画質を調整する",
      "圧縮後の画像をダウンロードする",
    ],
    useCases: ["サイト表示の高速化", "SNS・メール用に画像を軽量化"],
    cautions: [
      "画像はブラウザ内で処理され、サーバーへ送信されません",
      "圧縮後は画質を確認してからご利用ください",
    ],
    authorComment: "プライバシーのため、画像を一切アップロードしない設計にしました。",
    techStack: ["Next.js", "Canvas API"],
    reasonCreated: "画像をアップロードせずに手元で圧縮したいニーズに応えたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-password-generator",
    slug: "password-generator",
    name: "パスワード生成",
    shortDescription: "強度を選べる安全なランダムパスワードを生成します。",
    description:
      "長さや文字種（英大文字・小文字・数字・記号）を選んで、推測されにくいランダムなパスワードを生成するツールです。生成はすべてブラウザ内で行われ、外部に送信されません。区別しにくい文字（0/O, 1/l）を除外するオプションもあります。",
    category: "dev",
    subCategories: ["開発補助"],
    purposes: ["work-efficiency", "business-tools"],
    audienceTags: ["individual", "engineer", "worker"],
    toolTypeTags: ["internal-mini-tool", "random"],
    pricingTags: ["free", "no-signup"],
    tags: ["パスワード", "セキュリティ", "生成", "無料"],
    url: "/tools/password-generator",
    createdAt: "2026-06-07",
    updatedAt: "2026-06-07",
    recommendedFor: [
      "強いパスワードを手早く作りたい人",
      "アカウントごとに異なるパスワードを使いたい人",
    ],
    howToUse: [
      "長さと文字種を選ぶ",
      "生成ボタンを押す",
      "パスワードをコピーして使う",
    ],
    useCases: ["新規アカウント作成時", "定期的なパスワード更新"],
    cautions: [
      "生成はブラウザ内のみで行われ、保存・送信されません",
      "生成したパスワードはパスワード管理ツール等で安全に保管してください",
    ],
    authorComment: "暗号学的に安全な乱数（Web Crypto）で生成しています。",
    techStack: ["Next.js", "Web Crypto API"],
    reasonCreated: "安全なパスワードを、信頼できる手元の処理で作れるようにしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-price-calc",
    slug: "price-calc",
    name: "税込・割引計算",
    shortDescription: "税込／税抜・割引後の価格をすぐに計算します。",
    description:
      "金額と税率（10%・8%・任意）を入力して、税込・税抜の価格を相互に計算できるツールです。割引率を入れれば割引後の価格も同時にわかります。買い物・見積もり・価格設定の確認に。",
    category: "calc-diagnosis",
    subCategories: ["料金計算", "割合計算"],
    purposes: ["calculate", "business-tools", "manage-money"],
    audienceTags: ["individual", "sole-proprietor", "small-business", "worker"],
    toolTypeTags: ["internal-mini-tool", "calculator"],
    pricingTags: ["free", "no-signup"],
    tags: ["計算", "税込", "割引", "無料"],
    url: "/tools/price-calc",
    createdAt: "2026-06-06",
    updatedAt: "2026-06-06",
    recommendedFor: [
      "税込・税抜をすぐ計算したい人",
      "割引後の価格を確認したい人",
      "見積もり・価格設定をする個人事業の方",
    ],
    howToUse: [
      "金額を入力する",
      "税率（10%/8%/任意）と割引率を選ぶ",
      "税込・税抜・割引後の金額を確認する",
    ],
    useCases: ["買い物時の価格確認", "見積もり・請求の確認"],
    cautions: ["端数処理（切り捨て等）は用途に応じてご確認ください"],
    authorComment: "毎回電卓を叩く手間を減らすために作りました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "税込・割引の計算をその場でまとめて行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-color-converter",
    slug: "color-converter",
    name: "カラーコード変換",
    shortDescription: "HEX↔RGBを相互変換。色のプレビュー付き。",
    description:
      "カラーコードを HEX（#RRGGBB）と RGB の間で相互変換できるツールです。スライダーで色を調整しながら、プレビューとコードを同時に確認できます。デザインやコーディングでの色指定に。",
    category: "creator",
    subCategories: ["画像素材"],
    purposes: ["edit-image", "build-site", "creative"],
    audienceTags: ["creator-audience", "engineer", "code-beginner"],
    toolTypeTags: ["internal-mini-tool"],
    pricingTags: ["free", "no-signup"],
    tags: ["カラー", "HEX", "RGB", "デザイン"],
    url: "/tools/color-converter",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-05",
    recommendedFor: [
      "デザイン・コーディングで色を扱う人",
      "HEXとRGBを行き来したい人",
    ],
    howToUse: [
      "HEXを入力する、またはRGBスライダーを動かす",
      "プレビューと変換結果を確認する",
      "コードをコピーして使う",
    ],
    useCases: ["CSSの色指定", "デザインの色調整"],
    cautions: ["対応形式は HEX（#RRGGBB）と RGB です"],
    authorComment: "色をいじりながら確認できるようにしました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "色コードの変換を、プレビューを見ながら行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "tool-pomodoro-timer",
    slug: "pomodoro-timer",
    name: "ポモドーロタイマー",
    shortDescription: "25分集中＋5分休憩。作業に集中するためのタイマー。",
    description:
      "「25分集中 → 5分休憩」を繰り返すポモドーロ・テクニック用のタイマーです。集中と休憩を切り替えながら作業を進められます。時間はブラウザ内でカウントし、終了時に通知（音）でお知らせします。",
    category: "productivity",
    subCategories: ["タスク管理"],
    purposes: ["work-efficiency", "study"],
    audienceTags: ["individual", "worker", "student", "freelance"],
    toolTypeTags: ["internal-mini-tool"],
    pricingTags: ["free", "no-signup"],
    tags: ["タイマー", "集中", "ポモドーロ", "無料"],
    url: "/tools/pomodoro-timer",
    createdAt: "2026-06-04",
    updatedAt: "2026-06-04",
    recommendedFor: [
      "集中して作業・勉強したい人",
      "だらだら作業を防ぎたい人",
    ],
    howToUse: [
      "スタートを押して25分集中する",
      "終了したら5分休憩する",
      "これを繰り返す",
    ],
    useCases: ["仕事・勉強の集中時間づくり", "在宅ワークのリズムづくり"],
    cautions: ["タブを閉じるとカウントはリセットされます"],
    authorComment: "余計な機能を省き、集中に集中できるようにしました。",
    techStack: ["Next.js", "TypeScript"],
    reasonCreated: "シンプルなポモドーロタイマーを、広告なしで使いたかったため。",
    recruitmentStatus: ["seeking_users", "seeking_feedback"],
  }),

  /* ===== AppPark内ミニツール（config から描画。コード実行なし） ===== */
  tool({
    id: "mini-ai-tool-diagnosis",
    slug: "ai-tool-diagnosis",
    name: "自分に合うAIツール診断",
    shortDescription: "3つの質問に答えると、向いているAIツールのタイプが分かります。",
    description:
      "「何から使えばいいか分からない」人向けに、目的・スキル・重視点の3問から、相性の良いAIツールのタイプを提案する診断ミニツールです。AppPark内で完結し、結果は保存しません。",
    category: "ai-tools",
    subCategories: ["AI診断"],
    purposes: ["try-ai", "work-efficiency", "diagnose"],
    audienceTags: ["individual", "ai-beginner", "beginner"],
    pricingTags: ["free", "no-signup"],
    tags: ["診断", "AI", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "diagnosis",
      config: {
        note: "結果は目安です。実際の選定はご自身でご判断ください。",
        questions: [
          {
            id: "q1",
            text: "いちばんやりたいことは？",
            options: [
              { id: "q1a", label: "文章を作りたい", resultKey: "writing" },
              { id: "q1b", label: "画像・デザインを作りたい", resultKey: "image" },
              { id: "q1c", label: "作業を自動化・効率化したい", resultKey: "automation" },
            ],
          },
          {
            id: "q2",
            text: "ふだんのPC作業は？",
            options: [
              { id: "q2a", label: "文章・メールが多い", resultKey: "writing" },
              { id: "q2b", label: "資料・画像づくりが多い", resultKey: "image" },
              { id: "q2c", label: "表計算・繰り返し作業が多い", resultKey: "automation" },
            ],
          },
          {
            id: "q3",
            text: "重視するのは？",
            options: [
              { id: "q3a", label: "文章の質", resultKey: "writing" },
              { id: "q3b", label: "見た目・ビジュアル", resultKey: "image" },
              { id: "q3c", label: "時間の節約", resultKey: "automation" },
            ],
          },
        ],
        results: [
          {
            key: "writing",
            title: "文章生成AIタイプ",
            body: "メール・記事・要約などの文章づくりを助けるAIが向いています。まずは無料で使える文章生成AIから試すのがおすすめです。",
          },
          {
            key: "image",
            title: "画像・デザインAIタイプ",
            body: "画像生成・デザイン補助のAIが向いています。バナーや素材づくりから試してみましょう。",
          },
          {
            key: "automation",
            title: "効率化・自動化AIタイプ",
            body: "表計算の補助や繰り返し作業の自動化に強いAIが向いています。日々の定型作業から導入すると効果的です。",
          },
        ],
      },
    },
    recommendedFor: ["AIツールを使い始めたい人", "種類が多くて選べない人"],
    howToUse: ["3つの質問に答える", "「結果を見る」を押す", "提案されたタイプを参考にする"],
    useCases: ["AI導入の最初の一歩", "自分に合うツール選び"],
    cautions: ["結果は目安です。最終判断はご自身で行ってください"],
    authorComment: "「まず何から？」の入口になればと思って作りました。",
    techStack: ["AppPark内ミニツール（診断）"],
    reasonCreated: "AIツールが多すぎて選べない、という声に応えたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "mini-work-estimate",
    slug: "work-estimate",
    name: "作業ざっくり見積もり",
    shortDescription: "時給と想定時間から、作業のおおよその費用を計算します。",
    description:
      "時給（単価）と想定作業時間を入れるだけで、おおよその費用を計算するミニツールです。見積もりの初期検討や、外注・内製の比較の目安に。AppPark内で計算し、入力は保存しません。",
    category: "calc-diagnosis",
    subCategories: ["見積もり", "作業時間計算"],
    purposes: ["calculate", "business-tools", "manage-money"],
    audienceTags: ["freelance", "sole-proprietor", "small-business"],
    pricingTags: ["free", "no-signup"],
    tags: ["計算", "見積もり", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "calculator",
      config: {
        resultLabel: "おおよその費用",
        unit: "円",
        rounding: "round",
        formula: "rate * hours",
        note: "概算です。実際の見積もりは諸条件をご確認ください。",
        inputs: [
          { id: "rate", label: "時給・単価", kind: "number", unit: "円/時", defaultValue: 3000, min: 0 },
          { id: "hours", label: "想定作業時間", kind: "number", unit: "時間", defaultValue: 10, min: 0 },
        ],
      },
    },
    recommendedFor: ["作業費用をざっくり知りたい人", "見積もりの初期検討をしたい人"],
    howToUse: ["時給と想定時間を入力", "おおよその費用が表示される"],
    useCases: ["外注費用の目安", "作業見積もりの初期検討"],
    cautions: ["概算です。端数や諸経費は別途ご確認ください"],
    authorComment: "毎回電卓を叩く手間を減らしたくて作りました。",
    techStack: ["AppPark内ミニツール（計算・安全な式評価）"],
    reasonCreated: "費用感をその場でつかめるようにしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "mini-reply-template",
    slug: "reply-template",
    name: "問い合わせ返信メーカー",
    shortDescription: "宛名・用件を入れると、丁寧な返信文の下書きを作成します。",
    description:
      "宛名・用件・希望日などを入力すると、丁寧な問い合わせ返信文の下書きを生成するテンプレートツールです。AIではなく定型テンプレートで生成し、コピーしてそのまま使えます。",
    category: "writing",
    subCategories: ["メール作成"],
    purposes: ["write", "work-efficiency"],
    audienceTags: ["worker", "sole-proprietor", "small-business"],
    pricingTags: ["free", "no-signup"],
    tags: ["テンプレート", "メール", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "生成文は下書きです。内容を確認してからお使いください。",
        example: "○○株式会社 ○○様\n\nお問い合わせいただきありがとうございます。…",
        fields: [
          { id: "to", label: "宛名", placeholder: "○○株式会社 ○○様" },
          { id: "topic", label: "用件", placeholder: "お見積もりの件" },
          { id: "detail", label: "本文", placeholder: "詳細を入力", multiline: true },
        ],
        template:
          "{to}\n\nお世話になっております。\n{topic}について、ご連絡いたします。\n\n{detail}\n\nご不明な点がございましたら、お気軽にお問い合わせください。\nどうぞよろしくお願いいたします。",
      },
    },
    recommendedFor: ["返信文の書き出しに迷う人", "丁寧な文面をすぐ作りたい人"],
    howToUse: ["宛名・用件・本文を入力", "生成された文章をコピーして使う"],
    useCases: ["問い合わせ返信", "ビジネスメールの下書き"],
    cautions: ["生成文は下書きです。内容を確認してから送信してください"],
    authorComment: "「書き出しで止まる」を減らせればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "返信文の下書きづくりを楽にしたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "mini-prelaunch-checklist",
    slug: "prelaunch-checklist",
    name: "サイト公開前チェックリスト",
    shortDescription: "公開前の確認項目をチェック。進捗率も表示します。",
    description:
      "Webサイトを公開する前に確認したい項目（表示・SEO・法務・運用）をチェックできるリストです。進捗率が出るので抜け漏れ防止に。チェック状態はこの端末に保存され、ログインなしで使えます。",
    category: "dev",
    subCategories: ["SEOチェック", "開発補助"],
    purposes: ["build-site", "work-efficiency"],
    audienceTags: ["engineer", "code-beginner", "freelance", "small-business"],
    pricingTags: ["free", "no-signup"],
    tags: ["チェックリスト", "公開前", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "checklist",
      config: {
        note: "一般的な確認項目です。サイトの内容に応じて追加でご確認ください。",
        items: [
          { id: "c1", label: "スマホ表示が崩れていないか", category: "表示", required: true },
          { id: "c2", label: "リンク切れがないか", category: "表示" },
          { id: "c3", label: "title・descriptionを設定したか", category: "SEO" },
          { id: "c4", label: "OGP画像を設定したか", category: "SEO" },
          { id: "c5", label: "プライバシーポリシーを掲載したか", category: "法務", required: true },
          { id: "c6", label: "お問い合わせ手段があるか", category: "運用" },
          { id: "c7", label: "favicon を設定したか", category: "表示" },
          { id: "c8", label: "404ページがあるか", category: "運用" },
        ],
      },
    },
    recommendedFor: ["サイトを公開する人", "抜け漏れを防ぎたい人"],
    howToUse: ["項目をチェックしていく", "進捗率で確認状況を把握する"],
    useCases: ["公開前の最終確認", "リニューアル時のチェック"],
    cautions: ["一般的な項目です。内容に応じて追加確認してください"],
    authorComment: "公開直前の「あれ確認したっけ？」を減らせればと。",
    techStack: ["AppPark内ミニツール（チェックリスト）"],
    reasonCreated: "公開前チェックの抜け漏れを防ぎたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
  tool({
    id: "mini-text-format",
    slug: "text-format",
    name: "改行・箇条書き整形",
    shortDescription: "余分な空行や空白を整え、箇条書きに整形します。",
    description:
      "貼り付けた文章の余分な空行・空白を整理したり、各行を箇条書きにしたり、全角英数を半角に変換したりできる、ルールベースの整形ツールです。AIは使わず、AppPark内で処理します。",
    category: "writing",
    subCategories: ["文章整形"],
    purposes: ["write", "work-efficiency", "polish-writing"],
    audienceTags: ["individual", "worker", "creator-audience"],
    pricingTags: ["free", "no-signup"],
    tags: ["整形", "文章", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "text_transform",
      config: {
        note: "ルールベースの整形です（AIは使用していません）。",
        operations: ["trim_lines", "remove_blank_lines", "collapse_spaces", "to_bullets", "normalize_width"],
      },
    },
    recommendedFor: ["コピペ文章を整えたい人", "箇条書きにしたい人"],
    howToUse: ["文章を貼り付ける", "適用する整形を選ぶ", "結果をコピーする"],
    useCases: ["メモの整形", "箇条書き化"],
    cautions: ["整形結果は確認してからご利用ください"],
    authorComment: "コピペ後の手直しを減らしたくて作りました。",
    techStack: ["AppPark内ミニツール（文章整形）"],
    reasonCreated: "貼り付けた文章の整形を一発で行いたかったため。",
    recruitmentStatus: ["seeking_feedback"],
  }),
];

/* ------------------------------------------------------------------
 * データ取得ヘルパー（後で DB 接続に置き換えやすいよう関数化）
 * ------------------------------------------------------------------ */

export function getAllServices(): Service[] {
  return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(categorySlug: string): Service[] {
  return services.filter((s) => s.category === categorySlug);
}

export function getServicesByPurpose(purposeSlug: string): Service[] {
  return services.filter((s) => s.purposes.includes(purposeSlug));
}

export function getServicesBySubCategory(sub: string): Service[] {
  return services.filter((s) => s.subCategories.includes(sub));
}

/** 汎用タグ（利用者別・ツール形式・料金・運営状態）の slug でサービスを取得 */
export function getServicesByTagSlug(slug: string): Service[] {
  return services.filter(
    (s) =>
      s.audienceTags.includes(slug) ||
      s.toolTypeTags.includes(slug) ||
      s.pricingTags.includes(slug) ||
      s.statusTags.includes(slug)
  );
}

/** すべてのタグ（重複なし） */
export function getAllTags(): string[] {
  const set = new Set<string>();
  services.forEach((s) => s.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

/** カテゴリ別の掲載数（slug → 件数） */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  services.forEach((s) => {
    counts[s.category] = (counts[s.category] ?? 0) + 1;
  });
  return counts;
}

/** 内部の運営作成ツールか（url が /tools/ で始まる） */
export function isInternalToolUrl(url: string): boolean {
  return url.startsWith("/tools/");
}

/** ページ内で動くAppPark内ミニツール（config描画）か */
export function isConfigMiniTool(s: Service): boolean {
  return s.listingType === "internal_mini_tool" && s.miniTool.enabled && s.miniTool.config !== null;
}
