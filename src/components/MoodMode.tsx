import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Check, Sparkles, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Question } from '../data/questions';

const MOODS = [
  {
    id: 'easy',
    emoji: '🟢',
    label: 'EASY',
    actionText: 'Warm up',
    desc: 'I want something easy',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/50',
    activeClass: 'border-emerald-500/70 bg-emerald-500/15 shadow-lg shadow-emerald-500/10',
    textColor: 'text-emerald-400',
    tagline: 'Smooth & confidence-building fundamentals',
  },
  {
    id: 'normal',
    emoji: '🟡',
    label: 'NORMAL',
    actionText: 'Keep building',
    desc: 'I want a reasonable challenge',
    borderClass: 'border-amber-500/30 hover:border-amber-500/50',
    activeClass: 'border-amber-500/70 bg-amber-500/15 shadow-lg shadow-amber-500/10',
    textColor: 'text-amber-400',
    tagline: 'Standard interview caliber patterns',
  },
  {
    id: 'grind',
    emoji: '🔴',
    label: 'GRIND',
    actionText: 'Push yourself',
    desc: 'Give me something difficult',
    borderClass: 'border-red-500/30 hover:border-red-500/50',
    activeClass: 'border-red-500/70 bg-red-500/15 shadow-lg shadow-red-500/10',
    textColor: 'text-red-400',
    tagline: 'Algorithmic limits & complex edge cases',
  },
  {
    id: 'random',
    emoji: '⚡',
    label: 'RANDOM',
    actionText: 'Surprise me',
    desc: 'Surprise me',
    borderClass: 'border-purple-500/30 hover:border-purple-500/50',
    activeClass: 'border-purple-500/70 bg-purple-500/15 shadow-lg shadow-purple-500/10',
    textColor: 'text-purple-400',
    tagline: 'Unbiased interview simulation pick',
  },
];

