import type { Service } from "@/types";
import { tool } from "@/data/toolFactory";

/**
 * 各大カテゴリの初期掲載サービス。
 *
 * AppPark内で実際に使えるミニツールです（config からの描画のみ。投稿者の自由コードは
 * 実行しません）。デモ・サンプル・テストではなく、そのまま使える掲載ツールです。
 *
 * 投稿者は「運営作成」ではなく、サイトオーナー本人の通常投稿として扱います
 * （公開表示名：siteConfig.owner.displayName ＝「Kansui」、createdBy: "user"、
 * isFirstParty: false。これらは toolFactory.ts のデフォルトで設定されます）。
 * 公開するのは公開表示名のみで、メール・連絡先・管理情報は公開しません。
 * 架空のレビュー・閲覧数・クリック数は持たせません（views/clicks/helpful は 0 のまま、
 * siteConfig.showUsageStats=false のため表示もされません）。
 *
 * 注: サイト制作・開発カテゴリは、既存の「サイト公開前チェックリスト」
 * （services.ts の prelaunch-checklist）で初期掲載済みのため、ここでは作成しません。
 */

/** initialTool の入力（recruitmentStatus はデフォルトを持つため任意にする） */
type InitialToolInput = Omit<Parameters<typeof tool>[0], "recruitmentStatus"> &
  Partial<Pick<Service, "recruitmentStatus">>;

/** 初期掲載ミニツールの共通デフォルト（投稿者・料金・募集の既定値） */
function initialTool(partial: InitialToolInput): Service {
  return tool({
    pricingTags: ["free", "no-signup"],
    recruitmentStatus: ["seeking_feedback"],
    ...partial,
  });
}

