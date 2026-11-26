'use client';

/**
 * Tratamento de toda imagem enviada pelo jogador (as artes do criador de cartas e as imagens de fundo dos temas). A imagem é reduzida e
 * recomprimida antes de ser guardada no navegador ou enviada ao servidor, para o localStorage e o Blob não
 * acumularem arquivos pesados.
 */
export const IMAGE_LIMITS = {
  /** Lado maior: a altura da carta montada (750×1050), que basta para a tela e para imprimir em tamanho real. */
  maxSide: 1050,
  /** Peso máximo depois da compressão (o servidor aceita até `ART_MAX_BYTES`, com folga). */
  maxBytes: 300_000,
} as const;

/** Qualidades tentadas em ordem; depois, a imagem diminui de tamanho e tenta de novo. */
const QUALITIES = [0.85, 0.78, 0.7, 0.6, 0.5];
const SHRINK = 0.8;
const MAX_SHRINKS = 3;

/** Imagem de fundo dos temas da arena: a tela inteira (até Full HD), sob o desfoque e o escurecimento do tema. */
export const WALLPAPER_LIMITS = { maxSide: 1920, maxBytes: 380_000 } as const;

export class ImageTooLargeError extends Error {
  constructor(maxBytes: number = IMAGE_LIMITS.maxBytes) {
    super(`A imagem continua acima de ${Math.round(maxBytes / 1000)} KB mesmo comprimida. Use uma imagem menor ou mais simples.`);
  }
}

/** Bytes de um data URL em base64. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  return Math.floor((base64.length * 3) / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
}

/** A imagem já está tratada (WebP dentro dos limites de peso)? As dimensões são conferidas na compressão. */
export function isCompressed(dataUrl: string): boolean {
  return dataUrl.startsWith('data:image/webp;') && dataUrlBytes(dataUrl) <= IMAGE_LIMITS.maxBytes;
}

async function toBitmap(source: Blob | string): Promise<ImageBitmap> {
  const blob = typeof source === 'string' ? await (await fetch(source)).blob() : source;
  return createImageBitmap(blob);
}

/**
 * Reduz a imagem (lado maior até `maxSide`) e comprime em WebP, baixando a qualidade e, se preciso, o tamanho
 * até caber em `maxBytes` (por padrão, os de `IMAGE_LIMITS`). WebP guarda a transparência (arte da frente). Navegador sem WebP no canvas: JPEG para
 * imagens opacas, PNG para as transparentes. Lança `ImageTooLargeError` se não couber de jeito nenhum.
 */
export async function compressImage(
  source: Blob | string,
  {
    transparent = false,
    maxSide = IMAGE_LIMITS.maxSide,
    maxBytes = IMAGE_LIMITS.maxBytes,
  }: { transparent?: boolean; maxSide?: number; maxBytes?: number } = {},
): Promise<string> {
  const bitmap = await toBitmap(source);
  try {
    let scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    for (let shrink = 0; shrink <= MAX_SHRINKS; shrink++, scale *= SHRINK) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      for (const quality of QUALITIES) {
        let url = canvas.toDataURL('image/webp', quality);
        // Sem WebP, o navegador devolve PNG: para imagens opacas, JPEG fica bem menor.
        if (!url.startsWith('data:image/webp') && !transparent) url = canvas.toDataURL('image/jpeg', quality);
        if (dataUrlBytes(url) <= maxBytes) return url;
        if (url.startsWith('data:image/png')) break; // PNG não tem qualidade: só diminuir ajuda
      }
    }
  } finally {
    bitmap.close();
  }
  throw new ImageTooLargeError(maxBytes);
}
