import { NextResponse } from 'next/server';
import { sweepAssets } from '@/lib/content/assetStore';
import { contentErrorResponse } from '@/lib/content/http';

export const maxDuration = 60;

/** Apaga da pasta das imagens dos layouts e ícones no Blob o que não está em uso (fora do mapa de imagens). */
export async function POST() {
  try {
    return NextResponse.json(await sweepAssets());
  } catch (e) {
    return contentErrorResponse(e);
  }
}
