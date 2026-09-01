import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Loader2, Trophy, Zap, X, CheckCircle2, XCircle, Users } from 'lucide-react';
import {
  DUEL_QUESTION_COUNT,
  DUEL_SECONDS_PER_QUESTION,
  drawDuelQuestions,
  scoreAnswer,
  type DuelQuestion,
} from '../data/duelQuestions';
import {
  findDuel, submitScore, cancelDuel, watchMatch,
  getSavedName, saveName, opponentName, opponentScore,
  opponentAnswered, opponentDone, myScore,
  type DuelMatch,
} from '../services/duel';
import type { AnswerOption } from '../types';

type Fase = 'lobby' | 'buscando' | 'jogando' | 'aguardando' | 'fim';

const COR = '#F43F5E';

export function Duelo() {
  const navigate = useNavigate();

  const [fase, setFase] = useState<Fase>('lobby');
  const [nome, setNome] = useState(getSavedName());
  const [erro, setErro] = useState<string | null>(null);
  const [match, setMatch] = useState<DuelMatch | null>(null);
  const [perguntas, setPerguntas] = useState<DuelQuestion[]>([]);

  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<AnswerOption | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [ganhoUltimo, setGanhoUltimo] = useState(0);
  const [restante, setRestante] = useState(DUEL_SECONDS_PER_QUESTION);

  const inicioRef = useRef<number>(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unwatchRef = useRef<(() => void) | null>(null);
  const pontosRef = useRef(0);

  const limpar = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    unwatchRef.current?.();
    unwatchRef.current = null;
  }, []);

  useEffect(() => limpar, [limpar]);

  // ── Matchmaking ───────────────────────────
  async function procurar() {
    const limpo = nome.trim();
    if (!limpo) { setErro('Escolha um nome para aparecer no placar.'); return; }
    saveName(limpo);
    setErro(null);
    setFase('buscando');
    try {
      const m = await findDuel(limpo);
      setMatch(m);
      if (m.status === 'active') {
        comecar(m);
      } else {
        unwatchRef.current = watchMatch(m.id, (novo) => {
          setMatch(novo);
          if (novo.status === 'active') { unwatchRef.current?.(); unwatchRef.current = null; comecar(novo); }
        });
      }
    } catch (e) {
      setErro('Não foi possível conectar ao servidor do duelo. Tente de novo.');
      setFase('lobby');
    }
  }

  async function cancelar() {
    limpar();
    if (match) await cancelDuel(match.id).catch(() => {});
    setMatch(null);
    setFase('lobby');
  }

  // ── Partida ───────────────────────────────
  function comecar(m: DuelMatch) {
    setPerguntas(drawDuelQuestions(DUEL_QUESTION_COUNT, m.id));
    setIdx(0); setPontos(0); pontosRef.current = 0;
    setEscolha(null); setRevelado(false); setGanhoUltimo(0);
    setFase('jogando');
    // acompanha o placar do oponente durante a partida
    unwatchRef.current = watchMatch(m.id, setMatch);
    iniciarRodada();
  }

  function iniciarRodada() {
    inicioRef.current = Date.now();
    setRestante(DUEL_SECONDS_PER_QUESTION);
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      const passado = (Date.now() - inicioRef.current) / 1000;
      const falta = Math.max(0, DUEL_SECONDS_PER_QUESTION - passado);
      setRestante(falta);
      if (falta <= 0) { if (tickRef.current) clearInterval(tickRef.current); responder(null); }
    }, 100);
  }

  function responder(op: AnswerOption | null) {
    if (revelado) return;
    if (tickRef.current) clearInterval(tickRef.current);
    const decorrido = Date.now() - inicioRef.current;
    const q = perguntas[idx];
    const acertou = op !== null && op === q.correctAnswer;
    const ganho = scoreAnswer(acertou, decorrido);

    setEscolha(op);
    setRevelado(true);
    setGanhoUltimo(ganho);
    const total = pontosRef.current + ganho;
    pontosRef.current = total;
    setPontos(total);

    const ultima = idx + 1 >= DUEL_QUESTION_COUNT;
    if (match) submitScore(match.id, total, idx + 1, ultima).catch(() => {});
    setTimeout(() => avancar(ultima), 1600);
  }

  function avancar(ultima: boolean) {
    if (ultima) {
      setFase(match && opponentDone(match) ? 'fim' : 'aguardando');
      return;
    }
    setIdx((i) => i + 1);
    setEscolha(null); setRevelado(false); setGanhoUltimo(0);
    iniciarRodada();
  }

  // sai da espera assim que o oponente termina
  useEffect(() => {
    if (fase === 'aguardando' && match && opponentDone(match)) setFase('fim');
  }, [fase, match]);

  function jogarNovamente() {
    limpar();
    setMatch(null); setPerguntas([]);
    setIdx(0); setPontos(0); pontosRef.current = 0;
    setEscolha(null); setRevelado(false);
    setFase('lobby');
  }

  // ── Telas ─────────────────────────────────
  const Moldura = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-lg mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-brand-surface border rounded-2xl p-8 space-y-5 text-center"
        style={{ borderColor: `${COR}33` }}
      >
        {children}
      </motion.div>
    </div>
  );

  if (fase === 'lobby') {
    return (
      <Moldura>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
             style={{ background: `${COR}22` }}>
          <Swords size={32} style={{ color: COR }} />
        </div>
        <h1 className="font-display font-700 text-2xl text-brand-text">Duelo</h1>
        <p className="text-brand-muted text-sm">
          {DUEL_QUESTION_COUNT} perguntas diretas · {DUEL_SECONDS_PER_QUESTION}s cada.
          Quem acerta mais rápido pontua mais.
        </p>
        <div className="text-left space-y-1.5">
          <label className="text-brand-muted text-xs uppercase tracking-wider">Seu nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value.slice(0, 18))}
            onKeyDown={(e) => e.key === 'Enter' && procurar()}
            placeholder="Como aparecer no placar"
            className="w-full px-4 py-2.5 rounded-xl bg-brand-bg border border-brand-border text-brand-text text-sm outline-none focus:border-brand-accent transition-colors"
          />
        </div>
        {erro && <p className="text-brand-red text-xs">{erro}</p>}
        <button
          onClick={procurar}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: COR }}
        >
          <Users size={16} /> Procurar oponente
        </button>
        <button onClick={() => navigate('/')}
                className="w-full py-2 text-brand-muted text-sm hover:text-brand-text transition-colors">
          Voltar
        </button>
      </Moldura>
    );
  }

  if (fase === 'buscando') {
    return (
      <Moldura>
        <Loader2 size={40} className="animate-spin mx-auto" style={{ color: COR }} />
        <h1 className="font-display font-700 text-xl text-brand-text">Procurando oponente…</h1>
        <p className="text-brand-muted text-sm">
          Deixe esta tela aberta. Assim que outra pessoa entrar na fila, o duelo começa sozinho.
        </p>
        <p className="text-brand-muted text-xs">
          Sem ninguém por perto? Abra o site em outro aparelho e entre na fila também.
        </p>
        <button onClick={cancelar}
                className="w-full py-2 text-brand-muted text-sm hover:text-brand-text transition-colors flex items-center justify-center gap-1.5">
          <X size={14} /> Cancelar busca
        </button>
      </Moldura>
    );
  }

  if (fase === 'aguardando') {
    return (
      <Moldura>
        <Loader2 size={36} className="animate-spin mx-auto" style={{ color: COR }} />
        <h1 className="font-display font-700 text-xl text-brand-text">Você terminou!</h1>
        <p className="text-3xl font-display font-700" style={{ color: COR }}>{pontos} pts</p>
        <p className="text-brand-muted text-sm">
          Aguardando {match ? opponentName(match) : 'o oponente'} concluir
          {match ? ` (${opponentAnswered(match)}/${DUEL_QUESTION_COUNT})` : ''}…
        </p>
        <button onClick={() => setFase('fim')}
                className="w-full py-2 text-brand-muted text-sm hover:text-brand-text transition-colors">
          Ver placar parcial
        </button>
      </Moldura>
    );
  }

  if (fase === 'fim' && match) {
    const meu = Math.max(pontos, myScore(match));
    const dele = opponentScore(match);
    const venceu = meu > dele;
    const empate = meu === dele;
    return (
      <Moldura>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
             style={{ background: `${COR}22` }}>
          <Trophy size={32} style={{ color: venceu ? '#F59E0B' : COR }} />
        </div>
        <h1 className="font-display font-700 text-2xl text-brand-text">
          {empate ? 'Empate!' : venceu ? 'Você venceu!' : 'Você perdeu'}
        </h1>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="rounded-xl border p-4" style={{ borderColor: `${COR}55`, background: `${COR}11` }}>
            <p className="text-brand-muted text-xs truncate">Você</p>
            <p className="font-display font-700 text-2xl text-brand-text">{meu}</p>
          </div>
          <div className="rounded-xl border border-brand-border p-4">
            <p className="text-brand-muted text-xs truncate">{opponentName(match)}</p>
            <p className="font-display font-700 text-2xl text-brand-text">{dele}</p>
          </div>
        </div>
        {!opponentDone(match) && (
          <p className="text-brand-muted text-xs">
            O oponente ainda está jogando — o placar dele pode subir.
          </p>
        )}
        <button onClick={jogarNovamente}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ background: COR }}>
          Jogar de novo
        </button>
        <button onClick={() => navigate('/')}
                className="w-full py-2 text-brand-muted text-sm hover:text-brand-text transition-colors">
          Voltar ao dashboard
        </button>
      </Moldura>
    );
  }

  // ── Jogando ───────────────────────────────
  const q = perguntas[idx];
  if (!q) return null;
  const pctTempo = (restante / DUEL_SECONDS_PER_QUESTION) * 100;
  const urgente = restante <= 5;

  function classeOpcao(id: AnswerOption): string {
    const base = 'w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 text-sm';
    if (!revelado) return `${base} border-brand-border bg-brand-surface hover:border-brand-accent/60 cursor-pointer`;
    if (id === q.correctAnswer) return `${base} border-brand-teal bg-brand-teal/10 text-brand-teal`;
    if (id === escolha) return `${base} border-brand-red bg-brand-red/10 text-brand-red`;
    return `${base} border-brand-border bg-brand-surface text-brand-muted`;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      {/* Placar ao vivo */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-display font-700 text-lg" style={{ color: COR }}>{pontos}</span>
          <span className="text-brand-muted text-xs">você</span>
        </div>
        <span className="text-brand-muted text-xs">{idx + 1} / {DUEL_QUESTION_COUNT}</span>
        <div className="flex items-center gap-2">
          <span className="text-brand-muted text-xs truncate max-w-[90px]">
            {match ? opponentName(match) : 'Oponente'}
          </span>
          <span className="font-display font-700 text-lg text-brand-muted">
            {match ? opponentScore(match) : 0}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: urgente ? '#EF4444' : COR }}
            animate={{ width: `${pctTempo}%` }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        </div>
        <p className={`text-right text-xs font-mono ${urgente ? 'text-brand-red' : 'text-brand-muted'}`}>
          {restante.toFixed(1)}s
        </p>
      </div>

      <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-surface border border-brand-border rounded-xl p-5">
        <p className="text-brand-text leading-relaxed">{q.text}</p>
      </motion.div>

      <div className="space-y-2">
        {q.options.map((o) => (
          <button key={o.id} onClick={() => responder(o.id)} disabled={revelado} className={classeOpcao(o.id)}>
            <span className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-mono"
                  style={{ borderColor: 'currentColor' }}>
              {o.id}
            </span>
            <span className="flex-1">{o.text}</span>
            {revelado && o.id === q.correctAnswer && <CheckCircle2 size={16} className="text-brand-teal" />}
            {revelado && o.id === escolha && o.id !== q.correctAnswer && <XCircle size={16} className="text-brand-red" />}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {revelado && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-xl border border-brand-border bg-brand-surface p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-muted">{q.fact}</span>
              {ganhoUltimo > 0 && (
                <span className="flex items-center gap-1 font-mono text-sm text-brand-teal flex-shrink-0 ml-2">
                  <Zap size={13} /> +{ganhoUltimo}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
