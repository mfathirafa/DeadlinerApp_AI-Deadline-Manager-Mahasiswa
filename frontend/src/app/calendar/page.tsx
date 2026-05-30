'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Plus } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDeadline, getDeadlineColor } from '@/lib/utils';
import { Task } from '@/types';
import { useUIStore } from '@/stores/uiStore';
import Button from '@/components/ui/Button';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import toast from 'react-hot-toast';

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: '#ef444430', border: '#ef4444', text: '#fca5a5' },
  high: { bg: '#f9731630', border: '#f97316', text: '#fdba74' },
  medium: { bg: '#eab30830', border: '#eab308', text: '#fde047' },
  low: { bg: '#22c55e30', border: '#22c55e', text: '#86efac' },
};

interface CalendarWidgetProps {
  tasks: Task[];
  onDateClick: (dateStr: string) => void;
  onEventClick: (task: Task) => void;
}

function CalendarWidget({ tasks, onDateClick, onEventClick }: CalendarWidgetProps) {
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
      dateClick={(info: any) => {
        onDateClick(info.dateStr);
      }}
      eventClick={(info: any) => {
        const taskId = info.event.id;
        const clickedTask = tasks.find((t) => String(t.id) === String(taskId));
        if (clickedTask) {
          onEventClick(clickedTask);
        }
      }}
    />
  );
}

function CalendarPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');

  const { data: tasks, isLoading } = useTasks();
  const { openNewTaskModal } = useUIStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<{ date: string; tasks: Task[] } | null>(null);

  const handleDateClick = (dateStr: string) => {
    const matchingTasks = (tasks || []).filter((task) => {
      return task.deadline.startsWith(dateStr);
    });
    setSelectedDateTasks({ date: dateStr, tasks: matchingTasks });
  };

  useEffect(() => {
    if (action === 'pomodoro' && tasks && tasks.length > 0) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = `${yyyy}-${mm}-${dd}`;

      handleDateClick(todayStr);
      toast("Gunakan teknik Pomodoro 25 menit untuk sesi belajar berikutnya.", { icon: '⏱️' });

      // Clear search parameters
      router.replace(pathname);
    }
  }, [action, tasks, router, pathname]);

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
      <div className="space-y-6 max-w-[1600px] px-4 md:px-6 lg:px-8">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto min-w-0 px-4 md:px-6 lg:px-8">
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

      {/* Main Grid: 75% calendar, 25% sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full min-w-0 overflow-hidden">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 min-w-0 w-full overflow-hidden"
        >
          <GlassCard className="p-5" hover={false}>
            {(!tasks || tasks.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-semibold text-white/60 mb-1">Belum ada jadwal</h3>
                <p className="text-sm text-white/30 mb-5 max-w-xs">
                  Buat tugas baru dengan tenggat waktu untuk menampilkannya di kalender
                </p>
                <Button
                  glow
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => openNewTaskModal()}
                >
                  Add Task
                </Button>
              </div>
            ) : (
              <CalendarWidget
                tasks={tasks}
                onDateClick={handleDateClick}
                onEventClick={(task) => setSelectedTask(task)}
              />
            )}
          </GlassCard>
        </motion.div>

        {/* Sidebar - Upcoming & Legend */}
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
                    onClick={() => setSelectedTask(task)}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] transition-all cursor-pointer"
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
                  <p className="text-xs text-white/30">Belum ada jadwal</p>
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

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}

      {/* Tasks on Date Modal */}
      {selectedDateTasks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDateTasks(null)} />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#110e19]/95 backdrop-blur-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
            <h3 className="text-lg font-bold text-white font-display mb-4">
              Tugas untuk tanggal {new Date(selectedDateTasks.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar mb-5 pr-1">
              {selectedDateTasks.tasks.length > 0 ? (
                selectedDateTasks.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setSelectedDateTasks(null);
                    }}
                    className="p-3.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.08] cursor-pointer transition-all hover:scale-[1.01] duration-200"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-white truncate">{task.title}</h4>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant={task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : task.priority === 'low' ? 'success' : 'default'} size="sm">
                          {task.priority}
                        </Badge>
                        <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'purple' : task.status === 'overdue' ? 'danger' : 'default'} size="sm">
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <ProgressBar value={task.progress} className="flex-1 mr-3" />
                      <span className="text-[10px] text-white/40">
                        Tenggat: {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-white/[0.01] rounded-xl border border-dashed border-white/[0.05]">
                  <Clock className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-sm text-white/60 font-semibold font-display">Tidak ada tugas</p>
                  <p className="text-xs text-white/30 mt-1 font-display">Semua tenggat waktu untuk tanggal ini bersih!</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDateTasks(null)}
              >
                Tutup
              </Button>
              <Button
                glow
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  openNewTaskModal(selectedDateTasks.date);
                  setSelectedDateTasks(null);
                }}
              >
                Tambah Tugas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 max-w-[1600px] px-4 md:px-6 lg:px-8">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <SkeletonCard />
      </div>
    }>
      <CalendarPageContent />
    </Suspense>
  );
}
