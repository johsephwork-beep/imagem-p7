import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuizSession, SessionAnswer } from '../types';
import { QUESTIONS } from '../data/questions';
import { TOPICS } from '../data/topics';
import { calcStreak, getWeakTags, getBestTopic, getSessionHistory } from '../utils/stats';
import type { TopicStats, OverallStats, TagStat, SessionSummary } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AppStore {
  sessions: QuizSession[];
  currentSession: QuizSession | null;
  sessionQuestionIds: string[];

  startSession: (topicId: string) => void;
  answerQuestion: (questionId: string, chosen: string, correct: boolean, timeSpentSeconds: number) => void;
  finishSession: () => string;
  clearCurrentSession: () => void;

  getTopicStats: (topicId: string) => TopicStats;
  getOverallStats: () => OverallStats;
  getWeakTags: () => TagStat[];
  getSessionHistory: () => SessionSummary[];
  getSessionById: (id: string) => QuizSession | undefined;
}


export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      sessionQuestionIds: [],

      startSession: (topicId: string) => {
        const topicQuestions = QUESTIONS.filter((q) => q.topicId === topicId);

        const { sessions } = get();
        const answeredIds = new Set(
          sessions
            .filter((s) => s.topicId === topicId)
            .flatMap((s) => s.answers.map((a) => a.questionId))
        );

        // A sessão usa TODAS as questões do tópico — a contagem exibida no card
        // é a mesma que o quiz entrega. As ainda não respondidas vêm primeiro,
        // e cada grupo é embaralhado internamente.
        const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
        const unanswered = topicQuestions.filter((q) => !answeredIds.has(q.id));
        const alreadySeen = topicQuestions.filter((q) => answeredIds.has(q.id));
        const selected = [...shuffle(unanswered), ...shuffle(alreadySeen)];

        const session: QuizSession = {
          id: generateId(),
          topicId,
          startedAt: new Date().toISOString(),
          answers: [],
        };

        set({ currentSession: session, sessionQuestionIds: selected.map((q) => q.id) });
      },

      answerQuestion: (questionId, chosen, correct, timeSpentSeconds) => {
        const answer: SessionAnswer = { questionId, chosen, correct, timeSpentSeconds };
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              answers: [...state.currentSession.answers, answer],
            },
          };
        });
      },

      finishSession: () => {
        const { currentSession } = get();
        if (!currentSession) return '';
        const finished: QuizSession = {
          ...currentSession,
          finishedAt: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [...state.sessions, finished],
          currentSession: null,
          sessionQuestionIds: [],
        }));
        return finished.id;
      },

      clearCurrentSession: () => {
        set({ currentSession: null, sessionQuestionIds: [] });
      },

      getTopicStats: (topicId) => {
        const { sessions } = get();
        const topicSessions = sessions.filter((s) => s.topicId === topicId);
        const allAnswers = topicSessions.flatMap((s) => s.answers);
        const totalCorrect = allAnswers.filter((a) => a.correct).length;
        return {
          topicId,
          totalAnswered: allAnswers.length,
          totalCorrect,
          accuracy: allAnswers.length > 0 ? (totalCorrect / allAnswers.length) * 100 : 0,
        };
      },

      getOverallStats: () => {
        const { sessions } = get();
        const allAnswers = sessions.flatMap((s) => s.answers);
        const totalCorrect = allAnswers.filter((a) => a.correct).length;
        const accuracy = allAnswers.length > 0 ? (totalCorrect / allAnswers.length) * 100 : 0;
        const streak = calcStreak(sessions);
        const bestTopicId = getBestTopic(sessions, TOPICS);

        return {
          totalAnswered: allAnswers.length,
          totalCorrect,
          accuracy,
          streak,
          bestTopic: bestTopicId,
        };
      },

      getWeakTags: () => {
        const { sessions } = get();
        return getWeakTags(sessions, QUESTIONS);
      },

      getSessionHistory: () => {
        const { sessions } = get();
        return getSessionHistory(sessions, TOPICS);
      },

      getSessionById: (id) => {
        return get().sessions.find((s) => s.id === id);
      },
    }),
    {
      name: 'imagem-p7-store',
      partialize: (state) => ({
        sessions: state.sessions,
      }),
    }
  )
);
