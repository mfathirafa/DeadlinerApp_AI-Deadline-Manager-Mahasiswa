import { motion } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, Trophy, Lightbulb, Plus } from 'lucide-react';
import { AIInsight } from '@/types';
import Button from '../ui/Button';
import { useUIStore } from '@/stores/uiStore';

interface AIInsightCardProps {
  insights: AIInsight[];
  taskCount?: number;
}

const iconMap = {
  warning: AlertCircle,
  suggestion: Lightbulb,
  achievement: Trophy,
  analysis: Brain,
};

const colorMap = {
  warning: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  suggestion: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  achievement: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  analysis: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

export default function AIInsightCard({ insights, taskCount = 0 }: AIInsightCardProps) {
  const { openNewTaskModal } = useUIStore();
  const minHeightClass = taskCount <= 3 ? 'min-h-[130px]' : 'min-h-[180px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`
        relative p-4 lg:p-5 rounded-[20px]
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col justify-between
        ${minHeightClass}
      `}
    >
      {/* Gradient border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#9f7aea]/40 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#9f7aea]/20 to-purple-600/10">
          <Brain className="w-5 h-5 text-[#cfbcff]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            AI Insights
            <Sparkles className="w-4 h-4 text-[#cfbcff] animate-pulse" />
          </h3>
          <p className="text-xs text-white/40">Powered by AuraAI</p>
        </div>
      </div>

      {/* Insights */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar pr-2">
        {insights.length > 0 ? (
          <div className="space-y-5 w-full">
            {insights.map((insight, index) => {
              const Icon = iconMap[insight.type] || Brain;
              const colors = colorMap[insight.type] || colorMap.analysis;
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`flex items-start gap-4 py-3 px-4 rounded-xl ${colors.bg} border ${colors.border}`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white leading-relaxed">{insight.title}</p>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{insight.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Sparkles className="w-8 h-8 text-[#cfbcff]/20 mb-2 animate-pulse" />
            <p className="text-xs font-semibold text-white/80 font-display">Belum ada data untuk dianalisis</p>
            <p className="text-[10px] text-white/40 mt-1 max-w-[200px] font-display">
              Buat tugas atau tambahkan mata kuliah untuk mendapatkan insight AI
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
