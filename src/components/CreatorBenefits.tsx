import { IconBadge, type IconName, type IconTone } from "@/components/icons";

/**
 * 掲載者向けメリット（カード形式）。/submit ページで使用。
 * 閲覧者向け導線を邪魔しないよう、申請ページ側でしっかり訴求します。
 */
const benefits: { icon: IconName; tone: IconTone; title: string }[] = [
  { icon: "user-plus", tone: "navy", title: "最初のユーザーに見つけてもらえる" },
  { icon: "message-square-text", tone: "orange", title: "使ってみた感想がもらえる" },
  { icon: "bug", tone: "navy", title: "改善要望・バグ報告を受け取れる" },
  { icon: "file-text", tone: "orange", title: "サービス詳細ページを実績として使える" },
  {
    icon: "handshake",
    tone: "navy",
    title: "共同開発者・スポンサー・購入相談につながる可能性がある",
  },
  {
    icon: "share-2",
    tone: "orange",
    title: "SNSやショート動画で紹介される可能性がある",
  },
];

export function CreatorBenefits() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map((b) => (
        <li
          key={b.title}
          className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-card"
        >
          <IconBadge name={b.icon} tone={b.tone} size="sm" />
          <span className="pt-1 text-sm font-semibold leading-snug text-ink">
            {b.title}
          </span>
        </li>
      ))}
    </ul>
  );
}
