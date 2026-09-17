import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.wordpress.com',
        port: '',
        pathname: '/mshots/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net', // Domain cụ thể gây lỗi
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bing.net', // Cho phép tất cả các sub-domain khác của bing.net
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;