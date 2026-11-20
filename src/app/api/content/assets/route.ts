import { NextRequest, NextResponse } from 'next/server';
import { removeAsset, uploadAsset } from '@/lib/content/assetStore';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { invalidateContent } from '@/lib/content/server';

/**
 * Troca uma imagem dos layouts ou dos ícones (moldura, painel, ícone). Corpo: `{ path, data }`, com o caminho da imagem
 * (`layout-02/jutsu-frame.webp`) e a imagem em data URL (WebP ou PNG). A anterior é apagada do Blob.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const result = await uploadAsset(body?.path, body?.data);
    invalidateContent();
    return NextResponse.json(result);
  } catch (e) {
    return contentErrorResponse(e);
  }
}

/** Tira a imagem do Blob (`{ path }`): ela é apagada e volta a valer a do deploy. */
export async function DELETE(request: NextRequest) {
  try {
    const body = await readJson(request);
    const result = await removeAsset(body?.path);
    invalidateContent();
    return NextResponse.json(result);
  } catch (e) {
    return contentErrorResponse(e);
  }
}
