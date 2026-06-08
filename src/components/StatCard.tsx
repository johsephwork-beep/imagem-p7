import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  sub?: string;
}

export function StatCard({ label, value, icon: Icon, color = '#6366F1', sub }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-start gap-3"
      style={{ borderColor: `${color}22` }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-brand-muted text-xs mb-0.5">{label}</p>
        <p className="text-brand-text font-display font-600 text-xl leading-none">{value}</p>
        {sub && <p className="text-brand-muted text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}
