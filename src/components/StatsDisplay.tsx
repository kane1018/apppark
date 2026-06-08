import { formatNumber } from "@/lib/labels";
import { siteConfig } from "@/config/site";

/**
 * 閲覧数・外部クリック数・役に立った数の表示（セクション12・13）。
 *
 * β版（siteConfig.useDemoStats = true）では、実績に見えすぎないよう
 * 「集計準備中（デモ数値）」として控えめに表示します。
 * 実データ集計を始めたら siteConfig.useDemoStats を false にしてください。
 */
export function StatsDisplay({
  views,
  clicks,
  helpfulCount,
  variant = "inline",
  demo = siteConfig.useDemoStats,
}: {
  views: number;
  clicks: number;
  helpfulCount: number;
  variant?: "inline" | "cards";
  demo?: boolean;
}) {
  const items = [
    { label: "閲覧数", value: views, icon: EyeIcon },
    { label: "外部クリック数", value: clicks, icon: CursorIcon },
    { label: "役に立った", value: helpfulCount, icon: HeartIcon },
  ];

  // 一覧カード用（inline）：β版は数値を出さず「集計準備中」を控えめに表示
  if (variant === "inline") {
    if (demo) {
      return (
        <p className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-ink-faint">
          <ClockIcon className="h-3.5 w-3.5" />
          集計準備中（デモ数値）
        </p>
      );
    }
    return (
      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-faint">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-1">
            <Icon className="h-3.5 w-3.5" />
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="font-semibold text-ink-soft">{formatNumber(value)}</span>
              <span className="ml-0.5">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  // 詳細ページ用（cards）：数値は出すが、β版は弱め＋「デモ数値」注記
  return (
    <div>
      <dl className="grid grid-cols-3 gap-3">
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center"
          >
            <dt className="flex items-center justify-center gap-1 text-xs text-ink-faint">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </dt>
            <dd
              className={`mt-1 text-lg font-bold ${
                demo ? "text-ink-faint" : "text-brand-800"
              }`}
            >
              {formatNumber(value)}
            </dd>
          </div>
        ))}
      </dl>
      {demo && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-ink-faint">
          <ClockIcon className="h-3 w-3" />
          ※ デモ数値です（実データは集計準備中。正式公開後に実数へ切り替わります）
        </p>
      )}
    </div>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4a.75.75 0 00-1.5 0v4c0 .27.14.52.38.65l2.5 1.5a.75.75 0 10.74-1.3l-2.12-1.27V6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EyeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 4c-4.2 0-7.4 3.3-8.5 5.4a1.3 1.3 0 000 1.2C2.6 12.7 5.8 16 10 16s7.4-3.3 8.5-5.4a1.3 1.3 0 000-1.2C17.4 7.3 14.2 4 10 4zm0 9a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}

function CursorIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M5 2.5l11 5.2-4.7 1.4 2.7 5.1-2.2 1.1-2.7-5.1L5 14V2.5z" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path d="M10 17s-6.5-4.1-8.4-7.6C.3 6.9 1.6 4 4.4 4c1.7 0 2.9 1 3.6 2 .7-1 1.9-2 3.6-2 2.8 0 4.1 2.9 2.8 5.4C16.5 12.9 10 17 10 17z" />
    </svg>
  );
}
