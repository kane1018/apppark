import { siteConfig } from "@/config/site";

/**
 * 譲渡・購入相談に関する注意文。
 * - variant="detail"：サービス詳細ページ用（「譲渡相談可」「購入相談可」が選択されている場合に表示）
 * - variant="form"：投稿フォームの募集・相談ステータス欄の近くに表示
 *
 * AppParkは売買・決済・契約・権利移転を代行/保証しないことを明示します（相談の意思表示にとどめる）。
 */
export function RecruitmentNotice({ variant }: { variant: "detail" | "form" }) {
  const text =
    variant === "form"
      ? `譲渡・購入に関するステータスは、相談の意思表示にとどまります。${siteConfig.name}は、売買・決済・契約締結・権利移転を代行または保証しません。虚偽の収益、利用者数、権利関係、譲渡条件などを記載しないでください。`
      : `「譲渡相談可」「購入相談可」は、投稿者が相談を受け付ける可能性があることを示すものです。${siteConfig.name}は、取引成立、売却可能性、収益性、契約内容、権利移転、買主・売主の信用性を保証するものではありません。条件確認や契約は、当事者間で慎重に行ってください。`;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900/90">
      {text}
    </div>
  );
}
