import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Imagens das cartas: o navegador reaproveita por 1 dia sem perguntar ao servidor; depois,
        // usa a cópia em cache e confere em segundo plano se mudou (até 30 dias).
        // Os nomes não têm hash, então um cache "imutável" deixaria imagens trocadas presas no navegador.
        source: '/cards/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=2592000' }],
      },
    ];
  },
};

export default nextConfig;
