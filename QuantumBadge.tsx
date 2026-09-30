import React from 'react';

interface QuantumBadgeProps {
  label: string;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
}

export const QuantumBadge: React.FC<QuantumBadgeProps> = ({
  label,
  variant = 'cyan',
  size = 'sm',
  pulse = false,
}) => {
  const styles = {
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-cyan-950/40',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/40 shadow-purple-950/40',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-amber-950/40',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-500/40 shadow-rose-950/40',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60 shadow-slate-950/40',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-mono',
    sm: 'px-2 py-0.5 text-xs font-mono',
    md: 'px-2.5 py-1 text-xs font-semibold font-mono',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-all ${
        styles[variant]
      } ${sizeClasses[size]}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {label}
    </span>
  );
};
