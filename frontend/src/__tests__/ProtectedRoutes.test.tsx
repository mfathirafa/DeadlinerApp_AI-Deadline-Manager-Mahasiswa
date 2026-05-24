import { render, screen } from '@testing-library/react';
import AuthProvider from '../components/providers/AuthProvider';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';

// Mock Auth Store
jest.mock('@/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock layout subcomponents to prevent side effects / missing context issues
jest.mock('@/components/layout/Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="mock-sidebar">Sidebar</div>;
  };
});

jest.mock('@/components/layout/TopBar', () => {
  return function MockTopBar() {
    return <div data-testid="mock-topbar">TopBar</div>;
  };
});

jest.mock('@/components/tasks/NewTaskModal', () => {
  return function MockNewTaskModal() {
    return <div data-testid="mock-new-task-modal">NewTaskModal</div>;
  };
});

describe('AuthProvider Route Guarding', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      prefetch: () => null,
    });
  });

  it('redirects unauthenticated users attempting to access dashboard', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setLogout: jest.fn(),
      setLoading: jest.fn(),
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Dashboard Protected Area</div>
      </AuthProvider>
    );

    // Verify it doesn't render protected content and triggers redirect
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith('/login');
  });

  it('renders children for authenticated users on protected path', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    (useAuthStore as jest.Mock).mockReturnValue({
      user: { name: 'Ardhian', email: 'test@example.com' },
      token: 'valid-token',
      isAuthenticated: true,
      isLoading: false,
      setLogout: jest.fn(),
      setLoading: jest.fn(),
    });

    render(
      <AuthProvider>
        <div data-testid="protected-content">Dashboard Protected Area</div>
      </AuthProvider>
    );

    // Verify content displays
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
