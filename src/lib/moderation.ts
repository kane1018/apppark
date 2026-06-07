/**
 * コメントの危険度判定（モデレーション）ロジック。
 *
 * 【設計方針】
 * - 判定ロジックをこのファイルに分離し、UIから切り離しています。
 * - MVPは「ルールベース判定」。NGワード・URL数・個人情報らしき文字列・
 *   攻撃的表現・連続投稿などをスコア化します。
 * - 後から OpenAI Moderation API などに差し替えられるよう、公開関数
 *   `moderateComment` は async にしてあります。AIに切り替える場合は、
 *   この関数の中身を API 呼び出しに置き換えるだけで UI 側は変更不要です。
 */

import type {
  CommentType,
  ModerationStatus,
  RiskLevel,
} from "@/types";

/** リスクレベルのしきい値（0〜100）。運用に応じて調整可能。 */
export const RISK_THRESHOLDS = {
  /** これ未満は low */
  medium: 30,
  /** これ以上は high */
  high: 60,
} as const;

/** この通報数に達したら自動で確認待ち（pending）にする */
export const REPORT_THRESHOLD = 3;

export interface ModerationInput {
  body: string;
  commentType: CommentType;
  authorName?: string;
  /** 同一内容の連続投稿を検出するための、同じ文脈の既存本文一覧 */
  recentBodies?: string[];
}

export interface ModerationResult {
  riskScore: number; // 0〜100
  riskLevel: RiskLevel;
  moderationStatus: ModerationStatus;
  /** 判定理由（人間可読） */
  moderationReason: string;
  /** 検出カテゴリ（管理・デバッグ用） */
  flags: string[];
}

/* ------------------------------------------------------------------
 * ルールベースの辞書（カテゴリごとの危険ワード・重み）
 * 必要に応じてワードを追加・調整してください。
 * ------------------------------------------------------------------ */

interface RuleGroup {
  /** 管理画面・理由表示に使うラベル */
  label: string;
  /** 1語ヒットあたりの加点 */
  weight: number;
  words: string[];
}

const RULE_GROUPS: RuleGroup[] = [
  {
    label: "誹謗中傷・人格攻撃",
    weight: 45,
    words: [
      "死ね",
      "しね",
      "殺す",
      "ころす",
      "消えろ",
      "クズ",
      "くず",
      "ゴミ",
      "ごみ",
      "カス",
      "馬鹿",
      "バカ",
      "ばか",
      "アホ",
      "あほ",
      "無能",
      "クソ",
      "くそ",
      "きもい",
      "キモい",
      "うざい",
      "ウザい",
      "ブス",
      "デブ",
    ],
  },
  {
    label: "差別・ヘイト",
    weight: 60,
    words: ["差別しろ", "出ていけ", "劣等", "排除しろ"],
  },
  {
    label: "違法・危険行為の助長",
    weight: 60,
    words: [
      "違法ダウンロード",
      "割れ",
      "クラック",
      "ハッキング代行",
      "爆破",
      "爆弾の作り方",
      "麻薬",
      "大麻",
      "拳銃",
      "自殺の方法",
    ],
  },
  {
    label: "投資・副業・情報商材への誘導",
    weight: 40,
    words: [
      "必ず儲かる",
      "絶対稼げる",
      "簡単に稼げる",
      "副業",
      "情報商材",
      "投資案件",
      "億り人",
      "FX自動",
      "仮想通貨で稼",
      "LINEに登録",
      "公式LINE",
      "稼げます",
      "日給",
    ],
  },
  {
    label: "アダルト誘導",
    weight: 50,
    words: ["アダルト", "出会い", "エロ", "わいせつ", "裏垢", "パパ活"],
  },
  {
    label: "スパム・無関係な宣伝",
    weight: 25,
    words: [
      "今だけ",
      "登録はこちら",
      "クリックして",
      "詳しくはこちら",
      "プロフ見て",
      "DMください",
      "フォローして",
    ],
  },
  {
    label: "根拠のない断定的な悪評",
    weight: 20,
    words: ["詐欺確定", "絶対危険", "100%詐欺", "犯罪者", "違法に決まってる"],
  },
];

/* ------------------------------------------------------------------
 * 個別ルール（正規表現ベース）
 * ------------------------------------------------------------------ */

/** URL を数える */
const URL_REGEX = /https?:\/\/[^\s「」、。)）]+/g;

