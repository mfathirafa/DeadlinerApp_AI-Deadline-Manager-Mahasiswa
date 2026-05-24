'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
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
    
    if (!email) return setErrors({ email: 'Email is required' });
    if (!password) return setErrors({ password: 'Password is required' });

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
      className="w-full max-w-md"
    >
      <div className="
        relative p-8 rounded-2xl
        bg-white/[0.04] backdrop-blur-2xl
        border border-white/[0.08]
        shadow-[0_0_80px_rgba(159,122,234,0.08)]
      ">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-transparent to-violet-500/[0.05] pointer-events-none" />
        
        {/* Logo */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-xl opacity-40" />
          </div>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-[#cfbcff] to-white bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-white/40 mt-1">Sign in to AuraAI Deadliner</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/50 cursor-pointer">
              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              Remember me
            </label>
            <a href="#" className="text-[#cfbcff]/70 hover:text-[#cfbcff] transition-colors">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            glow
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        {/* Register link */}
        <p className="relative text-center mt-6 text-sm text-white/40">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#cfbcff] hover:text-white transition-colors font-medium">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