export default function MoodMode() {
  const {
    state,
    setMoodMode,
    getQuestionsForMood,
    toggleComplete,
    getQuestionProgress,
    setLastInteracted,
  } = useApp();

  const { moodMode } = state.preferences;
  const [recommendations, setRecommendations] = useState<Question[]>([]);

  useEffect(() => {
    if (moodMode) {
      setRecommendations(getQuestionsForMood(moodMode));
    }
  }, [moodMode, getQuestionsForMood]);

  function handleMoodSelect(id: string) {
    const nextMood = moodMode === id ? null : id;
    setMoodMode(nextMood);
    if (nextMood) {
      setRecommendations(getQuestionsForMood(nextMood));
    } else {
      setRecommendations([]);
    }
  }

  function handleRefresh() {
    if (moodMode) {
      setRecommendations(getQuestionsForMood(moodMode));
    }
  }

  const activeMoodObj = MOODS.find((m) => m.id === moodMode);
  const featuredQuestion = recommendations.length > 0 ? recommendations[0] : null;
  const otherRecommendations = recommendations.slice(1);

  return (
    <div className="space-y-5">
      {/* Intro & 4 Large Mood Cards */}
      <div className="glass rounded-2xl border border-white/8 p-6 sm:p-7 relative overflow-hidden shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">
            Intelligent Problem Recommender
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WHAT DO YOU FEEL LIKE SOLVING?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
            Pick a mood. We'll pick the problem.
          </p>
        </div>

        {/* 4 Large Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {MOODS.map((mood) => {
            const isActive = moodMode === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`glass rounded-xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${
                  isActive ? mood.activeClass : mood.borderClass
                } hover:bg-white/[0.04] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{mood.emoji}</span>
                    {isActive && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className={`text-base font-extrabold tracking-wider ${mood.textColor}`}>
                    {mood.label}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-0.5">
                    "{mood.actionText}"
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-white/5 font-medium">
                  {mood.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Problem Section */}
      {moodMode && (
        <div className="glass rounded-2xl border border-white/8 p-6 sm:p-7 animate-in space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeMoodObj?.emoji}</span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Recommended for {activeMoodObj?.label} Mode
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {state.myList.length > 0
                  ? 'Handpicked from your personal study queue'
                  : 'Handpicked from the 269 canonical pattern master reference'}
              </p>
            </div>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer self-start sm:self-center"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next Pick / Roll ↻</span>
            </button>
          </div>

          {featuredQuestion ? (
            <div className="space-y-6">
              {/* PRIMARY FEATURED CARD */}
              <div className="glass rounded-2xl border border-indigo-500/30 p-5 sm:p-6 bg-indigo-950/20 shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => {
                        setLastInteracted(featuredQuestion.id);
                        toggleComplete(featuredQuestion.id);
                      }}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        getQuestionProgress(featuredQuestion.id).completed
                          ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400 shadow-sm'
                          : 'border-white/30 hover:border-indigo-400'
                      }`}
                      title="Mark complete"
                    >
                      {getQuestionProgress(featuredQuestion.id).completed && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {featuredQuestion.category}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        {featuredQuestion.title}
                      </h3>

                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {featuredQuestion.badges.map((b) => (
                          <span
                            key={b}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              b === 'N' ? 'badge-n' : 'badge-s'
                            }`}
                          >
                            {b === 'N' ? 'NeetCode 150' : 'Striver Master'}
                          </span>
                        ))}

                        <span className="text-[11px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded capitalize">
                          Priority: {getQuestionProgress(featuredQuestion.id).priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SOLVE BUTTON */}
                  <button
                    onClick={() => {
                      setLastInteracted(featuredQuestion.id);
                      if (featuredQuestion.sources.leetcode) {
                        window.open(featuredQuestion.sources.leetcode, '_blank', 'noopener,noreferrer');
                      } else if (featuredQuestion.sources.neetcode) {
                        window.open(featuredQuestion.sources.neetcode, '_blank', 'noopener,noreferrer');
                      } else if (featuredQuestion.sources.striver) {
                        window.open(featuredQuestion.sources.striver, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all interactive-tap cursor-pointer self-start sm:self-center"
                  >
                    <span>Solve Problem</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Available Source Links */}
                <div className="flex items-center gap-2.5 pt-3 border-t border-white/5 text-xs flex-wrap">
                  <span className="text-slate-500 text-[11px] font-medium">Platforms:</span>
                  {featuredQuestion.sources.leetcode && (
                    <a
                      href={featuredQuestion.sources.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" /> LeetCode
                    </a>
                  )}
                  {featuredQuestion.sources.neetcode && (
                    <a
                      href={featuredQuestion.sources.neetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-blue-400/90 hover:text-blue-300 hover:bg-blue-500/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" /> NeetCode
                    </a>
                  )}
                  {featuredQuestion.sources.striver && (
                    <a
                      href={featuredQuestion.sources.striver}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" /> Striver
                    </a>
                  )}
                  {featuredQuestion.sources.youtube && (
                    <a
                      href={featuredQuestion.sources.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" /> YouTube
                    </a>
                  )}
                </div>
              </div>

              {/* OTHER MATCHING PROBLEMS IN THIS MOOD */}
              {otherRecommendations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Also Ready to Solve in this Mood</span>
                  </div>

                  <div className="space-y-2">
                    {otherRecommendations.map((q) => {
                      const prog = getQuestionProgress(q.id);

                      return (
                        <div
                          key={q.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl glass border border-white/5 hover:border-white/15 transition-all text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <button
                              onClick={() => {
                                setLastInteracted(q.id);
                                toggleComplete(q.id);
                              }}
                              className={`flex-shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                prog.completed
                                  ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-400'
                                  : 'border-white/30 hover:border-indigo-400'
                              }`}
                            >
                              {prog.completed && (
                                <Check className="w-2.5 h-2.5 text-emerald-400" strokeWidth={3} />
                              )}
                            </button>

                            <span className="font-semibold text-slate-200 truncate">{q.title}</span>
                            <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                              ({q.category})
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {q.sources.leetcode && (
                              <a
                                href={q.sources.leetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400/80 hover:text-amber-300 font-medium"
                              >
                                LC
                              </a>
                            )}
                            {q.sources.neetcode && (
                              <a
                                href={q.sources.neetcode}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400/80 hover:text-blue-300 font-medium"
                              >
                                NC
                              </a>
                            )}
                            {q.sources.striver && (
                              <a
                                href={q.sources.striver}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-400/80 hover:text-red-300 font-medium"
                              >
                                STR
                              </a>
                            )}

                            <button
                              onClick={() => {
                                setLastInteracted(q.id);
                                if (q.sources.leetcode) {
                                  window.open(q.sources.leetcode, '_blank', 'noopener,noreferrer');
                                } else if (q.sources.neetcode) {
                                  window.open(q.sources.neetcode, '_blank', 'noopener,noreferrer');
                                }
                              }}
                              className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
                            >
                              Solve
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center space-y-3">
              <div className="text-4xl">🏆</div>
              <h3 className="text-base font-bold text-white">All problems completed for this mood!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Outstanding progress! Switch to another mood, add fresh problems to My List, or reset to review.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
