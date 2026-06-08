import type { QuizSession, Question, TagStat, SessionSummary } from '../types';
import type { Topic } from '../types';

export function calcAccuracy(sessions: QuizSession[], topicId?: string): number {
  const filtered = topicId ? sessions.filter((s) => s.topicId === topicId) : sessions;
  const answers = filtered.flatMap((s) => s.answers);
  if (answers.length === 0) return 0;
  const correct = answers.filter((a) => a.correct).length;
  return (correct / answers.length) * 100;
}

export function calcStreak(sessions: QuizSession[]): number {
  if (sessions.length === 0) return 0;

  const finishedSessions = sessions.filter((s) => s.finishedAt);
  if (finishedSessions.length === 0) return 0;

  const days = new Set(
    finishedSessions.map((s) => {
      const d = new Date(s.finishedAt!);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const sortedDays = Array.from(days).sort().reverse();
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sortedDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const key = `${expected.getFullYear()}-${expected.getMonth()}-${expected.getDate()}`;
    if (sortedDays.includes(key)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function getWeakTags(sessions: QuizSession[], questions: Question[]): TagStat[] {
  const tagMap: Map<string, { total: number; correct: number }> = new Map();

  for (const session of sessions) {
    for (const answer of session.answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      for (const tag of question.tags) {
        const existing = tagMap.get(tag) ?? { total: 0, correct: 0 };
        tagMap.set(tag, {
          total: existing.total + 1,
          correct: existing.correct + (answer.correct ? 1 : 0),
        });
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, { total, correct }]) => ({
      tag,
      total,
      correct,
      accuracy: (correct / total) * 100,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

export function getSessionHistory(sessions: QuizSession[], topics: Topic[]): SessionSummary[] {
  return sessions
    .filter((s) => s.finishedAt)
    .map((s) => {
      const topic = topics.find((t) => t.id === s.topicId);
      const correct = s.answers.filter((a) => a.correct).length;
      const total = s.answers.length;
      const start = new Date(s.startedAt).getTime();
      const end = new Date(s.finishedAt!).getTime();
      return {
        sessionId: s.id,
        topicId: s.topicId,
        topicTitle: topic?.title ?? s.topicId,
        date: s.finishedAt!,
        totalQuestions: total,
        correctAnswers: correct,
        accuracy: total > 0 ? (correct / total) * 100 : 0,
        durationSeconds: Math.round((end - start) / 1000),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBestTopic(sessions: QuizSession[], topics: Topic[]): string | null {
  if (sessions.length === 0) return null;

  const topicAccuracy: Map<string, { total: number; correct: number }> = new Map();

  for (const session of sessions) {
    const existing = topicAccuracy.get(session.topicId) ?? { total: 0, correct: 0 };
    const correct = session.answers.filter((a) => a.correct).length;
    topicAccuracy.set(session.topicId, {
      total: existing.total + session.answers.length,
      correct: existing.correct + correct,
    });
  }

  let bestId: string | null = null;
  let bestAcc = -1;

  for (const [id, { total, correct }] of topicAccuracy.entries()) {
    if (total < 3) continue;
    const acc = (correct / total) * 100;
    if (acc > bestAcc) {
      bestAcc = acc;
      bestId = id;
    }
  }

  if (!bestId) return null;
  return topics.find((t) => t.id === bestId)?.title ?? bestId;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
