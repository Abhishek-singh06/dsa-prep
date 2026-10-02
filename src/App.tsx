import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import QuestionList from './components/QuestionList';
import MyList from './components/MyList';
import MoodMode from './components/MoodMode';
import {
  LayoutDashboard,
  Code2,
  Bookmark,
  Brain,
  Menu,
  X,
  PlayCircle,
  ArrowRight,
} from 'lucide-react';

type Tab = 'dashboard' | 'questions' | 'mylist' | 'mood';

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'questions', label: 'All Questions', icon: <Code2 className="w-4 h-4" /> },
  { id: 'mylist', label: 'My List', icon: <Bookmark className="w-4 h-4" /> },
  { id: 'mood', label: 'Mood Mode', icon: <Brain className="w-4 h-4" /> },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { state, setSelectedCategory, getContinueQuestion } = useApp();
  const myListCount = state.myList.length;
  const continueQuestion = getContinueQuestion();

  const handleNavigateToCategory = (cat?: string) => {
    if (cat) {
      setSelectedCategory(cat);
    }
    setActiveTab('questions');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 sm:pb-0">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogoClick={() => setActiveTab('dashboard')}
        onSearchActive={() => setActiveTab('questions')}
      />

      {/* Subtle Atmospheric Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-3.5 sm:px-5 lg:px-7 py-4 sm:py-6">
        {/* Navigation Tabs (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-1.5 mb-5 glass rounded-xl border border-white/8 p-1.5 w-fit shadow-lg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'mylist' && myListCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-indigo-200">
                  {myListCount}
                </span>
              )}
              {tab.id === 'mood' && state.preferences.moodMode && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="animate-in">
            <Dashboard onNavigateToQuestions={handleNavigateToCategory} />
          </div>
        )}

        {/* Tab 2: All Questions (Sidebar + FilterBar + QuestionList) */}
        {activeTab === 'questions' && (
          <div className="animate-in space-y-4">
            {/* Quick Context Banner: Continue where you left off */}
            {continueQuestion && (
              <div className="glass rounded-lg border border-white/8 px-3.5 py-2 flex items-center justify-between gap-3 text-xs bg-indigo-950/20">
                <div className="flex items-center gap-2 min-w-0">
                  <PlayCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span className="text-slate-400 hidden sm:inline">Continue solving:</span>
                  <span className="font-semibold text-slate-200 truncate">{continueQuestion.title}</span>
                  <span className="text-[10px] text-indigo-300/80 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.2 rounded flex-shrink-0">
                    {continueQuestion.category}
                  </span>
                </div>
                <button
                  onClick={() => handleNavigateToCategory(continueQuestion.category)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  <span>Filter Category</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex gap-5 lg:gap-7 items-start">
              {/* Desktop Left Sidebar */}
              <aside className="hidden lg:block flex-shrink-0">
                <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
                  <Sidebar />
                </div>
              </aside>

              {/* Mobile Drawer Overlay */}
              {mobileSidebarOpen && (
                <>
                  <div
                    className="overlay lg:hidden transition-opacity"
                    onClick={() => setMobileSidebarOpen(false)}
                  />
                  <div className="fixed left-0 top-0 bottom-0 z-50 w-72 glass border-r border-white/10 p-4 overflow-y-auto lg:hidden animate-in shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Categories
                      </span>
                      <button
                        onClick={() => setMobileSidebarOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div onClick={() => setMobileSidebarOpen(false)}>
                      <Sidebar />
                    </div>
                  </div>
                </>
              )}

              {/* Center Content Feed */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Mobile Sidebar Trigger & Category indicator */}
                <div className="flex items-center justify-between gap-2 lg:hidden">
                  <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="flex items-center gap-2 glass border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-white/5 transition-all shadow-sm"
                  >
                    <Menu className="w-4 h-4" />
                    <span>Categories:</span>
                    <span className="text-slate-200 font-normal truncate max-w-[180px]">
                      {state.preferences.selectedCategory
                        ? state.preferences.selectedCategory
                        : 'All (17)'}
                    </span>
                  </button>
                </div>

                {/* Filters Bar */}
                <FilterBar />

                {/* Questions Stream */}
                <QuestionList />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: My List Tab */}
        {activeTab === 'mylist' && (
          <div className="max-w-4xl mx-auto animate-in">
            <MyList />
          </div>
        )}

        {/* Tab 4: Mood Mode Tab */}
        {activeTab === 'mood' && (
          <div className="max-w-4xl mx-auto animate-in">
            <MoodMode />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 px-2 py-1.5 flex items-center justify-around backdrop-blur-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-all ${
              activeTab === tab.id ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.id === 'mylist' && myListCount > 0 && (
                <span className="absolute -top-1.5 -right-2 text-[9px] w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                  {myListCount}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop/Tablet Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-600 mt-8">
        DSA OS · Built locally with React + Vite + TypeScript + Tailwind CSS · 269 Curated Problems
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
