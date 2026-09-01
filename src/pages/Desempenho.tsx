import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell,
} from 'recharts';
import { CheckCircle2, Target, Flame, Trophy, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store';
import { TOPICS } from '../data/topics';
import { StatCard } from '../components/StatCard';
import { formatDate, formatDuration } from '../utils/stats';

function barColor(pct: number) {
  if (pct >= 80) return '#14B8A6';
  if (pct >= 60) return '#F59E0B';
  return '#EF4444';
}

export function Desempenho() {
  const { getOverallStats, getTopicStats, getWeakTags, getSessionHistory } = useAppStore();
  const overall = getOverallStats();
  const history = getSessionHistory();
  const weakTags = getWeakTags().slice(0, 8);

  const topicData = TOPICS.map((t) => {
    const stats = getTopicStats(t.id);
    return {
      name: t.title,
      acerto: Math.round(stats.accuracy),
      total: stats.totalAnswered,
      color: t.color,
    };
  });

  const lineData = [...history]
    .reverse()
    .slice(-20)
    .map((s) => ({
      data: formatDate(s.date),
      acerto: Math.round(s.accuracy),
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-700 text-2xl text-brand-text"
      >
        Seu Desempenho
      </motion.h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total respondidas" value={overall.totalAnswered} icon={CheckCircle2} color="#6366F1" />
        <StatCard label="Taxa de acerto" value={`${overall.accuracy.toFixed(0)}%`} icon={Target} color="#14B8A6" />
        <StatCard label="Sequência" value={`${overall.streak}d`} icon={Flame} color="#F59E0B" />
        <StatCard label="Melhor tópico" value={overall.bestTopic ?? '—'} icon={Trophy} color="#EC4899" />
      </div>

      {/* Bar chart por tópico */}
      <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
        <h2 className="font-display font-600 text-brand-text mb-4">Desempenho por tópico</h2>
        {overall.totalAnswered === 0 ? (
          <p className="text-brand-muted text-sm text-center py-8">Nenhuma questão respondida ainda.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topicData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8 }}
                labelStyle={{ color: '#F9FAFB', fontSize: 12 }}
                itemStyle={{ color: '#9CA3AF', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Acerto']}
              />
              <Bar dataKey="acerto" radius={[4, 4, 0, 0]}>
                {topicData.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.acerto)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Line chart evolução */}
      {lineData.length > 1 && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
          <h2 className="font-display font-600 text-brand-text mb-4">Evolução das sessões</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="data" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8 }}
                labelStyle={{ color: '#F9FAFB', fontSize: 12 }}
                itemStyle={{ color: '#9CA3AF', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Acerto']}
              />
              <Line
                type="monotone"
                dataKey="acerto"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: '#6366F1', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Histórico de sessões */}
      {history.length > 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
          <h2 className="font-display font-600 text-brand-text mb-4">Sessões recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-brand-muted text-xs border-b border-brand-border">
                  <th className="pb-2 text-left">Data</th>
                  <th className="pb-2 text-left">Tópico</th>
                  <th className="pb-2 text-right">Acertos</th>
                  <th className="pb-2 text-right">Acerto%</th>
                  <th className="pb-2 text-right">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {history.slice(0, 15).map((s) => {
                  const color =
                    s.accuracy >= 80 ? '#14B8A6' : s.accuracy >= 60 ? '#F59E0B' : '#EF4444';
                  return (
                    <tr key={s.sessionId} className="text-brand-text">
                      <td className="py-2.5 text-brand-muted text-xs">{formatDate(s.date)}</td>
                      <td className="py-2.5 font-medium">{s.topicTitle}</td>
                      <td className="py-2.5 text-right text-brand-muted">
                        {s.correctAnswers}/{s.totalQuestions}
                      </td>
                      <td className="py-2.5 text-right font-mono font-medium" style={{ color }}>
                        {s.accuracy.toFixed(0)}%
                      </td>
                      <td className="py-2.5 text-right text-brand-muted text-xs">
                        {formatDuration(s.durationSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tags fracas */}
      {weakTags.length > 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-xl p-5">
          <h2 className="font-display font-600 text-brand-text mb-1 flex items-center gap-2">
            <AlertTriangle size={16} className="text-brand-amber" /> Pontos a melhorar
          </h2>
          <p className="text-brand-muted text-xs mb-4">Tags com menor taxa de acerto</p>
          <div className="flex flex-wrap gap-2">
            {weakTags.map((t) => {
              const color = t.accuracy < 60 ? '#EF4444' : t.accuracy < 80 ? '#F59E0B' : '#14B8A6';
              return (
                <div
                  key={t.tag}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
                  style={{ background: `${color}15`, border: `1px solid ${color}33`, color }}
                >
                  #{t.tag}
                  <span className="font-semibold">{t.accuracy.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {overall.totalAnswered === 0 && (
        <div className="text-center py-16 text-brand-muted">
          <p className="text-lg mb-2">Nenhuma sessão registrada ainda.</p>
          <p className="text-sm">Complete um quiz para ver seu desempenho aqui.</p>
        </div>
      )}
    </div>
  );
}
