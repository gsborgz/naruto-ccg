'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPathOf, assetUrl, currentAssets } from '@/lib/content/assets';
import { migrateContentAssets, removeContentAsset, sweepContentAssets, uploadContentAsset } from '@/lib/content/client';
import { useOptionalContent } from '@/lib/content/ContentProvider';
import type { ContentKind, HistoryEntry } from '@/lib/content/types';

/**
 * Ferramentas do conteúdo editável no editor de layouts: trocar a imagem de uma moldura, painel ou ícone (vai para o
 * Vercel Blob; a anterior é apagada de lá), ver e restaurar as últimas versões de um item, enviar ao Blob as imagens
 * que ainda estão no deploy e apagar do Blob as que não estão em uso.
 */

const button = 'rounded px-2 py-1 text-xs ring-1 ring-border text-muted hover:bg-surface-2 hover:text-text disabled:opacity-50';

/** Largura e altura de uma imagem (null se não carregar). */
export function imageSize(src: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Tamanho da imagem atual de uma configuração (o tamanho padrão que a nova precisa ter). */
export function useImageSize(url: string | undefined): { w: number; h: number } | null {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const src = url ? assetUrl(url) : undefined;
  useEffect(() => {
    let cancelled = false;
    setSize(null);
    if (src) void imageSize(src).then((s) => !cancelled && setSize(s));
    return () => {
      cancelled = true;
    };
  }, [src]);
  return size;
}

/**
 * Botões "Trocar imagem" e "Voltar para a do deploy" de uma imagem da configuração (`url` lógica, `/card-layouts/...`).
 * Nos dois, a imagem que sai é apagada do Blob (não há histórico de imagens).
 *
 * Tamanho padrão (`exactSize`, o padrão): a imagem nova precisa ter o mesmo tamanho da atual (molduras e painéis, e os
 * ícones medidos na própria imagem); se não tiver, o envio é recusado e pede para redimensionar antes. Sem
 * `exactSize` (ícones com caixa: tipo, elemento, custo), qualquer tamanho vale e `onUploaded` recebe o tamanho da
 * imagem, para quem chama enquadrá-la na caixa do ícone.
 *
 * `ownPath`: o caminho que a imagem deve ter (ex.: o de um layout criado no editor, que começa com as imagens do
 * layout base). Se a configuração aponta para outro, a imagem nova vai para `ownPath` e `onRelocated` recebe o
 * endereço lógico novo, para a configuração passar a usá-lo (a do layout base fica como está).
 * `deployFallback`: a imagem existe no deploy (`public/card-layouts/`), então dá para voltar para ela.
 */
export function AssetSwapButton({
  url,
  label,
  ownPath,
  onRelocated,
  deployFallback = true,
  exactSize = true,
  onUploaded,
}: {
  url: string | undefined;
  label: string;
  ownPath?: string;
  onRelocated?: (url: string) => Promise<void>;
  deployFallback?: boolean;
  exactSize?: boolean;
  onUploaded?: (size: { w: number; h: number }) => void;
}) {
  const content = useOptionalContent();
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const size = useImageSize(url);
  const path = url ? assetPathOf(url) : null;
  if (!path) return null;
  const target = ownPath ?? path;

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setStatus(null);
    try {
      const preview = URL.createObjectURL(file);
      const got = await imageSize(preview);
      URL.revokeObjectURL(preview);
      if (!got) throw new Error('Não foi possível ler a imagem.');
      if (exactSize && size && (got.w !== size.w || got.h !== size.h)) {
        throw new Error(`A imagem precisa ter ${size.w}×${size.h} px (o tamanho padrão desta); a enviada tem ${got.w}×${got.h}. Redimensione antes de enviar.`);
      }
      const r = await uploadContentAsset(target, file);
      content?.assetChanged(r.path, r.url, r.version);
      if (target !== path) await onRelocated?.(`/card-layouts/${target}`);
      onUploaded?.(got);
      setStatus({
        ok: true,
        text: onUploaded
          ? 'Imagem trocada (a anterior foi apagada). Ela foi encaixada na caixa do ícone: ajuste o enquadramento e clique em Salvar.'
          : 'Imagem trocada para todo mundo (a anterior foi apagada).',
      });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  const inBlob = deployFallback && !!currentAssets()[path];
  const remove = async () => {
    if (!confirm('Apagar esta imagem do Blob e voltar para a do deploy? Não dá para desfazer.')) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await removeContentAsset(path);
      content?.assetChanged(r.path, null, r.version);
      setStatus({ ok: true, text: 'Imagem apagada do Blob; vale a do deploy.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted">{label}:</span>
        <a href={assetUrl(url)} target="_blank" rel="noreferrer" className="truncate text-accent hover:underline" title={path}>
          {path}
        </a>
        {size && <span className="text-muted">{size.w}×{size.h} px{exactSize ? '' : ' (qualquer tamanho)'}</span>}
        <button type="button" className={button} disabled={busy} onClick={() => input.current?.click()}>
          {busy ? 'Enviando…' : 'Trocar imagem'}
        </button>
        {inBlob && (
          <button type="button" className={button} disabled={busy} onClick={() => void remove()}>
            Voltar para a do deploy
          </button>
        )}
        <input ref={input} type="file" accept="image/webp,image/png" hidden onChange={(e) => void upload(e.target.files?.[0])} />
      </div>
      {status && <p className={`text-xs ${status.ok ? 'text-ok' : 'text-danger'}`}>{status.text}</p>}
    </div>
  );
}

const describe = (value: unknown) => `${Math.round(JSON.stringify(value).length / 100) / 10} KB de configuração`;

/** Botão "Histórico": as últimas versões do item, com "Restaurar". */
export function ContentHistoryButton({ kind, id, onRestored }: { kind: ContentKind; id: string; onRestored?: () => void }) {
  const content = useOptionalContent();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const open = async () => {
    if (entries) return setEntries(null);
    setError(null);
    const res = await fetch(`/api/content/history?kind=${kind}&id=${encodeURIComponent(id)}`, { cache: 'no-store' });
    const body = (await res.json().catch(() => ({}))) as { entries?: HistoryEntry[]; message?: string };
    if (!res.ok) return setError(body.message ?? `Erro ${res.status}`);
    setEntries(body.entries ?? []);
  };

  const restore = async (index: number) => {
    if (!confirm('Voltar para esta versão? A atual fica no histórico (dá para desfazer).')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/content/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, index }),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(body.message ?? `Erro ${res.status}`);
      setEntries(null);
      await content?.reload();
      onRestored?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="relative inline-flex">
      <button type="button" className={button} onClick={() => void open()}>
        Histórico
      </button>
      {(entries || error) && (
        <div className="absolute right-0 top-full z-40 mt-1 w-72 rounded-lg border border-border bg-surface p-2 text-xs shadow-lg">
          {error && <p className="text-danger">{error}</p>}
          {entries && !entries.length && <p className="text-muted">Nenhuma versão anterior.</p>}
          {entries?.map((e, i) => (
            <div key={e.savedAt + i} className="flex items-center gap-2 py-1">
              <span className="min-w-0 flex-1 truncate">
                {new Date(e.savedAt).toLocaleString('pt-BR')} <span className="text-muted">· {describe(e.value)}</span>
              </span>
              <button type="button" className={button} disabled={busy} onClick={() => void restore(i)}>
                Restaurar
              </button>
            </div>
          ))}
        </div>
      )}
    </span>
  );
}

/**
 * Envia ao Vercel Blob as imagens dos layouts e ícones que ainda vêm do deploy (public/card-layouts/). Depois disso,
 * trocar uma imagem não precisa mais de deploy.
 */
export function MigrateAssetsButton() {
  const content = useOptionalContent();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setStatus('Enviando…');
    try {
      const r = await migrateContentAssets((done, remaining) => setStatus(`Enviadas ${done}; faltam ${remaining}…`));
      await content?.reload();
      const swept = await sweepContentAssets();
      setStatus(
        `${r.migrated} imagens enviadas ao Blob.` +
          (r.missing.length ? ` ${r.missing.length} não existem no deploy (ignoradas).` : '') +
          (swept.deleted ? ` ${swept.deleted} sem uso apagadas.` : ''),
      );
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button type="button" className={button} disabled={busy} onClick={() => void run()}>
        Enviar imagens do deploy para o Blob
      </button>
      {status && <span className="text-muted">{status}</span>}
    </div>
  );
}

/** Apaga do Blob as imagens dos layouts e ícones que não estão em uso (sobras de um envio interrompido). */
export function SweepAssetsButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setStatus('Conferindo…');
    try {
      const r = await sweepContentAssets();
      setStatus(r.deleted ? `${r.deleted} imagens sem uso apagadas; ${r.kept} em uso.` : `Nada sobrando: ${r.kept} imagens, todas em uso.`);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button type="button" className={button} disabled={busy} onClick={() => void run()}>
        Apagar imagens sem uso
      </button>
      {status && <span className="text-muted">{status}</span>}
    </div>
  );
}
