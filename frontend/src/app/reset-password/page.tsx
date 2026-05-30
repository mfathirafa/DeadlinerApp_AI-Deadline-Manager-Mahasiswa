/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authApi } from '@/lib/api/auth';
import { toast } from 'react-hot-toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!password) {
      setErrors({ password: 'Password wajib diisi' });
      return;
    }
    if (password.length < 8) {
      setErrors({ password: 'Password minimal 8 karakter' });
      return;
    }
    if (password !== passwordConfirmation) {
      setErrors({ password_confirmation: 'Password tidak cocok' });
      return;
    }

    if (!token || !email) {
      toast.error('Link reset tidak valid. Silakan minta link baru.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success('Password berhasil direset! Silakan login.');
      router.push('/login');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const mapped: Record<string, string> = {};
        for (const key in serverErrors) {
          mapped[key] = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key];
        }
        setErrors(mapped);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto"
    >
      <div className="
        relative px-4 sm:px-6 md:px-8 py-8 rounded-2xl
        bg-white/[0.04] backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_0_80px_rgba(159,122,234,0.08)]
        z-10
      ">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-transparent to-violet-500/[0.05] pointer-events-none z-0" />
        
        {/* Logo / Header */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-xl opacity-40" />
          </div>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-[#cfbcff] to-white bg-clip-text text-transparent">
            Password Baru
          </h1>
          <p className="text-sm text-white/40 mt-1 text-center px-4">
            Buat password baru untuk akun <strong className="text-white/70">{email}</strong>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <Input
            label="Password Baru"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="Konfirmasi password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={errors.password_confirmation}
          />

          {errors.email && (
            <p className="text-xs text-red-400">{errors.email}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            glow
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Reset Password
          </Button>

          {/* Back to Login link */}
          <p className="text-center mt-6 text-sm text-white/40">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-[#cfbcff] hover:text-white transition-colors py-2 px-1 focus:outline-none focus:ring-2 focus:ring-[#cfbcff]/40 rounded-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Login
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] animate-pulse" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
