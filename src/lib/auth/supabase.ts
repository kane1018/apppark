import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase クライアント（環境変数が設定されている場合のみ有効）。
 *
 * 本番でGoogle/マジックリンク/メール認証を使うには、以下をVercel等に設定してください：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 * さらにSupabaseダッシュボードで Google プロバイダを有効化し、
 * リダイレクトURLに <本番URL>/auth/callback を登録してください。
 *
 * 未設定のあいだは、メール＋公開表示名の簡易ログイン（ローカル）で動作します。
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
