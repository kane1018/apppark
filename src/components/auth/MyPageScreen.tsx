"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { services } from "@/data/services";
import { ServiceGrid } from "@/components/ServiceGrid";

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

  const myServices = services.filter((s) => s.authorId === user.id);

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
          <form onSubmit={save} className="mt-4 space-y-4">
            <div>
              <label className="field-label" htmlFor="dn">
                公開表示名（必須・AppPark上に表示されます）
              </label>
              <input id="dn" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="field-input" />
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
          <h2 className="mb-3 text-base font-bold text-brand-800">自分が投稿したサービス</h2>
          {myServices.length > 0 ? (
            <ServiceGrid services={myServices} />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center text-sm text-ink-soft">
              まだ投稿したサービスはありません。
              <div className="mt-3">
                <Link href="/submit" className="btn-primary">サービスを掲載申請する</Link>
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-ink-faint">
            ※ 掲載申請後、運営確認を経て掲載されたサービスがここに表示されます（送信先・保存先の接続後に有効になります）。
          </p>
        </section>
      </div>
    </div>
  );
}
