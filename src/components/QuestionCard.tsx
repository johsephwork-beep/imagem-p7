import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, ZoomIn } from 'lucide-react';
import type { Question, AnswerOption } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { TopicBadge } from './TopicBadge';

type CardState = 'idle' | 'selected' | 'revealed';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  onAnswer: (chosen: AnswerOption, correct: boolean) => void;
}

export function QuestionCard({ question, index, total, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<AnswerOption | null>(null);
  const [state, setState] = useState<CardState>('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [imgZoomed, setImgZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleSelect(id: AnswerOption) {
    if (state !== 'idle') return;
    setSelected(id);
    setState('selected');
  }

  function handleConfirm() {
    if (!selected || state !== 'selected') return;
    setState('revealed');
    const correct = selected === question.correctAnswer;
    onAnswer(selected, correct);
  }

  function optionClass(id: AnswerOption): string {
    const base =
      'w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-start gap-3 cursor-pointer';
    if (state === 'idle') {
      return `${base} border-brand-border bg-brand-surface hover:border-brand-accent/50 hover:bg-brand-accent/5`;
    }
    if (state === 'selected') {
      if (id === selected) {
        return `${base} border-brand-accent bg-brand-accent/10 text-brand-text`;
      }
      return `${base} border-brand-border bg-brand-surface text-brand-muted cursor-not-allowed`;
    }
    // revealed
    if (id === question.correctAnswer) {
      return `${base} border-brand-teal bg-brand-teal/10 text-brand-teal`;
    }
    if (id === selected) {
      return `${base} border-brand-red bg-brand-red/10 text-brand-red`;
    }
    return `${base} border-brand-border bg-brand-surface text-brand-muted`;
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-brand-muted">
        <span>Questão {index + 1} de {total}</span>
        <div className="flex gap-1.5">
          <DifficultyBadge difficulty={question.difficulty} />
          <TopicBadge topicId={question.topicId} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-teal"
          initial={{ width: 0 }}
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question text */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
        <p className="text-brand-text leading-relaxed">{question.text}</p>
        {question.source && (
          <p className="text-brand-muted text-xs mt-3 font-mono">Fonte: {question.source}</p>
        )}
      </div>

      {/* Imagem do exame */}
      {question.imageUrl && !imgError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden border border-brand-border bg-black group cursor-zoom-in"
          style={{ borderColor: 'rgba(99,102,241,0.25)' }}
          onClick={() => setImgZoomed(true)}
        >
          <img
            src={question.imageUrl}
            alt="Exame de imagem radiológico"
            className="w-full object-contain max-h-72"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
          <p className="text-brand-muted text-xs text-center py-1.5 bg-brand-surface/80">
            Clique para ampliar · Fonte: Wikimedia Commons (CC)
          </p>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {imgZoomed && question.imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setImgZoomed(false)}
          >
            <motion.img
              src={question.imageUrl}
              alt="Exame de imagem ampliado"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={optionClass(opt.id)}
            disabled={state === 'revealed'}
          >
            <span
              className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-mono font-medium"
              style={{ borderColor: 'currentColor' }}
            >
              {opt.id}
            </span>
            <span className="flex-1 text-sm">{opt.text}</span>
            {state === 'revealed' && opt.id === question.correctAnswer && (
              <CheckCircle2 size={16} className="text-brand-teal flex-shrink-0" />
            )}
            {state === 'revealed' && opt.id === selected && opt.id !== question.correctAnswer && (
              <XCircle size={16} className="text-brand-red flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Confirm button */}
      {state === 'selected' && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-white font-semibold transition-colors"
        >
          Confirmar resposta
        </motion.button>
      )}

      {/* Explanation */}
      {state === 'revealed' && question.explanation && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => setShowExplanation((v) => !v)}
            className="flex items-center gap-2 text-brand-accent text-sm font-medium w-full py-2"
          >
            <ChevronDown
              size={16}
              className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`}
            />
            {showExplanation ? 'Ocultar comentário' : 'Ver comentário'}
          </button>
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-brand-surface border border-brand-accent/20 rounded-xl p-4 text-brand-text/90 text-sm leading-relaxed">
                  {question.explanation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tags */}
      {state === 'revealed' && (
        <div className="flex flex-wrap gap-1">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs font-mono bg-brand-border text-brand-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
