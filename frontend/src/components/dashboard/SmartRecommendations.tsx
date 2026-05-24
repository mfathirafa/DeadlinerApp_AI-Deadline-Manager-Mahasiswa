'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { Recommendation } from '@/types';
import Button from '@/components/ui/Button';

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
}

const priorityColors: Record<string, string> = {
  high: 'from-red-500/10 to-orange-500/5 border-red-500/15',
  medium: 'from-yellow-500/10 to-amber-500/5 border-yellow-500/15',
  low: 'from-emerald-500/10 to-green-500/5 border-emerald-500/15',
};

export default function SmartRecommendations({ recommendations }: SmartRecommendationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="
        relative overflow-hidden p-6 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
      "
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            Smart Recommendations
            <Sparkles className="w-3.5 h-3.5 text-[#cfbcff]" />
          </h3>
          <p className="text-xs text-white/40">AI-powered suggestions</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.length > 0 ? recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className={`p-4 rounded-xl bg-gradient-to-r border ${priorityColors[rec.priority] || priorityColors.medium}`}
          >
            <h4 className="text-sm font-medium text-white mb-1">{rec.title}</h4>
            <p className="text-xs text-white/50 mb-3">{rec.description}</p>
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              {rec.action}
            </Button>
          </motion.div>
        )) : (
          <div className="text-center py-6">
            <Lightbulb className="w-8 h-8 text-white/15 mx-auto mb-2" />
            <p className="text-sm text-white/30">Complete more tasks for recommendations</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
