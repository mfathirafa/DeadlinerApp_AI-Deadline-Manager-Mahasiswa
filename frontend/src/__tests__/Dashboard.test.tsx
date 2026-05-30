import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';

// Mock useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Ardhian' },
  }),
}));

// Mock useTasks and useCourses
jest.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    data: [],
    isLoading: false,
  }),
}));

jest.mock('@/hooks/useCourses', () => ({
  useCourses: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Mock useDashboard
jest.mock('@/hooks/useDashboard', () => ({
  useDashboard: () => ({
    data: {
      stats: {
        total_tasks: 5,
        completed_tasks: 2,
        pending_tasks: 3,
        overdue_tasks: 0,
        completion_rate: 40,
        focus_score: 90,
      },
      recent_tasks: [
        { id: 1, title: 'Sample Task Title', priority: 'high', progress: 50, deadline: '2026-06-24T12:00:00Z' },
      ],
      ai_insights: [
        { id: '1', type: 'analysis', title: 'Optimal Focus Level', description: 'Your current focus score is 90%.' },
      ],
      recommendations: [
        { id: '1', priority: 'high', title: 'Divide video workload', description: 'Tackle it in blocks.', action: 'Review' },
      ],
    },
    isLoading: false,
  }),
  useProductivity: () => ({
    data: {
      timeline: [
        { date: '2026-05-23', created: 3, completed: 1, overdue: 0 }
      ]
    },
    isLoading: false,
  }),
}));

describe('DashboardPage', () => {
  it('renders stats card widgets and greeting text', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/good morning|good afternoon|good evening|good night/i)).toBeInTheDocument();
    expect(screen.getByText(/Ardhian/i)).toBeInTheDocument();
    expect(screen.getByText('Total Tugas')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders charts, recent tasks, and recommendations list', () => {
    render(<DashboardPage />);

    expect(screen.getByText('Productivity Timeline')).toBeInTheDocument();
    expect(screen.getByText('Focus Score')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    
    expect(screen.getByText('Sample Task Title')).toBeInTheDocument();
    expect(screen.getByText('Optimal Focus Level')).toBeInTheDocument();
    expect(screen.getByText('Divide video workload')).toBeInTheDocument();
  });
});
