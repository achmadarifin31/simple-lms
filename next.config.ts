import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fail the build if there are TypeScript or ESLint errors
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
