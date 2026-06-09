import type { Idea, IdeaStatus, MiniToolPotential, WantLevel } from "@/types";
import { siteConfig } from "@/config/site";

/**
 * アイデア掲示板の初期データ（シード）。
 *
 * これらはサイトオーナー本人（公開表示名：kane）が「こんなツールが欲しい」を
 * 書き込んだ実在の投稿として扱います（架空の第三者ユーザーにはしません）。
 * 利用者がログインして投稿したアイデアは、クライアント側（localStorage）で
 * これらに追加されます（IdeaProvider）。後から Supabase 等に接続する際は、
 * この Idea 型に合わせて返すようにすれば UI は変更不要です。
 *
 * 架空の共感数・コメント数は持たせません（likeCount/commentCount は 0 始まり）。
 */

const OWNER = siteConfig.owner;

function idea(
  partial: Omit<
    Idea,
    | "authorId"
    | "publicAuthorName"
    | "isAnonymous"
    | "updatedAt"
    | "likeCount"
    | "commentCount"
    | "moderationStatus"
    | "riskLevel"
    | "relatedServiceId"
  > &
    Partial<Idea>
): Idea {
  return {
    authorId: OWNER.authorId,
    publicAuthorName: OWNER.displayName,
    isAnonymous: false,
    updatedAt: partial.createdAt,
    likeCount: 0,
    commentCount: 0,
    moderationStatus: "published",
    riskLevel: "low",
    relatedServiceId: null,
    ...partial,
  };
}

export const seedIdeas: Idea[] = [
  idea({
    id: "idea-interview-reply",
    title: "面接日程の返信文を一瞬で作れるツールが欲しい",
    problem:
      "企業ごとに丁寧な返信文を考えるのが面倒で、失礼がないか毎回不安になります。特に複数社の選考が並行すると、文面づくりだけで時間がかかってしまいます。",
    desiredTool:
      "企業名・担当者名・希望日時を入れるだけで、自然で丁寧な返信文を作ってくれるツール。対面／Webの違いも反映してくれると嬉しいです。",
    category: "hr",
    purposeTags: ["hr-job", "write"],
    audienceTags: ["student", "individual", "worker"],
    useCase: "面接日程の候補を返信するとき",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "yes",
    wantLevel: 5,
    status: "created",
    relatedServiceId: "init-interview-reply",
    createdAt: "2026-06-02",
  }),
  idea({
    id: "idea-receipt-split",
    title: "割り勘の端数までサッと出せる計算ツールが欲しい",
    problem:
      "飲み会やランチの割り勘で、幹事だけ多めに負担したり端数の扱いで毎回もたつきます。電卓だと条件を変えるたびに計算し直すのが手間です。",
    desiredTool:
      "合計金額・人数・幹事の割増を入れると、1人あたりの金額と端数調整まで出してくれるツール。",
    category: "calc-diagnosis",
    purposeTags: ["calculate", "daily-life"],
    audienceTags: ["individual", "student"],
    useCase: "飲み会の会計をその場で分けるとき",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "yes",
    wantLevel: 4,
    status: "open",
    createdAt: "2026-06-04",
  }),
  idea({
    id: "idea-reading-log",
    title: "読んだ本の内容を3行で残せる読書メモが欲しい",
    problem:
      "本を読んでも内容を忘れてしまい、あとで「何が良かったんだっけ」となります。長い感想は続かないので、軽く残せる形がいいです。",
    desiredTool:
      "タイトル・3行要約・次に活かすことだけを入力して残せる、シンプルな読書メモのテンプレート。",
    category: "notes",
    purposeTags: ["realize-idea", "study"],
    audienceTags: ["individual", "student", "worker"],
    useCase: "本を読み終えた直後",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "yes",
    wantLevel: 3,
    status: "open",
    createdAt: "2026-06-05",
  }),
  idea({
    id: "idea-shift-reminder",
    title: "今週の予定を一言ずつ整理できるツールが欲しい",
    problem:
      "頭の中で今週の予定を考えていると、抜け漏れが出たり優先順位がぼやけたりします。重いカレンダーアプリは続きませんでした。",
    desiredTool:
      "曜日ごとに「やること」を一言だけ書いて、今週のゆるい計画を立てられるテンプレート。",
    category: "productivity",
    purposeTags: ["work-efficiency", "daily-life"],
    audienceTags: ["worker", "individual", "freelance"],
    useCase: "週のはじめに予定を整理するとき",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "maybe",
    wantLevel: 3,
    status: "planned",
    createdAt: "2026-06-06",
  }),
  idea({
    id: "idea-gift-finder",
    title: "相手の情報からプレゼント候補を絞れる診断が欲しい",
    problem:
      "誕生日プレゼントを毎回悩んで決められず、結局無難なものになりがちです。何かヒントだけでも欲しいです。",
    desiredTool:
      "相手の年代・関係性・予算・趣味を選ぶと、考える方向性やジャンルを提案してくれる診断ツール（具体的な商品名の断定はしなくてOK）。",
    category: "entertainment",
    purposeTags: ["diagnose", "daily-life"],
    audienceTags: ["individual"],
    useCase: "プレゼント選びで迷ったとき",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "yes",
    wantLevel: 4,
    status: "open",
    createdAt: "2026-06-07",
  }),
  idea({
    id: "idea-sns-hashtag",
    title: "投稿テーマからハッシュタグ候補を整理できるツールが欲しい",
    problem:
      "SNS投稿のたびにハッシュタグを考えるのが大変で、毎回似たものになってしまいます。",
    desiredTool:
      "投稿テーマと媒体を入れると、大・中・小のハッシュタグの組み立て方を整理してくれるテンプレート（実在タグの自動取得はなくてOK）。",
    category: "sns",
    purposeTags: ["grow-sns", "get-customers"],
    audienceTags: ["marketer", "creator-audience", "small-business"],
    useCase: "SNS投稿の準備をするとき",
    similarServiceUrl: null,
    referenceImageUrl: null,
    miniToolPotential: "maybe",
    wantLevel: 3,
    status: "open",
    createdAt: "2026-06-08",
  }),
];

