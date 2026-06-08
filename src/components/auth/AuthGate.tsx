"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoginPanel } from "@/components/auth/LoginPanel";

/**
 * ログイン必須の操作をガードする。
 * - ログイン済み：children を表示
 * - 未ログイン：見出し・本文＋ログインUIを表示
 */
export function AuthGate({
  heading,
  body,
  children,
  returnTo,
}: {
  heading: string;
  body: string;
  children: React.ReactNode;
  returnTo?: string;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-center text-sm text-ink-faint">
        読み込み中…
      </div>
    );
  }

  if (user) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card sm:p-6">
      <h3 className="text-base font-bold text-brand-900">{heading}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{body}</p>
      <div className="mt-4 sm:max-w-sm">
        <LoginPanel returnTo={returnTo} />
      </div>
    </div>
  );
}
