import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "ログイン",
  description: `${siteConfig.name}へのログイン。`,
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-content py-12 text-center text-sm text-ink-faint">読み込み中…</div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
