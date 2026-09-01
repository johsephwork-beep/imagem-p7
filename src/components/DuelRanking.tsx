import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Loader2, Swords } from 'lucide-react';
import { fetchRanking, getPlayerId, type DuelPlayer } from '../services/duel';

interface DuelRankingProps {
  /** Quantas linhas mostrar. */
  limite?: number;
  /** Recarrega quando este valor muda — usado após terminar um duelo. */
  chaveRecarga?: string | number;
  compacto?: boolean;
}

const MEDALHAS = ['#F59E0B', '#94A3B8', '#B45309'];

export function DuelRanking({ limite = 10, chaveRecarga, compacto = false }: DuelRankingProps) {
  const [linhas, setLinhas] = useState<DuelPlayer[] | null>(null);
  const eu = getPlayerId();

  useEffect(() => {
    let vivo = true;
    setLinhas(null);
    fetchRanking(limite).then((r) => { if (vivo) setLinhas(r); });
    return () => { vivo = false; };
  }, [limite, chaveRecarga]);

  if (linhas === null) {
    return (
      <div className="flex items-center justify-center py-10 text-brand-muted">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (linhas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-brand-muted">
        <Swords size={26} className="opacity-50" />
        <p className="text-sm">Nenhum duelo concluído ainda.</p>
        <p className="text-xs">O ranking aparece assim que a primeira disputa terminar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {linhas.map((p, i) => {
        const souEu = p.player_id === eu;
        const medalha = MEDALHAS[i];
        return (
          <motion.div
            key={p.player_id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              souEu ? 'bg-brand-accent/5' : 'bg-brand-surface'
            }`}
            style={{ borderColor: souEu ? 'rgba(99,102,241,0.4)' : undefined }}
          >
            <span
              className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-mono font-semibold"
              style={
                medalha
                  ? { background: `${medalha}22`, color: medalha }
                  : { background: 'rgba(148,163,184,0.12)', color: '#94A3B8' }
              }
            >
              {i < 3 ? <Trophy size={13} /> : i + 1}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-brand-text text-sm truncate">
                {p.name}
                {souEu && <span className="text-brand-accent text-xs ml-1.5">· você</span>}
              </p>
              {!compacto && (
                <p className="text-brand-muted text-xs font-mono">
                  {p.wins}V · {p.losses}D{p.draws > 0 ? ` · ${p.draws}E` : ''} ·{' '}
                  {p.matches} {p.matches === 1 ? 'duelo' : 'duelos'}
                </p>
              )}
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-display font-700 text-brand-text text-sm">{p.wins}</p>
              <p className="text-brand-muted text-[10px] uppercase tracking-wider">
                {p.wins === 1 ? 'vitória' : 'vitórias'}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
