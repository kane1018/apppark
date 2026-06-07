import { recruitmentMeta, recruitmentStatuses } from "@/lib/recruitment";
import { RecruitmentNotice } from "@/components/recruitment/RecruitmentNotice";

/**
 * 投稿フォームの「募集・相談ステータス」入力欄（複数選択＝チェックボックス）＋補足欄。
 * 未選択でも送信可（required にしない）。
 *
 * 入力名：
 * - recruitmentStatus（チェックボックス・複数）
 * - recruitmentNote（補足・任意）
 */
export function RecruitmentStatusField() {
  return (
    <div className="space-y-4">
      <div>
        <span className="field-label">募集・相談ステータス（複数選択可・任意）</span>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {recruitmentStatuses.map((s) => {
            const m = recruitmentMeta[s];
            return (
              <label
                key={s}
                className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm text-ink-soft transition hover:border-brand-300"
              >
                <input
                  type="checkbox"
                  name="recruitmentStatus"
                  value={s}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
                />
                <span>
                  <span className="font-semibold text-ink">{m.label}</span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {m.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="recruitmentNote">
          募集・相談についての補足（任意）
        </label>
        <textarea
          id="recruitmentNote"
          name="recruitmentNote"
          rows={3}
          className="field-input resize-y"
          placeholder="例：まずはユーザーの感想がほしいです。共同開発者も条件次第で相談できます。譲渡については条件次第で相談可能です。"
        />
      </div>

      {/* 譲渡・購入に関する注意（投稿フォーム側） */}
      <RecruitmentNotice variant="form" />
    </div>
  );
}
