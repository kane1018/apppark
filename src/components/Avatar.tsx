/**
 * 投稿者アバター。表示の優先順位は次のとおり：
 *   1. プロフィール画像（avatarUrl）
 *   2. ニックネームの頭文字を使った丸いアバター
 *   3. （頭文字が取れない場合）デフォルトの「?」
 *
 * 公開して良いのは nickname / avatarUrl のみ。メール等は扱いません。
 */
const SIZES = {
  xs: { box: "h-6 w-6", text: "text-[10px]", px: 24 },
  sm: { box: "h-8 w-8", text: "text-xs", px: 32 },
  md: { box: "h-11 w-11", text: "text-base", px: 44 },
  lg: { box: "h-16 w-16", text: "text-2xl", px: 64 },
} as const;

export type AvatarSize = keyof typeof SIZES;

/** ニックネームの頭文字（英字は大文字化）。取れなければ "?" */
function initialOf(name: string): string {
  const c = name?.trim()?.[0] ?? "";
  if (!c) return "?";
  return /[a-z]/.test(c) ? c.toUpperCase() : c;
}

/** ニックネームから安定した背景色を選ぶ（同じ名前は常に同じ色） */
const TONES = [
  "bg-brand-100 text-brand-700",
  "bg-accent-100 text-accent-700",
  "bg-teal-100 text-teal-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
];
function toneOf(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return TONES[sum % TONES.length];
}

export function Avatar({
  name,
  avatarUrl = null,
  size = "sm",
  className = "",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const s = SIZES[size];
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name}のアイコン`}
        width={s.px}
        height={s.px}
        loading="lazy"
        className={`${s.box} shrink-0 rounded-full object-cover ring-1 ring-inset ring-black/5 ${className}`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ring-1 ring-inset ring-black/5 ${s.box} ${s.text} ${toneOf(name)} ${className}`}
    >
      {initialOf(name)}
    </span>
  );
}
