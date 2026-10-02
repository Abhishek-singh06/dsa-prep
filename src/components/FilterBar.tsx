import { useApp } from '../context/AppContext';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'incomplete', label: 'Incomplete' },
  { id: 'basic', label: 'Basic' },
  { id: 'important', label: 'Important' },
  { id: 'high', label: 'High Priority' },
];

const BADGE_FILTERS = [
  { id: 'all', label: 'All Sources' },
  { id: 'N', label: 'NeetCode' },
  { id: 'S', label: 'Striver' },
  { id: 'both', label: 'Both' },
];

export default function FilterBar() {
  const { state, setActiveFilter, setActiveBadgeFilter } = useApp();
  const { activeFilter, activeBadgeFilter } = state.preferences;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`filter-btn px-3 py-1.5 rounded-lg text-xs font-medium border border-white/8 text-slate-400 glass transition-all ${activeFilter === f.id ? 'active' : 'hover:text-slate-200 hover:border-white/15'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
      <div className="flex flex-wrap gap-1.5">
        {BADGE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveBadgeFilter(f.id)}
            className={`filter-btn px-3 py-1.5 rounded-lg text-xs font-medium border border-white/8 text-slate-400 glass transition-all ${activeBadgeFilter === f.id ? 'active' : 'hover:text-slate-200 hover:border-white/15'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
