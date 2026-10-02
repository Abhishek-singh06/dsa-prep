import { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookmarkPlus,
  BookmarkCheck,
  Tag,
} from 'lucide-react';
import type { Question, Priority, Status } from '../data/questions';
import { useApp } from '../context/AppContext';

interface QuestionCardProps {
  question: Question;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; icon: string; textClass: string; badgeClass: string }> = {
  basic: {
    label: 'Basic',
    icon: '📚',
    textClass: 'text-slate-400',
    badgeClass: 'text-slate-400 bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70',
  },
  important: {
    label: 'Important',
    icon: '⭐',
    textClass: 'text-amber-400',
    badgeClass: 'text-amber-300 bg-amber-950/30 border-amber-800/40 hover:bg-amber-950/50',
  },
  high: {
    label: 'High Priority',
    icon: '🔥',
    textClass: 'text-red-400',
    badgeClass: 'text-red-300 bg-red-950/30 border-red-800/40 hover:bg-red-950/50',
  },
};

const NEXT_PRIORITY: Record<Priority, Priority> = {
  basic: 'important',
  important: 'high',
  high: 'basic',
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function QuestionCard({ question }: QuestionCardProps) {
  const {
    getQuestionProgress,
    toggleComplete,
    setPriority,
    setStatus,
    setComment,
    addToMyList,
    removeFromMyList,
    isInMyList,
    getMyListItem,
    state,
    updateMyListCustomCategory,
    addCustomList,
    setLastInteracted,
  } = useApp();

  const progress = getQuestionProgress(question.id);
  const myListItem = getMyListItem(question.id);
  const [expanded, setExpanded] = useState(false);
  const [editingComment, setEditingComment] = useState(false);
  const [commentDraft, setCommentDraft] = useState(progress.comment);
  const [newCustomList, setNewCustomList] = useState('');

  const inList = isInMyList(question.id);
  const isCompleted = progress.completed;
  const priorityInfo = PRIORITY_CONFIG[progress.priority] || PRIORITY_CONFIG.basic;

  const handleToggle = () => {
    setLastInteracted(question.id);
    toggleComplete(question.id);
  };

  const handleCyclePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLastInteracted(question.id);
    const next = NEXT_PRIORITY[progress.priority] || 'basic';
    setPriority(question.id, next);
  };

  const handleToggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLastInteracted(question.id);
    if (inList) {
      removeFromMyList(question.id);
    } else {
      addToMyList(question.id, progress.priority);
    }
  };

  const handleCommentSave = () => {
    setLastInteracted(question.id);
    setComment(question.id, commentDraft);
    setEditingComment(false);
  };

  const handleAddCustomCategory = () => {
    if (newCustomList.trim()) {
      addCustomList(newCustomList.trim());
      updateMyListCustomCategory(question.id, newCustomList.trim());
      setNewCustomList('');
    }
  };

  return (
    <div
      className={`question-card glass rounded-lg border transition-all duration-150 ${
        isCompleted
          ? 'bg-white/[0.015] border-white/5 opacity-55 hover:opacity-85'
          : 'border-white/8 hover:border-white/15 hover:bg-white/[0.035]'
      }`}
    >
      {/* Compact Row */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:py-2.5 min-h-[44px]">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400 shadow-sm shadow-emerald-500/20'
              : 'border-white/25 hover:border-indigo-400 hover:bg-indigo-500/10'
          }`}
          title={isCompleted ? 'Completed (Click to undo)' : 'Click to mark complete'}
        >
          {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
        </button>

        {/* Title + Badges */}
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span
            onClick={handleToggle}
            className={`text-xs sm:text-sm font-medium tracking-tight cursor-pointer truncate ${
              isCompleted ? 'line-through text-slate-500' : 'text-slate-200 hover:text-white'
            }`}
            title={question.title}
          >
            {question.title}
          </span>

          {/* Platform Badges */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {question.badges.map((b) => (
              <span
                key={b}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded leading-none ${
                  b === 'N' ? 'badge-n' : 'badge-s'
                }`}
                title={b === 'N' ? 'NeetCode 150' : 'Striver Master DSA'}
              >
                {b}
              </span>
            ))}
          </div>

          {/* Direct 1-Click Priority Pill: click to cycle Basic -> Important -> High */}
          <button
            onClick={handleCyclePriority}
            className={`text-[10px] font-medium px-2 py-0.5 rounded border transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 ${priorityInfo.badgeClass}`}
            title="Click to cycle priority (Basic → Important → High)"
          >
            <span>{priorityInfo.icon}</span>
            <span>{priorityInfo.label}</span>
          </button>

          {/* Custom list tag if assigned */}
          {inList && myListItem?.customList && (
            <span className="text-[10px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 rounded hidden md:inline-flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" />
              {myListItem.customList}
            </span>
          )}
        </div>

        {/* Platform Links (Clean Pill Icons) */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-xs">
          {question.sources.leetcode && (
            <a
              href={question.sources.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 rounded text-[11px] font-medium text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
              title="Open problem on LeetCode"
            >
              LeetCode
            </a>
          )}
          {question.sources.neetcode && (
            <a
              href={question.sources.neetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 rounded text-[11px] font-medium text-blue-400/80 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
              title="Open problem on NeetCode"
            >
              NeetCode
            </a>
          )}
          {question.sources.striver && (
            <a
              href={question.sources.striver}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 rounded text-[11px] font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              title="Open problem on Striver / takeUforward"
            >
              Striver
            </a>
          )}
          {question.sources.youtube && (
            <a
              href={question.sources.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1.5 py-0.5 rounded text-[11px] font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Watch video solution on YouTube"
            >
              YouTube
            </a>
          )}
        </div>

        {/* Direct Actions: Comment Button, Add to List, Expand Chevron */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Quick Comment Trigger */}
          <button
            onClick={() => {
              setEditingComment(!editingComment);
              if (!expanded) setExpanded(true);
            }}
            className={`p-1.5 rounded text-xs transition-all flex items-center gap-1 ${
              progress.comment
                ? 'text-indigo-300 bg-indigo-500/15 border border-indigo-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
            title={progress.comment ? `Note: "${progress.comment}"` : 'Add note / comment'}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {progress.comment && (
              <span className="hidden xl:inline max-w-[120px] truncate text-[11px] text-slate-300 font-normal">
                {progress.comment}
              </span>
            )}
          </button>

          {/* Quick 1-Click My List Button */}
          <button
            onClick={handleToggleMyList}
            className={`p-1.5 rounded text-xs transition-all flex items-center gap-1 ${
              inList
                ? 'text-indigo-300 bg-indigo-500/20 border border-indigo-500/40'
                : 'text-slate-500 hover:text-indigo-400 hover:bg-white/5 border border-transparent'
            }`}
            title={inList ? 'In My List (Click to remove)' : '+ Add to My List'}
          >
            {inList ? <BookmarkCheck className="w-3.5 h-3.5 text-indigo-400" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
            <span className="hidden md:inline text-[11px]">{inList ? 'In List' : '+ List'}</span>
          </button>

          {/* Expand Details Chevron */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
            title={expanded ? 'Collapse' : 'More options (Status, Custom List, Notes)'}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Links Bar (visible on very small screens) */}
      <div className="flex sm:hidden items-center gap-2 px-3 pb-2 pt-0.5 text-xs border-t border-white/5">
        {question.sources.leetcode && (
          <a
            href={question.sources.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-amber-400/80 hover:text-amber-300 font-medium"
          >
            LC
          </a>
        )}
        {question.sources.neetcode && (
          <a
            href={question.sources.neetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400/80 hover:text-blue-300 font-medium"
          >
            NC
          </a>
        )}
        {question.sources.striver && (
          <a
            href={question.sources.striver}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-red-400/80 hover:text-red-300 font-medium"
          >
            Striver
          </a>
        )}
        {question.sources.youtube && (
          <a
            href={question.sources.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-rose-400/80 hover:text-rose-300 font-medium"
          >
            YT
          </a>
        )}
        <span className="text-[10px] text-slate-500 ml-auto">{question.category}</span>
      </div>

      {/* Advanced Expandable Panel */}
      {expanded && (
        <div className="border-t border-white/5 px-3.5 py-3 space-y-3 bg-white/[0.015]">
          {/* Controls: Status & Custom List */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Select */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-medium">Status:</span>
                <select
                  value={progress.status}
                  onChange={(e) => {
                    setLastInteracted(question.id);
                    setStatus(question.id, e.target.value as Status);
                  }}
                  className="glass border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 bg-slate-900 cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Select (alternative direct picker) */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-medium">Priority:</span>
                <select
                  value={progress.priority}
                  onChange={(e) => {
                    setLastInteracted(question.id);
                    setPriority(question.id, e.target.value as Priority);
                  }}
                  className="glass border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 bg-slate-900 cursor-pointer"
                >
                  <option value="basic">📚 Basic</option>
                  <option value="important">⭐ Important</option>
                  <option value="high">🔥 High Priority</option>
                </select>
              </div>

              {/* Custom List Assignment if in My List */}
              {inList && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[11px] font-medium">List Tag:</span>
                  <select
                    value={myListItem?.customList || ''}
                    onChange={(e) => {
                      setLastInteracted(question.id);
                      updateMyListCustomCategory(question.id, e.target.value || undefined);
                    }}
                    className="glass border border-white/10 rounded px-2 py-0.5 text-xs text-slate-200 bg-slate-900 cursor-pointer"
                  >
                    <option value="">(Default Queue)</option>
                    {state.customLists.map((cl) => (
                      <option key={cl} value={cl}>
                        {cl}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* In My List status & Quick add new list */}
            {inList && (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCustomList}
                  onChange={(e) => setNewCustomList(e.target.value)}
                  placeholder="New tag..."
                  className="glass border border-white/10 rounded px-2 py-0.5 text-[11px] text-slate-200 placeholder-slate-600 w-24"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                />
                <button
                  onClick={handleAddCustomCategory}
                  className="px-2 py-0.5 rounded text-[11px] glass border border-white/10 text-slate-300 hover:text-white"
                >
                  + Tag
                </button>
              </div>
            )}
          </div>

          {/* Reference note from source PDF if question has one */}
          {question.note && (
            <div className="text-[11px] text-amber-200/90 bg-amber-950/20 rounded-md px-2.5 py-1.5 border border-amber-800/30 flex items-start gap-1.5">
              <span className="text-amber-400">📌</span>
              <span>{question.note}</span>
            </div>
          )}

          {/* Note Editor Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-indigo-400" /> Notes & Intuition:
              </span>
              {!editingComment && progress.comment && (
                <button
                  onClick={() => setEditingComment(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  Edit
                </button>
              )}
            </div>

            {editingComment ? (
              <div className="space-y-1.5">
                <textarea
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  placeholder="Record your pattern notes, time/space complexity, edge cases..."
                  rows={2}
                  className="w-full glass border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 resize-none focus:border-indigo-400 transition-all placeholder-slate-600"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCommentSave}
                    className="px-2.5 py-1 text-xs bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 rounded font-medium transition-all"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setCommentDraft(progress.comment);
                      setEditingComment(false);
                    }}
                    className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingComment(true)}
                className="glass border border-white/5 rounded-lg px-2.5 py-1.5 text-xs cursor-pointer hover:border-white/10 transition-all text-slate-300 min-h-[30px]"
              >
                {progress.comment ? (
                  <span className="whitespace-pre-wrap">{progress.comment}</span>
                ) : (
                  <span className="text-slate-600 italic flex items-center gap-1">
                    Click to add personal note or pattern intuition...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
