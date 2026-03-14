import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config silences the warning and enables full Turbopack support
  turbopack: {},

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },

  // COOP/COEP headers for CesiumJS SharedArrayBuffer support
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
};

export default nextConfig;
