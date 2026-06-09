"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User as SupaUser } from "@supabase/supabase-js";
import type { AppUser, UserRole } from "@/lib/auth/types";
import { getSupabase, isSupabaseEnabled } from "@/lib/auth/supabase";
import { siteConfig } from "@/config/site";

const LOCAL_KEY = "apppark.auth.user";

interface AuthResult {
  ok: boolean;
  message: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** Supabase認証が有効か（Google/マジックリンクが使えるか） */
  isSupabase: boolean;
  signInWithGoogle: (returnTo?: string) => Promise<void>;
  signInWithMagicLink: (email: string, returnTo?: string) => Promise<AuthResult>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<AuthResult>;
  /** ローカル簡易ログイン（Supabase未設定時） */
  signInLocal: (email: string, displayName: string) => AuthResult;
  updateProfile: (patch: Partial<Pick<AppUser, "displayName" | "contactName" | "avatarUrl">>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** サイトオーナー本人（kansuinaoi@gmail.com）か */
function isOwnerEmail(email: string): boolean {
  return (
    !!email &&
    email.trim().toLowerCase() === siteConfig.owner.email.trim().toLowerCase()
  );
}

function mapSupaUser(u: SupaUser): AppUser {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const app = (u.app_metadata ?? {}) as Record<string, unknown>;
  const owner = isOwnerEmail(u.email ?? "");
  // role はサーバー（profiles.role）が真実。UIではオーナーを admin として扱い、
  // それ以外は JWT の app_metadata.role（無ければ user）。最終判定は RLS/サーバー側。
  const role = (owner ? "admin" : app.role || meta.role || "user") as UserRole;
  const displayName = owner
    ? siteConfig.owner.displayName
    : (meta.display_name as string) ||
      (meta.full_name as string) ||
      (u.email ? u.email.split("@")[0] : "ユーザー");
  return {
    // オーナー本人は初期掲載と同じ authorId に紐付け（マイページで自分の投稿として表示）
    id: owner ? siteConfig.owner.authorId : u.id,
    email: u.email ?? "",
    nickname: owner ? siteConfig.owner.nickname : (meta.nickname as string) || displayName,
    displayName,
    avatarUrl: (meta.avatar_url as string) ?? siteConfig.owner.avatarUrl ?? null,
    contactName: (meta.contact_name as string) ?? null,
    role,
    createdAt: u.created_at ?? new Date().toISOString(),
    updatedAt: (u.updated_at as string) ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 初期化
  useEffect(() => {
    let active = true;
    const sb = getSupabase();
    if (sb) {
      sb.auth.getSession().then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ? mapSupaUser(data.session.user) : null);
        setLoading(false);
      });
      const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ? mapSupaUser(session.user) : null);
      });
      return () => {
        active = false;
        sub.subscription.unsubscribe();
      };
    }
    // ローカルモード
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      /* noop */
    }
    setLoading(false);
    return () => {
      active = false;
    };
  }, []);

  const persistLocal = useCallback((u: AppUser | null) => {
    try {
      if (u) localStorage.setItem(LOCAL_KEY, JSON.stringify(u));
      else localStorage.removeItem(LOCAL_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const signInWithGoogle = useCallback(async (returnTo?: string) => {
    const sb = getSupabase();
    if (!sb) return;
    const next = returnTo || (typeof window !== "undefined" ? window.location.pathname : "/");
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }, []);

  const signInWithMagicLink = useCallback(
    async (email: string, returnTo?: string): Promise<AuthResult> => {
      const sb = getSupabase();
      if (!sb) return { ok: false, message: "メールリンクは現在利用できません。" };
      const next = returnTo || "/";
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      return error
        ? { ok: false, message: error.message }
        : { ok: true, message: "ログイン用のリンクをメールに送信しました。メールをご確認ください。" };
    },
    []
  );

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const sb = getSupabase();
      if (!sb) return { ok: false, message: "この方法は現在利用できません。" };
      const { error } = await sb.auth.signInWithPassword({ email, password });
      return error ? { ok: false, message: error.message } : { ok: true, message: "ログインしました。" };
    },
    []
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string, displayName: string): Promise<AuthResult> => {
      const sb = getSupabase();
      if (!sb) return { ok: false, message: "この方法は現在利用できません。" };
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      return error
        ? { ok: false, message: error.message }
        : { ok: true, message: "確認メールを送信しました。メールのリンクから登録を完了してください。" };
    },
    []
  );

  const signInLocal = useCallback(
    (email: string, displayName: string): AuthResult => {
      if (isSupabaseEnabled) return { ok: false, message: "Supabase認証が有効です。" };
      const name = displayName.trim();
      const mail = email.trim();
      if (!name) return { ok: false, message: "公開表示名を入力してください。" };
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail))
        return { ok: false, message: "メールアドレスを正しく入力してください。" };
      const now = new Date().toISOString();
      const owner = isOwnerEmail(mail);
      const u: AppUser = {
        // オーナー本人は初期掲載と同じ authorId・公開表示名（kane）に紐付け
        id: owner
          ? siteConfig.owner.authorId
          : `local-${btoa(unescape(encodeURIComponent(mail))).replace(/=/g, "").slice(0, 16)}`,
        email: mail,
        nickname: owner ? siteConfig.owner.nickname : name,
        displayName: owner ? siteConfig.owner.displayName : name,
        avatarUrl: owner ? siteConfig.owner.avatarUrl : null,
        contactName: null,
        role: owner ? "admin" : "user",
        createdAt: now,
        updatedAt: now,
      };
      setUser(u);
      persistLocal(u);
      return { ok: true, message: "ログインしました。" };
    },
    [persistLocal]
  );

  const updateProfile = useCallback(
    async (patch: Partial<Pick<AppUser, "displayName" | "contactName" | "avatarUrl">>) => {
      const sb = getSupabase();
      if (sb) {
        await sb.auth.updateUser({
          data: {
            ...(patch.displayName !== undefined ? { display_name: patch.displayName } : {}),
            ...(patch.contactName !== undefined ? { contact_name: patch.contactName } : {}),
            ...(patch.avatarUrl !== undefined ? { avatar_url: patch.avatarUrl } : {}),
          },
        });
        return;
      }
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
        persistLocal(next);
        return next;
      });
    },
    [persistLocal]
  );

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    setUser(null);
    persistLocal(null);
  }, [persistLocal]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isSupabase: isSupabaseEnabled,
      signInWithGoogle,
      signInWithMagicLink,
      signInWithPassword,
      signUpWithPassword,
      signInLocal,
      updateProfile,
      signOut,
    }),
    [
      user,
      loading,
      signInWithGoogle,
      signInWithMagicLink,
      signInWithPassword,
      signUpWithPassword,
      signInLocal,
      updateProfile,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
