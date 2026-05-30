/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!email) return setErrors({ email: 'Email wajib diisi' });
    if (!password) return setErrors({ password: 'Password wajib diisi' });

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
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
        
        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-xl opacity-40" />
          </div>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-[#cfbcff] to-white bg-clip-text text-transparent">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-white/40 mt-1">Masuk ke AuraAI Deadliner</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/50 cursor-pointer select-none py-2">
              <input 
                type="checkbox" 
                className="rounded border-white/20 bg-white/5 w-4 h-4 focus:ring-2 focus:ring-[#cfbcff]/40 focus:ring-offset-2 focus:ring-offset-[#0f0d13] focus:outline-none" 
              />
              Ingat saya
            </label>
            <Link 
              href="/forgot-password" 
              className="relative z-50 pointer-events-auto cursor-pointer py-2 px-1 text-[#cfbcff]/70 hover:text-[#cfbcff] hover:underline active:text-[#bca7fa] active:scale-95 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#cfbcff]/40 rounded-sm"
            >
              Lupa password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            glow
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Masuk
          </Button>
        </form>

        {/* Register link */}
        <p className="relative z-10 text-center mt-6 text-sm text-white/40">
          Belum punya akun?{' '}
          <Link 
            href="/register" 
            className="inline-block py-2 text-[#cfbcff] hover:text-white hover:underline transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#cfbcff]/40 rounded-sm"
          >
            Buat akun
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