export const initialServices: Service[] = [
  /* 1. AIツール */
  initialTool({
    id: "init-ai-prompt-tidy",
    slug: "ai-prompt-tidy",
    name: "AIプロンプト整えメーカー",
    shortDescription:
      "目的・出力形式・口調・条件を入れると、生成AIに渡しやすいプロンプト文に整えます。",
    description:
      "ChatGPTなどの生成AIに入力するプロンプトを、目的に合わせて整理できるテンプレート生成ツールです。やりたいこと・出力してほしい形式・口調・条件を入力すると、構造化されたプロンプト文を組み立てます。AppPark内で動作し、AIには接続しません（生成結果はそのままコピーして各AIに貼り付けてお使いください）。",
    category: "ai-tools",
    subCategories: ["AIプロンプト支援", "AI文章生成"],
    purposes: ["try-ai", "polish-writing", "work-efficiency"],
    audienceTags: ["ai-beginner", "individual", "worker"],
    tags: ["AI", "プロンプト", "テンプレート", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "AIには接続しません。生成された文をコピーして各AIに貼り付けてお使いください。",
        fields: [
          { id: "purpose", label: "やりたいこと（目的）", placeholder: "例：商品紹介の文章を作りたい", multiline: true },
          { id: "format", label: "出力してほしい形式", placeholder: "例：箇条書きで5つ" },
          { id: "tone", label: "口調・スタイル", placeholder: "例：やさしく・丁寧に" },
          { id: "conditions", label: "条件・前提（任意）", placeholder: "例：初心者向け、300字以内", multiline: true },
        ],
        template:
          "# 依頼\n{purpose}\n\n# 出力形式\n{format}\n\n# 口調・スタイル\n{tone}\n\n# 条件・前提\n{conditions}\n\n上記を踏まえて出力してください。",
      },
    },
    recommendedFor: ["AIへの指示文づくりが苦手な人", "出力のブレを減らしたい人"],
    howToUse: ["目的・形式・口調・条件を入力する", "生成されたプロンプトをコピーする", "使いたいAIに貼り付ける"],
    useCases: ["生成AIへの指示文づくり", "プロンプトの型を整える"],
    cautions: ["AIには接続していません。生成結果はご自身で確認してからお使いください"],
    authorComment: "「AIに何をどう頼めばいいか」を整理できる入口として作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "プロンプトの書き方が分からず止まってしまう人を減らしたかったため。",
  }),

  /* 2. 業務効率化 */
  initialTool({
    id: "init-today-task-triage",
    slug: "today-task-triage",
    name: "今日のタスク整理チェック",
    shortDescription:
      "今日やることを洗い出し→分類→実行の順に整理する、優先順位づけチェックリスト。",
    description:
      "今日やることを「洗い出し→緊急度・重要度で分類→実行順を決める」の流れで整理できるチェックリストです。進捗率が表示され、チェック状態はこの端末に保存されます（ログイン不要）。タスクそのものはお手元のメモに書き出しながらお使いください。",
    category: "productivity",
    subCategories: ["タスク管理", "業務チェックリスト"],
    purposes: ["work-efficiency"],
    audienceTags: ["worker", "individual", "freelance"],
    tags: ["タスク", "優先順位", "チェックリスト", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "checklist",
      config: {
        note: "進め方の手順です。具体的なタスクはお手元のメモに書き出しながら進めてください。",
        items: [
          { id: "t1", label: "今日やることをすべて書き出した", category: "1. 洗い出し", required: true },
          { id: "t2", label: "緊急かつ重要なタスクに印をつけた", category: "2. 分類" },
          { id: "t3", label: "重要だが緊急でないタスクを決めた", category: "2. 分類" },
          { id: "t4", label: "緊急だが重要でないタスクを短時間枠にした", category: "2. 分類" },
          { id: "t5", label: "やらなくていいタスクを外した", category: "2. 分類" },
          { id: "t6", label: "今日の最優先タスクを1つ決めた", category: "3. 実行", required: true },
          { id: "t7", label: "着手する順番を決めた", category: "3. 実行" },
        ],
      },
    },
    recommendedFor: ["やることが多くて手が止まる人", "優先順位づけが苦手な人"],
    howToUse: ["手順に沿ってチェックしていく", "進捗率で整理状況を確認する"],
    useCases: ["朝のタスク整理", "在宅ワークの段取り"],
    cautions: ["チェック状態はこの端末に保存されます"],
    authorComment: "「何から手をつけるか」で迷う時間を減らせればと思って作りました。",
    techStack: ["AppPark内ミニツール（チェックリスト）"],
    reasonCreated: "タスクの優先順位づけを、毎朝同じ手順でできるようにしたかったため。",
  }),

  /* 3. 文章・ライティング */
  initialTool({
    id: "init-mail-reply",
    slug: "mail-reply-maker",
    name: "メール返信文メーカー",
    shortDescription:
      "宛名・用件・内容・希望日時を入れると、丁寧なメール返信文の下書きを作ります。",
    description:
      "日程調整・お礼・確認依頼などのメール返信文の下書きを作成できるテンプレートツールです。宛名・用件・伝えたい内容・希望日時を入力すると、丁寧な文面に整えます。AIではなく定型テンプレートで生成し、コピーしてそのまま使えます。",
    category: "writing",
    subCategories: ["メール作成", "敬語変換", "応募書類作成"],
    purposes: ["write", "polish-writing", "hr-job"],
    audienceTags: ["worker", "student", "individual"],
    tags: ["メール", "返信", "テンプレート", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "生成文は下書きです。送信前に内容をご確認ください。",
        fields: [
          { id: "to", label: "宛名", placeholder: "○○株式会社 ○○様" },
          { id: "topic", label: "用件", placeholder: "面接日程のご連絡" },
          { id: "body", label: "伝えたい内容", placeholder: "詳細を入力", multiline: true },
          { id: "datetime", label: "希望日時（任意）", placeholder: "例：6月12日(金) 14時" },
        ],
        template:
          "{to}\n\nお世話になっております。\n{topic}について、ご連絡いたします。\n\n{body}\n\nご希望の日時：{datetime}\n\nお手数をおかけしますが、ご確認のほどよろしくお願いいたします。",
      },
    },
    recommendedFor: ["返信文の書き出しに迷う人", "丁寧な文面をすぐ作りたい人"],
    howToUse: ["宛名・用件・内容・希望日時を入力", "生成された文章をコピーして使う"],
    useCases: ["日程調整の返信", "お礼・確認メールの下書き"],
    cautions: ["生成文は下書きです。内容を確認してから送信してください"],
    authorComment: "「書き出しで止まる」をなくしたくて作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "ビジネスメールの下書きづくりを楽にしたかったため。",
  }),

  /* 4. 画像・デザイン */
  initialTool({
    id: "init-sns-thumb-memo",
    slug: "sns-thumb-memo",
    name: "SNSサムネ構成メモ",
    shortDescription:
      "テーマ・入れたい文字・強調ワード・雰囲気から、サムネイルの構成案メモを作ります。",
    description:
      "SNS投稿やショート動画のサムネイル構成を整理するためのテンプレートツールです。テーマ・入れたい文字・強調したい言葉・雰囲気を入力すると、配置や配色の方針メモを作成します。画像そのものは生成しません（構成を考えるための下書きメモです）。",
    category: "image-design",
    subCategories: ["サムネイル作成", "バナー作成", "配色"],
    purposes: ["create-image", "grow-sns", "creative"],
    audienceTags: ["creator-audience", "marketer", "individual"],
    tags: ["サムネイル", "デザイン", "構成", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "画像は生成しません。構成を考えるための下書きメモです。",
        fields: [
          { id: "theme", label: "投稿テーマ", placeholder: "例：在宅ワークの時短術" },
          { id: "mainText", label: "入れたい文字", placeholder: "例：5分でできる" },
          { id: "emphasis", label: "強調したい言葉", placeholder: "例：時短" },
          { id: "mood", label: "雰囲気", placeholder: "例：ポップ／落ち着いた" },
        ],
        template:
          "【サムネ構成メモ】\nテーマ：{theme}\nメインの文字：{mainText}\n強調ワード：{emphasis}\n雰囲気：{mood}\n\n構成案：\n・主役：「{emphasis}」を大きく、中央〜上部に配置\n・サブ：「{mainText}」を補足として小さめに\n・トーン：{mood} に合う配色でまとめる\n・視認性：背景と文字のコントラストを確保する",
      },
    },
    recommendedFor: ["サムネの構成で迷う人", "投稿前に方針を整理したい人"],
    howToUse: ["テーマ・文字・強調ワード・雰囲気を入力", "出てきた構成メモを下書きに使う"],
    useCases: ["サムネイルの構成検討", "バナーのラフ案づくり"],
    cautions: ["画像は生成しません。構成メモとしてご利用ください"],
    authorComment: "作る前に方針を一度ことばにすると、迷いが減ると思って作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "サムネの構成を考える最初のとっかかりが欲しかったため。",
  }),

  /* 5. 動画・音声 */
  initialTool({
    id: "init-short-video-script",
    slug: "short-video-script",
    name: "ショート動画台本メーカー",
    shortDescription:
      "テーマ・視聴者・尺・伝えたいことから、冒頭フック→本編→締めの台本案を作ります。",
    description:
      "YouTube Shorts・Instagram Reels・TikTok向けの短尺動画台本の下書きを作れるテンプレートツールです。テーマ・視聴者・動画尺・伝えたいことを入力すると、冒頭フック・本編・締めの構成案を作成します。",
    category: "video-audio",
    subCategories: ["ショート動画", "台本作成", "YouTube支援", "TikTok支援"],
    purposes: ["make-video", "grow-sns", "get-customers"],
    audienceTags: ["creator-audience", "marketer", "individual"],
    tags: ["動画", "台本", "ショート", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "構成の下書きです。実際のトーンや尺に合わせて調整してください。",
        fields: [
          { id: "theme", label: "テーマ", placeholder: "例：朝の時短ルーティン" },
          { id: "viewer", label: "視聴者", placeholder: "例：忙しい社会人" },
          { id: "length", label: "動画尺", placeholder: "例：30秒" },
          { id: "message", label: "伝えたいこと", placeholder: "例：3つのコツ", multiline: true },
        ],
        template:
          "【ショート動画台本】テーマ：{theme}／尺：{length}／視聴者：{viewer}\n\n■ 冒頭フック（最初の2秒）\n「{message}」に関する問いかけ・結論先出しで惹きつける\n\n■ 本編\n{message} を要点ごとにテンポよく説明する\n\n■ 締め\n要点を一言でまとめ、保存・フォローを促す",
      },
    },
    recommendedFor: ["ショート動画の構成で迷う人", "台本づくりを時短したい人"],
    howToUse: ["テーマ・視聴者・尺・伝えたいことを入力", "出てきた台本案を調整して使う"],
    useCases: ["ショート動画の台本づくり", "Reels・TikTokの構成検討"],
    cautions: ["構成の下書きです。トーンや尺はご自身で調整してください"],
    authorComment: "「最初のフックで止まる」を減らせればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "短尺動画の構成づくりの入口を用意したかったため。",
  }),

  /* 6. 学習・教育 */
  initialTool({
    id: "init-study-plan",
    slug: "study-plan-rough",
    name: "勉強計画ざっくりメーカー",
    shortDescription:
      "試験日・勉強できる曜日・1日の学習時間・苦手分野から、ざっくり勉強計画案を作ります。",
    description:
      "試験日や学習条件から、ざっくりした勉強計画の下書きを作れるテンプレートツールです。試験日・勉強できる曜日・1日の学習時間・苦手分野を入力すると、序盤・中盤・直前の進め方の目安を作成します。",
    category: "education",
    subCategories: ["勉強計画", "資格試験", "学習記録"],
    purposes: ["study", "try-first"],
    audienceTags: ["student", "individual", "beginner"],
    tags: ["勉強", "計画", "試験", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "目安の計画案です。実際の進み具合に合わせて調整してください。",
        fields: [
          { id: "examDate", label: "試験日", placeholder: "例：7月20日" },
          { id: "days", label: "勉強できる曜日", placeholder: "例：平日の夜と土曜" },
          { id: "hours", label: "1日の学習時間", placeholder: "例：2時間" },
          { id: "weak", label: "苦手分野", placeholder: "例：文法" },
        ],
        template:
          "【ざっくり勉強計画】\n試験日：{examDate}\n勉強できる曜日：{days}\n1日の学習時間：{hours}\n苦手分野：{weak}\n\nおすすめの進め方：\n1. 序盤：全体をひと通り（苦手な「{weak}」を早めに着手）\n2. 中盤：問題演習中心で弱点をつぶす\n3. 直前：過去問・総復習と間違い直し\n※「{days}」に「{hours}」を確保し、無理のない範囲で継続しましょう。",
      },
    },
    recommendedFor: ["計画づくりが苦手な人", "試験までの進め方に迷う人"],
    howToUse: ["試験日・曜日・時間・苦手分野を入力", "出てきた計画案を調整して使う"],
    useCases: ["資格試験の計画づくり", "学習スケジュールの下書き"],
    cautions: ["目安の計画案です。進み具合に合わせて調整してください"],
    authorComment: "計画の型があるだけで動き出しやすくなると思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "勉強の計画づくりの最初の一歩を軽くしたかったため。",
  }),

  /* 7. 生活便利 */
  initialTool({
    id: "init-menu-decider",
    slug: "menu-decider",
    name: "献立ざっくり決める君",
    shortDescription:
      "余っている食材・主食・調理時間・雰囲気から、今日の献立メモを組み立てます。",
    description:
      "家にある食材から、今日の献立の組み立て案メモを作れるテンプレートツールです。余っている食材・主食・調理時間・食べたい雰囲気を入力すると、主菜・主食・副菜の組み立て案を作成します。",
    category: "lifestyle",
    subCategories: ["料理", "献立", "家事"],
    purposes: ["daily-life", "try-first"],
    audienceTags: ["individual", "worker"],
    tags: ["献立", "料理", "生活", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "組み立ての下書きです。食材や好みに合わせてアレンジしてください。",
        fields: [
          { id: "ingredients", label: "余っている食材", placeholder: "例：卵、キャベツ、豚肉" },
          { id: "staple", label: "主食", placeholder: "例：ごはん／麺／パン" },
          { id: "time", label: "調理時間の目安", placeholder: "例：20分" },
          { id: "mood", label: "食べたい雰囲気", placeholder: "例：あっさり／がっつり" },
        ],
        template:
          "【今日の献立メモ】\n使う食材：{ingredients}\n主食：{staple}\n調理時間の目安：{time}\n雰囲気：{mood}\n\n組み立て案：\n・主菜：{ingredients} を使った「{mood}」な一品\n・主食：{staple}\n・副菜/汁物：冷蔵庫の残りで軽くもう一品\n※「{time}」で作れる範囲でアレンジしてください。",
      },
    },
    recommendedFor: ["献立を考えるのが面倒な人", "食材を使い切りたい人"],
    howToUse: ["食材・主食・時間・雰囲気を入力", "出てきた献立メモを参考にする"],
    useCases: ["夕飯の献立決め", "食材の使い切り"],
    cautions: ["組み立ての下書きです。好みに合わせて調整してください"],
    authorComment: "「今日なに作ろう」の最初のひと押しになればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "献立決めの迷いを少しでも減らしたかったため。",
  }),

  /* 8. 計算・診断 */
  initialTool({
    id: "init-work-time-estimate",
    slug: "work-time-estimate",
    name: "作業時間見積もり計算",
    shortDescription:
      "作業件数・1件あたりの時間・休憩から、合計作業時間をその場で計算します。",
    description:
      "作業量から、おおよその合計作業時間を計算できる計算ツールです。作業件数・1件あたりの時間（分）・休憩時間（分）を入力すると、合計の作業時間を計算します。AppPark内で計算し、入力は保存しません。",
    category: "calc-diagnosis",
    subCategories: ["作業時間計算", "見積もり", "シミュレーター"],
    purposes: ["calculate", "work-efficiency"],
    audienceTags: ["freelance", "worker", "sole-proprietor"],
    tags: ["計算", "作業時間", "見積もり", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "calculator",
      config: {
        resultLabel: "合計作業時間",
        unit: "分",
        rounding: "round",
        formula: "count * minutes + breakMin",
        note: "概算です。実際の作業時間は内容により変わります。",
        inputs: [
          { id: "count", label: "作業件数", kind: "number", unit: "件", defaultValue: 10, min: 0 },
          { id: "minutes", label: "1件あたりの時間", kind: "number", unit: "分", defaultValue: 15, min: 0 },
          { id: "breakMin", label: "休憩時間", kind: "number", unit: "分", defaultValue: 0, min: 0 },
        ],
      },
    },
    recommendedFor: ["作業時間をざっくり見積もりたい人", "段取りを立てたい人"],
    howToUse: ["件数・1件あたりの時間・休憩を入力", "合計作業時間が表示される"],
    useCases: ["作業の所要時間の見積もり", "スケジュールの段取り"],
    cautions: ["概算です。内容により実際の時間は変わります"],
    authorComment: "「だいたい何時間かかる？」をすぐ出せるようにしました。",
    techStack: ["AppPark内ミニツール（計算・安全な式評価）"],
    reasonCreated: "作業量から所要時間の目安をその場でつかめるようにしたかったため。",
  }),

  /* 10. マーケティング・集客 */
  initialTool({
    id: "init-sns-idea",
    slug: "sns-post-idea",
    name: "SNS投稿ネタ出しメーカー",
    shortDescription:
      "商品・ターゲット・投稿目的から、SNS投稿のネタ案を複数の切り口で出します。",
    description:
      "商品やサービス内容から、SNS投稿のネタ案を作れるテンプレートツールです。商品・サービス名、ターゲット、投稿目的を入力すると、悩み提起・ノウハウ・事例・参加型・お知らせといった複数の切り口の投稿ネタを作成します。",
    category: "marketing",
    subCategories: ["SNS運用", "広告文作成", "商品紹介"],
    purposes: ["get-customers", "grow-sns"],
    audienceTags: ["marketer", "small-business", "sole-proprietor"],
    tags: ["SNS", "ネタ出し", "集客", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "投稿ネタの下書きです。実際の発信内容はご自身で調整してください。",
        fields: [
          { id: "product", label: "商品・サービス名", placeholder: "例：オンライン英会話" },
          { id: "target", label: "ターゲット", placeholder: "例：初心者の社会人" },
          { id: "goal", label: "投稿目的", placeholder: "例：体験レッスンの申込" },
        ],
        template:
          "【{product} のSNS投稿ネタ案】ターゲット：{target}／目的：{goal}\n\n1. 悩み提起：{target} がつまずきがちな点を取り上げる\n2. ノウハウ：{product} で解決できる方法を1つ紹介\n3. 事例：使う前後の変化を見せる\n4. 参加型：{target} に問いかけてコメントを促す\n5. お知らせ：{goal} につながる行動を案内する",
      },
    },
    recommendedFor: ["投稿ネタが思いつかない人", "発信の切り口を増やしたい人"],
    howToUse: ["商品・ターゲット・目的を入力", "出てきたネタ案を発信に使う"],
    useCases: ["SNS投稿のネタ出し", "発信内容の方針づくり"],
    cautions: ["下書きです。発信内容はご自身で確認・調整してください"],
    authorComment: "「何を投稿するか」で止まる時間を減らせればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "SNS発信のネタ切れの悩みに応えたかったため。",
  }),

  /* 11. 事業者向け */
  initialTool({
    id: "init-inquiry-memo",
    slug: "inquiry-memo",
    name: "問い合わせ整理メモ",
    shortDescription:
      "問い合わせ内容・緊急度・対応状況・返信方針を入れて、対応メモに整理します。",
    description:
      "顧客から届いた問い合わせ内容を整理するためのテンプレートツールです。問い合わせ内容・緊急度・対応状況・返信方針を入力すると、次のアクションを含む対応メモに整理します。個人情報は入力しないでください（整理のための下書きメモです）。",
    category: "business",
    subCategories: ["問い合わせ対応", "顧客管理", "業務マニュアル"],
    purposes: ["business-tools", "work-efficiency"],
    audienceTags: ["small-business", "sole-proprietor", "worker"],
    tags: ["問い合わせ", "対応メモ", "整理", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "個人情報は入力しないでください。整理のための下書きメモです。",
        fields: [
          { id: "content", label: "問い合わせ内容", placeholder: "例：納期について確認したい", multiline: true },
          { id: "urgency", label: "緊急度", placeholder: "例：高／中／低" },
          { id: "status", label: "対応状況", placeholder: "例：未対応／対応中" },
          { id: "policy", label: "返信方針", placeholder: "例：本日中に一次返信" },
        ],
        template:
          "【問い合わせ対応メモ】\n内容：{content}\n緊急度：{urgency}\n対応状況：{status}\n返信方針：{policy}\n\n次のアクション：\n・「{policy}」に沿って一次返信を作成\n・対応状況を「{status}」から更新\n・必要なら担当者に共有する",
      },
    },
    recommendedFor: ["問い合わせ対応を整理したい人", "対応漏れを防ぎたい人"],
    howToUse: ["内容・緊急度・状況・方針を入力", "出てきた対応メモを使って動く"],
    useCases: ["問い合わせ対応の整理", "対応状況の見える化"],
    cautions: ["個人情報は入力しないでください"],
    authorComment: "問い合わせ対応の抜け漏れを減らせればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "問い合わせ対応を同じ型で整理できるようにしたかったため。",
  }),

  /* 12. クリエイター支援 */
  initialTool({
    id: "init-work-intro",
    slug: "work-intro-maker",
    name: "作品紹介文メーカー",
    shortDescription:
      "ジャンル・特徴・伝えたい魅力から、自分の作品の紹介文の下書きを作ります。",
    description:
      "自分の作品や制作物を紹介する文章を作れるテンプレートツールです。作品ジャンル・特徴・読者や視聴者に伝えたい魅力を入力すると、紹介文の下書きを作成します。ポートフォリオや投稿の説明文づくりに。",
    category: "creator",
    subCategories: ["作品紹介", "ポートフォリオ", "ネタ出し"],
    purposes: ["creative", "write"],
    audienceTags: ["creator-audience", "individual"],
    tags: ["作品紹介", "創作", "文章", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "紹介文の下書きです。表現はご自身の言葉に直してお使いください。",
        fields: [
          { id: "genre", label: "作品ジャンル", placeholder: "例：イラスト／小説／音楽" },
          { id: "features", label: "作品の特徴", placeholder: "例：やわらかい色使いが特徴です", multiline: true },
          { id: "appeal", label: "伝えたい魅力", placeholder: "例：見ていて落ち着くところ" },
        ],
        template:
          "この作品は、{genre} の作品です。\n\n{features}\n\n特に見てほしいのは、「{appeal}」という点です。\n\nぜひご覧いただけたら嬉しいです。",
      },
    },
    recommendedFor: ["作品の紹介文づくりが苦手な人", "ポートフォリオの説明を整えたい人"],
    howToUse: ["ジャンル・特徴・魅力を入力", "出てきた紹介文を自分の言葉に整える"],
    useCases: ["ポートフォリオの説明文", "投稿の作品紹介"],
    cautions: ["下書きです。ご自身の言葉に直してお使いください"],
    authorComment: "自分の作品を紹介する言葉づくりの助けになればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "作品紹介の文章で手が止まる人を減らしたかったため。",
  }),

  /* 13. ミニゲーム・エンタメ */
  initialTool({
    id: "init-topic-random",
    slug: "topic-random",
    name: "今日のお題ランダムメーカー",
    shortDescription:
      "会話・配信・創作・雑談に使えるお題を、カテゴリを選んでランダムに表示します。",
    description:
      "友達との会話、配信、創作、雑談などに使えるお題をランダムに表示するツールです。カテゴリを選んでボタンを押すと、お題が1つ表示されます。何度でも引き直せます。",
    category: "entertainment",
    subCategories: ["ランダム生成", "お題生成", "暇つぶし"],
    purposes: ["kill-time", "with-friends", "creative"],
    audienceTags: ["individual", "student"],
    tags: ["お題", "ランダム", "暇つぶし", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "random",
      config: {
        note: "表示はランダムです。結果は保存されません。",
        categories: [
          {
            id: "talk",
            label: "雑談・会話",
            items: [
              "最近ハマっていることは？",
              "子どものころの将来の夢は？",
              "今いちばん行きたい場所は？",
              "もらって嬉しかったプレゼントは？",
              "明日が休みなら何をする？",
              "最近うれしかった小さなことは？",
            ],
          },
          {
            id: "creative",
            label: "創作のお題",
            items: [
              "「鍵」をテーマに短い話を考える",
              "雨の日に起きる不思議な出来事",
              "もし動物と話せたら最初に聞くこと",
              "100年後の朝のニュース",
              "“さよなら”から始まる物語",
            ],
          },
          {
            id: "stream",
            label: "配信・トーク",
            items: [
              "視聴者に質問：最近の小さな幸せは？",
              "今日の一言テーマトーク：失敗談",
              "5秒で自己紹介してみる",
              "好きなものを3つだけ熱く語る",
            ],
          },
        ],
      },
    },
    recommendedFor: ["会話のきっかけが欲しい人", "創作のお題が欲しい人"],
    howToUse: ["カテゴリを選ぶ", "「お題を引く」を押す", "気に入らなければ引き直す"],
    useCases: ["友達との会話", "配信のトークテーマ", "創作のお題出し"],
    cautions: ["表示はランダムです。結果は保存されません"],
    authorComment: "会話や創作の「最初のひとこと」に困ったときに使えればと思い作りました。",
    techStack: ["AppPark内ミニツール（ランダム生成）"],
    reasonCreated: "お題に困ったときにすぐ引ける手軽さが欲しかったため。",
  }),

  /* 14. 法務・契約・士業 */
  initialTool({
    id: "init-contract-check",
    slug: "contract-check-points",
    name: "契約書確認ポイントチェック",
    shortDescription:
      "契約期間・報酬・解約・損害賠償・秘密保持・管轄など、基本の確認項目をチェック。",
    description:
      "契約書を見る前に確認したい基本項目を整理できるチェックリストです。契約期間・報酬・解約条件・損害賠償・秘密保持・管轄などの観点を確認できます。チェック状態はこの端末に保存されます（ログイン不要）。",
    category: "legal",
    subCategories: ["契約書チェック", "法務相談準備", "士業業務効率化"],
    purposes: ["legal-contract", "business-tools"],
    audienceTags: ["sole-proprietor", "small-business", "professional", "freelance"],
    tags: ["契約書", "チェックリスト", "法務", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "checklist",
      config: {
        note: "このツールは一般的な確認項目を整理するものであり、法的助言ではありません。具体的な判断は専門家にご相談ください。",
        items: [
          { id: "k1", label: "契約期間・開始日と終了日を確認した", category: "期間" },
          { id: "k2", label: "報酬額・支払時期・支払方法を確認した", category: "報酬", required: true },
          { id: "k3", label: "解約条件・中途解約の可否を確認した", category: "解約" },
          { id: "k4", label: "損害賠償・責任の範囲を確認した", category: "責任" },
          { id: "k5", label: "秘密保持の範囲・期間を確認した", category: "秘密保持" },
          { id: "k6", label: "知的財産・成果物の権利の帰属を確認した", category: "権利" },
          { id: "k7", label: "自動更新の有無を確認した", category: "更新" },
          { id: "k8", label: "管轄・準拠法を確認した", category: "管轄" },
        ],
      },
    },
    recommendedFor: ["契約書を確認する前に観点を整理したい人", "見落としを防ぎたい人"],
    howToUse: ["項目をチェックしていく", "気になる点は専門家に相談する"],
    useCases: ["契約書レビュー前の整理", "相談前の論点整理"],
    cautions: ["一般的な確認項目です。法的助言ではありません。判断は専門家にご相談ください"],
    authorComment: "確認の抜け漏れを減らし、専門家に相談しやすくする入口として作りました。",
    techStack: ["AppPark内ミニツール（チェックリスト）"],
    reasonCreated: "契約書を見る前の観点整理を手軽にできるようにしたかったため。",
  }),

  /* 15. お金・家計・経理 */
  initialTool({
    id: "init-budget-remaining",
    slug: "budget-remaining",
    name: "月の残り予算計算",
    shortDescription:
      "月収・固定費・すでに使った金額から、今月使える残り予算をその場で計算します。",
    description:
      "今月あと使える金額を計算できる計算ツールです。月収・固定費・すでに使った金額を入力すると、残り予算を計算します。AppPark内で計算し、入力は保存しません。",
    category: "finance",
    subCategories: ["家計管理", "収支計算", "支出チェック"],
    purposes: ["manage-money", "daily-life"],
    audienceTags: ["individual", "student", "worker"],
    tags: ["家計", "予算", "計算", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "calculator",
      config: {
        resultLabel: "今月使える残り予算",
        unit: "円",
        rounding: "none",
        formula: "income - fixed - spent",
        note: "概算です。実際の収支は明細でご確認ください。",
        inputs: [
          { id: "income", label: "月収（手取り）", kind: "number", unit: "円", defaultValue: 250000, min: 0 },
          { id: "fixed", label: "固定費（家賃・通信など）", kind: "number", unit: "円", defaultValue: 120000, min: 0 },
          { id: "spent", label: "すでに使った金額", kind: "number", unit: "円", defaultValue: 40000, min: 0 },
        ],
      },
    },
    recommendedFor: ["今月の使えるお金を把握したい人", "使いすぎを防ぎたい人"],
    howToUse: ["月収・固定費・使った金額を入力", "残り予算が表示される"],
    useCases: ["月の予算管理", "使いすぎの確認"],
    cautions: ["概算です。正確な収支は明細でご確認ください"],
    authorComment: "「今月あといくら使える？」をすぐ出せるようにしました。",
    techStack: ["AppPark内ミニツール（計算・安全な式評価）"],
    reasonCreated: "残り予算をその場で把握できるようにしたかったため。",
  }),

  /* 16. 人事・採用・転職 */
  initialTool({
    id: "init-interview-reply",
    slug: "interview-schedule-reply",
    name: "面接日程返信メーカー",
    relatedIdeaId: "idea-interview-reply",
    shortDescription:
      "企業名・担当者・希望日時・面接形式から、丁寧な面接日程の返信文を作ります。",
    description:
      "面接日程の確定・調整の返信文の下書きを作れるテンプレートツールです。企業名・担当者名・希望日時・面接形式（対面／Web）を入力すると、丁寧な返信文を作成します。AIではなく定型テンプレートで生成します。",
    category: "hr",
    subCategories: ["面接対策", "日程調整", "志望動機"],
    purposes: ["hr-job", "write"],
    audienceTags: ["student", "individual", "worker"],
    tags: ["面接", "日程", "返信", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "生成文は下書きです。送信前に内容をご確認ください。",
        fields: [
          { id: "company", label: "企業名", placeholder: "○○株式会社" },
          { id: "person", label: "担当者名", placeholder: "採用ご担当 ○○様" },
          { id: "datetime", label: "希望日時", placeholder: "例：6月15日(月) 10時" },
          { id: "format", label: "面接形式", placeholder: "例：対面／Web面接" },
        ],
        template:
          "{company}\n{person}\n\nお世話になっております。この度は面接のご案内をいただき、誠にありがとうございます。\n\n下記の日程で承知いたしました。\n日時：{datetime}\n形式：{format}\n\n当日はどうぞよろしくお願いいたします。",
      },
    },
    recommendedFor: ["面接日程の返信に迷う人", "丁寧な文面をすぐ作りたい就活・転職中の人"],
    howToUse: ["企業名・担当者・日時・形式を入力", "生成された返信文をコピーして使う"],
    useCases: ["面接日程の確定返信", "日程調整の連絡"],
    cautions: ["生成文は下書きです。内容を確認してから送信してください"],
    authorComment: "就活・転職中の連絡の負担を少し軽くできればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "面接日程の返信文づくりを楽にしたかったため。",
  }),

  /* 17. 翻訳・語学 */
  initialTool({
    id: "init-easy-japanese",
    slug: "easy-japanese-memo",
    name: "やさしい日本語変換メモ",
    shortDescription:
      "貼り付けた文章を一文ずつに分け、表記をそろえる整形ツール。やさしい日本語の下準備に。",
    description:
      "難しい日本語を、外国人にも伝わりやすい表現に直すための下準備ができる整形ツールです。各行の前後の空白を整理し、空行をまとめ、全角の英数字や全角スペースを半角にそろえます。言い換え自体は行いません（やさしい日本語にする前の整形・下ごしらえにお使いください）。",
    category: "language",
    subCategories: ["やさしい日本語", "外国人対応", "日本語校正"],
    purposes: ["language-support", "polish-writing"],
    audienceTags: ["foreigner-support", "educator", "individual"],
    tags: ["やさしい日本語", "整形", "外国人対応", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "text_transform",
      config: {
        note: "表記をそろえる整形ツールです。言い換え自体は行いません。一文ずつ短く分けるのは手動で行ってください。",
        operations: ["trim_lines", "remove_blank_lines", "collapse_spaces", "fullwidth_space_to_half", "normalize_width"],
      },
    },
    recommendedFor: ["外国人向けの掲示・案内文を整えたい人", "文章の表記をそろえたい人"],
    howToUse: ["文章を貼り付ける", "適用する整形を選ぶ", "整形結果をコピーする"],
    useCases: ["案内文の下ごしらえ", "表記ゆれの整理"],
    cautions: ["言い換えは行いません。意味の調整はご自身で行ってください"],
    authorComment: "やさしい日本語にする前の「整える」工程を手伝えればと思い作りました。",
    techStack: ["AppPark内ミニツール（文章整形）"],
    reasonCreated: "外国人向けの文章を整える下準備を手軽にしたかったため。",
  }),

  /* 18. 情報整理・メモ */
  initialTool({
    id: "init-idea-organize",
    slug: "idea-organize-memo",
    name: "アイデア整理メモ",
    shortDescription:
      "アイデア名・誰向け・解決する課題・次にやることに分けて、アイデアを整理します。",
    description:
      "思いついたアイデアを、目的・対象・次の一手に分けて整理できるテンプレートツールです。アイデア名・誰向けか・解決する課題・次にやることを入力すると、一言まとめ付きの整理メモを作成します。",
    category: "notes",
    subCategories: ["アイデア管理", "メモ", "文章整理"],
    purposes: ["realize-idea", "work-efficiency"],
    audienceTags: ["individual", "engineer", "creator-audience"],
    tags: ["アイデア", "整理", "メモ", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "整理のための下書きメモです。",
        fields: [
          { id: "name", label: "アイデア名", placeholder: "例：近所のイベント共有アプリ" },
          { id: "forWhom", label: "誰向けか", placeholder: "例：地域の子育て世帯" },
          { id: "problem", label: "解決する課題", placeholder: "例：地域の情報が見つけにくい", multiline: true },
          { id: "next", label: "次にやること", placeholder: "例：周りに困りごとを聞く" },
        ],
        template:
          "【アイデア整理メモ】\nアイデア名：{name}\n誰向け：{forWhom}\n解決する課題：{problem}\n次にやること：{next}\n\n一言まとめ：{forWhom} の「{problem}」を解決する『{name}』。まずは「{next}」から着手する。",
      },
    },
    recommendedFor: ["アイデアを頭の中で抱えがちな人", "次の一手を決めたい人"],
    howToUse: ["アイデア名・対象・課題・次の一手を入力", "出てきた整理メモを残す"],
    useCases: ["アイデアの言語化", "企画の初期整理"],
    cautions: ["整理のための下書きメモです"],
    authorComment: "アイデアを「形にする最初の一歩」を後押しできればと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "頭の中のアイデアを、動き出せる形に整理したかったため。",
  }),

  /* 19. SNS運用 */
  initialTool({
    id: "init-short-post-structure",
    slug: "short-post-structure",
    name: "ショート投稿構成メーカー",
    shortDescription:
      "投稿媒体・テーマ・視聴者・目的から、SNS投稿の構成案を作ります。",
    description:
      "X・Instagram・TikTok・YouTube Shorts向けの投稿構成の下書きを作れるテンプレートツールです。投稿媒体・テーマ・視聴者・目的を入力すると、つかみ・中身・具体例・締めの構成案を作成します。",
    category: "sns",
    subCategories: ["X投稿", "Instagram投稿", "TikTok投稿", "YouTube Shorts"],
    purposes: ["grow-sns", "get-customers"],
    audienceTags: ["marketer", "creator-audience", "small-business"],
    tags: ["SNS", "投稿", "構成", "無料"],
    url: "",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "template_generator",
      config: {
        note: "構成の下書きです。媒体のトーンに合わせて調整してください。",
        fields: [
          { id: "platform", label: "投稿媒体", placeholder: "例：X／Instagram／TikTok" },
          { id: "theme", label: "テーマ", placeholder: "例：時短レシピ" },
          { id: "viewer", label: "視聴者", placeholder: "例：一人暮らしの社会人" },
          { id: "goal", label: "目的", placeholder: "例：保存を増やす" },
        ],
        template:
          "【{platform} 投稿構成案】テーマ：{theme}／視聴者：{viewer}／目的：{goal}\n\n1. つかみ：{viewer} が思わず止まる一言・結論先出し\n2. 中身：{theme} のポイントを簡潔に\n3. 具体例：イメージしやすい例や手順\n4. 締め：{goal} につながる行動（保存・フォロー・リンク）を促す",
      },
    },
    recommendedFor: ["投稿の構成で迷う人", "媒体ごとの型が欲しい人"],
    howToUse: ["媒体・テーマ・視聴者・目的を入力", "出てきた構成案を投稿に使う"],
    useCases: ["SNS投稿の構成づくり", "各媒体の投稿設計"],
    cautions: ["構成の下書きです。媒体のトーンに合わせて調整してください"],
    authorComment: "媒体ごとの投稿の型があると発信しやすいと思い作りました。",
    techStack: ["AppPark内ミニツール（テンプレート生成）"],
    reasonCreated: "SNS投稿の構成づくりの入口を用意したかったため。",
  }),

  /* 20. AppPark内ミニツール */
  initialTool({
    id: "init-minitool-type-diagnosis",
    slug: "minitool-type-diagnosis",
    name: "ミニツール作成タイプ診断",
    shortDescription:
      "3つの質問で、あなたのアイデアに向いているミニツールのタイプを提案します。",
    description:
      "自分のアイデアが、診断・計算・チェックリスト・テンプレート生成のどのミニツールに向いているかを提案する診断ツールです。3つの質問に答えると、おすすめのタイプと作り方の入口を表示します。AppPark内で完結し、結果は保存しません。",
    category: "mini-tools",
    subCategories: ["診断ツール", "テンプレート生成", "チェックリスト"],
    purposes: ["publish-tool", "no-code", "try-first"],
    audienceTags: ["beginner", "code-beginner", "individual"],
    tags: ["診断", "ミニツール", "ノーコード", "無料"],
    url: "",
    ctaLabel: "ミニツールを作る／掲載申請する",
    ctaUrl: "/submit",
    listingType: "internal_mini_tool",
    miniTool: {
      enabled: true,
      type: "diagnosis",
      config: {
        note: "結果は目安です。実際のタイプはご自身のアイデアに合わせて選んでください。",
        questions: [
          {
            id: "q1",
            text: "作りたいものに近いのは？",
            options: [
              { id: "q1a", label: "向き不向きやタイプを判定したい", resultKey: "diagnosis" },
              { id: "q1b", label: "数値を計算・見積もりたい", resultKey: "calculator" },
              { id: "q1c", label: "抜け漏れを防ぐ確認をしたい", resultKey: "checklist" },
              { id: "q1d", label: "入力から文章を作りたい", resultKey: "template" },
            ],
          },
          {
            id: "q2",
            text: "利用者にしてもらう入力は？",
            options: [
              { id: "q2a", label: "いくつかの質問に答えてもらう", resultKey: "diagnosis" },
              { id: "q2b", label: "数値を入れてもらう", resultKey: "calculator" },
              { id: "q2c", label: "項目をチェックしてもらう", resultKey: "checklist" },
              { id: "q2d", label: "項目を埋めてもらう", resultKey: "template" },
            ],
          },
          {
            id: "q3",
            text: "返したい結果は？",
            options: [
              { id: "q3a", label: "タイプ・おすすめ", resultKey: "diagnosis" },
              { id: "q3b", label: "計算結果の数値", resultKey: "calculator" },
              { id: "q3c", label: "進捗率・確認状況", resultKey: "checklist" },
              { id: "q3d", label: "完成した文章", resultKey: "template" },
            ],
          },
        ],
        results: [
          { key: "diagnosis", title: "診断ツールが向いています", body: "質問への回答からタイプやおすすめを返す形が合っています。AppParkの「診断」タイプで作れます。", ctaLabel: "ミニツールを作る", ctaUrl: "/submit" },
          { key: "calculator", title: "計算・見積もりツールが向いています", body: "数値の入力から結果を計算する形が合っています。AppParkの「計算・見積もり」タイプで作れます。", ctaLabel: "ミニツールを作る", ctaUrl: "/submit" },
          { key: "checklist", title: "チェックリストツールが向いています", body: "確認項目を用意して進捗を出す形が合っています。AppParkの「チェックリスト」タイプで作れます。", ctaLabel: "ミニツールを作る", ctaUrl: "/submit" },
          { key: "template", title: "テンプレート生成ツールが向いています", body: "入力欄を埋めると文章ができる形が合っています。AppParkの「テンプレート生成」タイプで作れます。", ctaLabel: "ミニツールを作る", ctaUrl: "/submit" },
        ],
      },
    },
    recommendedFor: ["ミニツールを作ってみたい人", "どの形式で作るか迷っている人"],
    howToUse: ["3つの質問に答える", "「結果を見る」を押す", "提案されたタイプで掲載申請する"],
    useCases: ["ミニツール作成の入口", "形式選びの参考"],
    cautions: ["結果は目安です。最終的なタイプはご自身で選んでください"],
    authorComment: "「自分のアイデアはどの形で作れる？」の入口になればと思い作りました。",
    techStack: ["AppPark内ミニツール（診断）"],
    reasonCreated: "ミニツール作成の最初の一歩を選びやすくしたかったため。",
  }),
];
