/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useCreateTask } from '@/hooks/useTasks';
import { useCourses } from '@/hooks/useCourses';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function NewTaskModal() {
  const { newTaskModalOpen, closeNewTaskModal, prefilledDeadline } = useUIStore();
  const createTask = useCreateTask();
  const { data: courses } = useCourses();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [difficulty, setDifficulty] = useState('3');
  const [estimatedHours, setEstimatedHours] = useState('2');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (newTaskModalOpen && prefilledDeadline) {
      // Format prefilledDate (YYYY-MM-DD) to HTML datetime-local format (YYYY-MM-DDTHH:MM)
      // Usually dateStr from calendar is YYYY-MM-DD. Let's append T09:00 as default time.
      if (prefilledDeadline.includes('T')) {
        setDeadline(prefilledDeadline);
      } else {
        setDeadline(`${prefilledDeadline}T09:00`);
      }
    } else if (newTaskModalOpen) {
      const pad = (num: number) => String(num).padStart(2, '0');
      const date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in the future
      setDeadline(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`);
    }
  }, [newTaskModalOpen, prefilledDeadline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTask.mutateAsync({
        title,
        description,
        course_id: courseId ? parseInt(courseId) : undefined,
        priority: priority as 'low' | 'medium' | 'high' | 'critical',
        difficulty: parseInt(difficulty),
        estimated_hours: parseFloat(estimatedHours),
        deadline: deadline ? new Date(deadline).toISOString() : '',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCourseId('');
      setPriority('medium');
      setDifficulty('3');
      setEstimatedHours('2');
      setDeadline('');
      closeNewTaskModal();
    } catch (error: any) {
      console.error('Failed to create task:', error);
      // The error is already handled in useTasks hook's onError with a toast,
      // but we can add specific error handling here if we want.
    }
  };

  const courseOptions = [
    { value: '', label: 'No course' },
    ...(courses?.map((c) => ({ value: String(c.id), label: `${c.code} - ${c.name}` })) || []),
  ];

  const priorityOptions = [
    { value: 'low', label: '🟢 Low' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'high', label: '🟠 High' },
    { value: 'critical', label: '🔴 Critical' },
  ];

  return (
    <Modal isOpen={newTaskModalOpen} onClose={closeNewTaskModal} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Task Title"
          placeholder="e.g., Complete Machine Learning Assignment"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task..."
            rows={3}
            className="
              w-full px-4 py-3 rounded-xl
              bg-white/[0.05] backdrop-blur-sm
              border border-white/[0.08]
              text-white placeholder:text-white/30
              focus:outline-none focus:border-[#cfbcff]/40
              focus:shadow-[0_0_20px_rgba(207,188,255,0.1)]
              transition-all duration-300 resize-none
            "
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Course"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            options={courseOptions}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={priorityOptions}
          />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: '1', label: '1 - Very Easy' },
              { value: '2', label: '2 - Easy' },
              { value: '3', label: '3 - Medium' },
              { value: '4', label: '4 - Hard' },
              { value: '5', label: '5 - Very Hard' },
            ]}
          />
          <Input
            label="Est. Hours"
            type="number"
            min="0.5"
            step="0.5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
            required
          />
        </div>

        <Input
          label="Deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={closeNewTaskModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            glow
            loading={createTask.isPending}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
