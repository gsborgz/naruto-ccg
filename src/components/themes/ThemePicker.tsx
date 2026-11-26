'use client';

import Link from 'next/link';
import { themeActions, useActiveThemeId, useThemes } from '@/lib/themes/client';

/**
 * Escolhe o tema da arena (fica fora da arena, no cabeçalho do site durante a partida, ou no menu ⋯ em tela cheia).
 * Lista os temas de todos os jogadores; a escolha é deste jogador (na conta dele) e o oponente continua com o dele.
 * O link leva à tela de cadastro (/temas).
 */
export function ThemePicker({ disabled }: { disabled?: boolean }) {
  const themes = useThemes();
  const active = useActiveThemeId();
  return (
    <span className="flex items-center gap-1 rounded-lg py-1 pl-3 pr-1 text-sm text-muted ring-1 ring-border">
      <label className="flex items-center gap-2" title="Tema da arena (só para você)">
        <span aria-hidden>🎨</span>
        <span className="sr-only">Tema da arena</span>
        <select
          value={active ?? ''}
          onChange={(e) => void themeActions.use(e.target.value || null)}
          disabled={disabled || !themes}
          className="max-w-44 rounded-md bg-bg px-2 py-1 text-text outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
        >
          <option value="">Padrão</option>
          {themes?.map(({ theme, author, mine }) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
              {!mine && author ? ` · ${author}` : ''}
            </option>
          ))}
        </select>
      </label>
      <Link
        href="/temas"
        className="rounded-md px-2 py-1 text-muted hover:bg-surface-2 hover:text-text"
        title="Cadastrar e editar temas"
      >
        Temas
      </Link>
    </span>
  );
}
