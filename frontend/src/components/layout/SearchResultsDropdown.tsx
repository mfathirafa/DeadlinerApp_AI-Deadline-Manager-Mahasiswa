'use client';

import { motion } from 'framer-motion';
import SearchResultItem, { SearchResult } from './SearchResultItem';

interface SearchResultsDropdownProps {
  results: SearchResult[];
  query: string;
  activeIndex: number;
  isSearching: boolean;
  onItemClick: (item: SearchResult) => void;
}

export default function SearchResultsDropdown({
  results,
  query,
  activeIndex,
  isSearching,
  onItemClick,
}: SearchResultsDropdownProps) {
  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="
          absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl
          border border-white/[0.08] bg-[#0b0b14]/95 backdrop-blur-2xl
          shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-center text-xs text-white/40
          flex items-center justify-center gap-2
        "
      >
        <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Searching...
      </motion.div>
    );
  }

  if (!query.trim()) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="
          absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl
          border border-white/[0.08] bg-[#0b0b14]/95 backdrop-blur-2xl
          shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-center text-xs text-white/40
        "
      >
        Mulai mengetik untuk mencari tugas, mata kuliah, atau AI insight...
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="
          absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl
          border border-white/[0.08] bg-[#0b0b14]/95 backdrop-blur-2xl
          shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-center text-xs text-white/40
        "
      >
        No results found for '<span className="font-semibold text-white">{query}</span>'
      </motion.div>
    );
  }

  // Group results
  const tasks = results.filter((r) => r.type === 'task');
  const courses = results.filter((r) => r.type === 'course');
  const insights = results.filter((r) => r.type === 'insight' || r.type === 'recommendation');

  // We need to match global active index relative to grouped sections.
  // We can construct a flat list of items to identify their global indexes.
  const flatItems = [...tasks, ...courses, ...insights];

  let globalIndexCounter = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="
        absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl
        border border-white/[0.08] bg-[#0b0b14]/95 backdrop-blur-2xl
        shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 max-h-[380px] overflow-y-auto
        flex flex-col gap-2 custom-scrollbar
      "
    >
      {/* Tasks Section */}
      {tasks.length > 0 && (
        <div>
          <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            Tasks
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            {tasks.map((item) => {
              const currentIdx = globalIndexCounter++;
              return (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  query={query}
                  isActive={activeIndex === currentIdx}
                  onClick={() => onItemClick(item)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {courses.length > 0 && (
        <div>
          <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            Courses
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            {courses.map((item) => {
              const currentIdx = globalIndexCounter++;
              return (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  query={query}
                  isActive={activeIndex === currentIdx}
                  onClick={() => onItemClick(item)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Insights/Recommendations Section */}
      {insights.length > 0 && (
        <div>
          <div className="px-3 py-1 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            Insights
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            {insights.map((item) => {
              const currentIdx = globalIndexCounter++;
              return (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  query={query}
                  isActive={activeIndex === currentIdx}
                  onClick={() => onItemClick(item)}
                />
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
