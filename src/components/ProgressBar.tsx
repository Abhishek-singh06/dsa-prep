interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  colorClass?: string;
  height?: string;
  animated?: boolean;
  glow?: boolean;
  showLabel?: boolean;
  completed?: number;
  total?: number;
}

export default function ProgressBar({
  value,
  className = '',
  colorClass = 'bg-gradient-to-r from-indigo-500 to-purple-500',
  height = 'h-1.5',
  animated = true,
  glow = false,
  showLabel = false,
  completed,
  total,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          {completed !== undefined && total !== undefined ? (
            <span>
              {completed} of {total} completed
            </span>
          ) : (
            <span>Progress</span>
          )}
          <span className="font-semibold text-slate-200">{pct}%</span>
        </div>
      )}
      <div className={`w-full bg-white/5 rounded-full overflow-hidden ${height} ${className}`}>
        <div
          className={`${height} rounded-full ${colorClass} ${animated ? 'progress-bar-fill' : ''} ${
            glow ? 'shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
