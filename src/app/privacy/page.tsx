import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "プライバシーポリシー",
  description: "AppParkのプライバシーポリシー。取得する情報と利用目的について。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead="AppPark（以下「当サイト」）における個人情報の取り扱いについて定めます。"
      lastUpdated="2026年6月7日"
      crumbs={[
        { name: "ホーム", path: "/" },
        { name: "プライバシーポリシー", path: "/privacy" },
      ]}
    >
      <div className="prose-legal">
        <h2>1. 取得する情報</h2>
        <p>当サイトは、以下の情報を取得することがあります。</p>
        <ul>
          <li>お名前（投稿者名・お問い合わせ者名）</li>
          <li>メールアドレス</li>
          <li>投稿内容（掲載申請内容・コメント等）</li>
          <li>お問い合わせ内容・通報内容</li>
          <li>アクセス解析情報（閲覧ページ、ブラウザ情報、IPアドレス等）</li>
        </ul>

        <h2>1の2. ログイン機能に関して取得する情報</h2>
        <p>
          AppParkでは、ログイン機能の提供、投稿管理、コメント管理、本人確認、問い合わせ対応、通報対応のため、以下の情報を取得する場合があります。
        </p>
        <ul>
          <li>メールアドレス</li>
          <li>公開表示名</li>
          <li>連絡先氏名</li>
          <li>プロフィール画像</li>
          <li>投稿サービス情報</li>
          <li>コメント内容</li>
          <li>通報内容</li>
          <li>ログイン履歴</li>
          <li>アクセス情報</li>
        </ul>
        <p>
          <strong className="font-semibold text-ink">公開される情報：</strong>
          公開表示名／投稿サービス／コメント内容／プロフィール画像（任意）。
        </p>
        <p>
          <strong className="font-semibold text-ink">公開されない情報：</strong>
          メールアドレス／連絡先氏名／管理用メモ／通報者情報。
        </p>

        <h2>2. 利用目的</h2>
        <p>取得した情報は、以下の目的で利用します。</p>
        <ul>
          <li>ログイン機能の提供・本人確認</li>
          <li>掲載申請の審査・投稿/コメントの管理</li>
          <li>投稿者・利用者への連絡</li>
          <li>お問い合わせ・通報への対応</li>
          <li>サイトの改善・運営</li>
          <li>スポンサー対応</li>
        </ul>

        <h2>3. 第三者提供</h2>
        <p>
          当サイトは、法令に基づく場合や本人の同意がある場合を除き、取得した個人情報を第三者に提供しません。
        </p>

        <h2>4. 外部サービスの利用</h2>
        <p>
          当サイトは、フォーム送信・アクセス解析・ホスティング等のために外部サービスを利用することがあります。これらの外部サービスにおける情報の取り扱いは、各サービスの定めに従います。
        </p>

        <h2>5. Cookie・アクセス解析</h2>
        <p>
          当サイトは、利用状況の把握やサイト改善のために、Cookieやアクセス解析ツールを利用することがあります。これらにより個人を直接特定することはありません。ブラウザの設定によりCookieを無効化することができます。
        </p>

        <h2>6. 個人情報の管理</h2>
        <p>
          当サイトは、取得した個人情報を適切に管理し、不正アクセス・紛失・漏えい等の防止に努めます。
        </p>

        <h2>7. お問い合わせ窓口</h2>
        <p>
          本ポリシーに関するお問い合わせは、{siteConfig.organization.name}まで、
          お問い合わせフォームよりご連絡ください。
        </p>
      </div>
    </LegalPage>
  );
}
