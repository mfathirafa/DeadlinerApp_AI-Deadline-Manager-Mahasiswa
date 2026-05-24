'use client';

import { motion } from 'framer-motion';
import { Target, Zap } from 'lucide-react';
import CircularProgress from '@/components/ui/CircularProgress';

interface FocusScoreCircleProps {
  score: number;
  completionRate: number;
}

export default function FocusScoreCircle({ score, completionRate }: FocusScoreCircleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="
        relative overflow-hidden p-6 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col justify-between
      "
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-[#9f7aea]/10">
          <Target className="w-5 h-5 text-[#cfbcff]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Focus Score</h3>
          <p className="text-xs text-white/40">Your productivity level</p>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <CircularProgress
          value={score}
          size={160}
          strokeWidth={10}
          label="Focus"
          sublabel="Score"
        />

        <div className="mt-6 w-full space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white/60">Completion Rate</span>
            </div>
            <span className="text-sm font-semibold text-white">{completionRate}%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#cfbcff]" />
              <span className="text-sm text-white/60">Daily Goal</span>
            </div>
            <span className="text-sm font-semibold text-[#cfbcff]">On Track</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
