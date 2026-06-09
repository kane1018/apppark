import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Zap,
  GraduationCap,
  House,
  Palette,
  Gamepad2,
  Building2,
  Code2,
  PenLine,
  Clapperboard,
  Calculator,
  LayoutTemplate,
  Image,
  BookOpen,
  Globe,
  Megaphone,
  BriefcaseBusiness,
  Shapes,
  UserPlus,
  MessageSquareText,
  Bug,
  FileText,
  Handshake,
  Share2,
  LayoutGrid,
  Wallet,
  Users,
  Languages,
  NotebookPen,
  Scale,
  Sparkles,
} from "lucide-react";

/**
 * アイコン統一システム（Lucide Icons / ISC・商用利用可）。
 *
 * カテゴリ・目的のカードや見出しで使う線アイコンを一元管理します。
 * 絵文字は使わず、サイズ・余白・角丸・影・配色を揃えて「信頼感のある
 * カタログ」の見た目に統一しています。
 *
 * アイコンを変えたいときは、データ側（categories.ts / purposes.ts）の
 * `icon` を下記キーのいずれかに変更してください。
 */

export type IconName =
  | "bot"
  | "zap"
  | "graduation-cap"
  | "house"
  | "palette"
  | "gamepad-2"
  | "building-2"
  | "code-2"
  | "pen-line"
  | "clapperboard"
  | "calculator"
  | "layout-template"
  | "image"
  | "book-open"
  | "globe"
  | "megaphone"
  | "briefcase-business"
  | "user-plus"
  | "message-square-text"
  | "bug"
  | "file-text"
  | "handshake"
  | "share-2"
  | "layout-grid"
  | "wallet"
  | "users"
  | "languages"
  | "notebook-pen"
  | "scale"
  | "sparkles";

const iconRegistry: Record<IconName, LucideIcon> = {
  bot: Bot,
  zap: Zap,
  "graduation-cap": GraduationCap,
  house: House,
  palette: Palette,
  "gamepad-2": Gamepad2,
  "building-2": Building2,
  "code-2": Code2,
  "pen-line": PenLine,
  clapperboard: Clapperboard,
  calculator: Calculator,
  "layout-template": LayoutTemplate,
  image: Image,
  "book-open": BookOpen,
  globe: Globe,
  megaphone: Megaphone,
  "briefcase-business": BriefcaseBusiness,
  "user-plus": UserPlus,
  "message-square-text": MessageSquareText,
  bug: Bug,
  "file-text": FileText,
  handshake: Handshake,
  "share-2": Share2,
  "layout-grid": LayoutGrid,
  wallet: Wallet,
  users: Users,
  languages: Languages,
  "notebook-pen": NotebookPen,
  scale: Scale,
  sparkles: Sparkles,
};

export type IconTone = "navy" | "orange" | "grey";
export type IconBadgeSize = "sm" | "md" | "lg";

const toneStyles: Record<IconTone, string> = {
  navy: "bg-brand-50 text-brand-600 ring-brand-600/10",
  orange: "bg-accent-100 text-accent-600 ring-accent-600/10",
  grey: "bg-gray-100 text-ink-soft ring-gray-500/10",
};

const sizeStyles: Record<IconBadgeSize, { box: string; px: number }> = {
  sm: { box: "h-9 w-9 rounded-lg", px: 18 },
  md: { box: "h-11 w-11 rounded-xl", px: 22 },
  lg: { box: "h-14 w-14 rounded-2xl", px: 28 },
};

/**
 * アイコンを、配色付きの角丸バッジに入れて表示する統一コンポーネント。
 * 背景は薄いネイビー / 薄いオレンジ / 薄いグレーのいずれか。
 */
export function IconBadge({
  name,
  tone = "navy",
  size = "md",
  className = "",
}: {
  name: IconName;
  tone?: IconTone;
  size?: IconBadgeSize;
  className?: string;
}) {
  const Icon = iconRegistry[name] ?? Shapes;
  const s = sizeStyles[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center shadow-sm ring-1 ring-inset ${s.box} ${toneStyles[tone]} ${className}`}
      aria-hidden
    >
      <Icon size={s.px} strokeWidth={1.9} absoluteStrokeWidth />
    </span>
  );
}

/**
 * 背景なしのアイコン（ナビのチップやサムネイルなど、文字色を継承したい箇所用）。
 */
export function IconGlyph({
  name,
  size = 16,
  strokeWidth = 1.9,
  className = "",
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = iconRegistry[name] ?? Shapes;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden />;
}
