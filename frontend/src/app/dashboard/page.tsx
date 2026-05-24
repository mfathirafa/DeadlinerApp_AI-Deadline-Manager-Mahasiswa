'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

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
    focus_score: 0,
  };

  return (
    <div className="space-y-6 w-full max-w-[1400px] mx-auto min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
            <Sparkles className="w-5 h-5 text-[#cfbcff]" />
          </h1>
          <p className="text-sm text-white/40 mt-1">Here&apos;s your productivity overview</p>
        </div>
      </motion.div>

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Main Grid - Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-w-0">
        <div className="xl:col-span-2 min-w-0 w-full overflow-hidden">
          <ProductivityTimeline data={dashboard?.productivity_data || []} />
        </div>
        <div className="min-w-0 w-full overflow-hidden">
          <FocusScoreCircle
            score={stats.focus_score || 75}
            completionRate={stats.completion_rate || 0}
          />
        </div>
      </div>

      {/* Main Grid - Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full min-w-0">
        <div className="xl:col-span-2 min-w-0 w-full overflow-hidden">
          <RecentTasks tasks={dashboard?.recent_tasks || []} />
        </div>
        <div className="min-w-0 w-full overflow-hidden">
          <AIInsightCard insights={dashboard?.ai_insights || []} />
        </div>
      </div>

      {/* Recommendations */}
      <SmartRecommendations recommendations={dashboard?.recommendations || []} />
    </div>
  );
}
