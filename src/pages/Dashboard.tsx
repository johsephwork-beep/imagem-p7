import type { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Activity, Zap, Circle, Layers, Bone, Swords,
  CheckCircle2, Target, Flame, Trophy, ArrowRight, Play
} from 'lucide-react';
import { TOPICS } from '../data/topics';
import { useAppStore } from '../store';
import { StatCard } from '../components/StatCard';

const ICON_MAP: Record<string, ElementType> = {
  Brain, Activity, Zap, Circle, Layers, Bone,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Dashboard() {
  const navigate = useNavigate();
  const { getOverallStats, getTopicStats, currentSession } = useAppStore();
  const overall = getOverallStats();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-mono mb-2">
          <Brain size={12} /> Monitoria de Neuroimagem · P7 2026
        </div>
        <h1 className="font-display font-700 text-3xl md:text-4xl text-brand-text">
          Treine sua leitura de{' '}
          <span className="bg-gradient-to-r from-brand-accent to-brand-accent2 bg-clip-text text-transparent">
            exames de imagem
          </span>
        </h1>
        <p className="text-brand-muted max-w-lg mx-auto text-sm leading-relaxed">
          Banco de questões de neuroimagem baseado nos materiais da monitoria UNIMA Afya.
          TC, RM, PET e muito mais.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Questões respondidas"
          value={overall.totalAnswered}
          icon={CheckCircle2}
          color="#6366F1"
        />
        <StatCard
          label="Taxa de acerto"
          value={`${overall.accuracy.toFixed(0)}%`}
          icon={Target}
          color="#14B8A6"
        />
        <StatCard
          label="Sequência atual"
          value={`${overall.streak} ${overall.streak === 1 ? 'dia' : 'dias'}`}
          icon={Flame}
          color="#F59E0B"
        />
        <StatCard
          label="Melhor tópico"
          value={overall.bestTopic ?? '—'}
          icon={Trophy}
          color="#EC4899"
        />
      </div>

      {/* Continue sessão */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-4 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-brand-accent font-semibold text-sm">Sessão em andamento</p>
            <p className="text-brand-muted text-xs mt-0.5">
              {currentSession.answers.length} questões respondidas
            </p>
          </div>
          <button
            onClick={() => navigate(`/quiz/${currentSession.topicId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent/90 text-white text-sm font-semibold transition-colors"
          >
            Continuar <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      {/* Duelo — modo multiplayer */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/duelo')}
        className="w-full text-left bg-brand-surface border rounded-xl p-5 flex items-center gap-4 hover:border-opacity-80 transition-all group"
        style={{ borderColor: '#F43F5E33' }}
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: '#F43F5E22' }}>
          <Swords size={24} style={{ color: '#F43F5E' }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-600 text-brand-text">Duelo</h3>
          <p className="text-brand-muted text-sm">
            7 perguntas · 30s cada · quem acerta mais rápido pontua mais
          </p>
        </div>
        <ArrowRight size={18} className="text-brand-muted group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
      </motion.button>

      {/* Topic grid */}
      <div>
        <h2 className="font-display font-600 text-lg text-brand-text mb-4">Tópicos disponíveis</h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TOPICS.map((topic) => {
            const Icon = ICON_MAP[topic.icon] ?? Brain;
            const stats = getTopicStats(topic.id);
            const pct = topic.questionCount > 0 ? (stats.totalAnswered / topic.questionCount) * 100 : 0;

            return (
              <motion.div
                key={topic.id}
                variants={item}
                className="bg-brand-surface border border-brand-border rounded-xl p-5 flex flex-col gap-4 hover:border-opacity-60 transition-all duration-200 group"
                style={{ borderColor: `${topic.color}22` }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${topic.color}22` }}
                  >
                    <Icon size={20} style={{ color: topic.color }} />
                  </div>
                  <span className="text-brand-muted text-xs font-mono">
                    {stats.totalAnswered}/{topic.questionCount} questões
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-600 text-brand-text">{topic.title}</h3>
                  <p className="text-brand-muted text-xs mt-1 leading-relaxed">{topic.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: topic.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                  {stats.totalAnswered > 0 && (
                    <p className="text-brand-muted text-xs">
                      {stats.accuracy.toFixed(0)}% de acerto
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/quiz/${topic.id}`)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: `${topic.color}22`,
                    color: topic.color,
                    border: `1px solid ${topic.color}44`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${topic.color}33`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${topic.color}22`;
                  }}
                >
                  <Play size={14} /> Iniciar Quiz
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
