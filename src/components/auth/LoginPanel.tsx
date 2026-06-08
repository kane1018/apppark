"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * ログインUI（ハイブリッド）。
 * - Supabase有効：Googleログイン＋メールリンク＋メール/パスワード
 * - 未設定：メール＋公開表示名の簡易ログイン
 */
export function LoginPanel({
  returnTo,
  onSignedIn,
}: {
  returnTo?: string;
  onSignedIn?: () => void;
}) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const next =
    returnTo || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await auth.signInWithMagicLink(email, next);
    setMsg({ ok: r.ok, text: r.message });
    setBusy(false);
  }
  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await auth.signInWithPassword(email, password);
    setMsg({ ok: r.ok, text: r.message });
    setBusy(false);
    if (r.ok) onSignedIn?.();
  }
  function handleLocal(e: React.FormEvent) {
    e.preventDefault();
    const r = auth.signInLocal(email, displayName);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) onSignedIn?.();
  }

  return (
    <div className="space-y-4">
      {msg && (
        <p
          className={`rounded-lg border px-3 py-2 text-sm ${
            msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {msg.text}
        </p>
      )}

      {auth.isSupabase ? (
        <>
          <button
            type="button"
            onClick={() => auth.signInWithGoogle(next)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-gray-50"
          >
            <GoogleIcon />
            Googleでログイン
          </button>

          <div className="flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-gray-200" />
            または
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="flex gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`rounded-lg px-3 py-1.5 ${mode === "magic" ? "bg-brand-700 text-white" : "bg-gray-100 text-ink-soft"}`}
            >
              メールリンク
            </button>
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`rounded-lg px-3 py-1.5 ${mode === "password" ? "bg-brand-700 text-white" : "bg-gray-100 text-ink-soft"}`}
            >
              メール＋パスワード
            </button>
          </div>

          {mode === "magic" ? (
            <form onSubmit={handleMagic} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                className="field-input"
              />
              <button type="submit" disabled={busy} className="btn-secondary w-full disabled:opacity-50">
                ログインリンクを送る
              </button>
            </form>
          ) : (
            <form onSubmit={handlePassword} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
                className="field-input"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                className="field-input"
              />
              <button type="submit" disabled={busy} className="btn-secondary w-full disabled:opacity-50">
                ログイン
              </button>
            </form>
          )}
        </>
      ) : (
        // ローカル簡易ログイン
        <form onSubmit={handleLocal} className="space-y-3">
          <div>
            <label className="field-label" htmlFor="login-name">
              公開表示名（必須・ニックネーム可）
            </label>
            <input
              id="login-name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="AppPark上に表示される名前"
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label" htmlFor="login-email">
              メールアドレス（非公開）
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field-input"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            ログイン
          </button>
          <p className="text-[11px] leading-relaxed text-ink-faint">
            ※ 現在は簡易ログイン（この端末に保存）です。Google等の本格ログインは運営が認証基盤を接続後に有効化されます。メールアドレスは公開されません。
          </p>
        </form>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.05H12v3.88h5.9a5 5 0 01-2.18 3.3v2.74h3.53c2.07-1.9 3.25-4.7 3.25-7.87z" />
      <path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.53-2.74c-.98.66-2.24 1.05-3.71 1.05-2.85 0-5.27-1.93-6.13-4.52H2.22v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.87 14.14a6.6 6.6 0 010-4.28V7.02H2.22a11 11 0 000 9.96l3.65-2.84z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.05.55 4.18 1.63l3.13-3.13C17.43 2.1 14.95 1 12 1A11 11 0 002.22 7.02l3.65 2.84C6.73 7.33 9.15 5.4 12 5.4z" />
    </svg>
  );
}
