"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { purposes } from "@/data/purposes";
import { pricingLabels, statusLabels } from "@/lib/labels";
import { siteConfig } from "@/config/site";
import type { Pricing, ServiceStatus } from "@/types";
import { RecruitmentStatusField } from "@/components/recruitment/RecruitmentStatusField";

/**
 * 投稿申請フォーム（セクション14）。
 *
 * MVPでは送信先は仮です（実際には送信しません）。
 * 後から Formspree / Google フォーム / Notion / スプレッドシート / Supabase 等へ
 * 接続できるよう、handleSubmit の中身を差し替えるだけでよい構造にしています。
 */
/** 画像URLの簡易バリデーション（http(s) で始まり画像拡張子で終わる。空欄は許可） */
const IMAGE_URL_PATTERN =
  "https?://\\S+\\.(?:jpe?g|png|webp|gif|JPE?G|PNG|WEBP|GIF)(?:\\?\\S*)?";
const IMAGE_URL_TITLE =
  "http(s):// で始まり、.jpg / .jpeg / .png / .webp / .gif で終わる画像URLを入力してください。";

export function SubmitForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 本番ではここで送信先へ POST する（FormData を利用）
    // const data = new FormData(e.currentTarget);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-emerald-800">
          掲載申請を受け付けました
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-900/90">
          掲載申請を受け付けました。内容を確認のうえ、掲載可否を判断します。申請いただいたすべてのサービスが掲載されるわけではありません。
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-outline mt-4"
        >
          続けて別のサービスを申請する
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Fieldset legend="申請者情報">
        <Field label="投稿者名" name="authorName" required placeholder="お名前またはニックネーム" />
        <Field label="メールアドレス" name="email" type="email" required placeholder="連絡用（公開されません）" />
      </Fieldset>

      <Fieldset legend="サービス基本情報">
        <Field label="サービス名" name="serviceName" required />
        <Field label="サービスURL" name="url" type="url" required placeholder="https://..." />
        <Field label="サービスの一言説明" name="shortDescription" required placeholder="何ができるかを一言で" />
        <TextareaField label="詳細説明" name="description" required rows={4} />
      </Fieldset>

      <Fieldset legend="画像（任意）">
        {/* 著作権等の注意文（セクション：画像の注意文） */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900/90">
          画像は、ご自身が権利を持つもの、または掲載許可を得ているものを使用してください。第三者の著作権・商標権・肖像権を侵害する画像は掲載できません。
        </div>

        <Field
          label="メイン画像URL"
          name="thumbnailUrl"
          type="url"
          pattern={IMAGE_URL_PATTERN}
          title={IMAGE_URL_TITLE}
          placeholder="一覧カード・詳細ページ上部に表示（未指定でも掲載可）"
        />

        <div className="space-y-3">
          <span className="field-label">サブ画像URL（スクリーンショット等・最大3枚）</span>
          {[1, 2, 3].map((n) => (
            <input
              key={n}
              name="galleryImageUrls"
              type="url"
              pattern={IMAGE_URL_PATTERN}
              title={IMAGE_URL_TITLE}
              placeholder={`サブ画像URL ${n}（任意）`}
              className="field-input"
            />
          ))}
        </div>

        <p className="text-xs leading-relaxed text-ink-faint">
          ※ 対応形式の目安：jpg / jpeg / png / webp / gif。画像が読み込めない場合は、カテゴリアイコンのプレースホルダを表示します。画像アップロード（保存）には今後対応予定です。
        </p>
      </Fieldset>

      <Fieldset legend="分類">
        <div>
          <label className="field-label" htmlFor="category">
            カテゴリ
          </label>
          <select id="category" name="category" required className="field-input">
            <option value="">選択してください</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="field-label">目的タグ（複数選択可）</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {purposes.map((p) => (
              <CheckOption key={p.slug} name="purposes" value={p.slug} label={p.name} />
            ))}
          </div>
        </div>

        <RadioGroup
          legend="料金形態"
          name="pricing"
          options={(Object.keys(pricingLabels) as Pricing[]).map((p) => ({
            value: p,
            label: pricingLabels[p],
          }))}
        />

        <RadioGroup
          legend="運営状況"
          name="status"
          options={(Object.keys(statusLabels) as ServiceStatus[]).map((s) => ({
            value: s,
            label: statusLabels[s],
          }))}
        />
      </Fieldset>

      <Fieldset legend="サービス内容（閲覧者向け）">
        <TextareaField label="何ができるサービスか" name="whatItDoes" required rows={3} />
        <TextareaField
          label="こんな人におすすめ（改行区切り）"
          name="recommendedFor"
          rows={3}
          placeholder={"例：\n無料でAIを試したい人\n文章作成を効率化したい人"}
        />
        <TextareaField
          label="使い方（改行区切り・3〜5ステップ）"
          name="howToUse"
          rows={3}
        />
        <TextareaField label="使用目的の例（改行区切り）" name="useCases" rows={3} />
        <TextareaField label="注意点（改行区切り）" name="cautions" rows={2} />
      </Fieldset>

      <Fieldset legend="作者・開発情報">
        <Field label="使用技術（カンマ区切り）" name="techStack" placeholder="例：Next.js, TypeScript" />
        <Field label="使用したAIツール（カンマ区切り・任意）" name="aiToolsUsed" />
        <TextareaField label="作った理由" name="reasonCreated" rows={2} />
        <Field label="作者SNS（URL・任意）" name="authorSns" type="url" />
      </Fieldset>

      <Fieldset legend="募集・相談ステータス（任意）">
        <RecruitmentStatusField />
      </Fieldset>

      <Fieldset legend="同意事項">
        <CheckOption
          name="agreeGuidelines"
          value="yes"
          required
          label={
            <>
              <a href="/guidelines" className="text-brand-600 underline-offset-2 hover:underline">
                掲載基準
              </a>
              を確認し、同意します。
            </>
          }
        />
        <CheckOption
          name="agreeTerms"
          value="yes"
          required
          label={
            <>
              <a href="/terms" className="text-brand-600 underline-offset-2 hover:underline">
                利用規約
              </a>
              に同意します。
            </>
          }
        />
      </Fieldset>

      <div className="rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-ink-faint">
        申請いただいた内容は運営が確認します。掲載は審査制のため、すべてのサービスが掲載されるわけではありません。{siteConfig.name}は掲載サービスの安全性・合法性・品質・収益性を保証しません。
      </div>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        この内容で掲載申請する
      </button>
    </form>
  );
}

/* --- 小さなフォーム部品 --- */

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="card p-5">
      <legend className="px-1 text-sm font-bold text-brand-800">{legend}</legend>
      <div className="mt-3 space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  pattern,
  title,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  /** 入力値の検証パターン（不正な場合はブラウザがエラーメッセージを表示） */
  pattern?: string;
  /** パターン不一致時に表示する説明 */
  title?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        title={title}
        className="field-input"
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  rows = 3,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="field-input resize-y"
      />
    </div>
  );
}

function CheckOption({
  name,
  value,
  label,
  required,
}: {
  name: string;
  value: string;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        name={name}
        value={value}
        required={required}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400"
      />
      <span>{label}</span>
    </label>
  );
}

function RadioGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <span className="field-label">{legend}</span>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-1.5 text-sm text-ink-soft">
            <input
              type="radio"
              name={name}
              value={o.value}
              required
              className="h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
            />
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}
