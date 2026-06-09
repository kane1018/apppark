"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Idea } from "@/types";
import { getCategoryName } from "@/data/categories";
import { getPurposeName } from "@/data/purposes";
import {
  ideaStatusLabels,
  ideaStatusStyles,
  wantLevelLabels,
  miniToolPotentialLabels,
  ideaAuthorName,
} from "@/data/ideas";
import { formatDate } from "@/lib/labels";
import { safeUrl, safeImageUrl } from "@/lib/safeUrl";
import { submissionMessage } from "@/lib/moderation";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { useIdeas } from "@/components/ideas/IdeaProvider";

export function IdeaDetail({
  seedIdea,
  ideaId,
  relatedService,
}: {
  seedIdea: Idea | null;
  ideaId: string;
  relatedService: { slug: string; name: string } | null;
}) {
  const { getIdea, likeCountOf, hasLiked, toggleLike, hasInterest, markInterest, reportIdea } = useIdeas();
  const { user } = useAuth();
  const router = useRouter();
  const [reported, setReported] = useState(false);

  const idea = getIdea(ideaId) ?? seedIdea ?? null;

  if (!idea) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center text-sm text-ink-soft">
        このアイデアは見つかりませんでした。
        <div className="mt-3">
          <Link href="/ideas" className="btn-primary">アイデア掲示板へ戻る</Link>
        </div>
      </div>
    );
  }

  function onWant() {
    if (!user) return;
    toggleLike(idea!.id);
  }

  function onBuild() {
    if (!user) return;
    markInterest(idea!.id);
    router.push(`/submit?ideaId=${idea!.id}`);
  }

  const liked = hasLiked(idea.id);
  // ユーザー入力URLは http/https のみ許可（javascript: data: 等を遮断）
  const safeSimilarUrl = safeUrl(idea.similarServiceUrl);
  const safeImage = safeImageUrl(idea.referenceImageUrl);

  return (
    <div className="space-y-8">
      {/* 基本情報 */}
      <section className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${ideaStatusStyles[idea.status]}`}>
            {ideaStatusLabels[idea.status]}
          </span>
          <Link href={`/categories/${idea.category}`} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-ink-soft hover:bg-brand-50 hover:text-brand-700">
            {getCategoryName(idea.category)}
          </Link>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            ほしい度 {wantLevelLabels[idea.wantLevel]}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-black leading-snug text-brand-900 sm:text-3xl">{idea.title}</h1>
        <p className="mt-2 text-xs text-ink-faint">
          投稿者：{ideaAuthorName(idea)}・投稿日：{formatDate(idea.createdAt)}
        </p>

        {idea.purposeTags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {idea.purposeTags.map((p) => (
              <li key={p}>
                <Link href={`/purposes/${p}`} className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-100">
                  {getPurposeName(p)}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* 共感ボタン */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          {user ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onWant}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  liked ? "bg-rose-600 text-white hover:bg-rose-700" : "border border-rose-300 text-rose-600 hover:bg-rose-50"
                }`}
              >
                ♥ これ欲しい
              </button>
              <span className="text-sm font-semibold text-ink-soft">{likeCountOf(idea)} 人が「欲しい」</span>
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-ink-soft">
              ログインすると「これ欲しい」を送信できます。（現在 {likeCountOf(idea)} 人が「欲しい」）
            </p>
          )}
        </div>

        {/* 作ってみたい */}
        <div className="mt-3">
          {user ? (
            <button
              type="button"
              onClick={onBuild}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-600"
            >
              このアイデアで作ってみたい → 掲載申請へ
            </button>
          ) : (
            <p className="text-xs text-ink-faint">ログインすると「このアイデアで作ってみたい」から掲載申請に進めます。</p>
          )}
          {user && hasInterest(idea.id) && (
            <p className="mt-1.5 text-[11px] font-semibold text-accent-600">「作ってみたい」を受け付けました。</p>
          )}
        </div>
      </section>

      {/* このアイデアから作られたサービス */}
      {relatedService && (
        <section className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
          <h2 className="text-sm font-bold text-brand-800">このアイデアから作られたサービス</h2>
          <Link href={`/services/${relatedService.slug}`} className="mt-2 inline-flex items-center gap-1 text-base font-bold text-brand-700 underline-offset-2 hover:underline">
            {relatedService.name} →
          </Link>
        </section>
      )}

      <Block title="困っていること・解決したいこと">
        <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">{idea.problem}</p>
      </Block>

      <Block title="欲しいツールの内容">
        <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">{idea.desiredTool}</p>
      </Block>

      {(idea.useCase || idea.audienceTags.length > 0 || idea.miniToolPotential !== "unknown") && (
        <Block title="詳細">
          <dl className="grid gap-3 sm:grid-cols-2">
            {idea.useCase && <Info label="使いたい場面" value={idea.useCase} />}
            {idea.audienceTags.length > 0 && <Info label="想定利用者" value={idea.audienceTags.join("、")} />}
            <Info label="ミニツールでの実現性" value={miniToolPotentialLabels[idea.miniToolPotential]} />
            {safeSimilarUrl && (
              <div className="rounded-xl bg-gray-50 px-3 py-2">
                <dt className="text-xs font-semibold text-ink-faint">似ているサービス</dt>
                <dd className="mt-0.5 break-all text-sm">
                  <a href={safeSimilarUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-brand-600 underline-offset-2 hover:underline">
                    {safeSimilarUrl} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {safeImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={safeImage} alt="参考画像" className="mt-4 max-h-80 w-auto rounded-xl border border-gray-200" loading="lazy" referrerPolicy="no-referrer" />
          )}
        </Block>
      )}

      {/* コメント */}
      <IdeaComments ideaId={idea.id} />

      {/* 通報（ログイン必須） */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        {reported ? (
          <p className="text-sm text-ink-faint">通報を受け付けました。内容を確認し、必要に応じて非表示・削除を検討します。</p>
        ) : user ? (
          <button
            type="button"
            onClick={() => { reportIdea(idea.id); setReported(true); }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-faint transition hover:text-rose-600"
          >
            ⚑ このアイデアを通報する
          </button>
        ) : (
          <p className="text-sm text-ink-soft">
            <Link href="/login" className="font-semibold text-brand-600 underline-offset-2 hover:underline">ログイン</Link>
            すると、不適切な投稿を通報できます。
          </p>
        )}
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2">
      <dt className="text-xs font-semibold text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-soft">{value}</dd>
    </div>
  );
}

/* ---------------- コメント ---------------- */
function IdeaComments({ ideaId }: { ideaId: string }) {
  const { user } = useAuth();
  const { commentsOf, addComment, reportComment } = useIdeas();
  const [body, setBody] = useState("");
  const [agree, setAgree] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const comments = commentsOf(ideaId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !agree || pending) return;
    setPending(true);
    const status = await addComment(ideaId, body);
    setPending(false);
    setBody("");
    setAgree(false);
    setMessage(status === "published" ? "コメントを投稿しました。" : submissionMessage(status === "pending" ? "medium" : "high"));
  }

  return (
    <section className="space-y-4">
      <h2 className="section-title">コメント</h2>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs leading-relaxed text-ink-soft">
        建設的な意見・追加要望・参考情報を歓迎します。誹謗中傷、人格攻撃、スパム、違法行為の助長、個人情報の投稿は禁止です。コメントは自動判定または運営確認により、非表示・削除される場合があります。
      </div>

      {user ? (
        <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-4">
          {message && <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
          <p className="mb-2 text-xs text-ink-faint">投稿者：<span className="font-semibold text-ink-soft">{user.displayName}</span>（公開表示名）</p>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} required maxLength={1000} className="field-input resize-y" placeholder="追加要望・使いたい場面・参考情報・「作ってみたい」など" />
          <label className="mt-2 flex items-start gap-2 text-xs text-ink-soft">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-500 focus:ring-accent-400" />
            <span><a href="/terms" className="text-brand-600 underline-offset-2 hover:underline">利用規約</a>・コメントルールに同意します。</span>
          </label>
          <button type="submit" disabled={!body.trim() || !agree || pending} className="btn-primary mt-3 disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "判定中…" : "コメントを投稿"}
          </button>
        </form>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-bold text-brand-900">コメントするにはログインが必要です。</h3>
          <p className="mt-1.5 text-sm text-ink-soft">Googleアカウントでログインするとコメントできます。追加要望や参考情報を共有できます。</p>
          <div className="mt-4 sm:max-w-sm"><LoginPanel /></div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-ink-faint">
          まだコメントはありません。
          <br />
          このアイデアへの追加要望や参考情報を投稿できます。
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-brand-900">{c.authorName}</span>
                <span className="text-[11px] text-ink-faint">{formatDate(c.createdAt)}</span>
                {c.moderationStatus === "pending" && <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">確認中</span>}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{c.body}</p>
              {user ? (
                <button type="button" onClick={() => reportComment(c.id)} className="mt-2 text-[11px] font-semibold text-ink-faint hover:text-rose-600">通報</button>
              ) : (
                <span className="mt-2 block text-[11px] text-ink-faint">
                  <Link href="/login" className="font-semibold text-brand-600 underline-offset-2 hover:underline">ログイン</Link>すると通報できます
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
