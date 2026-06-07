/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // デモのサムネイルはローカルのグラデーション生成のため外部画像ドメイン設定は不要。
  // 後で外部画像を使う場合は images.remotePatterns をここに追加してください。
};

export default nextConfig;
