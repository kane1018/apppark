"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/types";
import { getCategoryName } from "@/data/categories";
import { isConfigMiniTool, isInternalToolUrl } from "@/data/services";
import { formatDate } from "@/lib/labels";

/**
 * マイページの「自分が投稿したサービス」一覧（投稿者本人の管理ビュー）。
 *
 * 投稿者本人として 編集申請 / 非公開申請 / 削除申請 ができます（MVPでは申請の受付のみ。
 * 送信先の接続後に実反映）。管理者（role=admin）は非公開・削除を直接操作できる導線を表示します。
 * 公開ページと同じく、ここでも公開表示名以外（メール等）は扱いません。
 */
export function OwnerServiceList({
  services,
  isAdmin = false,
}: {
  services: Service[];
  isAdmin?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {services.map((s) => (
        <OwnerServiceRow key={s.id} service={s} isAdmin={isAdmin} />
      ))}
    </ul>
  );
}

type ActionState =
  | { kind: "idle" }
  | { kind: "edit" | "hide" | "delete"; message: string };

function OwnerServiceRow({
  service,
  isAdmin,
}: {
  service: Service;
  isAdmin: boolean;
}) {
  const [state, setState] = useState<ActionState>({ kind: "idle" });

  const inPage = isConfigMiniTool(service) || isInternalToolUrl(service.url);

  function request(kind: "edit" | "hide" | "delete") {
    // MVP：送信先未接続のため、申請の受付のみ（本番では API へ POST）。
    const label =
      kind === "edit" ? "編集申請" : kind === "hide" ? "非公開申請" : "削除申請";
    setState({
      kind,
      message: `${label}を受け付けました。運営が確認のうえ反映します。`,
    });
  }

  return (
    <li className="card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-brand-900">
              <Link href={`/services/${service.slug}`} className="hover:text-brand-600">
                {service.name}
              </Link>
            </h3>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
              {getCategoryName(service.category)}
            </span>
            {inPage && (
              <span className="inline-flex items-center rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700">
                このページ内で使えます
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              公開中
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{service.shortDescription}</p>
          <p className="mt-1 text-[11px] text-ink-faint">
            公開表示名：{service.publicAuthorName}・更新日：{formatDate(service.updatedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <Link
            href={`/services/${service.slug}`}
            className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-bold text-ink-soft hover:border-brand-400 hover:text-brand-600"
          >
            開く
          </Link>
          <button
            type="button"
            onClick={() => request("edit")}
            className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-bold text-ink-soft hover:border-brand-400 hover:text-brand-600"
          >
            編集申請
          </button>
          <button
            type="button"
            onClick={() => request("hide")}
            className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-bold text-ink-soft hover:border-amber-400 hover:text-amber-600"
          >
            {isAdmin ? "非公開" : "非公開申請"}
          </button>
          <button
            type="button"
            onClick={() => request("delete")}
            className="rounded-lg border border-gray-300 px-2.5 py-1 text-xs font-bold text-ink-soft hover:border-rose-400 hover:text-rose-600"
          >
            {isAdmin ? "削除" : "削除申請"}
          </button>
        </div>
      </div>

      {state.kind !== "idle" && (
        <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
          {state.message}
        </p>
      )}
    </li>
  );
}
