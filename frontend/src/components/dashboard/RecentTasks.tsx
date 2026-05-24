'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Task } from '@/types';
import { formatDeadline, getDeadlineColor } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="
        relative overflow-hidden p-6 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col
      "
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Recent Tasks</h3>
            <p className="text-xs text-white/40">Your latest deadlines</p>
          </div>
        </div>
        <Link
          href="/deadlines"
          className="flex items-center gap-1.5 text-xs text-[#cfbcff]/60 hover:text-[#cfbcff] transition-colors group"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 space-y-3">
        {tasks.length > 0 ? tasks.slice(0, 5).map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="p-3.5 rounded-xl border border-white/[0.04] cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
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
        )) : (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-white/15 mx-auto mb-2" />
            <p className="text-sm text-white/30">No tasks yet</p>
            <p className="text-xs text-white/20 mt-1">Create your first task to get started</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
