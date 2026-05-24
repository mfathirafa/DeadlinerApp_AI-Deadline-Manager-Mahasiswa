'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDeadline, getDeadlineColor } from '@/lib/utils';
import { Task } from '@/types';

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: '#ef444430', border: '#ef4444', text: '#fca5a5' },
  high: { bg: '#f9731630', border: '#f97316', text: '#fdba74' },
  medium: { bg: '#eab30830', border: '#eab308', text: '#fde047' },
  low: { bg: '#22c55e30', border: '#22c55e', text: '#86efac' },
};

function CalendarWidget({ tasks }: { tasks: Task[] }) {
  const [CalendarComponent, setCalendarComponent] = useState<any>(null);
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      import('@fullcalendar/react'),
      import('@fullcalendar/daygrid'),
      import('@fullcalendar/interaction'),
    ]).then(([calModule, dayGridModule, interactionModule]) => {
      setCalendarComponent(() => calModule.default);
      setPlugins([dayGridModule.default, interactionModule.default]);
    });
  }, []);

  const events = useMemo(() => {
    return tasks.map((task) => {
      const colors = priorityColors[task.priority] || priorityColors.medium;
      return {
        id: String(task.id),
        title: task.title,
        start: task.deadline,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: colors.text,
        extendedProps: {
          priority: task.priority,
          status: task.status,
          course: task.course?.code,
        },
      };
    });
  }, [tasks]);

  if (!CalendarComponent || plugins.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#9f7aea]/20 animate-pulse flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-[#cfbcff]" />
          </div>
          <p className="text-xs text-white/30">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <CalendarComponent
      plugins={plugins}
      initialView="dayGridMonth"
      events={events}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek',
      }}
      height="auto"
      eventDisplay="block"
      dayMaxEvents={3}
      eventTimeFormat={{
        hour: '2-digit' as const,
        minute: '2-digit' as const,
        hour12: false,
      }}
    />
  );
}

export default function CalendarPage() {
  const { data: tasks, isLoading } = useTasks();

  // Upcoming deadlines (next 7 days)
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return (tasks || [])
      .filter((t) => {
        const deadline = new Date(t.deadline);
        return deadline >= now && deadline <= weekLater && t.status !== 'completed';
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-[#cfbcff]" />
          Calendar
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Visualize your deadlines and schedule
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-5" hover={false}>
            <CalendarWidget tasks={tasks || []} />
          </GlassCard>
        </motion.div>

        {/* Sidebar - Upcoming */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#cfbcff]" />
              Upcoming (7 days)
            </h3>
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all"
                  >
                    <h4 className="text-sm text-white font-medium truncate">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs ${getDeadlineColor(task.deadline)}`}>
                        {formatDeadline(task.deadline)}
                      </span>
                      {task.course && (
                        <Badge variant="purple" size="sm">{task.course.code}</Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/30 mx-auto mb-2" />
                  <p className="text-xs text-white/30">No upcoming deadlines</p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Legend */}
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-sm font-semibold text-white mb-3">Priority Legend</h3>
            <div className="space-y-2">
              {Object.entries(priorityColors).map(([key, colors]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.border }}
                  />
                  <span className="text-xs text-white/60 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
