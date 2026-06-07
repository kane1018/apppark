/**
 * 募集・相談ステータスの定義（ラベル・説明・アイコン・色）を一元管理。
 *
 * 表示はあくまで「相談・募集の意思表示」です。AppParkは売買・決済・契約・権利移転を
 * 代行/保証しません（src/components/recruitment/RecruitmentNotice.tsx で明示）。
 */
import type { IconName } from "@/components/icons";
import type { RecruitmentStatus } from "@/types";

export interface RecruitmentMeta {
  label: string;
  /** 短い説明（ツールチップ／詳細ページの補足文に使用） */
  description: string;
  icon: IconName;
  /** バッジの配色（派手すぎない soft トーン） */
  badge: string;
  /** 譲渡・購入など「相談」系か（注意文の出し分けに使用） */
  consultation?: boolean;
}

/** 表示順（投稿フォーム・フィルター・バッジ共通） */
export const recruitmentStatuses: RecruitmentStatus[] = [
  "seeking_users",
  "seeking_feedback",
  "seeking_cofounder",
  "seeking_sponsor",
  "transfer_consultation",
  "purchase_consultation",
];

export const recruitmentMeta: Record<RecruitmentStatus, RecruitmentMeta> = {
  seeking_users: {
    label: "ユーザー募集中",
    description: "このサービスを使ってくれるユーザーを募集しています。",
    icon: "user-plus",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  seeking_feedback: {
    label: "フィードバック募集中",
    description: "感想、改善要望、バグ報告などを受け付けています。",
    icon: "message-square-text",
    badge: "bg-sky-50 text-sky-700 ring-sky-600/20",
  },
  seeking_cofounder: {
    label: "共同開発者募集中",
    description: "一緒に開発・改善してくれる人を募集しています。",
    icon: "handshake",
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  },
  seeking_sponsor: {
    label: "スポンサー募集中",
    description:
      "サービス運営や開発を応援してくれるスポンサーを募集しています。",
    icon: "megaphone",
    badge: "bg-violet-50 text-violet-700 ring-violet-600/20",
  },
  transfer_consultation: {
    label: "譲渡相談可",
    description: "条件次第で、サービスの譲渡相談を受け付ける可能性があります。",
    icon: "share-2",
    badge: "bg-amber-50 text-amber-800 ring-amber-600/20",
    consultation: true,
  },
  purchase_consultation: {
    label: "購入相談可",
    description:
      "このサービスの購入に関心がある人からの相談を受け付ける可能性があります。",
    icon: "briefcase-business",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/20",
    consultation: true,
  },
};

/** 値が正しい RecruitmentStatus か */
export function isRecruitmentStatus(v: string): v is RecruitmentStatus {
  return v in recruitmentMeta;
}

/** 「譲渡相談可」または「購入相談可」を含むか（注意文の表示判定） */
export function hasConsultation(list: RecruitmentStatus[]): boolean {
  return list.some((s) => recruitmentMeta[s]?.consultation);
}
