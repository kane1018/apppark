/**
 * AppPark内ミニツールの設定（config）型。
 * すべて「データからの描画」であり、投稿者のコードは実行しません。
 */

export type MiniToolType =
  | "diagnosis" // 診断
  | "calculator" // 計算・見積もり
  | "template_generator" // テンプレート生成
  | "checklist" // チェックリスト
  | "text_transform" // 文章変換・整形
  | "none"; // ミニツールなし（外部/開発中など）

/* ---------------- A. 診断 ---------------- */
export interface DiagnosisOption {
  id: string;
  label: string;
  /** この選択でどの結果に票を入れるか（結果のkey） */
  resultKey: string;
}
export interface DiagnosisQuestion {
  id: string;
  text: string;
  options: DiagnosisOption[];
}
export interface DiagnosisResult {
  key: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
}
export interface DiagnosisConfig {
  questions: DiagnosisQuestion[];
  results: DiagnosisResult[];
  note?: string;
}

/* ---------------- B. 計算・見積もり ---------------- */
export interface CalcInput {
  id: string; // 式で使う変数名（英数字_）
  label: string;
  kind: "number" | "select";
  unit?: string;
  options?: { label: string; value: number }[]; // kind=select
  min?: number;
  max?: number;
  defaultValue?: number;
}
export interface CalculatorConfig {
  inputs: CalcInput[];
  /** 安全な式（+ - * / ( ) と入力id）。evalは使いません */
  formula: string;
  resultLabel: string;
  unit?: string;
  rounding?: "round" | "floor" | "ceil" | "none";
  note?: string;
}

/* ---------------- C. テンプレート生成 ---------------- */
export interface TemplateField {
  id: string; // テンプレ内 {id} に対応
  label: string;
  placeholder?: string;
  multiline?: boolean;
}
export interface TemplateConfig {
  fields: TemplateField[];
  /** {id} を入力値で置換 */
  template: string;
  example?: string;
  note?: string;
}

/* ---------------- D. チェックリスト ---------------- */
export interface ChecklistItem {
  id: string;
  label: string;
  help?: string;
  category?: string;
  required?: boolean;
}
export interface ChecklistConfig {
  items: ChecklistItem[];
  note?: string;
}

/* ---------------- E. 文章変換・整形 ---------------- */
export type TransformOp =
  | "trim_lines" // 各行の前後空白を除去
  | "remove_blank_lines" // 空行を削除
  | "collapse_spaces" // 連続スペースを1つに
  | "to_bullets" // 行頭に「・」を付与
  | "remove_bullets" // 行頭の記号を除去
  | "normalize_width" // 全角英数→半角
  | "fullwidth_space_to_half"; // 全角スペース→半角
export interface TextTransformConfig {
  operations: TransformOp[];
  note?: string;
}

export type MiniToolConfig =
  | DiagnosisConfig
  | CalculatorConfig
  | TemplateConfig
  | ChecklistConfig
  | TextTransformConfig;

export interface MiniTool {
  enabled: boolean;
  type: MiniToolType;
  config: MiniToolConfig | null;
}

export const transformOpLabels: Record<TransformOp, string> = {
  trim_lines: "各行の前後の空白を削除",
  remove_blank_lines: "空行を削除",
  collapse_spaces: "連続スペースを1つにまとめる",
  to_bullets: "行頭に「・」を付ける",
  remove_bullets: "行頭の記号（・-* 等）を削除",
  normalize_width: "全角の英数字を半角に",
  fullwidth_space_to_half: "全角スペースを半角に",
};

export const miniToolTypeLabels: Record<Exclude<MiniToolType, "none">, string> = {
  diagnosis: "診断ツール",
  calculator: "計算・見積もりツール",
  template_generator: "テンプレート生成ツール",
  checklist: "チェックリストツール",
  text_transform: "文章変換・整形ツール",
};
