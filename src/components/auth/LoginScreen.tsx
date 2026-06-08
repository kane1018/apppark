"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginPanel } from "@/components/auth/LoginPanel";

/** ログイン画面（?next= に対応。ログイン済みなら next へ戻す） */
export function LoginScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, next, router]);

  return (
    <div className="container-content py-12">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-black text-brand-900">ログイン</h1>
        <p className="mt-2 text-sm text-ink-soft">
          サービス投稿やコメントには、ログインが必要です。ログイン後、見ていたページに戻ります。
        </p>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <LoginPanel returnTo={next} onSignedIn={() => router.replace(next)} />
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          ログインすることで
          <Link href="/terms" className="text-brand-600 underline-offset-2 hover:underline">利用規約</Link>
          ・
          <Link href="/privacy" className="text-brand-600 underline-offset-2 hover:underline">プライバシーポリシー</Link>
          に同意したものとみなします。
        </p>
      </div>
    </div>
  );
}
