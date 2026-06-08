import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, BarChart2, Home } from 'lucide-react';
import { useAppStore } from '../store';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { ProgressRing } from '../components/ProgressRing';
import { formatDuration } from '../utils/stats';

export function Resultado() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { getSessionById } = useAppStore();

  const session = sessionId ? getSessionById(sessionId) : undefined;

  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-brand-muted">
        Sessão não encontrada.{' '}
        <button onClick={() => navigate('/')} className="text-brand-accent underline">
          Voltar ao início
        </button>
      </div>
    );
  }

  const topic = TOPICS.find((t) => t.id === session.topicId);
  const correct = session.answers.filter((a) => a.correct).length;
  const total = session.answers.length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const start = new Date(session.startedAt).getTime();
  const end = session.finishedAt ? new Date(session.finishedAt).getTime() : Date.now();
  const duration = Math.round((end - start) / 1000);

  const color =
    accuracy >= 80 ? '#14B8A6' : accuracy >= 60 ? '#F59E0B' : '#EF4444';
  const label =
    accuracy >= 80 ? 'Excelente!' : accuracy >= 60 ? 'Bom trabalho!' : 'Continue praticando!';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-surface border border-brand-border rounded-2xl p-8 flex flex-col items-center gap-4"
        style={{ borderColor: `${color}33` }}
      >
        <ProgressRing
          value={accuracy}
          max={100}
          size={140}
          strokeWidth={10}
          color={color}
          label={`${correct}/${total}`}
          sublabel="acertos"
        />
        <div className="text-center">
          <p className="font-display font-700 text-2xl" style={{ color }}>
            {label}
          </p>
          <p className="text-brand-muted text-sm mt-1">
            {accuracy.toFixed(0)}% de acerto · {topic?.title} · {formatDuration(duration)}
          </p>
        </div>

        <div className="flex gap-3 w-full flex-wrap justify-center">
          <button
            onClick={() => navigate(`/quiz/${session.topicId}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text text-sm font-semibold transition-all"
          >
            <RefreshCw size={14} /> Refazer Quiz
          </button>
          <button
            onClick={() => navigate('/desempenho')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-sm font-semibold transition-all hover:bg-brand-accent/30"
          >
            <BarChart2 size={14} /> Ver Desempenho
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text text-sm font-semibold transition-all"
          >
            <Home size={14} /> Início
          </button>
        </div>
      </motion.div>

      {/* Revisão */}
      <div>
        <h2 className="font-display font-600 text-lg text-brand-text mb-3">Revisão das questões</h2>
        <div className="space-y-3">
          {session.answers.map((answer, i) => {
            const q = QUESTIONS.find((q) => q.id === answer.questionId);
            if (!q) return null;
            const chosenOpt = q.options.find((o) => o.id === answer.chosen);
            const correctOpt = q.options.find((o) => o.id === q.correctAnswer);
            return (
              <motion.div
                key={answer.questionId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-brand-surface border border-brand-border rounded-xl p-4 flex gap-3"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {answer.correct ? (
                    <CheckCircle2 size={18} className="text-brand-teal" />
                  ) : (
                    <XCircle size={18} className="text-brand-red" />
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-brand-text text-sm line-clamp-2">{q.text}</p>
                  {!answer.correct && (
                    <p className="text-brand-muted text-xs">
                      Sua resposta:{' '}
                      <span className="text-brand-red">
                        {answer.chosen}. {chosenOpt?.text}
                      </span>
                    </p>
                  )}
                  <p className="text-brand-muted text-xs">
                    Gabarito:{' '}
                    <span className="text-brand-teal">
                      {q.correctAnswer}. {correctOpt?.text}
                    </span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
