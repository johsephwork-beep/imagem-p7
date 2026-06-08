import type { Difficulty } from '../types';

const MAP: Record<Difficulty, { label: string; color: string }> = {
  facil:    { label: 'Fácil',   color: '#14B8A6' },
  medio:    { label: 'Médio',   color: '#F59E0B' },
  dificil:  { label: 'Difícil', color: '#EF4444' },
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, color } = MAP[difficulty];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
}
