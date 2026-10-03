import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Match nest360.org, where /news and /newsletter redirect to these pages.
  async redirects() {
    return [
      { source: "/news", destination: "/stories", permanent: true },
      { source: "/newsletter", destination: "/newsletters", permanent: true },
    ];
  },
};

export default nextConfig;
