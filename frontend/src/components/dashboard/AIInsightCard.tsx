'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, AlertCircle, Trophy, Lightbulb } from 'lucide-react';
import { AIInsight } from '@/types';

interface AIInsightCardProps {
  insights: AIInsight[];
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

export default function AIInsightCard({ insights }: AIInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="
        relative overflow-hidden p-6 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col
      "
    >
      {/* Gradient border accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#9f7aea]/40 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
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

      {/* AI Typing Animation */}
      <div className="flex items-center gap-1 mb-4 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04] w-fit">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#cfbcff]" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#cfbcff]" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-[#cfbcff]" />
        <span className="text-xs text-white/30 ml-2">AI is analyzing your tasks...</span>
      </div>

      {/* Insights */}
      <div className="flex-1 space-y-3">
        {insights.length > 0 ? insights.map((insight, index) => {
          const Icon = iconMap[insight.type] || Brain;
          const colors = colorMap[insight.type] || colorMap.analysis;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-xl ${colors.bg} border ${colors.border}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`} />
              <div>
                <p className="text-sm font-medium text-white">{insight.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{insight.description}</p>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-6">
            <Brain className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/30">No insights yet. Add more tasks!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
