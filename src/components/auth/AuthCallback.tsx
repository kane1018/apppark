"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Supabase の OAuth / マジックリンクのリダイレクト先。
 * セッション確立後、next（元のページ）へ戻します。
 */
export function AuthCallback() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  useEffect(() => {
    if (loading) return;
    router.replace(user ? next : "/login");
  }, [user, loading, next, router]);

  return (
    <div className="container-content py-16 text-center text-sm text-ink-faint">
      ログイン処理中です。少々お待ちください…
    </div>
  );
}
