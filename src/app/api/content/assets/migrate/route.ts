import { NextRequest, NextResponse } from 'next/server';
import { migrateAssets } from '@/lib/content/assetStore';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { ensureContent, invalidateContent } from '@/lib/content/server';

export const maxDuration = 300;

/**
 * Envia ao Vercel Blob, num lote, as imagens dos layouts e ícones que ainda estão só no deploy (public/card-layouts/).
 * O editor de layouts chama em sequência até `remaining` chegar a zero, mandando em `skip` as que faltaram.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const rawSkip = Array.isArray(body?.skip) ? (body.skip as unknown[]) : [];
    const skip = new Set(rawSkip.filter((s): s is string => typeof s === 'string'));
    invalidateContent();
    const content = await ensureContent();
    const result = await migrateAssets(request.nextUrl.origin, content, 25, skip);
    invalidateContent();
    return NextResponse.json(result);
  } catch (e) {
    return contentErrorResponse(e);
  }
}
