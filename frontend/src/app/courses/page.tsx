'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Pencil, Trash2, GraduationCap,
  CheckCircle2, FolderOpen,
} from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/useCourses';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Modal from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Course } from '@/types';

const presetColors = [
  '#9f7aea', '#cfbcff', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
];

function CoursesPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scroll = searchParams.get('scroll');
  const highlight = searchParams.get('highlight');

  const { data: courses, isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  // Highlight state and timeout reference
  const [highlightActive, setHighlightActive] = useState(false);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#9f7aea');

  const resetForm = () => {
    setName('');
    setCode('');
    setColor('#9f7aea');
  };

  useEffect(() => {
    if (scroll === 'true' && highlight === 'true' && courses && courses.length > 0) {
      const element = document.getElementById('course-list');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setHighlightActive(true);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightActive(false);
      }, 4000);

      // Clear query parameters
      router.replace(pathname);
    }

    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [scroll, highlight, courses, router, pathname]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourse.mutateAsync({ name, code, color });
    resetForm();
    setShowCreateModal(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;
    await updateCourse.mutateAsync({ id: editCourse.id, data: { name, code, color } });
    resetForm();
    setEditCourse(null);
  };

  const openEditModal = (course: Course) => {
    setName(course.name);
    setCode(course.code);
    setColor(course.color);
    setEditCourse(course);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1400px]">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#cfbcff]" />
            Courses
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {courses?.length || 0} courses registered
          </p>
        </div>

        <Button
          glow
          icon={<Plus className="w-4 h-4" />}
          onClick={() => { resetForm(); setShowCreateModal(true); }}
        >
          Add Course
        </Button>
      </motion.div>

      {/* Course Cards */}
      <div id="course-list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full min-w-0">
        <AnimatePresence mode="popLayout">
          {courses?.map((course, index) => {
            const totalTasks = course.task_count || 0;
            const completedTasks = course.completed_count || 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <GlassCard 
                  className={`p-5 h-full transition-all duration-300 ${
                    highlightActive 
                      ? 'ring-2 ring-violet-500/50 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-[1.01]' 
                      : ''
                  }`} 
                  hover
                >
                  {/* Color Accent */}
                  <div
                    className="w-full h-1 rounded-full mb-4"
                    style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}80)` }}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${course.color}20` }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: course.color }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{course.name}</h3>
                        <Badge variant="purple" size="sm">{course.code}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <FolderOpen className="w-3.5 h-3.5" />
                      {totalTasks} tasks
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400/70">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {completedTasks} done
                    </div>
                  </div>

                  {/* Progress */}
                  <ProgressBar
                    value={progress}
                    color={progress === 100 ? 'green' : progress > 50 ? 'blue' : 'purple'}
                    showLabel
                  />

                  {/* Actions */}
                  <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(course)}
                      icon={<Pencil className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteCourse.mutate(course.id)}
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {(!courses || courses.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-1">Belum ada mata kuliah</h3>
          <p className="text-sm text-white/30 mb-4">Tambahkan mata kuliah Anda untuk mengatur tugas-tugas</p>
          <Button
            glow
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { resetForm(); setShowCreateModal(true); }}
          >
            Add Your First Course
          </Button>
        </motion.div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || !!editCourse}
        onClose={() => { setShowCreateModal(false); setEditCourse(null); resetForm(); }}
        title={editCourse ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={editCourse ? handleUpdate : handleCreate} className="space-y-5">
          <Input
            label="Course Name"
            placeholder="e.g., Machine Learning"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Course Code"
            placeholder="e.g., CS401"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Color</label>
            <div className="flex gap-2 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`
                    w-8 h-8 rounded-lg transition-all duration-200
                    ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f0d13] scale-110' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => { setShowCreateModal(false); setEditCourse(null); resetForm(); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              glow
              loading={createCourse.isPending || updateCourse.isPending}
            >
              {editCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 max-w-[1400px] px-4 md:px-6 lg:px-8 pt-6">
        <div className="h-8 w-48 bg-white/[0.04] rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
