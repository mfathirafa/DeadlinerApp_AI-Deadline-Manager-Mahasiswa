'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0b14] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#9f7aea]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-[#cfbcff]/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          relative p-8 sm:p-12 rounded-[24px] max-w-md w-full
          bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]
          shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          flex flex-col items-center
        "
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center shadow-[0_0_30px_rgba(159,122,234,0.25)] mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 font-display tracking-wider">
          404
        </h1>
        <h2 className="text-lg font-bold text-white mb-2 font-display">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs text-white/50 mb-8 leading-relaxed font-display">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <Link href="/dashboard" passHref className="w-full">
          <Button
            glow
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full bg-gradient-to-r from-[#9f7aea] to-purple-600 border-none text-white font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            Kembali ke Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
