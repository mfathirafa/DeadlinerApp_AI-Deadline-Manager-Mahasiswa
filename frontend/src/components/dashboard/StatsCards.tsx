/* eslint-disable react-hooks/set-state-in-effect */
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
    total_change?: string | null;
    completed_change?: string | null;
    pending_change?: string | null;
    overdue_change?: string | null;
  };
}

import { useEffect, useState } from 'react';

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      setCount(value);
      return;
    }
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / 1000, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  if (process.env.NODE_ENV === 'test') {
    return <>{value}</>;
  }

  return <>{count}</>;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Tugas',
      value: stats.total_tasks,
      icon: ListTodo,
      color: 'from-purple-500 to-violet-400',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      change: stats.total_change,
      trend: stats.total_change?.startsWith('-') ? 'down' as const : 'up' as const,
    },
    {
      label: 'Selesai',
      value: stats.completed_tasks,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-400',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      change: stats.completed_change,
      trend: stats.completed_change?.startsWith('-') ? 'down' as const : 'up' as const,
    },
    {
      label: 'Pending',
      value: stats.pending_tasks,
      icon: Clock,
      color: 'from-amber-500 to-yellow-400',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      change: stats.pending_change,
      trend: stats.pending_change?.startsWith('-') ? 'down' as const : 'up' as const,
    },
    {
      label: 'Terlambat',
      value: stats.overdue_tasks,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-400',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      change: stats.overdue_change,
      trend: stats.overdue_change?.startsWith('-') ? 'down' as const : 'up' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              relative overflow-hidden py-3 px-4 lg:py-3.5 lg:px-4.5 rounded-[20px]
              bg-white/[0.04] backdrop-blur-xl
              border border-white/[0.06]
              group cursor-pointer min-h-[96px] flex flex-col justify-between
            "
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: card.bgGlow }}
            />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-white/40 uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-3xl sm:text-4xl font-bold text-white font-display"><CountUp value={card.value} /></p>
              </div>
              <div className="p-2.5 rounded-2xl bg-gradient-to-br bg-opacity-20 flex-shrink-0"
                style={{ background: card.bgGlow }}
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>

            {card.change ? (
              <div className="relative flex items-center gap-1 mt-2">
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={`text-xs font-medium ${card.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.change}
                </span>
                <span className="text-xs text-white/30 ml-1">vs last week</span>
              </div>
            ) : (
              <div className="relative flex items-center gap-1 mt-2">
                <span className="text-xs text-white/30">Tidak ada perubahan</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
