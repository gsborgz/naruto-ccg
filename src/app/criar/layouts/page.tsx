import { LayoutEditor } from '@/components/cardMaker/LayoutEditor';

/**
 * Editor dos layouts e dos ícones do criador (`/criar/layouts`): grava no conteúdo do jogo (Redis e Vercel Blob) pelas
 * rotas de `/api/content/`, valendo para todo mundo na hora, sem deploy. Protegido pela senha do site, como o resto.
 */
export default function LayoutEditorPage() {
  return <LayoutEditor />;
}
