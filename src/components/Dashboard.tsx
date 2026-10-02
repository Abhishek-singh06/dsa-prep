import {
  CheckCircle2,
  Circle,
  Zap,
  Flame,
  Sparkles,
  PlayCircle,
  ExternalLink,
  Check,
  BookmarkPlus,
  BookmarkCheck,
  Compass,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUESTIONS, CATEGORIES } from '../data/questions';
import ProgressBar from './ProgressBar';

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

interface DashboardProps {
  onNavigateToQuestions?: (category?: string) => void;
}

export default function Dashboard({ onNavigateToQuestions }: DashboardProps) {
  const {
    getCompletedCount,
    getTodayCompletedCount,
    getCurrentStreak,
    getContinueQuestion,
    getQuickPicks,
    getTodaysMission,
    getCategoryProgress,
    setSelectedCategory,
    toggleComplete,
    addToMyList,
    removeFromMyList,
    isInMyList,
    getQuestionProgress,
    setLastInteracted,
  } = useApp();

  const total = QUESTIONS.length;
  const completed = getCompletedCount();
  const remaining = total - completed;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const todayCount = getTodayCompletedCount();
  const streak = getCurrentStreak();

  const continueQuestion = getContinueQuestion();
  const quickPicks = getQuickPicks();
  const todaysMission = getTodaysMission(5);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (onNavigateToQuestions) {
      onNavigateToQuestions(category);
    }
  };

  const handleStartMission = () => {
    if (todaysMission.length > 0) {
      const target = todaysMission[0];
      setLastInteracted(target.id);
      handleCategoryClick(target.category);
    } else if (continueQuestion) {
      handleCategoryClick(continueQuestion.category);
    } else {
      if (onNavigateToQuestions) onNavigateToQuestions();
    }
  };

  // Circular progress calculations for SVG ring
  const circleRadius = 52;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (pct / 100) * circleCircumference;

  const getHeatmapTierClass = (percentage: number) => {
    if (percentage === 100) return 'heatmap-tier-100';
    if (percentage >= 76) return 'heatmap-tier-99';
    if (percentage >= 51) return 'heatmap-tier-75';
    if (percentage >= 26) return 'heatmap-tier-50';
    if (percentage > 0) return 'heatmap-tier-25';
    return 'heatmap-tier-0';
  };

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* PHASE 1 — PREMIUM DASHBOARD HERO                          */}
      {/* ========================================================= */}
      <div className="glass rounded-2xl p-6 sm:p-7 border border-white/8 relative overflow-hidden shadow-2xl">
        {/* Subtle ambient lighting */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Welcome & Text Info */}
          <div className="space-y-2 text-center md:text-left flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal DSA Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Master the patterns. Track the progress.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{completed} solved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>{remaining} remaining</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>269 curated reference</span>
              </div>
            </div>
          </div>

          {/* Large Circular Progress Ring Visualization */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-2xl glass border border-white/5 bg-white/[0.015]">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 128 128">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  stroke="rgba(255, 255, 255, 0.07)"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Glowing Progress Stroke */}
                <circle
                  cx="64"
                  cy="64"
                  r={circleRadius}
                  stroke="url(#progress-gradient)"
                  strokeWidth="8"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="circular-progress-circle"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered Percentage & Count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white tracking-tight leading-none">
                  {pct}%
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {completed} / {total}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-semibold">
                  completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sophisticated Horizontal Progress Visualization */}
        <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
          <ProgressBar
            value={pct}
            height="h-2.5"
            colorClass="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
            className="rounded-full shadow-inner"
          />
          <div className="flex justify-between text-xs text-slate-400 font-medium px-0.5">
            <span className="text-emerald-400 font-semibold">{completed} questions completed</span>
            <span className="text-slate-400">{remaining} remaining to pattern mastery</span>
          </div>
        </div>
      </div>

      {/* 4 Premium Glass Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak Card */}
        <div className="glass rounded-xl p-4 border border-white/8 hover:border-orange-500/30 transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-orange-400 tracking-tight">
              {streak} {streak === 1 ? 'day' : 'days'}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">Daily consistency</div>
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="glass rounded-xl p-4 border border-white/8 hover:border-amber-500/30 transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Completed Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight">
              {todayCount}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {todayCount > 0 ? 'Active momentum' : 'Ready to solve'}
            </div>
          </div>
        </div>

        {/* Remaining Card */}
        <div className="glass rounded-xl p-4 border border-white/8 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Remaining
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Circle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-blue-400 tracking-tight">
              {remaining}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">To pattern mastery</div>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="glass rounded-xl p-4 border border-white/8 hover:border-indigo-500/30 transition-all group flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-extrabold text-indigo-400 tracking-tight">
              {pct}%
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {completed} of {total} mastered
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHASE 2 — TODAY'S MISSION ("Your next 5 problems")         */}
      {/* ========================================================= */}
      <div className="glass rounded-2xl p-5 sm:p-6 border border-white/8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Today's Mission
                </h2>
                <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  5 Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Your next 5 high-yield problems to unlock pattern breakthroughs.
              </p>
            </div>
          </div>

          {/* START SESSION BUTTON */}
          <button
            onClick={handleStartMission}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all interactive-tap cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>START SESSION</span>
          </button>
        </div>

        {/* 5 Problem Rows */}
        <div className="space-y-2">
          {todaysMission.map((q) => {
            const prog = getQuestionProgress(q.id);
            const inList = isInMyList(q.id);

            return (
              <div
                key={q.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl glass border transition-all duration-150 ${
                  prog.completed
                    ? 'border-white/5 bg-white/[0.01] opacity-60'
                    : 'border-white/8 hover:border-white/15 hover:bg-white/[0.035]'
                }`}
              >
                {/* Left: Checkbox + Title + Category + Priority */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={() => {
                      setLastInteracted(q.id);
                      toggleComplete(q.id);
                    }}
                    aria-label={prog.completed ? `Mark ${q.title} incomplete` : `Mark ${q.title} complete`}
                    className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      prog.completed
                        ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400 shadow-sm shadow-emerald-500/20'
                        : 'border-white/25 hover:border-indigo-400 hover:bg-indigo-500/10'
                    }`}
                    title={prog.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {prog.completed && <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />}
                  </button>

                  <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                    <span
                      onClick={() => handleCategoryClick(q.category)}
                      className={`text-xs sm:text-sm font-semibold tracking-tight truncate cursor-pointer hover:underline ${
                        prog.completed ? 'line-through text-slate-500' : 'text-slate-100 hover:text-white'
                      }`}
                      title={q.title}
                    >
                      {q.title}
                    </span>

                    <span className="text-[11px] text-slate-500 truncate">
                      ({q.category})
                    </span>

                    {/* Priority Pill */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border capitalize flex items-center gap-1 ${
                        prog.priority === 'high'
                          ? 'text-red-300 bg-red-950/30 border-red-800/40'
                          : prog.priority === 'important'
                          ? 'text-amber-300 bg-amber-950/30 border-amber-800/40'
                          : 'text-slate-400 bg-slate-800/40 border-slate-700/50'
                      }`}
                    >
                      {prog.priority === 'high' ? '🔥 High' : prog.priority === 'important' ? '⭐ Important' : '📚 Basic'}
                    </span>

                    {/* Source Badges */}
                    <div className="flex items-center gap-1">
                      {q.badges.map((b) => (
                        <span
                          key={b}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            b === 'N' ? 'badge-n' : 'badge-s'
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Platform Links & Bookmark */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center text-xs">
                  {q.sources.leetcode && (
                    <a
                      href={q.sources.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded text-[11px] font-medium text-amber-400/85 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                      title="LeetCode problem"
                    >
                      LeetCode
                    </a>
                  )}
                  {q.sources.neetcode && (
                    <a
                      href={q.sources.neetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded text-[11px] font-medium text-blue-400/85 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                      title="NeetCode problem"
                    >
                      NeetCode
                    </a>
                  )}
                  {q.sources.striver && (
                    <a
                      href={q.sources.striver}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded text-[11px] font-medium text-red-400/85 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      title="Striver problem"
                    >
                      Striver
                    </a>
                  )}
                  {q.sources.youtube && (
                    <a
                      href={q.sources.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded text-[11px] font-medium text-rose-400/85 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                      title="YouTube explanation"
                    >
                      YouTube
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setLastInteracted(q.id);
                      if (inList) removeFromMyList(q.id);
                      else addToMyList(q.id, prog.priority);
                    }}
                    className={`p-1 rounded transition-colors ${
                      inList ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={inList ? 'In My List' : 'Add to My List'}
                  >
                    {inList ? <BookmarkCheck className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHASE 3 & PHASE 4: CONTINUE & QUICK PICKS                 */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* PHASE 3 — CONTINUE WHERE YOU LEFT OFF */}
        <div className="lg:col-span-5 glass rounded-2xl p-5 sm:p-6 border border-white/8 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Continue Where You Left Off
                </h2>
              </div>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Active Focus
              </span>
            </div>

            {continueQuestion ? (
              <div className="glass rounded-xl border border-white/8 p-4 space-y-3 bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => {
                      setLastInteracted(continueQuestion.id);
                      toggleComplete(continueQuestion.id);
                    }}
                    aria-label={getQuestionProgress(continueQuestion.id).completed ? `Mark ${continueQuestion.title} incomplete` : `Mark ${continueQuestion.title} complete`}
                    className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      getQuestionProgress(continueQuestion.id).completed
                        ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400 shadow-sm'
                        : 'border-white/25 hover:border-indigo-400'
                    }`}
                    title="Mark complete"
                  >
                    {getQuestionProgress(continueQuestion.id).completed && (
                      <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      {continueQuestion.category}
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {continueQuestion.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {continueQuestion.badges.map((b) => (
                        <span
                          key={b}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            b === 'N' ? 'badge-n' : 'badge-s'
                          }`}
                        >
                          {b === 'N' ? 'NeetCode 150' : 'Striver Master'}
                        </span>
                      ))}

                      <span className="text-[10px] text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded capitalize font-medium">
                        Priority: {getQuestionProgress(continueQuestion.id).priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Platform links */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs flex-wrap">
                  {continueQuestion.sources.leetcode && (
                    <a
                      href={continueQuestion.sources.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400/85 hover:text-amber-300 font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> LeetCode
                    </a>
                  )}
                  {continueQuestion.sources.neetcode && (
                    <a
                      href={continueQuestion.sources.neetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400/85 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> NeetCode
                    </a>
                  )}
                  {continueQuestion.sources.striver && (
                    <a
                      href={continueQuestion.sources.striver}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400/85 hover:text-red-300 font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Striver
                    </a>
                  )}
                  {continueQuestion.sources.youtube && (
                    <a
                      href={continueQuestion.sources.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400/85 hover:text-rose-300 font-medium inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> YouTube
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                🎉 All 269 questions completed! Outstanding achievement!
              </div>
            )}
          </div>

          {continueQuestion && (
            <button
              onClick={() => handleCategoryClick(continueQuestion.category)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold glass border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/10 transition-all cursor-pointer"
            >
              <span>Continue in {continueQuestion.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* PHASE 4 — QUICK PICKS (Exactly 3 Questions) */}
        <div className="lg:col-span-7 glass rounded-2xl p-5 sm:p-6 border border-white/8 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Quick Picks
              </h2>
            </div>
            <span className="text-[10px] text-slate-400">Curated high-value patterns</span>
          </div>

          <div className="space-y-2.5">
            {quickPicks.map((q, idx) => {
              const inList = isInMyList(q.id);
              const prog = getQuestionProgress(q.id);
              const indexNumber = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={q.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl glass border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.035] transition-all group"
                >
                  {/* Subtle Numbered Indicator: 01, 02, 03 */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-base font-extrabold text-indigo-400/50 group-hover:text-indigo-400 transition-colors font-mono">
                      {indexNumber}
                    </span>

                    <button
                      onClick={() => {
                        setLastInteracted(q.id);
                        toggleComplete(q.id);
                      }}
                      aria-label={prog.completed ? `Mark ${q.title} incomplete` : `Mark ${q.title} complete`}
                      className={`flex-shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        prog.completed
                          ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400'
                          : 'border-white/30 hover:border-indigo-400'
                      }`}
                      title="Mark complete"
                    >
                      {prog.completed && <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          onClick={() => handleCategoryClick(q.category)}
                          className={`text-xs sm:text-sm font-semibold truncate cursor-pointer hover:underline ${
                            prog.completed ? 'line-through text-slate-500' : 'text-slate-200 hover:text-white'
                          }`}
                        >
                          {q.title}
                        </span>

                        {q.badges.map((b) => (
                          <span
                            key={b}
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              b === 'N' ? 'badge-n' : 'badge-s'
                            }`}
                          >
                            {b}
                          </span>
                        ))}

                        <span className="text-[10px] text-slate-400 bg-white/5 border border-white/10 px-1.5 py-0.2 rounded capitalize">
                          {prog.priority}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">{q.category}</div>
                    </div>
                  </div>

                  {/* Actions & Solve Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setLastInteracted(q.id);
                        if (inList) removeFromMyList(q.id);
                        else addToMyList(q.id, prog.priority);
                      }}
                      className={`p-1.5 rounded transition-colors ${
                        inList ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                      }`}
                      title={inList ? 'In My List' : 'Add to My List'}
                    >
                      {inList ? <BookmarkCheck className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    </button>

                    {/* Solve Button */}
                    <button
                      onClick={() => {
                        setLastInteracted(q.id);
                        if (q.sources.leetcode) {
                          window.open(q.sources.leetcode, '_blank', 'noopener,noreferrer');
                        } else if (q.sources.neetcode) {
                          window.open(q.sources.neetcode, '_blank', 'noopener,noreferrer');
                        } else {
                          handleCategoryClick(q.category);
                        }
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all cursor-pointer"
                    >
                      Solve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHASE 5 — CATEGORY HEATMAP ("DSA COVERAGE")               */}
      {/* ========================================================= */}
      <div className="glass rounded-2xl p-5 sm:p-6 border border-white/8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🗺️</span>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                DSA Coverage
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual completion intensity across all 17 canonical pattern domains.
            </p>
          </div>

          {/* Intensity Legend */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
            <span className="text-slate-500">Intensity:</span>
            <span className="px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.02] text-slate-500">0%</span>
            <span className="px-1.5 py-0.5 rounded border border-indigo-500/20 bg-indigo-950/20 text-indigo-300">1-25%</span>
            <span className="px-1.5 py-0.5 rounded border border-indigo-500/30 bg-indigo-900/30 text-indigo-200">26-50%</span>
            <span className="px-1.5 py-0.5 rounded border border-indigo-500/40 bg-indigo-600/20 text-indigo-100">51-75%</span>
            <span className="px-1.5 py-0.5 rounded border border-purple-500/50 bg-purple-600/25 text-purple-100">76-99%</span>
            <span className="px-1.5 py-0.5 rounded border border-emerald-500/50 bg-emerald-500/20 text-emerald-200">100%</span>
          </div>
        </div>

        {/* 17 Category Coverage Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {CATEGORIES.map((cat) => {
            const { completed: catCompleted, total: catTotal, percentage } = getCategoryProgress(cat);
            const tierClass = getHeatmapTierClass(percentage);

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer group flex flex-col justify-between ${tierClass}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-base group-hover:scale-110 transition-transform">
                      {CATEGORY_ICONS[cat] || '📋'}
                    </span>
                    <span className="text-xs font-bold font-mono tracking-tight">
                      {percentage}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-2 leading-tight">
                    {cat}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">
                    {catCompleted}/{catTotal} solved
                  </div>
                  <ProgressBar
                    value={percentage}
                    height="h-1"
                    colorClass={
                      percentage === 100
                        ? 'bg-emerald-400'
                        : percentage >= 76
                        ? 'bg-purple-400'
                        : 'bg-indigo-400'
                    }
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
