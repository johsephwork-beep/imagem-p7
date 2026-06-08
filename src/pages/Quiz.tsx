import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { useAppStore } from '../store';
import type { AnswerOption } from '../types';
import { QuestionCard } from '../components/QuestionCard';

export function Quiz() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const {
    sessionQuestionIds,
    startSession,
    answerQuestion,
    finishSession,
  } = useAppStore();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const topic = TOPICS.find((t) => t.id === topicId);
  const questions = sessionQuestionIds.map((id) => QUESTIONS.find((q) => q.id === id)!).filter(Boolean);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleStart() {
    if (topicId) {
      startSession(topicId);
      setStarted(true);
      setCurrentIndex(0);
      setAnswered(false);
      setElapsed(0);
      questionStartRef.current = Date.now();
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
  }

  function handleAnswer(chosen: AnswerOption, correct: boolean) {
    if (!questions[currentIndex]) return;
    const spent = Math.round((Date.now() - questionStartRef.current) / 1000);
    answerQuestion(questions[currentIndex].id, chosen, correct, spent);
    setAnswered(true);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      const sessionId = finishSession();
      navigate(`/resultado/${sessionId}`);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setAnswered(false);
    questionStartRef.current = Date.now();
  }

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-brand-muted">
        Tópico não encontrado.
      </div>
    );
  }

  if (!started) {
    const topicQuestions = QUESTIONS.filter((q) => q.topicId === topicId);
    const count = Math.min(topicQuestions.length, 15);
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-surface border border-brand-border rounded-2xl p-8 space-y-4"
          style={{ borderColor: `${topic.color}33` }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: `${topic.color}22` }}
          >
            <CheckCircle2 size={32} style={{ color: topic.color }} />
          </div>
          <h1 className="font-display font-700 text-2xl text-brand-text">{topic.title}</h1>
          <p className="text-brand-muted text-sm">{topic.description}</p>
          <div className="flex items-center justify-center gap-4 text-sm text-brand-muted">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={14} /> {count} questões
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> Timer por questão
            </span>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: topic.color }}
          >
            Começar Quiz
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 text-brand-muted text-sm hover:text-brand-text transition-colors"
          >
            Voltar
          </button>
        </motion.div>
      </div>
    );
  }

  const current = questions[currentIndex];
  if (!current) return null;

  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Timer */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-brand-muted text-sm">{topic.title}</span>
        <span className="font-mono text-brand-muted text-sm flex items-center gap-1">
          <Clock size={13} /> {mins}:{secs}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <QuestionCard
          key={current.id}
          question={current}
          index={currentIndex}
          total={questions.length}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>

      {answered && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text font-semibold text-sm transition-all"
        >
          {currentIndex + 1 >= questions.length ? 'Ver resultado' : 'Próxima questão'}
          <ArrowRight size={15} />
        </motion.button>
      )}
    </div>
  );
}
