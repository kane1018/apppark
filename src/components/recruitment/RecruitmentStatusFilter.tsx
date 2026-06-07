"use client";

import { IconGlyph } from "@/components/icons";
import { recruitmentMeta, recruitmentStatuses } from "@/lib/recruitment";
import type { RecruitmentStatus } from "@/types";

/**
 * 募集・相談ステータスでの絞り込み（複数選択トグル）。
 * いずれかを選ぶと、そのステータスを持つサービスのみ表示します（OR 条件）。
 */
export function RecruitmentStatusFilter({
  value,
  onChange,
}: {
  value: RecruitmentStatus[];
  onChange: (next: RecruitmentStatus[]) => void;
}) {
  function toggle(s: RecruitmentStatus) {
    onChange(value.includes(s) ? value.filter((x) => x !== s) : [...value, s]);
  }

  return (
    <div>
      <span className="field-label">募集・相談ステータス</span>
      <div className="flex flex-wrap gap-2">
        {recruitmentStatuses.map((s) => {
          const m = recruitmentMeta[s];
          const active = value.includes(s);
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(s)}
              title={m.description}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition ${
                active
                  ? `${m.badge} ring-2`
                  : "bg-white text-ink-soft ring-gray-200 hover:bg-gray-50"
              }`}
            >
              <IconGlyph name={m.icon} size={13} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
