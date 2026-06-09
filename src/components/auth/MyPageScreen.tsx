"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { services } from "@/data/services";
import { siteConfig } from "@/config/site";
import { Avatar } from "@/components/Avatar";
import { OwnerServiceList } from "@/components/auth/OwnerServiceList";
import { IdeaProvider } from "@/components/ideas/IdeaProvider";
import { MyIdeasSection } from "@/components/ideas/MyIdeasSection";

/** マイページ（公開表示名の編集・自分の投稿・ログアウト） */
export function MyPageScreen() {
  const { user, loading, updateProfile, signOut } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [contactName, setContactName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?next=/mypage");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setContactName(user.contactName ?? "");
    }
  }, [user]);

  if (loading || !user) {
    return <div className="container-content py-16 text-center text-sm text-ink-faint">読み込み中…</div>;
  }

  // 自分の投稿：ユーザーIDが一致するもの＋サイトオーナー本人（メール/IDが一致）の初期掲載
  const isOwner =
    user.id === siteConfig.owner.authorId ||
    user.email.trim().toLowerCase() === siteConfig.owner.email.trim().toLowerCase();
  const myServices = services.filter(
    (s) =>
      s.authorId === user.id ||
      (isOwner && s.authorId === siteConfig.owner.authorId)
  );
  const nickname = user.nickname || user.displayName;
  const isAdmin = user.role === "admin";
  const ideaBornServices = myServices.filter((s) => s.relatedIdeaId !== null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await updateProfile({ displayName: displayName.trim() || "ユーザー", contactName: contactName.trim() || null });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="container-content py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-brand-900 sm:text-3xl">マイページ</h1>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-ink-soft hover:border-brand-400"
          >
            ログアウト
          </button>
        </header>

        {/* プロフィール編集 */}
        <section className="card p-5 sm:p-6">
          <h2 className="text-base font-bold text-brand-800">プロフィール</h2>

          {/* アイコン＋ニックネーム（公開される情報） */}
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={nickname} avatarUrl={user.avatarUrl} size="lg" />
            <div className="min-w-0">
              <p className="text-lg font-black text-brand-900">{nickname}</p>
              <p className="text-xs text-ink-faint">公開ニックネーム（公開ページに表示されます）</p>
              <Link
                href={`/users/${encodeURIComponent(nickname)}`}
                className="mt-1 inline-block text-xs font-semibold text-brand-600 underline-offset-2 hover:underline"
              >
                公開プロフィールを見る →
              </Link>
            </div>
          </div>

          <form onSubmit={save} className="mt-5 space-y-4">
            <div>
              <label className="field-label" htmlFor="dn">
                公開表示名（必須・AppPark上に表示されます）
              </label>
              <input id="dn" required maxLength={50} value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label" htmlFor="cn">
                連絡先氏名（運営確認用・非公開・任意）
              </label>
              <input id="cn" value={contactName} onChange={(e) => setContactName(e.target.value)} className="field-input" placeholder="公開されません" />
            </div>
            <div>
              <span className="field-label">メールアドレス（非公開）</span>
              <p className="rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-ink-soft">{user.email || "（未設定）"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn-primary">保存する</button>
              {saved && <span className="text-sm font-semibold text-emerald-600">保存しました</span>}
            </div>
          </form>
          <p className="mt-3 text-xs text-ink-faint">
            公開ページ（サービス詳細・コメント・作者情報）には、<strong className="font-semibold text-ink-soft">公開表示名のみ</strong>表示されます。メールアドレス・連絡先氏名は公開されません。
          </p>
        </section>

        {/* 自分の投稿サービス */}
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold text-brand-800">自分が投稿したサービス</h2>
            {myServices.length > 0 && (
              <span className="text-xs font-semibold text-ink-faint">{myServices.length}件</span>
            )}
          </div>
          {myServices.length > 0 ? (
            <OwnerServiceList services={myServices} isAdmin={isAdmin} />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-ink-soft">
              まだ投稿したサービスはありません。
              <div className="mt-3">
                <Link href="/submit" className="btn-primary">サービスを掲載申請する</Link>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-ink-faint">
            ※ 各サービスは投稿者本人として、編集申請・非公開申請・削除申請ができます。申請は運営が確認のうえ反映します（送信先の接続後に有効になります）。{isAdmin && "管理者は非公開・削除を直接行えます。"}
          </p>
        </section>

        {/* アイデアから作成中のサービス */}
        {ideaBornServices.length > 0 && (
          <section>
            <h2 className="mb-3 text-base font-bold text-brand-800">アイデアから作成したサービス</h2>
            <OwnerServiceList services={ideaBornServices} isAdmin={isAdmin} />
          </section>
        )}

        {/* アイデア掲示板の連携 */}
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-base font-bold text-brand-800">アイデア掲示板</h2>
            <Link href="/ideas" className="text-xs font-semibold text-brand-600 underline-offset-2 hover:underline">
              アイデア掲示板へ →
            </Link>
          </div>
          <IdeaProvider>
            <MyIdeasSection />
          </IdeaProvider>
        </section>
      </div>
    </div>
  );
}
