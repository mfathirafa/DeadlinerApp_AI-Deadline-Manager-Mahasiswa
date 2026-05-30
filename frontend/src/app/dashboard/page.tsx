'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/uiStore';
import Button from '@/components/ui/Button';
import StatsCards from '@/components/dashboard/StatsCards';
import AIInsightCard from '@/components/dashboard/AIInsightCard';
import ProductivityTimeline from '@/components/dashboard/ProductivityTimeline';
import FocusScoreCircle from '@/components/dashboard/FocusScoreCircle';
import RecentTasks from '@/components/dashboard/RecentTasks';
import SmartRecommendations from '@/components/dashboard/SmartRecommendations';
import { SkeletonCard } from '@/components/ui/Skeleton';


export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useDashboard();
  const { openNewTaskModal } = useUIStore();

  const getGreeting = (hour: number) => {
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 15) return 'Good Afternoon';
    if (hour >= 15 && hour < 18) return 'Good Evening';
    return 'Good Night';
  };

  // Use backend current_hour with client-side fallback
  const currentHour = dashboard?.stats?.current_hour ?? new Date().getHours();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="h-4 w-40 bg-white/[0.03] rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><SkeletonCard /></div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    overdue_tasks: 0,
    completion_rate: 0,
    focus_score: 75,
    current_hour: new Date().getHours(),
  };

  return (
    <div className="space-y-8 w-full max-w-[1600px] mx-auto min-w-0 pt-6 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center gap-2">
            {getGreeting(currentHour)}, {user?.name || 'User'} 👋
          </h1>
          <p className="text-sm text-white/50 mt-1.5 font-display">
            ✨ Tetap fokus dan selesaikan tugas hari ini!
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="!mt-0 w-full">
        <StatsCards stats={stats} />
      </div>

      {/* ROW 2: 70% Productivity Chart, 30% Focus Score */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full min-w-0 !mt-5">
        <div className="lg:col-span-7 min-w-0 w-full overflow-hidden">
          <ProductivityTimeline />
        </div>
        <div className="lg:col-span-3 min-w-0 w-full overflow-hidden">
          <FocusScoreCircle
            score={stats.focus_score}
            completionRate={stats.completion_rate}
            completedTasks={stats.completed_tasks || 0}
            totalTasks={stats.total_tasks}
            overdueCount={stats.overdue_tasks}
          />
        </div>
      </div>

      {/* ROW 3: 60% Recent Tasks, 40% AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 w-full min-w-0 !mt-6">
        <div className="lg:col-span-6 min-w-0 w-full overflow-hidden">
          <RecentTasks tasks={dashboard?.recent_tasks || []} />
        </div>
        <div className="lg:col-span-4 min-w-0 w-full overflow-hidden">
          <AIInsightCard insights={dashboard?.ai_insights || []} taskCount={dashboard?.recent_tasks?.length || 0} />
        </div>
      </div>

      {/* ROW 4: Smart Recommendations */}
      <div className="!mt-5 w-full">
        <SmartRecommendations recommendations={dashboard?.recommendations || []} />
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-white/20 border-t border-white/[0.04] !mt-5">
        © 2026 AuraAI Deadliner. All rights reserved.
      </div>
    </div>
  );
}
