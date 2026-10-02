import { QUESTIONS, CATEGORIES } from '../data/questions';
import { useApp } from '../context/AppContext';
import ProgressBar from './ProgressBar';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  'Arrays & Hashing': '🗂️',
  'Two Pointers': '👆',
  'Sliding Window': '🪟',
  'Stacks & Queues': '📚',
  'Binary Search': '🔍',
  'Linked Lists': '🔗',
  'Binary Trees & BSTs': '🌳',
  'Heaps & Priority Queues': '⛰️',
  'Recursion & Backtracking': '🔄',
  'Tries': '🔤',
  'Graphs: Traversal & Connectivity': '🕸️',
  'Graphs: Paths & Spanning Trees': '🗺️',
  'Dynamic Programming': '🧮',
  'Greedy & Intervals': '📈',
  'Math & Geometry': '📐',
  'Bit Manipulation': '⚙️',
  'String Matching': '🔡',
};

export default function Sidebar() {
  const { state, setSelectedCategory, setSidebarCollapsed, getCategoryProgress } = useApp();
  const { selectedCategory, sidebarCollapsed } = state.preferences;

  if (sidebarCollapsed) {
    return (
      <div className="w-12 flex flex-col items-center pt-4 gap-2">
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="p-2 glass rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        {CATEGORIES.map((cat) => {
          const { completed, total } = getCategoryProgress(cat);
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isActive ? null : cat)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-base transition-all tooltip ${isActive ? 'bg-indigo-500/20' : 'hover:bg-white/5'}`}
              data-tip={cat}
              title={`${cat} (${completed}/${total})`}
            >
              {CATEGORY_ICONS[cat] || '📋'}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</span>
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="p-1 text-slate-600 hover:text-slate-300 transition-colors"
          title="Collapse sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* All */}
      <button
        onClick={() => setSelectedCategory(null)}
        className={`sidebar-item flex items-center gap-2.5 px-3 py-2 rounded-xl border text-sm transition-all ${
          !selectedCategory
            ? 'active border-indigo-500/30 text-indigo-300'
            : 'border-transparent text-slate-400 hover:text-slate-200'
        }`}
      >
        <LayoutGrid className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">All Questions</span>
            <span className="text-xs text-slate-500">{QUESTIONS.length}</span>
          </div>
        </div>
      </button>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const { completed, total } = getCategoryProgress(cat);
        const pct = total > 0 ? (completed / total) * 100 : 0;
        const isActive = selectedCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(isActive ? null : cat)}
            className={`sidebar-item flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all w-full ${
              isActive
                ? 'active border-indigo-500/30 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-base flex-shrink-0">{CATEGORY_ICONS[cat] || '📋'}</span>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-xs leading-tight truncate pr-1">{cat}</span>
                <span className="text-xs text-slate-500 flex-shrink-0">{completed}/{total}</span>
              </div>
              <ProgressBar
                value={pct}
                height="h-1"
                colorClass={isActive ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600/60 to-purple-600/60'}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
