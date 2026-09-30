import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  delta,
  deltaType = 'neutral',
  glowColor = 'cyan',
}) => {
  const glowBorder = {
    cyan: 'hover:border-cyan-500/50 hover:shadow-cyan-950/30',
    purple: 'hover:border-purple-500/50 hover:shadow-purple-950/30',
    emerald: 'hover:border-emerald-500/50 hover:shadow-emerald-950/30',
    amber: 'hover:border-amber-500/50 hover:shadow-amber-950/30',
    rose: 'hover:border-rose-500/50 hover:shadow-rose-950/30',
  };

  const deltaColors = {
    positive: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/40',
    negative: 'text-rose-400 bg-rose-950/60 border-rose-800/40',
    neutral: 'text-slate-400 bg-slate-800/60 border-slate-700/40',
  };

  return (
    <div
      className={`glass-panel rounded-xl p-4 sm:p-5 transition-all duration-300 border border-slate-800/80 hover:shadow-lg ${glowBorder[glowColor]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        {icon && <div className="text-cyan-400 p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-900/40">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
          {value}
        </div>
        {delta && (
          <span
            className={`text-xs font-mono px-1.5 py-0.5 rounded border ${deltaColors[deltaType]}`}
          >
            {delta}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
