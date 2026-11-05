/** Static export: deploy the /out folder to any static host (Vercel, Netlify, Cloudflare Pages, S3). */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
