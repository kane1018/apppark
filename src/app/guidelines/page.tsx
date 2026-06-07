import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { GuidelineSection } from "@/components/GuidelineSection";

export const metadata: Metadata = buildMetadata({
  title: "掲載基準",
  description:
    "AppParkの掲載基準。掲載しやすいサービス・掲載を断る可能性が高いサービスの考え方を示します。",
  path: "/guidelines",
});

export default function GuidelinesPage() {
  return (
    <LegalPage
      title="掲載基準"
      lead="AppParkは審査制・キュレーション型です。以下の考え方をもとに掲載可否を判断します。"
      width="wide"
      crumbs={[
        { name: "ホーム", path: "/" },
        { name: "掲載基準", path: "/guidelines" },
      ]}
    >
      <GuidelineSection />
      <div className="mt-8 rounded-2xl bg-brand-50/70 p-5 text-sm text-ink-soft">
        掲載をご希望の方は、
        <Link href="/submit" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
          掲載申請ページ
        </Link>
        からお申し込みください。掲載は審査制のため、すべてのサービスが掲載されるわけではありません。
      </div>
    </LegalPage>
  );
}
