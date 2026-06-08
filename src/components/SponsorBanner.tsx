import Link from "next/link";
import { SponsorTag } from "@/components/badges";
import { siteConfig } from "@/config/site";

/**
 * スポンサー枠（セクション6・26）。
 * 通常のおすすめと混同させないため、必ず「スポンサー」「PR」「広告」を明示し、
 * 枠であることがわかる見た目にしています。
 *
 * MVPはデモ（実際の広告主はいません）。配置は次の各所：
 * - トップページの注目サービス付近 / 一覧上部 / カテゴリ上部 / 詳細下部
 */
export function SponsorBanner({
  label = "スポンサー",
  placement = "default",
}: {
  label?: "スポンサー" | "PR" | "広告";
  placement?: "default" | "compact";
}) {
  const compact = placement === "compact";
  return (
    <aside
      aria-label="スポンサー枠（広告）"
      className="overflow-hidden rounded-2xl border border-dashed border-accent-300 bg-accent-50/60"
    >
      <div
        className={`flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between ${
          compact ? "" : "sm:p-5"
        }`}
      >
        <div className="flex items-start gap-3">
          <SponsorTag label={label} />
          <div>
            <p className="text-sm font-bold text-brand-900">
              この枠はスポンサー掲載枠（広告）です
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">
              {siteConfig.name}では、Webサービスを探す人・AIツールに関心のある人にPRできるスポンサー枠を募集しています。
            </p>
          </div>
        </div>
        <Link
          href="/sponsor"
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-center text-xs font-bold text-accent-700 ring-1 ring-inset ring-accent-300 transition hover:bg-accent-100"
        >
          スポンサー掲載について
        </Link>
      </div>
    </aside>
  );
}
