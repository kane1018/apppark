/**
 * ユーザー入力のURLを安全化するヘルパー。
 *
 * href / src に入る可能性のあるURL（似ているサービスURL、参考画像URL、作者リンク、
 * 外部サービスURLなど）は、必ずこの関数を通してください。
 * 許可するのは http / https のみ。javascript: data: vbscript: file: blob: などの
 * 危険・予期しないスキームは null を返し、レンダリングしないようにします。
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function safeUrl(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(u.protocol)) return null;
    return u.href;
  } catch {
    return null;
  }
}

/** 画像URL専用（http/https のみ。data: は不可）。 */
export function safeImageUrl(input: string | null | undefined): string | null {
  return safeUrl(input);
}
