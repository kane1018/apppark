/**
 * 各種バッジ（料金形態・運営状況・スポンサー表示）。
 * 募集・相談ステータスのバッジは components/recruitment/RecruitmentStatusBadges を参照。
 */
import type { Pricing, ServiceStatus } from "@/types";
import { pricingLabels, statusLabels } from "@/lib/labels";

const pricingStyles: Record<Pricing, string> = {
  free: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paid: "bg-amber-50 text-amber-700 ring-amber-600/20",
  freemium: "bg-sky-50 text-sky-700 ring-sky-600/20",
  unknown: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export function PricingBadge({ pricing }: { pricing: Pricing }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${pricingStyles[pricing]}`}
    >
      {pricingLabels[pricing]}
    </span>
  );
}

const statusStyles: Record<ServiceStatus, string> = {
  active: "bg-brand-50 text-brand-700 ring-brand-600/20",
  beta: "bg-violet-50 text-violet-700 ring-violet-600/20",
  development: "bg-orange-50 text-orange-700 ring-orange-600/20",
  paused: "bg-gray-100 text-gray-500 ring-gray-500/20",
};

export function StatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {statusLabels[status]}
    </span>
  );
}

/**
 * スポンサー表示（セクション6・26）。
 * 必ず「スポンサー」「PR」「広告」のいずれかを明示する。
 */
export function SponsorTag({ label = "PR" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-accent-100 px-2 py-0.5 text-xs font-bold text-accent-700 ring-1 ring-inset ring-accent-600/30">
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 5.5a.75.75 0 00-1.5 0v.25H9a.75.75 0 000 1.5h.25v3.5a.75.75 0 001.5 0v-.25H11a.75.75 0 000-1.5h-.25v-3.25z" />
      </svg>
      {label}
    </span>
  );
}
