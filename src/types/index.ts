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

export interface QuestionImage {
  type: 'drive' | 'url';
  src: string;
  caption?: string;
  showAfterAnswer?: boolean;
}

export interface Question {
  id: string;
  topicId: string;
  text: string;
  options: {
    id: AnswerOption;
    text: string;
    /** Justificativa da alternativa — por que está certa ou por que está errada.
     *  Exibida após a resposta, no bloco de revisão alternativa a alternativa. */
    rationale?: string;
  }[];
  correctAnswer: AnswerOption;
  explanation?: string;
  imageUrl?: string;
  image?: QuestionImage;
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
