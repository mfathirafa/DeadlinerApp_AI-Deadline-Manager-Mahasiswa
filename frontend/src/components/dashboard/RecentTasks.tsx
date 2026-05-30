import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ClipboardList, Plus } from 'lucide-react';
import { Task } from '@/types';
import { formatDeadline, getDeadlineColor } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Button from '../ui/Button';
import { useUIStore } from '@/stores/uiStore';

interface RecentTasksProps {
  tasks: Task[];
}

const priorityVariant: Record<string, 'danger' | 'warning' | 'default' | 'success'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'default',
  low: 'success',
};

export default function RecentTasks({ tasks }: RecentTasksProps) {
  const router = useRouter();
  const { openNewTaskModal } = useUIStore();
  const minHeightClass = tasks.length <= 3 ? 'min-h-[130px]' : 'min-h-[180px]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`
        relative p-4 lg:p-5 rounded-[20px]
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col justify-between
        ${minHeightClass}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <ClipboardList className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-display">Tugas Terbaru</h3>
            <p className="text-xs text-white/40 font-display">Your latest deadlines</p>
          </div>
        </div>
        <Link
          href="/deadlines"
          className="flex items-center gap-1.5 text-xs text-[#cfbcff]/60 hover:text-[#cfbcff] transition-colors group font-display"
        >
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar pr-2">
        {tasks.length > 0 ? (
          <div className={`w-full ${tasks.length <= 3 ? 'space-y-2' : 'space-y-3'}`}>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                onClick={() => router.push(`/deadlines?edit=${task.id}`)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                className={`rounded-xl border border-white/[0.04] cursor-pointer transition-all group hover:scale-[1.01] active:scale-[0.99] duration-200 ${
                  tasks.length <= 3 ? 'p-2 sm:p-2.5' : 'p-3.5'
                }`}
              >
                <div className={`flex items-start justify-between ${tasks.length <= 3 ? 'mb-1' : 'mb-2'}`}>
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#cfbcff] transition-colors">
                      {task.title}
                    </p>
                    {task.course && (
                      <p className="text-xs text-white/30 mt-0.5">{task.course.name}</p>
                    )}
                  </div>
                  <Badge variant={priorityVariant[task.priority] || 'default'} size="sm">
                    {task.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <ProgressBar value={task.progress} className="flex-1 mr-3" />
                  <span className={`text-[11px] font-medium whitespace-nowrap ${getDeadlineColor(task.deadline)}`}>
                    {formatDeadline(task.deadline)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <ClipboardList className="w-8 h-8 text-blue-400/20 mb-2" />
            <p className="text-xs font-semibold text-white/80 font-display">Belum ada tugas</p>
            <p className="text-[10px] text-white/40 mt-1 font-display">Mulai buat tugas pertamamu sekarang</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