/* ------------------------------------------------------------------
 * ラベル
 * ------------------------------------------------------------------ */

export const ideaStatusLabels: Record<IdeaStatus, string> = {
  open: "募集中",
  planned: "作成予定",
  in_progress: "作成中",
  created: "作成済み",
  closed: "終了",
};

/** ステータスの表示色（バッジ用） */
export const ideaStatusStyles: Record<IdeaStatus, string> = {
  open: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  planned: "bg-sky-50 text-sky-700 ring-sky-600/20",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-600/20",
  created: "bg-brand-50 text-brand-700 ring-brand-600/20",
  closed: "bg-gray-100 text-gray-500 ring-gray-500/20",
};

export const miniToolPotentialLabels: Record<MiniToolPotential, string> = {
  yes: "AppPark内ミニツールで作れそう",
  maybe: "工夫すれば作れそう",
  no: "外部サービス向き",
  unknown: "わからない",
};

export const wantLevelLabels: Record<WantLevel, string> = {
  1: "あれば便利",
  2: "ほしい",
  3: "けっこうほしい",
  4: "かなりほしい",
  5: "今すぐほしい",
};

/* ------------------------------------------------------------------
 * 取得ヘルパー
 * ------------------------------------------------------------------ */

export function getSeedIdeaById(id: string): Idea | undefined {
  return seedIdeas.find((i) => i.id === id);
}

export function getSeedIdeasByCategory(categorySlug: string): Idea[] {
  return seedIdeas.filter(
    (i) => i.category === categorySlug && i.moderationStatus === "published"
  );
}

/** 公開ページに表示する投稿者名（匿名なら「匿名」） */
export function ideaAuthorName(i: Idea): string {
  return i.isAnonymous ? "匿名" : i.publicAuthorName;
}
