/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Plus } from 'lucide-react';
import { useProductivity } from '@/hooks/useDashboard';
import { SkeletonCard } from '../ui/Skeleton';
import Button from '../ui/Button';
import { useUIStore } from '@/stores/uiStore';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    let formattedLabel = label;
    try {
      const date = new Date(label);
      formattedLabel = date.toLocaleDateString('id-ID', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      // fallback
    }

    return (
      <div className="p-3 rounded-xl bg-[#1a1625]/95 backdrop-blur-xl border border-white/[0.08] shadow-lg text-xs">
        <p className="text-white/50 mb-1.5 font-medium font-display">{formattedLabel}</p>
        <div className="space-y-1">
          {payload.map((item: any) => {
            const isHours = item.name.toLowerCase().includes('fokus') || item.name.toLowerCase().includes('focus');
            return (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <span className="text-white/70 flex items-center gap-1.5 font-display">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.stroke || item.color }} />
                  {item.name}:
                </span>
                <span className="font-semibold text-white font-display">
                  {item.value} {isHours ? 'jam' : 'tugas'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function ProductivityTimeline() {
  const { data, isLoading } = useProductivity();
  const { openNewTaskModal } = useUIStore();
  const timelineData = data?.timeline || [];

  // Check if there is any activity (created, completed, or focus hours > 0)
  const hasActivity = timelineData.some(
    (day) => day.created > 0 || day.completed > 0 || (day.focus_hours && day.focus_hours > 0)
  );

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', { weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[235px]">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="
        relative overflow-hidden p-4 lg:p-5 rounded-[20px]
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        h-[235px] flex flex-col justify-between
      "
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-display">Productivity Timeline</h3>
            <p className="text-xs text-white/40 font-display">Aktivitas produktivitas (7 Hari Terakhir)</p>
          </div>
        </div>
        
        {hasActivity && (
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#9f7aea]" />
              <span className="text-[11px] text-white/50 font-display">Jumlah Tugas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#cfbcff]" />
              <span className="text-[11px] text-white/50 font-display">Tugas Selesai</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span className="text-[11px] text-white/50 font-display">Jam Fokus</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {!hasActivity ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="relative mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-[#cfbcff]/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M65 30 A12 12 0 0 1 50 45 A12 12 0 0 0 65 30 Z" fill="currentColor" opacity="0.3" stroke="none" />
                <path d="M10 80 L35 45 L55 60 L85 25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 80 L40 60 L60 70 L90 40" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" opacity="0.5" />
                <circle cx="35" cy="45" r="3" fill="#9f7aea" />
                <circle cx="55" cy="60" r="3" fill="#cfbcff" />
                <circle cx="85" cy="25" r="3" fill="#38bdf8" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-white/70 font-display">Belum ada aktivitas produktivitas</h4>
            <p className="text-xs text-white/40 mt-1 max-w-[280px] font-display">
              Tambahkan tugas dan mulai belajar untuk melihat statistikmu
            </p>
          </div>

        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9f7aea" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9f7aea" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cfbcff" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#cfbcff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickFormatter={formatDate}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                name="Jumlah Tugas"
                dataKey="created"
                stroke="#9f7aea"
                strokeWidth={2}
                fill="url(#createdGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#9f7aea', stroke: '#0b0b14', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                name="Tugas Selesai"
                dataKey="completed"
                stroke="#cfbcff"
                strokeWidth={2}
                fill="url(#completedGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#cfbcff', stroke: '#0b0b14', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                name="Jam Fokus"
                dataKey="focus_hours"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#focusGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#38bdf8', stroke: '#0b0b14', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
