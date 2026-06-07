import { siteConfig } from "@/config/site";

/**
 * β版（デモ）であることを示す上部の細いバー。
 * siteConfig.isBeta が true の間だけ表示します。正式公開時は false に。
 */
export function BetaBanner() {
  if (!siteConfig.isBeta) return null;
  return (
    <div className="bg-brand-900 text-white">
      <div className="container-content flex items-center justify-center gap-2 py-1.5 text-center text-[11px] sm:text-xs">
        <span className="inline-flex items-center rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide">
          {siteConfig.betaLabel}
        </span>
        <span className="text-white/85">
          これは {siteConfig.name} の{siteConfig.betaLabel}（デモ）です。掲載内容はサンプルデータで、機能は試験運用中です。
        </span>
      </div>
    </div>
  );
}
