"use client";

import { useState } from "react";

/**
 * お問い合わせフォーム。MVPでは送信先は仮です（実際には送信しません）。
 * 後から Formspree / API / Supabase 等に接続できる構造です。
 */
const topics = [
  "サービスについて",
  "掲載申請について",
  "スポンサー掲載について",
  "通報・削除について",
  "その他",
];

export function ContactForm() {
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
        <h2 className="text-lg font-bold text-emerald-800">送信しました</h2>
        <p className="mt-2">
          お問い合わせありがとうございます。内容を確認のうえ、必要に応じてご返信します。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="field-label" htmlFor="c-name">
          お名前 <span className="text-rose-500">*</span>
        </label>
        <input id="c-name" name="name" required className="field-input" />
      </div>
      <div>
        <label className="field-label" htmlFor="c-email">
          メールアドレス <span className="text-rose-500">*</span>
        </label>
        <input id="c-email" name="email" type="email" required className="field-input" />
      </div>
      <div>
        <label className="field-label" htmlFor="c-topic">
          お問い合わせ種別
        </label>
        <select id="c-topic" name="topic" className="field-input">
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="c-message">
          内容 <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          className="field-input resize-y"
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">
        送信する
      </button>
    </form>
  );
}
