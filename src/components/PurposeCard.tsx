import Link from "next/link";
import type { Purpose } from "@/types";
import { IconBadge } from "@/components/icons";

/**
 * 目的別カード（トップ・目的一覧で使用）。
 */
export function PurposeCard({
  purpose,
  count,
}: {
  purpose: Purpose;
  count?: number;
}) {
  return (
    <Link
      href={`/purposes/${purpose.slug}`}
      className="group flex flex-col items-start gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-card-hover"
    >
      <IconBadge name={purpose.icon} tone="orange" size="md" />
      <span className="text-sm font-bold leading-snug text-brand-900 group-hover:text-brand-600">
        {purpose.name}
      </span>
      {typeof count === "number" && (
        <span className="text-[11px] font-semibold text-ink-faint">
          {count}件
        </span>
      )}
    </Link>
  );
}
