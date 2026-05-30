import { motion } from 'framer-motion';
import { Target, Zap, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import CircularProgress from '@/components/ui/CircularProgress';

interface FocusScoreCircleProps {
  score: number;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
}

export default function FocusScoreCircle({ 
  score, 
  completionRate, 
  completedTasks, 
  totalTasks, 
  overdueCount 
}: FocusScoreCircleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="
        relative overflow-hidden p-4 lg:p-5 rounded-[20px]
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-[235px] flex flex-col justify-between
      "
    >
      <div className="flex items-center gap-3 mb-2 flex-shrink-0">
        <div className="p-2 rounded-xl bg-[#9f7aea]/10">
          <Target className="w-5 h-5 text-[#cfbcff]" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white leading-none">Focus Score</h3>
          <p className="text-[11px] text-white/40 mt-1">Your productivity level</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-shrink-0">
            <CircularProgress
              value={score}
              size={90}
              strokeWidth={7}
              label={totalTasks === 0 ? "Skor Baseline" : "Skor Fokus"}
            />
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center justify-between p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 min-w-0">
                <Zap className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                <span className="text-[11px] text-white/60 truncate">Completion Rate</span>
              </div>
              <span className="text-[11px] font-semibold text-white flex-shrink-0">
                {totalTasks === 0 ? '-' : `${completionRate}%`}
              </span>
            </div>

            <div className="flex items-center justify-between p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] text-white/60 truncate">Tugas Selesai</span>
              </div>
              <span className="text-[11px] font-semibold text-white flex-shrink-0">
                {completedTasks}/{totalTasks}
              </span>
            </div>

            <div className="flex items-center justify-between p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 min-w-0">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-[11px] text-white/60 truncate">Terlambat</span>
              </div>
              <span className="text-[11px] font-semibold text-red-400 flex-shrink-0">
                {overdueCount}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 min-w-0">
                <Target className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="text-[11px] text-white/60 truncate">Daily Goal</span>
              </div>
              <span className="text-[11px] font-semibold text-purple-400 flex-shrink-0">
                {Math.min(5, completedTasks)}/5
              </span>
            </div>
          </div>
        </div>

        {/* Small advice message at the bottom */}
        <div className="mt-1.5 flex-shrink-0">
          {totalTasks === 0 ? (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <Clock className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
              <p className="text-[10px] text-white/40 truncate">Mulai selesaikan tugas pertamamu.</p>
            </div>
          ) : score >= 100 ? (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10">
              <Zap className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <p className="text-[10px] text-emerald-400/60 truncate">Sempurna! Semua tugas selesai hari ini.</p>
            </div>
          ) : score >= 75 ? (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/10">
              <Target className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <p className="text-[10px] text-emerald-400/60 truncate">Bagus! Produktivitasmu cukup baik.</p>
            </div>
          ) : score >= 25 ? (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-amber-500/[0.04] border-amber-500/10">
              <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <p className="text-[10px] text-amber-400/60 truncate">Perlu Perhatian. Ada tugas pending.</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-red-500/[0.04] border border-red-500/10">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              <p className="text-[10px] text-red-400/60 truncate">Mulai selesaikan tugas pending kuliahmu.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
