// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* other config options here if you have any */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hothothoops.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.msg.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'oxfordeagle.com',
        port: '',
        pathname: '/wp-content/uploads/sites/**/nba-best-bets-grizzlies-vs-hawks-picks-for-march-3.jpg',
      },
      {
        protocol: 'https',
        hostname: 's.secure.espncdn.com',
        port: '',
        pathname: '/stitcher/artwork/**',
      },
      {
        protocol: 'https',
        hostname: 'www.lineups.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'artwork.espncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.scotiabankarena.com',
        port: '',
        pathname: '/assets/img/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.clutchpoints.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'e0.365dm.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sport-tv.org',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '/ny/api/res/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.wrestletalk.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.cwtv.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        port: '',
        pathname: '/image/thumb/**',
      },
      {
        protocol: 'https',
        hostname: 'lastwordonsports.com',
        port: '',
        pathname: '/prowrestling/wp-content/uploads/sites/**',
      },
      {
        protocol: 'https',
        hostname: 'www.al.com',
        port: '',
        pathname: '/resizer/v2/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'www.wwe.com',
        port: '',
        pathname: '/f/styles/**',
      },
      // --- NUEVO HOSTNAME AÑADIDO PARA BOXEO (TrillerTV) ---
      {
        protocol: 'https',
        hostname: 'www.trillertv.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
