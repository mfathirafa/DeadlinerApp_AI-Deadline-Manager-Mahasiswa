'use client';

import { ClipboardList, BookOpen, Brain, Sparkles } from 'lucide-react';

export interface SearchResult {
  id: string;
  type: 'task' | 'course' | 'insight' | 'recommendation';
  title: string;
  subtitle?: string;
  score: number;
  originalItem: any;
}

interface SearchResultItemProps {
  item: SearchResult;
  query: string;
  isActive: boolean;
  onClick: () => void;
}

const iconMap = {
  task: ClipboardList,
  course: BookOpen,
  insight: Brain,
  recommendation: Sparkles,
};

const iconColorMap = {
  task: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  course: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  insight: 'text-[#cfbcff] bg-[#9f7aea]/10 border-[#9f7aea]/20',
  recommendation: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="text-[#cfbcff] font-semibold bg-white/[0.08] px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function SearchResultItem({ item, query, isActive, onClick }: SearchResultItemProps) {
  const IconComponent = iconMap[item.type] || ClipboardList;
  const colors = iconColorMap[item.type] || iconColorMap.task;

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-2.5 rounded-xl cursor-pointer
        transition-all duration-200 border border-transparent
        ${isActive 
          ? 'bg-white/[0.08] border-white/[0.08] text-white scale-[1.01]' 
          : 'hover:bg-white/[0.04] text-white/70 hover:text-white'
        }
      `}
    >
      <div className={`p-1.5 rounded-lg border ${colors} flex-shrink-0`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          <HighlightedText text={item.title} query={query} />
        </p>
        {item.subtitle && (
          <p className="text-[10px] text-white/40 mt-0.5 truncate">{item.subtitle}</p>
        )}
      </div>
    </div>
  );
}
