import { useState } from 'react';
import type { ElementType } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Activity, Zap, Circle, Layers, Bone,
  ExternalLink, BookOpen, FileText,
} from 'lucide-react';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import { DRIVE_FILES, getDrivePreviewUrl } from '../services/driveImages';
import { DifficultyBadge } from '../components/DifficultyBadge';
import type { Difficulty } from '../types';

const ICON_MAP: Record<string, ElementType> = {
  Brain, Activity, Zap, Circle, Layers, Bone,
};

const TOPIC_DRIVE_KEYS: Record<string, keyof typeof DRIVE_FILES> = {
  tce:     'TCE_PDF',
  ave:     'AVE_PDF',
  cefaleia:'CEFALEIA_PDF',
  parkinson:'PARKINSON_PPTX',
  em_sgb:  'QUIZ_CVCC_PPTX',
};

const DIFFICULTIES: Difficulty[] = ['facil', 'medio', 'dificil'];

export function Topicos() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterDiff, setFilterDiff] = useState<Difficulty | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-700 text-2xl text-brand-text"
        >
          Biblioteca de Tópicos
        </motion.h1>

        <div className="flex items-center gap-2">
          <span className="text-brand-muted text-xs">Filtrar:</span>
          <button
            onClick={() => setFilterDiff(null)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
              filterDiff === null
                ? 'bg-brand-accent text-white'
                : 'bg-brand-surface text-brand-muted border border-brand-border hover:border-brand-accent/50'
            }`}
          >
            Todos
          </button>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDiff(filterDiff === d ? null : d)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-colors ${
                filterDiff === d
                  ? 'bg-brand-accent text-white'
                  : 'bg-brand-surface text-brand-muted border border-brand-border hover:border-brand-accent/50'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {TOPICS.map((topic, i) => {
          const Icon = ICON_MAP[topic.icon] ?? Brain;
          const topicQuestions = QUESTIONS.filter(
            (q) => q.topicId === topic.id && (filterDiff === null || q.difficulty === filterDiff)
          );
          const isOpen = expanded === topic.id;
          const driveKey = TOPIC_DRIVE_KEYS[topic.id];
          const driveId = driveKey ? DRIVE_FILES[driveKey] : undefined;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-brand-surface border rounded-xl overflow-hidden transition-all duration-200"
              style={{ borderColor: isOpen ? `${topic.color}44` : '#1F2937' }}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : topic.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-brand-border/10 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${topic.color}22` }}
                >
                  <Icon size={20} style={{ color: topic.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-600 text-brand-text">{topic.title}</h2>
                    <span className="text-brand-muted text-xs font-mono">
                      {topicQuestions.length} questões
                    </span>
                  </div>
                  <p className="text-brand-muted text-xs mt-0.5 truncate">{topic.description}</p>
                </div>
                <span
                  className="text-brand-muted text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ›
                </span>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-brand-border divide-y divide-brand-border"
                >
                  {/* Material de referência */}
                  {driveId && (
                    <div className="p-4 flex items-center gap-3">
                      <FileText size={14} className="text-brand-muted flex-shrink-0" />
                      <span className="text-brand-muted text-xs">Material de referência:</span>
                      <a
                        href={getDrivePreviewUrl(driveId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-brand-accent text-xs hover:underline"
                      >
                        Abrir no Google Drive <ExternalLink size={11} />
                      </a>
                    </div>
                  )}

                  {/* Tags do tópico */}
                  <div className="p-4">
                    <p className="text-brand-muted text-xs mb-2 flex items-center gap-1">
                      <BookOpen size={12} /> Subtemas abordados
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from(
                        new Set(topicQuestions.flatMap((q) => q.tags))
                      ).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-xs font-mono bg-brand-border text-brand-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Questões */}
                  {topicQuestions.length === 0 ? (
                    <p className="p-4 text-brand-muted text-sm text-center">
                      Nenhuma questão para o filtro selecionado.
                    </p>
                  ) : (
                    topicQuestions.map((q, qi) => (
                      <div key={q.id} className="p-4 flex items-start gap-3">
                        <span className="text-brand-muted font-mono text-xs flex-shrink-0 mt-0.5 w-5">
                          {qi + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-brand-text text-sm leading-relaxed line-clamp-2">{q.text}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <DifficultyBadge difficulty={q.difficulty} />
                            {q.source && (
                              <span className="text-brand-muted text-xs font-mono">{q.source}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
