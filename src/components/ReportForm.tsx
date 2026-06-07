"use client";

import { useState } from "react";

/**
 * 通報・削除依頼フォーム（セクション17）。
 * MVPでは送信先は仮です（実際には送信しません）。
 * 後から Formspree / API / Supabase 等に接続できる構造です。
 */
const reasons = [
  "違法の可能性",
  "詐欺的",
  "権利侵害",
  "個人情報の問題",
  "危険なサービス",
  "リンク切れ",
  "内容が実態と異なる",
  "その他",
];

export function ReportForm({
  defaultServiceName = "",
  defaultUrl = "",
}: {
  defaultServiceName?: string;
  defaultUrl?: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 本番ではここで送信先へ POST する
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-relaxed text-emerald-900/90">
        <h2 className="text-lg font-bold text-emerald-800">通報を受け付けました</h2>
        <p className="mt-2">
          通報を受け付けました。内容を確認し、必要に応じて掲載内容の修正・非公開・削除を検討します。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="field-label" htmlFor="rep-name">
          対象サービス名 <span className="text-rose-500">*</span>
        </label>
        <input
          id="rep-name"
          name="serviceName"
          required
          defaultValue={defaultServiceName}
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="rep-url">
          対象URL <span className="text-rose-500">*</span>
        </label>
        <input
          id="rep-url"
          name="url"
          type="url"
          required
          defaultValue={defaultUrl}
          placeholder="https://..."
          className="field-input"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="rep-reason">
          通報理由 <span className="text-rose-500">*</span>
        </label>
        <select id="rep-reason" name="reason" required className="field-input">
          <option value="">選択してください</option>
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="rep-detail">
          詳細 <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="rep-detail"
          name="detail"
          required
          rows={5}
          className="field-input resize-y"
          placeholder="どの点が問題か、できるだけ具体的にご記入ください。"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="rep-email">
          連絡先メールアドレス <span className="text-rose-500">*</span>
        </label>
        <input
          id="rep-email"
          name="email"
          type="email"
          required
          className="field-input"
        />
      </div>

      <div>
        <span className="field-label">権利者本人かどうか</span>
        <div className="flex flex-wrap gap-3">
          {["権利者本人です", "権利者本人ではありません"].map((label, i) => (
            <label key={label} className="flex items-center gap-1.5 text-sm text-ink-soft">
              <input
                type="radio"
                name="isRightsHolder"
                value={i === 0 ? "yes" : "no"}
                required
                className="h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-secondary w-full sm:w-auto">
        この内容で通報・削除依頼する
      </button>
    </form>
  );
}
