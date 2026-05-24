'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import toast from 'react-hot-toast';
import { LoginData, RegisterData } from '@/types';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, login: setLogin, logout: setLogout, setUser, setLoading } = useAuthStore();


  const login = async (data: LoginData) => {
    try {
      const response = await authApi.login(data);
      setLogin(response.user, response.token);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      setLogin(response.user, response.token);
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {} finally {
      setLogout();
      toast.success('Logged out successfully');
      router.push('/login');
    }
  };

  return { user, token, isAuthenticated, isLoading, login, register, logout };
}
