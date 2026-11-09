'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Card } from '@/models/card';
import type { CardLanguage, CardTranslations, LocalizedCardText } from '@/models/cardTranslation';
import { localizeCard } from './cardLocale';

/** Preferência por navegador (não vai para o servidor nem para os decks compartilhados). */
const STORAGE_KEY = 'naruto-ccg:card-language';

interface CardLanguageContextValue {
  language: CardLanguage;
  setLanguage: (language: CardLanguage) => void;
  /** Traduções PT-BR; `null` enquanto não foram carregadas (ou com o idioma em inglês). */
  translations: CardTranslations | null;
}

const CardLanguageContext = createContext<CardLanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  translations: null,
});

export function CardLanguageProvider({ children }: { children: React.ReactNode }) {
  // Começa em inglês para o HTML do servidor bater com o do navegador; a preferência vem logo depois.
  const [language, setLanguageState] = useState<CardLanguage>('en');
  const [translations, setTranslations] = useState<CardTranslations | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'pt-BR') setLanguageState('pt-BR');
    } catch {
      // localStorage indisponível: fica em inglês.
    }
  }, []);

  // As traduções (~1 MB quando todas as coleções estiverem prontas) só são baixadas se o PT-BR for escolhido.
  useEffect(() => {
    if (language !== 'pt-BR' || translations) return;
    let cancelled = false;
    import('@/data/ptbr').then((m) => {
      if (!cancelled) setTranslations(m.CARD_TRANSLATIONS_PTBR);
    });
    return () => {
      cancelled = true;
    };
  }, [language, translations]);

  const setLanguage = useCallback((next: CardLanguage) => {
    setLanguageState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem persistência; a escolha vale até recarregar a página.
    }
  }, []);

  const value = useMemo(() => ({ language, setLanguage, translations }), [language, setLanguage, translations]);
  return <CardLanguageContext.Provider value={value}>{children}</CardLanguageContext.Provider>;
}

export function useCardLanguage(): CardLanguageContextValue {
  return useContext(CardLanguageContext);
}

/** Textos da carta no idioma escolhido pelo jogador. */
export function useLocalizedCard(card: Card): LocalizedCardText {
  const { language, translations } = useCardLanguage();
  return useMemo(() => localizeCard(card, language, translations), [card, language, translations]);
}
