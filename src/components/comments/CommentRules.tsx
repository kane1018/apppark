/**
 * コメント欄の注意文（追加仕様）。
 */
import { siteConfig } from "@/config/site";

export function CommentRules() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-ink-soft">
      <p className="mb-2 font-bold text-brand-800">コメントのルール</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>建設的な感想・質問・改善要望を歓迎します。</li>
        <li>誹謗中傷、人格攻撃、スパム、違法行為の助長は禁止です。</li>
        <li>個人情報（電話番号・メールアドレス等）を投稿しないでください。</li>
        <li>
          コメントは自動判定または運営確認により、非表示・削除される場合があります。
        </li>
        <li>
          掲載サービスの安全性・品質を {siteConfig.name} が保証するものではありません。
        </li>
      </ul>
    </div>
  );
}
