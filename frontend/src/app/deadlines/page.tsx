'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, AlertTriangle, CheckCircle2, Circle, Timer, Sparkles,
  Filter, SortAsc, SortDesc, Trash2, Brain, ChevronDown, ChevronUp,
  CalendarClock, Flag, ArrowUpRight,
} from 'lucide-react';
import { useTasks, useUpdateTaskStatus, useDeleteTask, useAnalyzeTask } from '@/hooks/useTasks';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDeadline, getDeadlineColor, getPriorityColor, getStatusColor } from '@/lib/utils';
import { Task } from '@/types';

const statusFilters = [
  { value: 'all', label: 'All Tasks', icon: Circle },
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'in_progress', label: 'In Progress', icon: Timer },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
  { value: 'overdue', label: 'Overdue', icon: AlertTriangle },
];

const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export default function DeadlinesPage() {
  const { data: tasks, isLoading } = useTasks();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const analyzeTask = useAnalyzeTask();

  const [activeFilter, setActiveFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const filteredTasks = useMemo(() => {
    let result = tasks || [];
    if (activeFilter !== 'all') {
      result = result.filter((t) => t.status === activeFilter);
    }
    return result.sort((a, b) => {
      // Sort by priority first, then by deadline
      const pA = priorityOrder[a.priority] ?? 99;
      const pB = priorityOrder[b.priority] ?? 99;
      if (pA !== pB) return sortAsc ? pA - pB : pB - pA;
      return sortAsc
        ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    });
  }, [tasks, activeFilter, sortAsc]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks?.length || 0 };
    tasks?.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  const nextStatus = (current: string) => {
    const flow: Record<string, string> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
      overdue: 'in_progress',
    };
    return flow[current] || 'pending';
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-[#cfbcff]" />
            Deadlines & Tasks
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {tasks?.length || 0} total tasks · {statusCounts['overdue'] || 0} overdue
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={sortAsc ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          onClick={() => setSortAsc(!sortAsc)}
        >
          {sortAsc ? 'Priority ↑' : 'Priority ↓'}
        </Button>
      </motion.div>

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {statusFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-[#9f7aea]/20 text-[#cfbcff] border border-[#9f7aea]/30 shadow-[0_0_15px_rgba(159,122,234,0.15)]'
                  : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-[#9f7aea]/30' : 'bg-white/[0.06]'}`}>
                {statusCounts[filter.value] || 0}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <GlassCard
                className="p-5 cursor-pointer"
                gradient={task.priority === 'critical'}
                glow={task.priority === 'critical'}
                onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              >
                {/* Priority & Status */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      task.priority === 'critical' ? 'danger'
                        : task.priority === 'high' ? 'warning'
                        : task.priority === 'medium' ? 'info'
                        : 'success'
                    }
                    size="sm"
                  >
                    <Flag className="w-3 h-3" />
                    {task.priority}
                  </Badge>

                  <Badge
                    variant={
                      task.status === 'completed' ? 'success'
                        : task.status === 'overdue' ? 'danger'
                        : task.status === 'in_progress' ? 'info'
                        : 'default'
                    }
                    size="sm"
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{task.title}</h3>

                {/* Course Tag */}
                {task.course && (
                  <p className="text-xs text-white/40 mb-3">
                    {task.course.code} · {task.course.name}
                  </p>
                )}

                {/* Deadline */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className={`w-3.5 h-3.5 ${getDeadlineColor(task.deadline)}`} />
                  <span className={`text-xs font-medium ${getDeadlineColor(task.deadline)}`}>
                    {formatDeadline(task.deadline)}
                  </span>
                </div>

                {/* Progress */}
                <ProgressBar
                  value={task.progress}
                  color={task.status === 'completed' ? 'green' : task.status === 'overdue' ? 'red' : 'purple'}
                  showLabel
                />

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedTask === task.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-3">
                        {task.description && (
                          <p className="text-xs text-white/50 leading-relaxed">{task.description}</p>
                        )}

                        {task.ai_analysis && (
                          <div className="p-3 rounded-xl bg-[#9f7aea]/10 border border-[#9f7aea]/20">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Brain className="w-3.5 h-3.5 text-[#cfbcff]" />
                              <span className="text-xs font-medium text-[#cfbcff]">AI Analysis</span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed">{task.ai_analysis}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              updateStatus.mutate({ id: task.id, status: nextStatus(task.status) });
                            }}
                            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                          >
                            → {nextStatus(task.status).replace('_', ' ')}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              analyzeTask.mutate(task.id);
                            }}
                            icon={<Sparkles className="w-3.5 h-3.5" />}
                          >
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              deleteTask.mutate(task.id);
                            }}
                            icon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand indicator */}
                <div className="flex justify-center mt-2">
                  {expandedTask === task.id
                    ? <ChevronUp className="w-4 h-4 text-white/20" />
                    : <ChevronDown className="w-4 h-4 text-white/20" />
                  }
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-1">No tasks found</h3>
          <p className="text-sm text-white/30">
            {activeFilter === 'all'
              ? 'Create a new task to get started'
              : `No ${activeFilter.replace('_', ' ')} tasks`
            }
          </p>
        </motion.div>
      )}
    </div>
  );
}
