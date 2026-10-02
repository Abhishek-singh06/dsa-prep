import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  onSearchActive?: () => void;
}

export default function SearchBar({ onSearchActive }: SearchBarProps) {
  const { state, setSearchQuery } = useApp();
  const query = state.preferences.searchQuery;

  const handleChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() && onSearchActive) {
      onSearchActive();
    }
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => {
          if (query.trim() && onSearchActive) onSearchActive();
        }}
        placeholder="Search questions, categories, badges (NeetCode/Striver)..."
        className="w-full glass rounded-lg pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 border border-white/8 focus:border-indigo-500/50 focus:bg-white/6 transition-all"
      />
      {query && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
