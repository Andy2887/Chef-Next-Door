import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vkjwghqwqacivpuomtdr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/chef-next-door-images/**',
      },
    ],
  },
};

export default nextConfig;
