import { formatNumber } from "@/lib/labels";

/**
 * 閲覧数・外部クリック数・役に立った数（利用実績）の表示。
 *
 * 実データの集計基盤が整うまでは表示しません（呼び出し側で
 * siteConfig.showUsageStats が true のときのみレンダリングします）。
 * 架空の数値は表示しません。
 */
export function StatsDisplay({
  views,
  clicks,
  helpfulCount,
}: {
  views: number;
  clicks: number;
  helpfulCount: number;
}) {
  const items = [
    { label: "閲覧数", value: views, icon: EyeIcon },
    { label: "外部クリック数", value: clicks, icon: CursorIcon },
    { label: "役に立った", value: helpfulCount, icon: HeartIcon },
  ];
  return (
    <dl className="grid grid-cols-3 gap-3">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-gray-200 bg-white px-3 py-3 text-center">
          <dt className="flex items-center justify-center gap-1 text-xs text-ink-faint">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </dt>
          <dd className="mt-1 text-lg font-bold text-brand-800">{formatNumber(value)}</dd>
        </div>
      ))}
    </dl>
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
