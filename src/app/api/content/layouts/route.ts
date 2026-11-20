import { NextRequest, NextResponse } from 'next/server';
import { dropAssets } from '@/lib/content/assetStore';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { invalidateContent } from '@/lib/content/server';
import { ContentError, createLayout, deleteLayout } from '@/lib/content/store';

/** Id de um layout criado no editor: `layout-` e letras minúsculas, números e hífens. */
const NEW_ID = /^layout-[a-z0-9][a-z0-9-]{0,39}$/;

/**
 * Cria um layout novo no editor de layouts, cópia de outro (`{ id, label, base }`): depois é só trocar as molduras,
 * os painéis e as posições dele.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const id = body?.id;
    const label = typeof body?.label === 'string' ? body.label.trim() : '';
    const base = body?.base;
    if (typeof id !== 'string' || !NEW_ID.test(id)) throw new ContentError(400, 'Id inválido: use "layout-" e letras minúsculas, números e hífens.');
    if (!label || label.length > 60) throw new ContentError(400, 'Dê um nome ao layout (até 60 caracteres).');
    if (typeof base !== 'string' || !NEW_ID.test(base)) throw new ContentError(400, 'Layout base inválido.');
    const version = await createLayout(id, label, base);
    invalidateContent();
    return NextResponse.json({ version, id });
  } catch (e) {
    return contentErrorResponse(e);
  }
}

/** Exclui um layout criado no editor (`{ id }`), se nenhuma carta o usa; as imagens dele saem do Blob. */
export async function DELETE(request: NextRequest) {
  try {
    const body = await readJson(request);
    const id = body?.id;
    if (typeof id !== 'string' || !NEW_ID.test(id)) throw new ContentError(400, 'Layout inválido.');
    const { version, dropped } = await deleteLayout(id);
    invalidateContent();
    await dropAssets(dropped);
    return NextResponse.json({ version });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
