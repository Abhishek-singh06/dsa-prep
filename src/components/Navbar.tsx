import { useState, useRef, useEffect } from 'react';
import {
  Code2,
  Settings,
  Download,
  Upload,
  RotateCcw,
  X,
  Check,
  LayoutDashboard,
  Bookmark,
  Brain,
} from 'lucide-react';
import SearchBar from './SearchBar';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from '../data/questions';
import ProgressBar from './ProgressBar';

export type Tab = 'dashboard' | 'questions' | 'mylist' | 'mood';

interface NavbarProps {
  onLogoClick?: () => void;
  onSearchActive?: () => void;
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export default function Navbar({
  onLogoClick,
  onSearchActive,
  activeTab = 'dashboard',
  onTabChange,
}: NavbarProps) {
  const { getCompletedCount, resetAllProgress, exportBackup, importBackup, state } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completed = getCompletedCount();
  const total = QUESTIONS.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const myListCount = state.myList.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings]);

  const handleExport = () => {
    const data = exportBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackup(content);
      if (success) {
        setImportStatus('Data imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Failed to parse backup JSON.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const navTabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'questions', label: 'Questions', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'mylist', label: 'My List', icon: <Bookmark className="w-3.5 h-3.5" /> },
    { id: 'mood', label: 'Mood Mode', icon: <Brain className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/8 px-3 sm:px-6 py-2.5 w-full backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 w-full">
        {/* Left: Logo & Subtitle */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          title="Return to Dashboard"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold gradient-text leading-tight tracking-wide">
              DSA OS
            </div>
            <div className="text-[10px] text-slate-400 font-medium leading-tight hidden sm:block">
              Master the patterns.
            </div>
          </div>
        </div>

        {/* Center: Desktop Nav Tabs */}
        {onTabChange && (
          <div className="hidden lg:flex items-center gap-1 glass rounded-xl border border-white/8 p-1">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.id === 'mylist' && myListCount > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200">
                      {myListCount}
                    </span>
                  )}
                  {tab.id === 'mood' && state.preferences.moodMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Search */}
        <div className="flex-1 min-w-0 flex justify-center max-w-xs xl:max-w-sm mx-1">
          <SearchBar onSearchActive={onSearchActive} />
        </div>

        {/* Right: Overall Progress + Settings */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2.5">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Progress
              </div>
              <div className="text-xs font-bold text-slate-200">
                <span className="text-indigo-400">{completed}</span>
                <span className="text-slate-500"> / {total}</span>
                <span className="text-[11px] text-slate-400 ml-1">({pct}%)</span>
              </div>
            </div>
            <div className="w-20">
              <ProgressBar value={pct} height="h-1.5" />
            </div>
          </div>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
            title="Settings & Data Management"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="overlay" onClick={() => setShowSettings(false)} />
          <div className="glass rounded-2xl border border-white/10 p-6 max-w-md w-full relative z-10 space-y-5 animate-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-200">Settings & Local Storage</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importStatus && (
              <div className="p-2.5 rounded-lg text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" /> {importStatus}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Data Backup & Portability
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  All progress is stored locally in your browser. Export anytime to back up or move to another device.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" /> Export JSON
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-400" /> Import JSON
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Reset Progress
                </h4>
                {resetConfirm ? (
                  <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/30 space-y-2.5 animate-in">
                    <div className="text-xs font-bold text-red-300">
                      Reset all DSA progress?
                    </div>
                    <p className="text-[11px] text-red-200/80 leading-relaxed">
                      This will permanently remove your completion status, notes, priorities and lists from this browser.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setResetConfirm(false)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium glass border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          resetAllProgress();
                          setResetConfirm(false);
                          setShowSettings(false);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                      >
                        Reset Everything
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-500 mb-3">
                      Clear all completed statuses, personal comments, and My List entries.
                    </p>
                    <button
                      onClick={() => setResetConfirm(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-400 glass border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-500 text-center">
              DSA OS · 269 unique problems deduplicated reference
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
