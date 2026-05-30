'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Award, Target, TrendingUp,
  Edit3, Save, CheckCircle2, Zap, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import { useCourses } from '@/hooks/useCourses';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CircularProgress from '@/components/ui/CircularProgress';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: dashboard, isLoading: dashLoading } = useDashboard();
  const { data: tasks } = useTasks();
  const { data: courses } = useCourses();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const stats = dashboard?.stats;
  const totalTasks = stats?.total_tasks || 0;
  const completedTasks = stats?.completed_tasks || 0;
  const focusScore = stats?.focus_score || 0;
  const completionRate = stats?.completion_rate || 0;

  // Achievements based on stats
  const achievements = [
    {
      label: 'Task Master',
      description: 'Complete 10+ tasks',
      unlocked: completedTasks >= 10,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      label: 'Focused Mind',
      description: 'Achieve 80%+ focus score',
      unlocked: focusScore >= 80,
      icon: Target,
      color: 'purple',
    },
    {
      label: 'Consistent',
      description: 'Complete 5+ tasks without overdue',
      unlocked: completedTasks >= 5 && (stats?.overdue_tasks || 0) === 0,
      icon: TrendingUp,
      color: 'blue',
    },
    {
      label: 'Scholar',
      description: 'Register 3+ courses',
      unlocked: (courses?.length || 0) >= 3,
      icon: Award,
      color: 'yellow',
    },
    {
      label: 'Speedrunner',
      description: 'Complete a task within 1 hour',
      unlocked: false,
      icon: Zap,
      color: 'orange',
    },
    {
      label: 'AI Pioneer',
      description: 'Use AI analysis on 3+ tasks',
      unlocked: (tasks?.filter((t) => t.ai_analysis)?.length || 0) >= 3,
      icon: Sparkles,
      color: 'pink',
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    pink: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  };

  if (dashLoading) {
    return (
      <div className="space-y-6 max-w-[1000px]">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1000px] mx-auto min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <User className="w-6 h-6 text-[#cfbcff]" />
          Profile
        </h1>
        <p className="text-sm text-white/40 mt-1">Your account and achievements</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-6" gradient glow hover={false}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-xl opacity-30" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0f0d13] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-3 max-w-sm">
                  <Input
                    label="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" glow icon={<Save className="w-3.5 h-3.5" />}
                      onClick={() => setIsEditing(false)}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-white">{user?.name || ''}</h2>
                  <p className="text-sm text-white/50 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user?.email || ''}
                  </p>
                  <p className="text-xs text-white/30 flex items-center gap-1.5 justify-center sm:justify-start mt-1">
                    <Calendar className="w-3 h-3" />
                    Joined {user?.created_at ? formatDate(user.created_at) : 'Recently'}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3"
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>

            {/* Focus Score */}
            <div className="flex-shrink-0">
              <CircularProgress
                value={focusScore}
                size={120}
                strokeWidth={8}
                label="Focus"
                sublabel="Score"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Tasks', value: totalTasks, icon: Target, color: 'text-[#cfbcff]' },
          { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Completion %', value: `${completionRate}%`, icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Courses', value: courses?.length || 0, icon: Award, color: 'text-yellow-400' },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-4 text-center">
            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
              >
                <GlassCard
                  className={`p-4 ${!ach.unlocked ? 'opacity-40' : ''}`}
                  glow={ach.unlocked}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[ach.color] || colorMap.purple}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{ach.label}</h4>
                      <p className="text-xs text-white/40">{ach.description}</p>
                    </div>
                    {ach.unlocked && (
                      <Badge variant="success" size="sm" className="ml-auto">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
