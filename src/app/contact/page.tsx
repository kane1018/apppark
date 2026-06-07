import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "お問い合わせ",
  description: "AppParkへのお問い合わせ・スポンサー掲載のご相談はこちらから。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPage
      title="お問い合わせ"
      lead="サービス・掲載申請・スポンサー掲載などについてのお問い合わせを受け付けています。"
      crumbs={[
        { name: "ホーム", path: "/" },
        { name: "お問い合わせ", path: "/contact" },
      ]}
    >
      <div className="card p-5 sm:p-6">
        <ContactForm />
      </div>
      <p className="mt-4 text-xs text-ink-faint">
        掲載サービスに関する通報・削除依頼は
        <Link href="/report" className="text-brand-600 underline-offset-2 hover:underline">
          通報・削除依頼ページ
        </Link>
        をご利用ください。
      </p>
    </LegalPage>
  );
}
