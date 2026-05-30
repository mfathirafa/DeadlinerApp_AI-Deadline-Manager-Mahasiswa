'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Calendar 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Recommendation } from '@/types';
import { useUIStore } from '@/stores/uiStore';
import { useTasks } from '@/hooks/useTasks';
import { useCourses } from '@/hooks/useCourses';
import { trackEvent } from '@/lib/analytics';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
}

const priorityColors: Record<string, string> = {
  high: 'from-red-500/10 to-orange-500/5 border-red-500/15 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]',
  medium: 'from-yellow-500/10 to-amber-500/5 border-yellow-500/15 hover:border-yellow-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
  low: 'from-emerald-500/10 to-green-500/5 border-emerald-500/15 hover:border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
};

const iconMap: Record<string, any> = {
  clock: Clock,
  book: BookOpen,
  target: Target,
  warning: AlertTriangle,
  calendar: Calendar,
  sparkles: Sparkles,
  lightbulb: Lightbulb,
};

const AVAILABLE_ROUTES = ['/calendar', '/courses', '/deadlines'];

export default function SmartRecommendations({ recommendations }: SmartRecommendationsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: courses = [], isLoading: coursesLoading } = useCourses();

  const [isNavigating, setIsNavigating] = useState(false);

  // Navigation recovery: reset navigation state whenever pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  const handleCardClick = (rec: Recommendation) => {
    if (tasksLoading || coursesLoading) return;
    if (isNavigating) return;

    let destination = '';
    let destinationBase = '';

    const recType = rec.type || (
      rec.title.toLowerCase().includes('pomodoro') ? 'pomodoro' :
      rec.title.toLowerCase().includes('mata kuliah') ? 'study_planning' :
      rec.title.toLowerCase().includes('deadline') ? 'upcoming_deadline' : 'quick_actions'
    );

    switch (recType) {
      case 'pomodoro':
        destination = '/calendar?action=pomodoro';
        destinationBase = '/calendar';
        break;
      case 'study_planning':
        destination = '/courses?scroll=true&highlight=true';
        destinationBase = '/courses';
        break;
      case 'upcoming_deadline':
        destination = '/deadlines?sort=nearest&highlight=urgent';
        destinationBase = '/deadlines';
        break;
      case 'quick_actions':
        destination = '/courses';
        destinationBase = '/courses';
        break;
      default:
        destination = '/courses';
        destinationBase = '/courses';
    }

    setIsNavigating(true);

    // Route Safety check
    if (!AVAILABLE_ROUTES.includes(destinationBase)) {
      toast.error('Halaman tujuan tidak tersedia.');
      setIsNavigating(false);
      return;
    }

    // Empty state safety check
    if (destinationBase === '/calendar' || destinationBase === '/deadlines') {
      if (!tasks || tasks.length === 0) {
        toast.error('Tidak ada data yang tersedia.');
        setIsNavigating(false);
        return;
      }
    } else if (destinationBase === '/courses') {
      if (!courses || courses.length === 0) {
        toast.error('Tidak ada data yang tersedia.');
        setIsNavigating(false);
        return;
      }
    }

    // Track recommendation clicked event
    trackEvent('recommendation_clicked', {
      recommendation_type: recType,
      destination_page: destinationBase,
    });

    router.push(destination);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rec: Recommendation) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.key === ' ') {
        e.preventDefault();
      }
      handleCardClick(rec);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="
        relative overflow-hidden p-4 lg:p-5 rounded-[20px]
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
      "
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-amber-500/10">
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2 font-display">
            Smart Recommendations
            <Sparkles className="w-3.5 h-3.5 text-[#cfbcff]" />
          </h3>
          <p className="text-xs text-white/40 font-display">AI-powered suggestions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.length > 0 ? recommendations.map((rec, index) => {
          const IconComponent = rec.icon && iconMap[rec.icon] ? iconMap[rec.icon] : Lightbulb;
          const isLoadingOrNavigating = tasksLoading || coursesLoading || isNavigating;

          return (
            <motion.div
              key={rec.id}
              onClick={() => handleCardClick(rec)}
              onKeyDown={(e) => handleKeyDown(e, rec)}
              tabIndex={0}
              role="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className={`
                p-3.5 lg:p-4 rounded-xl bg-gradient-to-r border focus:outline-none focus:ring-2 focus:ring-violet-500/50
                flex flex-col justify-between h-full min-h-[140px]
                ${isLoadingOrNavigating 
                  ? 'cursor-not-allowed opacity-70 transition-all duration-200' 
                  : 'cursor-pointer hover:scale-[1.01] hover:border-violet-500/30 transition-all duration-200'
                }
                ${priorityColors[rec.priority] || priorityColors.medium}
              `}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${
                    rec.priority === 'high' ? 'text-red-400' :
                    rec.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-white font-display">{rec.title}</h4>
                </div>
                <p className="text-xs text-white/50 mb-2.5 leading-relaxed font-display">{rec.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="w-fit pointer-events-none text-[#cfbcff] hover:text-white"
              >
                {rec.action}
              </Button>
            </motion.div>
          );
        }) : (
          <div className="text-center py-6 col-span-2">
            <Lightbulb className="w-8 h-8 text-white/15 mx-auto mb-2" />
            <p className="text-sm text-white/40 font-medium font-display">Belum ada rekomendasi</p>
            <p className="text-xs text-white/20 mt-1 font-display">Selesaikan tugas untuk menerima saran produktivitas</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
