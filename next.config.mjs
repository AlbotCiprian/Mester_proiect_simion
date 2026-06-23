/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Open-source placeholder imagery during prototype phase.
    // Final production media is owner-supplied (see docs/specs/16-MEDIA-VERCEL-BLOB.md).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
