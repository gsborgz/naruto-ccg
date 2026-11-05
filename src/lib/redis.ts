import { Redis } from '@upstash/redis';

let client: Redis | null = null;

/**
 * Cliente Upstash (REST), criado só no primeiro uso: assim o build não depende das variáveis.
 * Local: `npm run services:up` + `.env.local` (ver `.env.example`).
 * Vercel: integração Upstash do Marketplace (preenche UPSTASH_REDIS_REST_URL/TOKEN) — ver DEPLOY.md.
 */
export function getRedis(): Redis {
  client ??= Redis.fromEnv();
  return client;
}
