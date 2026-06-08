export type AnswerOption = 'A' | 'B' | 'C' | 'D' | 'E';
export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  driveFileId?: string;
}

export interface Question {
  id: string;
  topicId: string;
  text: string;
  options: {
    id: AnswerOption;
    text: string;
  }[];
  correctAnswer: AnswerOption;
  explanation?: string;
  imageUrl?: string;
  difficulty: Difficulty;
  tags: string[];
  source?: string;
}

export interface SessionAnswer {
  questionId: string;
  chosen: string;
  correct: boolean;
  timeSpentSeconds: number;
}

export interface QuizSession {
  id: string;
  topicId: string;
  startedAt: string;
  finishedAt?: string;
  answers: SessionAnswer[];
}

export interface TopicStats {
  topicId: string;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
}

export interface OverallStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  streak: number;
  bestTopic: string | null;
}

export interface TagStat {
  tag: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface SessionSummary {
  sessionId: string;
  topicId: string;
  topicTitle: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  durationSeconds: number;
}
