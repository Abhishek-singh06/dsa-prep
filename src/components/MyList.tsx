import { useState } from 'react';
import { Trash2, ExternalLink, Check, FolderPlus, Bookmark } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import type { Priority } from '../data/questions';
import { useApp } from '../context/AppContext';
import ProgressBar from './ProgressBar';

const PRIORITY_SECTIONS: {
  value: Priority;
  label: string;
  icon: string;
  color: string;
  badgeBg: string;
  emptyText: string;
}[] = [
  {
    value: 'high',
    label: 'HIGH PRIORITY',
    icon: '🔥',
    color: 'text-red-400',
    badgeBg: 'bg-red-500/10 border-red-500/20 text-red-300',
    emptyText: 'No high-priority problems in this queue.',
  },
  {
    value: 'important',
    label: 'IMPORTANT',
    icon: '⭐',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    emptyText: 'No important problems in this queue.',
  },
  {
    value: 'basic',
    label: 'BASIC',
    icon: '📚',
    color: 'text-slate-400',
    badgeBg: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
    emptyText: 'No basic problems in this queue.',
  },
];

export default function MyList() {
  const {
    state,
    removeFromMyList,
    updateMyListPriority,
    updateMyListCustomCategory,
    toggleComplete,
    getQuestionProgress,
    addCustomList,
    deleteCustomList,
  } = useApp();

  const { myList, customLists } = state;
  const [activeFilterList, setActiveFilterList] = useState<string | 'all'>('all');
  const [newListName, setNewListName] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);

  const questionMap = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

  // Filter items by custom list if selected
  const filteredItems = myList.filter((item) => {
    if (activeFilterList === 'all') return true;
    if (activeFilterList === '__uncategorized__') return !item.customList;
    return item.customList === activeFilterList;
  });

  const handleCreateList = () => {
    if (newListName.trim()) {
      addCustomList(newListName.trim());
      setActiveFilterList(newListName.trim());
      setNewListName('');
      setShowAddListInput(false);
    }
  };

  if (myList.length === 0) {
    return (
      <div className="glass rounded-2xl border border-white/8 p-12 text-center animate-in space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Bookmark className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">My List is empty</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Your personal queue is ready. Click the bookmark icon on any problem to queue it up with priority tiers (High, Important, Basic) and custom revision tags.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header card with custom list filters */}
      <div className="glass rounded-2xl border border-white/8 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
              Personal Study Queue
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>MY LIST</span>
              <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                {myList.length} {myList.length === 1 ? 'problem' : 'problems'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Problems worth coming back to.
            </p>
          </div>

          {/* Create custom list button */}
          <div className="flex items-center gap-2">
            {showAddListInput ? (
              <div className="flex items-center gap-1.5 animate-in">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list name..."
                  className="glass border border-indigo-500/50 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
                  autoFocus
                />
                <button
                  onClick={handleCreateList}
                  className="px-2.5 py-1 text-xs bg-indigo-600/40 text-indigo-200 rounded-lg hover:bg-indigo-600/60 font-semibold cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddListInput(false)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddListInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-indigo-400" /> New Tag / List
              </button>
            )}
          </div>
        </div>

        {/* Custom Lists Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
          <button
            onClick={() => setActiveFilterList('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              activeFilterList === 'all'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'glass border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items ({myList.length})
          </button>

          {customLists.map((cl) => {
            const count = myList.filter((i) => i.customList === cl).length;
            return (
              <div key={cl} className="inline-flex items-center group">
                <button
                  onClick={() => setActiveFilterList(cl)}
                  className={`px-3 py-1 rounded-l-lg text-xs font-medium border transition-all cursor-pointer ${
                    activeFilterList === cl
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'glass border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cl} ({count})
                </button>
                <button
                  onClick={() => deleteCustomList(cl)}
                  className="px-1.5 py-1 text-xs border border-l-0 border-white/5 text-slate-600 hover:text-red-400 glass rounded-r-lg cursor-pointer"
                  title={`Delete list "${cl}"`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* THREE EXPLICIT PRIORITY SECTIONS: HIGH, IMPORTANT, BASIC */}
      <div className="space-y-5">
        {PRIORITY_SECTIONS.map((section) => {
          const sectionItems = filteredItems.filter((i) => i.priority === section.value);
          const completedCount = sectionItems.filter(
            (i) => getQuestionProgress(i.questionId).completed
          ).length;
          const totalCount = sectionItems.length;
          const sectionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={section.value}
              className="glass rounded-2xl border border-white/8 p-5 sm:p-6 space-y-4 shadow-xl"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-sm sm:text-base font-extrabold tracking-wider ${section.color}`}>
                        {section.label}
                      </h2>
                      <span className="text-xs text-slate-400 font-semibold bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {totalCount} {totalCount === 1 ? 'problem' : 'problems'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Mini Overview */}
                {totalCount > 0 && (
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="text-right text-xs">
                      <span className="text-slate-300 font-bold">{completedCount}/{totalCount}</span>
                      <span className="text-slate-500 ml-1">({sectionPct}%)</span>
                    </div>
                    <div className="w-24">
                      <ProgressBar
                        value={sectionPct}
                        height="h-1.5"
                        colorClass={
                          section.value === 'high'
                            ? 'bg-red-400'
                            : section.value === 'important'
                            ? 'bg-amber-400'
                            : 'bg-indigo-400'
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Questions List for this Section */}
              {totalCount > 0 ? (
                <div className="space-y-2">
                  {sectionItems.map((item) => {
                    const q = questionMap[item.questionId];
                    if (!q) return null;
                    const prog = getQuestionProgress(q.id);

                    return (
                      <div
                        key={item.questionId}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl glass border transition-all ${
                          prog.completed
                            ? 'border-white/5 bg-white/[0.01] opacity-55 hover:opacity-85'
                            : 'border-white/8 hover:border-white/15 hover:bg-white/[0.035]'
                        }`}
                      >
                        {/* Checkbox + Title + Category */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => toggleComplete(q.id)}
                            className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                              prog.completed
                                ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400 shadow-sm'
                                : 'border-white/25 hover:border-indigo-400'
                            }`}
                            title={prog.completed ? 'Mark incomplete' : 'Mark completed'}
                          >
                            {prog.completed && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-semibold tracking-tight ${
                                  prog.completed ? 'line-through text-slate-500' : 'text-slate-100'
                                }`}
                              >
                                {q.title}
                              </span>

                              {/* Platform Badges */}
                              {q.badges.map((b) => (
                                <span
                                  key={b}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    b === 'N' ? 'badge-n' : 'badge-s'
                                  }`}
                                >
                                  {b === 'N' ? 'NeetCode' : 'Striver'}
                                </span>
                              ))}

                              {item.customList && (
                                <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                                  {item.customList}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{q.category}</div>
                          </div>
                        </div>

                        {/* Controls: Priority Change + Custom Tag + Links + Remove */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center text-xs">
                          {/* Priority Change Selector */}
                          <select
                            value={item.priority}
                            onChange={(e) => updateMyListPriority(q.id, e.target.value as Priority)}
                            className="text-xs glass border border-white/10 rounded-lg px-2 py-1 text-slate-200 bg-slate-900 cursor-pointer"
                          >
                            <option value="high">🔥 High</option>
                            <option value="important">⭐ Important</option>
                            <option value="basic">📚 Basic</option>
                          </select>

                          {/* Custom List reassignment */}
                          {customLists.length > 0 && (
                            <select
                              value={item.customList || ''}
                              onChange={(e) => updateMyListCustomCategory(q.id, e.target.value || undefined)}
                              className="text-xs glass border border-white/10 rounded-lg px-2 py-1 text-slate-200 bg-slate-900 cursor-pointer hidden md:block"
                            >
                              <option value="">No Custom List</option>
                              {customLists.map((cl) => (
                                <option key={cl} value={cl}>
                                  {cl}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Links */}
                          <div className="flex items-center gap-1.5 ml-1">
                            {q.sources.leetcode && (
                              <a
                                href={q.sources.leetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-amber-400/80 hover:text-amber-300"
                                title="LeetCode"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {q.sources.neetcode && (
                              <a
                                href={q.sources.neetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-blue-400/80 hover:text-blue-300"
                                title="NeetCode"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {q.sources.striver && (
                              <a
                                href={q.sources.striver}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-red-400/80 hover:text-red-300"
                                title="Striver"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromMyList(q.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove from My List"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 italic">
                  {section.emptyText}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
