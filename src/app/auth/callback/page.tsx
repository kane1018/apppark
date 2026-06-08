import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCallback } from "@/components/auth/AuthCallback";

export const metadata: Metadata = {
  title: "ログイン処理",
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container-content py-16 text-center text-sm text-ink-faint">ログイン処理中…</div>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
