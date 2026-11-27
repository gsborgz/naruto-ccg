import type { NextRequest } from 'next/server';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';
import { getNickname, setNickname } from '@/lib/profile/store';
import { parseNickname } from '@/lib/rooms/model';

/**
 * Apelido do jogador (`{ nickname }`), trocado a qualquer momento pelo campo do cabeçalho. Vale nas salas novas e como
 * criador dos temas, sleeves e cartas; nas salas em que ele está, o navegador manda também a jogada `rename`.
 */
/** O apelido gravado na conta (vazio se ainda não tem). */
export async function GET(request: NextRequest) {
  try {
    return json({ nickname: await getNickname(playerOf(request)) });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const { nickname } = await readBody(request);
    const name = parseNickname(nickname);
    if (!name) throw new PlayerError(400, 'Apelido inválido (1 a 24 caracteres).');
    await setNickname(owner, name);
    return json({ nickname: name });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
