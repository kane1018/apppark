"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, getCategory, getCategoryName } from "@/data/categories";
import { purposes } from "@/data/purposes";
import {
  audienceTags,
  toolTypeTags,
  pricingTags as pricingTagDefs,
  statusTags as statusTagDefs,
} from "@/data/tags";
import type { TagDef } from "@/types";
import { siteConfig } from "@/config/site";
import { RecruitmentStatusField } from "@/components/recruitment/RecruitmentStatusField";
import { useAuth } from "@/components/auth/AuthProvider";
import { Avatar } from "@/components/Avatar";
import { MiniToolBuilder } from "@/components/minitool/MiniToolBuilder";

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

type ListingTypeChoice = "external" | "internal_mini_tool" | "iframe_embed" | "development";

const LISTING_TYPE_OPTIONS: { value: ListingTypeChoice; label: string; desc: string }[] = [
  { value: "external", label: "外部サービスを掲載する", desc: "すでに公開しているWebサービス・AIツールのURLを掲載" },
  { value: "internal_mini_tool", label: "ノーコードでミニツールを作成する", desc: "コード不要。フォーム入力だけで、AppPark上で使えるツールを作成" },
  { value: "iframe_embed", label: "iframe埋め込みを希望する", desc: "外部URLをAppPark内に埋め込みたい（運営承認制）" },
  { value: "development", label: "開発中サービスとして紹介する", desc: "まだ正式公開していないサービスを紹介" },
];

