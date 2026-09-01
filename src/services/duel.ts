import { supabase } from '../lib/supabase';

export interface DuelMatch {
  id: string;
  status: 'waiting' | 'active' | 'finished';
  question_ids: string[];
  p1_id: string;
  p1_name: string;
  p1_score: number;
  p1_answered: number;
  p1_done: boolean;
  p2_id: string | null;
  p2_name: string | null;
  p2_score: number;
  p2_answered: number;
  p2_done: boolean;
  created_at: string;
  started_at: string | null;
}

const PLAYER_KEY = 'imagem-p7:duel-player-id';
const NAME_KEY = 'imagem-p7:duel-player-name';

/** Id anônimo estável por navegador — o duelo não exige login. */
export function getPlayerId(): string {
  try {
    const existente = localStorage.getItem(PLAYER_KEY);
    if (existente) return existente;
    const novo = `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem(PLAYER_KEY, novo);
    return novo;
  } catch {
    // navegação privada / storage bloqueado: id efêmero da sessão
    return `p_${Math.random().toString(36).slice(2)}`;
  }
}

export function getSavedName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveName(nome: string): void {
  try {
    localStorage.setItem(NAME_KEY, nome);
  } catch {
    /* storage indisponível — segue sem persistir */
  }
}

/** Entra na fila: pareia com quem está esperando ou abre uma sala nova. */
export async function findDuel(nome: string): Promise<DuelMatch> {
  const { data, error } = await supabase.rpc('find_duel', {
    p_id: getPlayerId(),
    p_name: nome,
    p_questions: [],
  });
  if (error) throw error;
  return data as unknown as DuelMatch;
}

export async function submitScore(
  matchId: string,
  score: number,
  answered: number,
  done: boolean
): Promise<DuelMatch | null> {
  const { data, error } = await supabase.rpc('submit_duel_score', {
    p_match: matchId,
    p_id: getPlayerId(),
    p_score: score,
    p_answered: answered,
    p_done: done,
  });
  if (error) throw error;
  return (data as unknown as DuelMatch) ?? null;
}

export async function cancelDuel(matchId: string): Promise<void> {
  await supabase.rpc('cancel_duel', { p_match: matchId, p_id: getPlayerId() });
}

export async function fetchMatch(matchId: string): Promise<DuelMatch | null> {
  const { data } = await supabase.from('duel_matches').select('*').eq('id', matchId).maybeSingle();
  return (data as unknown as DuelMatch) ?? null;
}

/**
 * Assina as mudanças da partida. Realtime é o caminho normal; o polling de
 * 3 s é a rede de segurança para quando o websocket cai ou é bloqueado —
 * sem ele o jogador poderia ficar preso na tela de espera para sempre.
 */
export function watchMatch(matchId: string, onChange: (m: DuelMatch) => void): () => void {
  const canal = supabase
    .channel(`duel:${matchId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'duel_matches', filter: `id=eq.${matchId}` },
      (payload) => onChange(payload.new as DuelMatch)
    )
    .subscribe();

  const intervalo = setInterval(async () => {
    const m = await fetchMatch(matchId);
    if (m) onChange(m);
  }, 3000);

  return () => {
    clearInterval(intervalo);
    supabase.removeChannel(canal);
  };
}

/** true se este navegador é o jogador 1 da partida. */
export function isPlayerOne(m: DuelMatch): boolean {
  return m.p1_id === getPlayerId();
}

export function myScore(m: DuelMatch): number {
  return isPlayerOne(m) ? m.p1_score : m.p2_score;
}

export function opponentScore(m: DuelMatch): number {
  return isPlayerOne(m) ? m.p2_score : m.p1_score;
}

export function opponentName(m: DuelMatch): string {
  const nome = isPlayerOne(m) ? m.p2_name : m.p1_name;
  return nome ?? 'Oponente';
}

export function opponentAnswered(m: DuelMatch): number {
  return isPlayerOne(m) ? m.p2_answered : m.p1_answered;
}

export function opponentDone(m: DuelMatch): boolean {
  return isPlayerOne(m) ? m.p2_done : m.p1_done;
}
