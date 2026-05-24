'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Tasks',
      value: stats.total_tasks,
      icon: ListTodo,
      color: 'from-purple-500 to-violet-400',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      change: '+12%',
      trend: 'up' as const,
    },
    {
      label: 'Completed',
      value: stats.completed_tasks,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-400',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      change: '+8%',
      trend: 'up' as const,
    },
    {
      label: 'Pending',
      value: stats.pending_tasks,
      icon: Clock,
      color: 'from-amber-500 to-yellow-400',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      change: '-3%',
      trend: 'down' as const,
    },
    {
      label: 'Overdue',
      value: stats.overdue_tasks,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-400',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      change: '-5%',
      trend: 'down' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -3, boxShadow: `0 8px 40px ${card.bgGlow}` }}
            className="
              relative overflow-hidden p-5 rounded-2xl
              bg-white/[0.04] backdrop-blur-xl
              border border-white/[0.06]
              group cursor-pointer
            "
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: card.bgGlow }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{card.label}</p>
                <p className="text-3xl font-bold text-white font-display">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20`}
                style={{ background: card.bgGlow }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="relative flex items-center gap-1 mt-3">
              {card.trend === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="text-xs text-emerald-400 font-medium">{card.change}</span>
              <span className="text-xs text-white/30 ml-1">vs last week</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