/** 個人情報らしき文字列（電話番号・メール） */
const PHONE_REGEX = /0\d{1,4}[-(]?\d{1,4}[-)]?\d{3,4}/;
const EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/;

function countMatches(text: string, words: string[]): string[] {
  const hit: string[] = [];
  for (const w of words) {
    if (w && text.includes(w)) hit.push(w);
  }
  return hit;
}

function normalize(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

/**
 * ルールベースの本体。スコアと理由を組み立てます。
 * （同期関数。AIに差し替える場合は moderateComment を置き換えてください）
 */
export function assessByRules(input: ModerationInput): ModerationResult {
  const raw = input.body ?? "";
  const text = raw;
  const normalized = normalize(raw);
  const flags: string[] = [];
  const reasons: string[] = [];
  let score = 0;

  // 1) カテゴリ辞書
  for (const group of RULE_GROUPS) {
    const hits = countMatches(raw, group.words);
    if (hits.length > 0) {
      score += group.weight + (hits.length - 1) * 8;
      flags.push(group.label);
      reasons.push(`${group.label}に該当する表現を検出`);
    }
  }

  // 2) URL の数（多いほどスパムの疑い）
  const urls = text.match(URL_REGEX) ?? [];
  if (urls.length >= 3) {
    score += 35;
    flags.push("スパム・無関係な宣伝");
    reasons.push("URLが多数含まれています");
  } else if (urls.length === 2) {
    score += 15;
    reasons.push("URLが複数含まれています");
  }

  // 3) 個人情報らしき文字列
  if (PHONE_REGEX.test(text) || EMAIL_REGEX.test(text)) {
    score += 45;
    flags.push("個人情報の投稿");
    reasons.push("電話番号やメールアドレスらしき文字列を検出");
  }

  // 4) 過度に攻撃的な表現（記号の連打・全文大文字など）
  if (/[!！?？]{4,}/.test(text) || /(.)\1{6,}/.test(normalized)) {
    score += 12;
    reasons.push("過度に強い・繰り返しの表現");
  }

  // 5) 同一内容の連続投稿
  if (input.recentBodies && input.recentBodies.length > 0) {
    const dup = input.recentBodies.some(
      (b) => normalize(b) === normalized && normalized.length > 0
    );
    if (dup) {
      score += 40;
      flags.push("同一内容の連続投稿");
      reasons.push("直前と同じ内容の投稿です");
    }
  }

  // 6) あまりに短すぎる/長すぎる本文の補正（軽微）
  if (raw.trim().length > 0 && raw.trim().length < 2) {
    score += 5;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const riskLevel: RiskLevel =
    score >= RISK_THRESHOLDS.high
      ? "high"
      : score >= RISK_THRESHOLDS.medium
        ? "medium"
        : "low";

  const moderationStatus = statusFromLevel(riskLevel);

  const moderationReason =
    reasons.length > 0
      ? Array.from(new Set(reasons)).join(" / ")
      : "問題となる表現は検出されませんでした";

  return {
    riskScore: score,
    riskLevel,
    moderationStatus,
    moderationReason,
    flags: Array.from(new Set(flags)),
  };
}

/** リスクレベルから初期のモデレーション状態を決める（表示ルール：セクション） */
export function statusFromLevel(level: RiskLevel): ModerationStatus {
  switch (level) {
    case "low":
      return "published"; // 原則公開
    case "medium":
      return "pending"; // 確認中（保留）
    case "high":
      return "hidden"; // 自動で非公開＋管理者確認待ち
  }
}

/**
 * 公開API。現在はルールベースを呼ぶだけ。
 * AIモデレーションに切り替える場合は、この関数の中身を
 * fetch('/api/moderate' ...) などに置き換えてください（戻り値の型は同じ）。
 */
export async function moderateComment(
  input: ModerationInput
): Promise<ModerationResult> {
  return assessByRules(input);
}

/** 投稿後にユーザーへ表示するメッセージ（リスクレベル別） */
export function submissionMessage(level: RiskLevel): string {
  switch (level) {
    case "low":
      return "コメントを投稿しました。";
    case "medium":
      return "コメントを受け付けました。内容を確認後、掲載される場合があります。";
    case "high":
      return "このコメントは、コメントルールに抵触する可能性があるため、確認待ちとなりました。";
  }
}
