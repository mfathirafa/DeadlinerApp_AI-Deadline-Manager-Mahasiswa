'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { authApi } from '@/lib/api/auth';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import NewTaskModal from '@/components/tasks/NewTaskModal';

const protectedRoutes = [
  '/dashboard',
  '/deadlines',
  '/courses',
  '/calendar',
  '/ai-insights',
  '/settings',
  '/profile',
];

const authRoutes = [
  '/login',
  '/register',
];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAuthenticated, isLoading, setUser, logout: setLogout, setLoading } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Initialize auth state once on mount
  useEffect(() => {
    setMounted(true);
    const initAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (storedToken && !user) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch {
          // Clear credentials on token expiration or error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
          }
          setLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    initAuth();
  }, [setUser, setLoading, setLogout, user]);

  // Route guarding redirection logic
  useEffect(() => {
    if (isLoading || !mounted) return;

    if (protectedRoutes.includes(pathname)) {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    } else if (authRoutes.includes(pathname)) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      }
    } else if (pathname === '/') {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  // Prevent hydration mismatches and show dynamic spinner initially
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0d13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] animate-pulse flex items-center justify-center">
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    );
  }

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Stop rendering content during transition redirects to prevent page flashing
  if (isProtectedRoute && !isAuthenticated) {
    return null;
  }
  if (isAuthRoute && isAuthenticated) {
    return null;
  }

  // Dashboard layout wrapper
  if (isProtectedRoute) {
    return (
      <div className="min-h-screen bg-[#0f0d13] flex flex-col">
        <div className="flex flex-1 min-w-0 relative">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300">
            <TopBar />
            <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 w-full max-w-[1400px] mx-auto">
              {children}
            </main>
          </div>
        </div>
        <NewTaskModal />
      </div>
    );
  }

  // Auth pages (login, register) layout wrapper with animated background
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#0f0d13] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#9f7aea]/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#cfbcff]/8 blur-[150px] animate-float-delayed" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-purple-600/5 blur-[100px] animate-float" />
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      </div>
    );
  }

  // Fallback layout
  return <>{children}</>;
}
