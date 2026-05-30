'use client';

import { motion } from 'framer-motion';
import {
  Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb,
  Target, Zap, Shield, ArrowRight, BarChart3, Clock,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CircularProgress from '@/components/ui/CircularProgress';
import { SkeletonCard } from '@/components/ui/Skeleton';

const insightTypeConfig: Record<string, { icon: typeof Brain; color: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  suggestion: { icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  achievement: { icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  analysis: { icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AIInsightsPage() {
  const { data: dashboard, isLoading: dashLoading } = useDashboard();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const isLoading = dashLoading || tasksLoading;

  // Compute AI metrics from tasks
  const overdueTasks = tasks?.filter((t) => t.status === 'overdue') || [];
  const criticalTasks = tasks?.filter((t) => t.priority === 'critical' && t.status !== 'completed') || [];
  const completedToday = tasks?.filter((t) => {
    const updated = new Date(t.updated_at);
    const today = new Date();
    return t.status === 'completed' &&
      updated.getDate() === today.getDate() &&
      updated.getMonth() === today.getMonth();
  }) || [];

  const stats = dashboard?.stats;
  const insights = dashboard?.ai_insights || [];
  const recommendations = dashboard?.recommendations || [];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] px-4 md:px-6 lg:px-8">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
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
          <Brain className="w-6 h-6 text-[#cfbcff]" />
          AI Insights
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Intelligent analysis of your productivity and task patterns
        </p>
      </motion.div>

      {/* AI Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        {/* Focus Score */}
        <GlassCard className="p-6 flex flex-col items-center justify-center" glow gradient hover={false}>
          <div className="relative mb-4">
            <div className="absolute -inset-4 rounded-full bg-[#9f7aea]/10 blur-2xl animate-pulse-glow" />
            <CircularProgress
              value={stats?.focus_score || 0}
              size={160}
              strokeWidth={10}
              label="Focus Score"
              sublabel="AI Calculated"
            />
          </div>
          <p className="text-xs text-white/40 text-center mt-2 max-w-[200px]">
            Based on your task completion patterns and deadline adherence
          </p>
        </GlassCard>

        {/* Quick Stats */}
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Performance Snapshot
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm text-white/70">Completion Rate</span>
              </div>
              <span className="text-sm font-bold text-emerald-400">{stats?.completion_rate || 0}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-sm text-white/70">Overdue Tasks</span>
              </div>
              <span className="text-sm font-bold text-red-400">{overdueTasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-white/70">Critical Tasks</span>
              </div>
              <span className="text-sm font-bold text-purple-400">{criticalTasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-white/70">Completed Today</span>
              </div>
              <span className="text-sm font-bold text-blue-400">{completedToday.length}</span>
            </div>
          </div>
        </GlassCard>

        {/* Risk Assessment */}
        <GlassCard className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#cfbcff]" />
              Risk Analysis
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">
              Real-time
            </span>
          </div>

          <div className="space-y-4">
            {/* Risk Meter Gauge */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/40 font-medium">Risk Score</span>
                <span className={`font-bold tracking-wide ${
                  (stats?.risk_score || 0) <= 25 ? 'text-emerald-400' :
                  (stats?.risk_score || 0) <= 50 ? 'text-yellow-400' :
                  (stats?.risk_score || 0) <= 75 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {stats?.risk_score || 0}% · {
                    (stats?.risk_score || 0) <= 25 ? 'LOW' :
                    (stats?.risk_score || 0) <= 50 ? 'MEDIUM' :
                    (stats?.risk_score || 0) <= 75 ? 'HIGH' : 'CRITICAL'
                  }
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.risk_score || 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    (stats?.risk_score || 0) <= 25 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                    (stats?.risk_score || 0) <= 50 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' :
                    (stats?.risk_score || 0) <= 75 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  }`}
                />
              </div>
            </div>

            {/* Overdue Task List */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-white/50 px-1">Risk Factors (Overdue)</h4>
              {overdueTasks.length > 0 ? (
                overdueTasks.slice(0, 3).map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/[0.04] border border-red-500/10"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-white/80 truncate">{task.title}</p>
                      <p className="text-[10px] text-red-400/60 mt-0.5">{task.course?.code || 'No course'}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">No Risk Factors</p>
                  <p className="text-[10px] text-white/30 mt-0.5">All deadlines are up to date</p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* AI Insights Cards */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#cfbcff]" />
            AI Analysis
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {insights.map((insight, idx) => {
              const config = insightTypeConfig[insight.type] || insightTypeConfig.analysis;
              const Icon = config.icon;
              return (
                <motion.div key={insight.id || idx} variants={item}>
                  <GlassCard className="p-5" hover>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} border flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white mb-1">{insight.title}</h3>
                        <p className="text-xs text-white/50 leading-relaxed">{insight.description}</p>
                        <Badge variant={
                          insight.type === 'warning' ? 'warning'
                            : insight.type === 'achievement' ? 'success'
                            : insight.type === 'suggestion' ? 'info'
                            : 'purple'
                        } size="sm" className="mt-3">
                          {insight.type}
                        </Badge>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Smart Recommendations
          </h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {recommendations.map((rec, idx) => (
              <motion.div key={rec.id || idx} variants={item}>
                <GlassCard className="p-5 h-full" hover>
                  <div className="flex flex-col h-full">
                    <Badge
                      variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'success'}
                      size="sm"
                      className="self-start mb-3"
                    >
                      {rec.priority} priority
                    </Badge>
                    <h3 className="text-sm font-semibold text-white mb-2">{rec.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed flex-1">{rec.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-start mt-4"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {rec.action}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Empty state when no insights */}
      {insights.length === 0 && recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#9f7aea]/20 to-[#cfbcff]/10 flex items-center justify-center">
              <Brain className="w-10 h-10 text-[#cfbcff]/50" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-[#9f7aea]/10 blur-2xl animate-pulse-glow" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-2">Belum ada data produktivitas</h3>
          <p className="text-sm text-white/30 max-w-sm">
            Selesaikan lebih banyak tugas dan AI akan menghasilkan wawasan dan rekomendasi personal untuk Anda.
          </p>
        </motion.div>
      )}
    </div>
  );
}
