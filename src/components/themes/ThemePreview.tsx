import { themeVars, type BoardTheme } from '@/lib/themes/types';
import styles from './ThemePreview.module.css';

/**
 * Miniatura da arena com o tema (a imagem de fundo pode ainda ser um data URL, antes de salvar): mostra a paleta nas
 * costas das cartas, no botão, nos brilhos e na sua linha, e a imagem sob o vidro das zonas e o véu do Campo de Batalha.
 */
export function ThemePreview({ theme, className }: { theme: BoardTheme | null; className?: string }) {
  const style = themeVars(theme) as React.CSSProperties;
  const pips = (on: number) => (
    <div className={styles.pips}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className={`${styles.pip} ${i < on ? styles.pipOn : ''}`} />
      ))}
    </div>
  );
  const row = (mine: boolean) => (
    <div className={`${styles.abs} ${styles.row} ${mine ? styles.rowMine : styles.rowOpp}`}>
      {/* Na linha do jogador a ordem é invertida (row-reverse): Deck, Descarte, Chakra, Vila e Prêmios. */}
      <div className={`${styles.zone} ${styles.reward}`}>
        <span className={styles.zoneLabel}>PRÊMIOS</span>
        <span className={styles.back}>忍</span>
        <span className={styles.count}>{mine ? 4 : 2}</span>
      </div>
      <div className={`${styles.zone} ${styles.village}`}>
        <span className={styles.zoneLabel}>VILA</span>
        {Array.from({ length: mine ? 4 : 3 }, (_, i) => (
          <span key={i} className={styles.card} />
        ))}
      </div>
      <div className={`${styles.zone} ${styles.chakra}`}>
        <span className={styles.zoneLabel}>CHAKRA</span>
        <span className={styles.back}>忍</span>
        <span className={styles.count}>{mine ? 5 : 3}</span>
      </div>
      <div className={`${styles.zone} ${styles.discard}`}>
        <span className={styles.zoneLabel}>DESCARTE</span>
        <span className={styles.card} />
      </div>
      <div className={`${styles.zone} ${styles.deck}`}>
        <span className={styles.zoneLabel}>DECK</span>
        <span className={styles.back}>忍</span>
      </div>
    </div>
  );
  return (
    <div className={`${styles.board} ${className ?? ''}`} style={style} aria-hidden>
      <div className={`${styles.abs} ${styles.rail}`}>
        <div className={styles.plate}>
          <strong>Oponente</strong>
          {pips(2)}
        </div>
        <div className={styles.turn}>
          <span className={styles.turnLabel}>TURNO</span>
          <span className={styles.turnNumber}>5</span>
          <span className={styles.button}>Passar turno</span>
        </div>
        <div className={`${styles.plate} ${styles.plateMine}`}>
          {pips(4)}
          <strong>Você</strong>
        </div>
      </div>
      {row(false)}
      <div className={`${styles.abs} ${styles.arena}`}>
        <div className={styles.arenaInner}>
          <div className={`${styles.team} ${styles.teamOpp}`}>
            <span className={styles.card} />
            <span className={styles.card} />
          </div>
          <span className={styles.line} />
          <span className={styles.pill}>番 SUA VEZ</span>
          <div className={`${styles.team} ${styles.teamMine}`}>
            <span className={`${styles.card} ${styles.leader}`} />
            <span className={styles.card} />
          </div>
        </div>
      </div>
      {row(true)}
      <div className={`${styles.abs} ${styles.hand}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={`${styles.card} ${i === 2 ? styles.hover : ''}`} />
        ))}
      </div>
    </div>
  );
}
