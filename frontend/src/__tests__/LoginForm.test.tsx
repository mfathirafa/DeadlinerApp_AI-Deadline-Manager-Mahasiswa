import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/login/page';
import { useAuth } from '@/hooks/useAuth';

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    login: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders login form elements correctly', () => {
    const { container } = render(<LoginPage />);

    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk|sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /masuk|sign in/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/email wajib diisi|email is required/i)).toBeInTheDocument();
  });

  it('calls login function on successful submit', async () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });

    const { container } = render(<LoginPage />);

    const emailInput = container.querySelector('input[type="email"]')!;
    const passwordInput = container.querySelector('input[type="password"]')!;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: /masuk|sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
