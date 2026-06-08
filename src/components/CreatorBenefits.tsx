import { IconBadge, type IconName, type IconTone } from "@/components/icons";

/**
 * 掲載者向けメリット（カード形式）。/submit ページで使用。
 * 閲覧者向け導線を邪魔しないよう、申請ページ側でしっかり訴求します。
 */
const benefits: { icon: IconName; tone: IconTone; title: string; desc: string }[] = [
  {
    icon: "file-text",
    tone: "navy",
    title: "専用の紹介ページを作成できる",
    desc: "あなたのWebサービス専用の紹介ページ（何ができる・使い方・スクショ）を持てます。",
  },
  {
    icon: "layout-grid",
    tone: "orange",
    title: "カテゴリ・目的別ページから継続的に見つかる",
    desc: "一度きりの告知で終わらず、目的別／カテゴリ別ページからずっと発見されます。",
  },
  {
    icon: "share-2",
    tone: "navy",
    title: "公式サイト・SNSへの導線を設置できる",
    desc: "公式サイトやSNSへのリンクを置けて、関心を持った人をそのまま誘導できます。",
  },
  {
    icon: "message-square-text",
    tone: "orange",
    title: "コメント・改善要望・バグ報告を受け取れる",
    desc: "使ってくれた人から、感想・改善要望・バグ報告を直接もらえます。",
  },
  {
    icon: "handshake",
    tone: "navy",
    title: "募集・相談ステータスを表示できる",
    desc: "ユーザー・共同開発者・スポンサー募集や、譲渡・購入相談の意思を掲示できます。",
  },
  {
    icon: "user-plus",
    tone: "orange",
    title: "最初のユーザーに出会える",
    desc: "AppParkで便利ツールを探している人へ届き、最初の利用者に出会えます。",
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
          <span>
            <span className="block text-sm font-bold leading-snug text-ink">
              {b.title}
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
              {b.desc}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
