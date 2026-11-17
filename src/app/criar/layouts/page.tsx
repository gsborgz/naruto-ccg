import { notFound } from 'next/navigation';
import { LayoutEditor } from '@/components/cardMaker/LayoutEditor';

/**
 * Editor dos layouts e dos ícones do criador (`/criar/layouts`). Só em desenvolvimento (`next dev`): grava nos
 * arquivos de src/lib/cardMaker/ pela rota `/api/dev/card-config`. Fora dele, 404. Sem link no app.
 */
export default function LayoutEditorPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <LayoutEditor />;
}
