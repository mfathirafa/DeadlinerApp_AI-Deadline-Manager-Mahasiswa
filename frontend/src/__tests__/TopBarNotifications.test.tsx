import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from '../components/layout/TopBar';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';

// Mock UI Store
jest.mock('@/stores/uiStore', () => ({
  useUIStore: () => ({
    toggleSidebar: jest.fn(),
    openNewTaskModal: jest.fn(),
  }),
}));

// Mock useNotifications hooks
jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: jest.fn(),
  useMarkNotificationRead: jest.fn(),
  useMarkAllNotificationsRead: jest.fn(),
}));

describe('TopBar Notifications Dropdown', () => {
  const mockMarkRead = jest.fn();
  const mockMarkAllRead = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useMarkNotificationRead as jest.Mock).mockReturnValue({ mutate: mockMarkRead });
    (useMarkAllNotificationsRead as jest.Mock).mockReturnValue({ mutate: mockMarkAllRead });
  });

  it('renders search input and action buttons', () => {
    (useNotifications as jest.Mock).mockReturnValue({ data: [] });
    render(<TopBar />);

    expect(screen.getByPlaceholderText('Search tasks, courses...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
  });

  it('toggles notifications dropdown on bell click', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      data: [
        {
          id: 'notif-123',
          type: 'App\\Notifications\\TaskDeadlineNotification',
          data: { type: 'deadline_near', title: 'Deadline Approaching', message: 'Task sample is due.' },
          read_at: null,
          created_at: '2026-05-24T12:00:00Z',
        },
      ],
    });

    render(<TopBar />);

    // Click notification bell
    const bellBtn = screen.getAllByRole('button')[1]; // Bell is the second button
    fireEvent.click(bellBtn);

    // Assert dropdown displays
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('1 new')).toBeInTheDocument();
    expect(screen.getByText('Deadline Approaching')).toBeInTheDocument();
    expect(screen.getByText('Task sample is due.')).toBeInTheDocument();
  });

  it('triggers mark as read mutations correctly', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      data: [
        {
          id: 'notif-123',
          type: 'App\\Notifications\\TaskDeadlineNotification',
          data: { type: 'deadline_near', title: 'Deadline Approaching', message: 'Task sample is due.' },
          read_at: null,
          created_at: '2026-05-24T12:00:00Z',
        },
      ],
    });

    render(<TopBar />);

    // Open dropdown
    const bellBtn = screen.getAllByRole('button')[1];
    fireEvent.click(bellBtn);

    // Click single notification to mark read
    const notifItem = screen.getByText('Deadline Approaching');
    fireEvent.click(notifItem);
    expect(mockMarkRead).toHaveBeenCalledWith('notif-123');

    // Click mark all read
    const markAllBtn = screen.getByText('Mark all as read');
    fireEvent.click(markAllBtn);
    expect(mockMarkAllRead).toHaveBeenCalled();
  });
});
