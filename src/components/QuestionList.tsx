import { useMemo } from 'react';
import { QUESTIONS } from '../data/questions';
import { useApp } from '../context/AppContext';
import QuestionCard from './QuestionCard';

export default function QuestionList() {
  const { state } = useApp();
  const { selectedCategory, activeFilter, activeBadgeFilter, searchQuery } = state.preferences;

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      // Category filter
      if (selectedCategory && q.category !== selectedCategory) return false;

      // Badge filter
      if (activeBadgeFilter === 'N' && !q.badges.includes('N')) return false;
      if (activeBadgeFilter === 'S' && !q.badges.includes('S')) return false;
      if (activeBadgeFilter === 'both' && (!q.badges.includes('N') || !q.badges.includes('S'))) return false;

      // Status/priority filter
      const prog = state.progress[q.id];
      if (activeFilter === 'completed' && !prog?.completed) return false;
      if (activeFilter === 'incomplete' && prog?.completed) return false;
      if (activeFilter === 'basic' && prog?.priority !== 'basic') return false;
      if (activeFilter === 'important' && prog?.priority !== 'important') return false;
      if (activeFilter === 'high' && prog?.priority !== 'high') return false;

      // Global Search
      if (searchQuery.trim()) {
        const q2 = searchQuery.toLowerCase().trim();
        const matchTitle = q.title.toLowerCase().includes(q2);
        const matchCat = q.category.toLowerCase().includes(q2);
        const matchBadge =
          (q2 === 'n' && q.badges.includes('N')) ||
          (q2 === 's' && q.badges.includes('S')) ||
          (q.badges.includes('N') && 'neetcode'.includes(q2)) ||
          (q.badges.includes('S') && 'striver'.includes(q2));
        const matchPriority = (prog?.priority || 'basic').toLowerCase().includes(q2) ||
          (q2 === 'high' && prog?.priority === 'high') ||
          (q2 === 'high priority' && prog?.priority === 'high');
        const matchStatus =
          (prog?.completed && ('completed'.includes(q2) || 'done'.includes(q2))) ||
          (!prog?.completed && ('incomplete'.includes(q2) || 'not started'.includes(q2) || (prog?.status && prog.status.includes(q2))));

        if (!matchTitle && !matchCat && !matchBadge && !matchPriority && !matchStatus) return false;
      }

      return true;
    });
  }, [selectedCategory, activeFilter, activeBadgeFilter, searchQuery, state.progress]);

  if (filtered.length === 0) {
    return (
      <div className="glass rounded-2xl border border-white/8 p-12 text-center animate-in">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">No questions found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No questions matched your search criteria or active filters. Try clearing filters or changing your search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs text-slate-400">
          Showing <span className="text-indigo-400 font-semibold">{filtered.length}</span> of{' '}
          <span className="text-slate-300 font-medium">
            {selectedCategory
              ? QUESTIONS.filter((q) => q.category === selectedCategory).length
              : QUESTIONS.length}
          </span>{' '}
          questions
          {selectedCategory && (
            <>
              {' '}in <span className="text-slate-200 font-medium">{selectedCategory}</span>
            </>
          )}
        </span>
      </div>
      {filtered.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
