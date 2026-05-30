/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useUpdateTask } from '@/hooks/useTasks';
import { useCourses } from '@/hooks/useCourses';
import { Task } from '@/types';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const updateTask = useUpdateTask();
  const { data: courses } = useCourses();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState('');

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setCourseId(task.course_id ? String(task.course_id) : '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'pending');
      
      // Format deadline date for datetime-local input (YYYY-MM-DDTHH:MM)
      if (task.deadline) {
        try {
          const date = new Date(task.deadline);
          // Adjust to local timezone format
          const pad = (num: number) => String(num).padStart(2, '0');
          const localString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
          setDeadline(localString);
        } catch {
          setDeadline('');
        }
      } else {
        setDeadline('');
      }
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateTask.mutateAsync({
        id: task.id,
        data: {
          title,
          description,
          course_id: courseId ? parseInt(courseId) : undefined,
          priority: priority as 'low' | 'medium' | 'high' | 'critical',
          status: status as 'pending' | 'in_progress' | 'completed' | 'overdue',
          deadline,
        },
      });
      onClose();
    } catch (error: any) {
      console.error('Failed to update task:', error);
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

  const statusOptions = [
    { value: 'pending', label: '⏳ Pending' },
    { value: 'in_progress', label: '⚡ In Progress' },
    { value: 'completed', label: '✅ Completed' },
    { value: 'overdue', label: '🚨 Overdue' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task" size="lg">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={statusOptions}
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
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            glow
            loading={updateTask.isPending}
            icon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
