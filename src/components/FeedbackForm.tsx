"use client";

import { useState } from "react";

/**
 * 改善要望・バグ報告・通報フォーム（セクション13-9）。
 * MVPでは送信先は仮（実際には送信しません）。
 * 後から Formspree / Google フォーム / Supabase 等に接続できるよう、
 * handleSubmit の中身を差し替えるだけでよい構造にしています。
 */
const reportTypes = [
  "使用感想",
  "改善要望",
  "バグ報告",
  "リンク切れ",
  "権利侵害の可能性",
  "危険・不適切なサービス",
  "その他",
];

export function FeedbackForm({ serviceName }: { serviceName: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 本番ではここで送信先（Formspree / API / Supabase 等）へ POST する
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
        ご報告ありがとうございます。内容を確認し、必要に応じて掲載内容の修正・非公開・削除を検討します。
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="service" value={serviceName} />
      <div>
        <label htmlFor="fb-type" className="field-label">
          報告の種類
        </label>
        <select id="fb-type" name="type" required className="field-input">
          {reportTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fb-body" className="field-label">
          内容
        </label>
        <textarea
          id="fb-body"
          name="body"
          required
          rows={4}
          className="field-input resize-y"
          placeholder="気づいた点・改善要望・不具合などをご記入ください。"
        />
      </div>
      <div>
        <label htmlFor="fb-email" className="field-label">
          連絡先メールアドレス（任意）
        </label>
        <input
          id="fb-email"
          name="email"
          type="email"
          className="field-input"
          placeholder="返信が必要な場合のみ"
        />
      </div>
      <button type="submit" className="btn-secondary">
        この内容で報告する
      </button>
    </form>
  );
}
