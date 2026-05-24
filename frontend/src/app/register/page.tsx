'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name) return setErrors({ name: 'Name is required' });
    if (!email) return setErrors({ email: 'Email is required' });
    if (!password) return setErrors({ password: 'Password is required' });
    if (password !== passwordConfirmation) return setErrors({ password_confirmation: 'Passwords do not match' });

    setLoading(true);
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
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
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.08] via-transparent to-violet-500/[0.05] pointer-events-none" />

        <div className="relative flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-xl opacity-40" />
          </div>
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-[#cfbcff] to-white bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-sm text-white/40 mt-1">Join AuraAI Deadliner</p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            error={errors.name}
          />

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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            error={errors.password_confirmation}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            glow
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <p className="relative text-center mt-6 text-sm text-white/40">
          Already have an account?{' '}
          <Link href="/login" className="text-[#cfbcff] hover:text-white transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
