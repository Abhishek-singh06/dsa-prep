import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  colorClass?: string;
  glowClass?: string;
}

export default function StatsCard({ label, value, icon, subtext, colorClass = 'text-indigo-400', glowClass }: StatsCardProps) {
  return (
    <div className={`glass rounded-xl p-4 flex flex-col gap-2 glass-hover ${glowClass || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        <span className={`${colorClass}`}>{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
      {subtext && <div className="text-xs text-slate-500">{subtext}</div>}
    </div>
  );
}
