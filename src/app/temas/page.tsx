'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeEditor } from '@/components/themes/ThemeEditor';
import { ThemePreview } from '@/components/themes/ThemePreview';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { useLibraryError } from '@/lib/cloud/library';
import { themeActions, uploadWallpaper, useActiveThemeId, useThemes, type ThemeItem } from '@/lib/themes/client';
import { newTheme, PALETTES, THEME_LIMITS, type BoardTheme } from '@/lib/themes/types';
import { useLeaveGuard } from '@/lib/useLeaveGuard';

/**
 * Temas da arena (`/temas`): cada jogador cadastra os seus (padrão de cores + imagem de fundo, `src/lib/themes/`).
 * Todos os temas aparecem para todos e qualquer um pode usar qualquer tema; só quem criou edita e exclui (os outros
 * podem criar uma cópia). O tema em uso é de cada jogador e vale em todas as partidas dele.
 */
export default function ThemesPage() {
  const themes = useThemes();
  const activeId = useActiveThemeId();
  const loadError = useLibraryError();
  // Rascunho aberto no editor e como ele estava ao abrir (para saber se mudou).
  const [draft, setDraft] = useState<BoardTheme | null>(null);
  const [opened, setOpened] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const dirty = !!draft && JSON.stringify(draft) !== opened;
  const guard = useLeaveGuard(dirty);

  const mineCount = themes?.filter((t) => t.mine).length ?? 0;
  const isNew = !!draft && !themes?.some((t) => t.theme.id === draft.id);

  function open(theme: BoardTheme) {
    if (dirty && !confirm('Descartar as alterações do tema aberto?')) return;
    setDraft(theme);
    setOpened(JSON.stringify(theme));
    setSaveError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function close() {
    setDraft(null);
    setOpened(null);
    setSaveError(null);
  }

  /** Envia a imagem nova (se houver) e grava o tema. Resolve `true` se deu certo. */
  async function save(): Promise<boolean> {
    if (!draft || saving) return false;
    setSaving(true);
    setSaveError(null);
    try {
      const wallpaper = draft.wallpaper?.startsWith('data:') ? await uploadWallpaper(draft.wallpaper) : draft.wallpaper;
      const theme = { ...draft, name: draft.name.trim() || 'Tema sem nome', wallpaper };
      if (!(await themeActions.save(theme))) return false;
      close();
      return true;
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Não foi possível salvar o tema.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function copy(item: ThemeItem) {
    const { theme } = item;
    open({
      ...newTheme(`Cópia de ${theme.name}`.slice(0, THEME_LIMITS.nameLength)),
      palette: theme.palette,
      wallpaper: theme.wallpaper,
      tile: theme.tile,
      dim: theme.dim,
      arenaDim: theme.arenaDim,
      blur: theme.blur,
    });
  }

  async function remove(theme: BoardTheme) {
    if (!confirm(`Excluir o tema "${theme.name}"? Quem estiver usando volta para o fundo padrão.`)) return;
    if (draft?.id === theme.id) close();
    await themeActions.remove(theme.id);
  }

  const btn = 'rounded-lg px-3 py-1.5 text-sm ring-1 ring-border hover:bg-surface-2 disabled:opacity-50';

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Temas da arena</h1>
          <p className="text-sm text-muted">
            Escolha um padrão de cores e uma imagem de fundo. Os temas ficam disponíveis para todos os jogadores; o tema em
            uso é só seu e o oponente vê o dele.
          </p>
        </div>
        <button
          type="button"
          onClick={() => open(newTheme())}
          disabled={!themes || mineCount >= THEME_LIMITS.themes}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong disabled:opacity-50"
        >
          + Novo tema
        </button>
      </div>

      {loadError && <p className="text-sm text-danger">Não foi possível carregar da nuvem: {loadError}</p>}

      {draft && (
        <ThemeEditor
          draft={draft}
          onChange={setDraft}
          onSave={() => void save()}
          onCancel={() => {
            if (!dirty || confirm('Descartar as alterações?')) close();
          }}
          saving={saving}
          error={saveError}
          isNew={isNew}
        />
      )}

      {!themes ? (
        <p className="text-muted">Carregando os temas…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ThemeCard
            name="Padrão"
            subtitle="Fundo padrão, paleta Lilás"
            theme={null}
            active={activeId === null}
            onUse={() => void themeActions.use(null)}
          />
          {themes.map((item) => (
            <ThemeCard
              key={item.theme.id}
              name={item.theme.name}
              subtitle={`${PALETTES[item.theme.palette].name} · ${item.mine ? 'seu' : item.author ? `por ${item.author}` : 'de outro jogador'}`}
              theme={item.theme}
              active={activeId === item.theme.id}
              onUse={() => void themeActions.use(item.theme.id)}
            >
              <Link href={`/arena?tema=${item.theme.id}`} className={btn}>
                Ver na arena
              </Link>
              {item.mine ? (
                <>
                  <button type="button" onClick={() => open(item.theme)} className={btn}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(item.theme)}
                    className="rounded-lg px-3 py-1.5 text-sm text-danger ring-1 ring-danger/40 hover:bg-danger/10"
                  >
                    Excluir
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => copy(item)} disabled={mineCount >= THEME_LIMITS.themes} className={btn}>
                  Criar cópia
                </button>
              )}
            </ThemeCard>
          ))}
        </ul>
      )}

      <UnsavedChangesDialog
        open={guard.pending}
        message="Você alterou este tema. Quer salvar antes de sair?"
        onSave={() => {
          void save().then((ok) => (ok ? guard.proceed() : guard.cancel()));
        }}
        onDiscard={guard.proceed}
        onCancel={guard.cancel}
      />
    </div>
  );
}

function ThemeCard({
  name,
  subtitle,
  theme,
  active,
  onUse,
  children,
}: {
  name: string;
  subtitle: string;
  theme: BoardTheme | null;
  active: boolean;
  onUse: () => void;
  children?: React.ReactNode;
}) {
  return (
    <li
      className={`flex flex-col gap-3 rounded-xl border bg-surface p-3 ${active ? 'border-accent' : 'border-border'}`}
    >
      <ThemePreview theme={theme} />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate font-semibold">{name}</h2>
          <p className="truncate text-xs text-muted">{subtitle}</p>
        </div>
        {active ? (
          <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">Em uso</span>
        ) : (
          <button
            type="button"
            onClick={onUse}
            className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong"
          >
            Usar
          </button>
        )}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </li>
  );
}
