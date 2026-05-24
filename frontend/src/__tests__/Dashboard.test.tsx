import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/dashboard/page';

// Mock useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Ardhian' },
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
      productivity_data: [
        { date: 'Mon', tasks_completed: 1, focus_hours: 2 },
      ],
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
}));

describe('DashboardPage', () => {
  it('renders stats card widgets and greeting text', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/good morning|good afternoon|good evening/i)).toBeInTheDocument();
    expect(screen.getByText(/Ardhian/i)).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
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
