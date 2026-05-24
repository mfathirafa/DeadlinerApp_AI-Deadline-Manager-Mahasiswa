'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ProductivityPoint } from '@/types';

interface ProductivityTimelineProps {
  data: ProductivityPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-[#1a1625]/95 backdrop-blur-xl border border-white/[0.08] shadow-lg">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
          {payload[0].value} tasks
        </p>
        <p className="text-xs text-[#cfbcff]">
          {payload[1]?.value}h focus
        </p>
      </div>
    );
  }
  return null;
};

export default function ProductivityTimeline({ data }: ProductivityTimelineProps) {
  const defaultData = [
    { date: 'Mon', tasks_completed: 3, focus_hours: 4 },
    { date: 'Tue', tasks_completed: 5, focus_hours: 6 },
    { date: 'Wed', tasks_completed: 2, focus_hours: 3 },
    { date: 'Thu', tasks_completed: 7, focus_hours: 8 },
    { date: 'Fri', tasks_completed: 4, focus_hours: 5 },
    { date: 'Sat', tasks_completed: 6, focus_hours: 7 },
    { date: 'Sun', tasks_completed: 3, focus_hours: 4 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="
        relative overflow-hidden p-6 rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-full flex flex-col justify-between
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Productivity Timeline</h3>
            <p className="text-xs text-white/40">Weekly performance overview</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#9f7aea]" />
            <span className="text-[11px] text-white/40">Tasks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#cfbcff]" />
            <span className="text-[11px] text-white/40">Focus Hours</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9f7aea" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#9f7aea" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cfbcff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#cfbcff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="tasks_completed"
              stroke="#9f7aea"
              strokeWidth={2}
              fill="url(#tasksGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#9f7aea', stroke: '#0f0d13', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="focus_hours"
              stroke="#cfbcff"
              strokeWidth={2}
              fill="url(#focusGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#cfbcff', stroke: '#0f0d13', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
