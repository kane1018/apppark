/** @type {import('next').NextConfig} */

/**
 * セキュリティヘッダー。
 * CSP は既存機能（Next のハイドレーション用インラインスクリプト、Tailwind の
 * インラインスタイル、ユーザー画像URL、Supabase 通信、承認済みiframe埋め込み、
 * next/og）を壊さない範囲で設定しています。
 * script/style は 'unsafe-inline' を許容（Next 既定の動作のため）。代わりに
 * frame-ancestors / object-src / base-uri / form-action を固めてクリックジャッキング・
 * ベース乗っ取り・プラグイン実行を防ぎます。
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https:",
  "frame-src 'self' https:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  // サムネイルはローカルのグラデーション生成のため外部画像ドメイン設定は不要。
  // 後で外部画像を使う場合は images.remotePatterns をここに追加してください。
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
