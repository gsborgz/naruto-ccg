'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { catalogDraft, toCatalogCard, withoutLayout } from '@/lib/cardMaker/catalogEdit';
import type { CustomCard } from '@/lib/cardMaker/model';
import { saveCatalogCard } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import type { Card } from '@/models/card';
import { CardFace } from '../CardFace';
import { CardDataEditor } from './CardEditor';
import { ContentHistoryButton } from './ContentTools';

/**
 * Aba Editar do detalhe da carta: os textos (PT-BR: nome, efeito, frase, características, Atributo de Combate) e os
 * números (custos, poder; nos Jutsus, os ícones de elemento e o Chakra genérico do custo) de uma carta do catálogo. Vale
 * para todo mundo na hora, sem deploy. O design não muda: a carta do catálogo mostra sempre a imagem impressa (as artes
 * novas ficam nas alters, feitas em Criar carta → Importar do catálogo).
 */
export default function CardEditTab({
  card,
  header,
  onDirtyChange,
}: {
  card: Card;
  header: ReactNode;
  /** Avisa o detalhe quando há alterações não salvas (para perguntar antes de fechar ou trocar de aba). */
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const content = useContent();
  // A carta no formato do editor do criador (só os campos de texto e número aparecem).
  const initial = useMemo(() => catalogDraft(withoutLayout(card)), [card]);
  const [draft, setDraft] = useState<CustomCard>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);
  // Carta gravada (nova versão do conteúdo): o rascunho recomeça dela.
  useEffect(() => setDraft(initial), [initial]);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await saveCatalogCard(withoutLayout(toCatalogCard(card, draft)));
      await content.reload();
      setStatus({ ok: true, text: 'Carta salva para todo mundo.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      <div className="mx-auto w-full max-w-xs self-start sm:sticky sm:top-4 sm:max-w-none">
        <CardFace card={card} size="full" className="rounded-lg shadow-xl" />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {header}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{dirty ? 'Alterações não salvas' : 'Sem alterações'}</span>
          <ContentHistoryButton kind="card" id={card.id} />
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => setDraft(initial)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger disabled:opacity-50"
            >
              Descartar
            </button>
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={save}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </span>
        </div>
        {status && <p className={`text-xs ${status.ok ? 'text-ok' : 'text-danger'}`}>{status.text}</p>}
        <CardDataEditor card={draft} onChange={setDraft} />
      </div>
    </div>
  );
}
