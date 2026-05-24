export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  course_id?: number;
  course?: Course;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  deadline: string;
  progress: number;
  ai_analysis?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  color: string;
  task_count?: number;
  completed_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  stats: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    completion_rate: number;
    focus_score: number;
  };
  recent_tasks: Task[];
  ai_insights: AIInsight[];
  productivity_data: ProductivityPoint[];
  recommendations: Recommendation[];
}

export interface AIInsight {
  id: number;
  title: string;
  description: string;
  type: 'warning' | 'suggestion' | 'achievement' | 'analysis';
  icon?: string;
}

export interface ProductivityPoint {
  date: string;
  tasks_completed: number;
  focus_hours: number;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface CreateTaskData {
  title: string;
  description: string;
  course_id?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface CreateCourseData {
  name: string;
  code: string;
  color: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
