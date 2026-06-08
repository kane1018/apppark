import { IconGlyph } from "@/components/icons";
import { recruitmentMeta, recruitmentStatuses } from "@/lib/recruitment";
import type { RecruitmentStatus } from "@/types";

/**
 * 募集・相談ステータスのバッジ表示。
 * - 各バッジは icon＋ラベル、ステータスごとに soft な配色（派手すぎない）
 * - title 属性で説明（ツールチップ）を表示
 * - max を指定すると、それを超える分は「ほか◯件」に省略（カードのごちゃつき防止）
 */
function StatusChip({ status }: { status: RecruitmentStatus }) {
  const m = recruitmentMeta[status];
  return (
    <span
      title={m.description}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${m.badge}`}
    >
      <IconGlyph name={m.icon} size={13} />
      {m.label}
    </span>
  );
}

export function RecruitmentStatusBadges({
  statuses,
  max,
}: {
  statuses: RecruitmentStatus[];
  /** 表示する最大件数。超過分は「ほか◯件」表示 */
  max?: number;
}) {
  if (!statuses || statuses.length === 0) return null;

  // 優先度順に並べ替え（譲渡・購入相談は後方→カードでは「ほか◯件」に回りやすい）
  const ordered = [...statuses].sort(
    (a, b) => recruitmentStatuses.indexOf(a) - recruitmentStatuses.indexOf(b)
  );
  const shown = typeof max === "number" ? ordered.slice(0, max) : ordered;
  const rest = ordered.length - shown.length;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((s) => (
        <li key={s}>
          <StatusChip status={s} />
        </li>
      ))}
      {rest > 0 && (
        <li>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-ink-faint">
            ほか{rest}件
          </span>
        </li>
      )}
    </ul>
  );
}