export function SubmitForm({ ideaId = null }: { ideaId?: string | null }) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [listingType, setListingType] = useState<ListingTypeChoice>("external");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 本番ではここで送信先へ POST する（FormData を利用）。
    // 投稿者の紐付け：authorId = user.id, publicAuthorName = user.displayName を一緒に送信する。
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
      {/* アイデア掲示板から作成する場合 */}
      {ideaId && (
        <div className="rounded-2xl border border-accent-200 bg-accent-50/40 p-4 text-sm leading-relaxed text-brand-900">
          <input type="hidden" name="relatedIdeaId" value={ideaId} />
          <span className="font-bold">アイデア掲示板の投稿をもとに作成中です。</span>
          <Link href={`/ideas/${ideaId}`} className="ml-2 text-xs font-semibold text-brand-600 underline-offset-2 hover:underline">
            元のアイデアを見る
          </Link>
          <p className="mt-1 text-xs text-ink-faint">
            掲載されると、このアイデアと相互にリンクされます（relatedIdeaId として申請に含まれます）。
          </p>
        </div>
      )}

      <Fieldset legend="申請者情報（ログイン中）">
        {/* 公開表示名・メールはログイン情報から。サービスにはこの公開表示名が紐づきます */}
        <input type="hidden" name="authorId" value={user?.id ?? ""} />
        <input type="hidden" name="publicAuthorName" value={user?.displayName ?? ""} />
        <div className="rounded-xl bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar name={user?.nickname || user?.displayName || "ユーザー"} avatarUrl={user?.avatarUrl ?? null} size="md" />
            <div className="min-w-0 text-sm">
              <p>
                投稿者として表示される名前：
                <span className="font-bold text-ink">{user?.nickname || user?.displayName}</span>
                <Link href="/mypage" className="ml-2 text-xs font-semibold text-brand-600 underline-offset-2 hover:underline">
                  変更
                </Link>
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">
                連絡用メールアドレス：<span className="font-semibold">{user?.email}</span>
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            メールアドレスは運営確認用であり、公開されません。掲載時は、投稿者名（公開ニックネーム）とアイコンのみが表示されます。
          </p>
        </div>
        <Field
          label="連絡先氏名（運営確認用・非公開・任意）"
          name="contactName"
          placeholder="公開されません"
        />
      </Fieldset>

      {/* 掲載タイプ */}
      <Fieldset legend="掲載タイプ">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {LISTING_TYPE_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition ${
                listingType === o.value
                  ? "border-accent-300 bg-accent-50/50 ring-1 ring-accent-200"
                  : "border-gray-200 bg-white hover:border-brand-300"
              }`}
            >
              <input
                type="radio"
                name="listingType"
                value={o.value}
                checked={listingType === o.value}
                onChange={() => setListingType(o.value)}
                className="mt-0.5 h-4 w-4 border-gray-300 text-accent-500 focus:ring-accent-400"
              />
              <span>
                <span className="block text-sm font-bold text-brand-900">{o.label}</span>
                <span className="mt-0.5 block text-xs text-ink-faint">{o.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </Fieldset>

      {/* ===== 1. 外部サービスを掲載する ===== */}
      {listingType === "external" && (
      <>
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

      <Fieldset legend="分類（カテゴリ・タグ）">
        <ClassificationFields />
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
      </>
      )}

      {/* ===== 2. AppPark内ミニツールを作成する ===== */}
      {listingType === "internal_mini_tool" && (
      <>
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900/90">
        AppPark内ミニツールは、安全性確保のため、テンプレート形式で作成する仕組みです。投稿者が自由にHTMLやJavaScriptを実行できる形式ではありません。個人情報、パスワード、決済情報、機密情報を入力させるツールは掲載できません。掲載内容は運営確認後に公開されます。
      </div>

      <Fieldset legend="ミニツール基本情報">
        <Field label="ツール名" name="serviceName" required />
        <Field label="一言説明" name="shortDescription" required placeholder="何ができるツールかを一言で" />
        <TextareaField label="詳細説明" name="description" required rows={4} />
      </Fieldset>

      <Fieldset legend="分類（カテゴリ・タグ）">
        <ClassificationFields />
        <Field label="サムネイル画像URL（任意）" name="thumbnailUrl" type="url" pattern={IMAGE_URL_PATTERN} title={IMAGE_URL_TITLE} />
      </Fieldset>

      <Fieldset legend="ミニツールを作成する">
        <MiniToolBuilder />
      </Fieldset>

      <Fieldset legend="表示の補足（任意）">
        <TextareaField label="注意文（任意）" name="toolNote" rows={2} placeholder="利用時の注意があれば" />
        <Field label="CTAボタン文言（任意）" name="ctaLabel" placeholder="例：詳しくはこちら" />
        <Field label="CTAリンク（任意）" name="ctaUrl" type="url" placeholder="https://..." />
      </Fieldset>
      </>
      )}

      {/* ===== 3. iframe埋め込みを希望する ===== */}
      {listingType === "iframe_embed" && (
      <>
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs leading-relaxed text-amber-900/90">
        iframe埋め込みは、運営の確認・承認後にのみ表示されます（自動では表示しません）。表示する場合も sandbox 属性を付与し、安全性を確保します。
      </div>
      <Fieldset legend="iframe埋め込み申請">
        <Field label="ツール名・サービス名" name="serviceName" required />
        <Field label="埋め込み希望URL" name="iframeUrl" type="url" required placeholder="https://..." />
        <Field label="通常のサービスURL" name="url" type="url" required placeholder="https://..." />
        <TextareaField label="埋め込み希望理由" name="iframeReason" required rows={3} />
        <TextareaField label="サービス説明" name="description" required rows={3} />
        <ClassificationFields minimal />
        <CheckOption name="agreeIframeNote" value="yes" required label="埋め込み表示は運営承認制であり、承認まで表示されないことに同意します。" />
      </Fieldset>
      </>
      )}

      {/* ===== 4. 開発中サービスとして紹介する ===== */}
      {listingType === "development" && (
      <>
      <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 text-xs leading-relaxed text-violet-900/90">
        アイデアのみで実態が確認できないものは掲載できません。開発状況やスクリーンショット等で、実態が分かるようにしてください。
      </div>
      <Fieldset legend="開発中サービス情報">
        <Field label="サービス名" name="serviceName" required />
        <Field label="一言説明" name="shortDescription" required />
        <TextareaField label="詳細説明" name="description" required rows={4} />
        <Field label="開発状況" name="devStatus" required placeholder="例：β版テスト中／コア機能実装済み" />
        <Field label="公開予定時期（任意）" name="plannedRelease" placeholder="例：2026年内" />
        <ClassificationFields />
        <Field label="スクリーンショット画像URL（任意）" name="thumbnailUrl" type="url" pattern={IMAGE_URL_PATTERN} title={IMAGE_URL_TITLE} />
      </Fieldset>
      </>
      )}

      {/* 募集・相談ステータス（iframe以外） */}
      {listingType !== "iframe_embed" && (
        <Fieldset legend="募集・相談ステータス（任意）">
          <RecruitmentStatusField />
        </Fieldset>
      )}

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

function TagSelect({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: TagDef[];
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} className="field-input">
        <option value="">選択しない</option>
        {options.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * 分類フィールド（大カテゴリ → 詳細カテゴリのカスケード ＋ 各種タグ）。
 * 投稿者が迷わないよう、大カテゴリを選んだ後に詳細カテゴリが絞り込まれます。
 * minimal=true のときはカテゴリ＋詳細カテゴリのみ表示します（iframe申請など）。
 */
function ClassificationFields({ minimal = false }: { minimal?: boolean }) {
  const [cat, setCat] = useState("");
  const subs = cat ? getCategory(cat)?.subCategories ?? [] : [];

  return (
    <>
      <div>
        <label className="field-label" htmlFor="cf-category">
          大カテゴリ<span className="ml-1 text-rose-500">*</span>
        </label>
        <select
          id="cf-category"
          name="category"
          required
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="field-input"
        >
          <option value="">選択してください</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="cf-sub">
          詳細カテゴリ（任意）
        </label>
        <select
          id="cf-sub"
          name="subCategory"
          disabled={subs.length === 0}
          className="field-input disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-ink-faint"
        >
          <option value="">
            {cat ? "選択してください" : "まず大カテゴリを選択してください"}
          </option>
          {subs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {cat && subs.length > 0 && (
          <p className="mt-1 text-xs text-ink-faint">
            「{getCategoryName(cat)}」の詳細カテゴリから選べます。
          </p>
        )}
      </div>

      {!minimal && (
        <>
          <div>
            <span className="field-label">目的タグ（複数選択可）</span>
            <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-gray-200 p-3 sm:grid-cols-2">
              {purposes.map((p) => (
                <CheckOption key={p.slug} name="purposes" value={p.slug} label={p.name} />
              ))}
            </div>
          </div>

          <div>
            <span className="field-label">利用者別タグ（複数選択可）</span>
            <div className="grid max-h-44 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-gray-200 p-3 sm:grid-cols-2">
              {audienceTags.map((t) => (
                <CheckOption key={t.slug} name="audienceTags" value={t.slug} label={t.name} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <TagSelect label="ツール形式タグ" name="toolTypeTag" options={toolTypeTags} />
            <TagSelect label="料金タグ" name="pricingTag" options={pricingTagDefs} />
            <TagSelect label="運営状態タグ" name="statusTag" options={statusTagDefs} />
          </div>
        </>
      )}
    </>
  );
}
