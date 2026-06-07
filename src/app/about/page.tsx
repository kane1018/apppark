import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "AppParkについて",
  description:
    "AppParkは、面白い・便利なWebサービスを目的別／カテゴリ別に探せる、ユーザー投稿型の発見サイトです。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalPage
      title="AppParkについて"
      lead={`${siteConfig.name} は、面白いWebサービス・便利なWebアプリ・AIツール・個人開発サービスを探せる発見サイトです。`}
      crumbs={[
        { name: "ホーム", path: "/" },
        { name: "AppParkについて", path: "/about" },
      ]}
    >
      <div className="prose-legal">
        <h2>このサイトの主役は「使う人」です</h2>
        <p>
          AppParkは、サービスを投稿する人ではなく、まず「見る人・使う人」を主役にしています。閲覧者が、自分の目的に合ったWebサービスを探し、実際に使い、感想・改善要望・バグ報告などを残せる場所を目指しています。
        </p>

        <h2>AppParkでできること</h2>
        <ul>
          <li>目的別・カテゴリ別にWebサービスを探す</li>
          <li>料金形態・運営状況・タグなどで絞り込む</li>
          <li>詳細ページで「使う前」に必要な情報を確認する</li>
          <li>外部リンクから実際にサービスを使う</li>
          <li>利用者の声を見る／コメントで感想・質問・改善要望を残す</li>
          <li>問題があれば通報する</li>
        </ul>

        <h2>審査制・キュレーション型です</h2>
        <p>
          誹謗中傷・ステマ・違法サービス・権利侵害・詐欺的サービスなどを避けるため、投稿は即時公開ではなく、運営の確認後に掲載する審査制としています。掲載後であっても、必要に応じて内容の修正・非公開・削除を行うことがあります。
        </p>

        <h2>掲載内容について</h2>
        <p>
          掲載サービスは、投稿者または外部運営者が提供するものです。AppParkは、掲載サービスの内容・安全性・合法性・品質・継続提供・収益性を保証するものではありません。利用前に、各サービスの利用規約・プライバシーポリシーをご確認ください。
        </p>

        <h2>関連ページ</h2>
        <ul>
          <li>
            <Link href="/guidelines" className="text-brand-600 underline-offset-2 hover:underline">
              掲載基準
            </Link>
          </li>
          <li>
            <Link href="/submit" className="text-brand-600 underline-offset-2 hover:underline">
              サービス掲載申請
            </Link>
          </li>
          <li>
            <Link href="/sponsor" className="text-brand-600 underline-offset-2 hover:underline">
              スポンサー掲載について
            </Link>
          </li>
        </ul>

        <p className="text-xs text-ink-faint">
          ※「{siteConfig.name}」はサービス名です。今後変更される可能性があります。
        </p>
      </div>
    </LegalPage>
  );
}
