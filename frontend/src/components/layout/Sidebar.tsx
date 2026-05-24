'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  Brain,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  X,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/deadlines', label: 'Deadlines', icon: Clock },
  { href: '/ai-insights', label: 'AI Insights', icon: Brain },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse, sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-40
          bg-[#0f0d13]/80 backdrop-blur-2xl
          border-r border-white/[0.06]
          flex flex-col
          transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] blur-lg opacity-40" />
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-sm font-bold font-display bg-gradient-to-r from-[#cfbcff] to-[#9f7aea] bg-clip-text text-transparent">
                  AuraAI
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">Deadliner</span>
              </motion.div>
            )}
          </Link>
          
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <motion.div
                  className={`
                    relative flex items-center rounded-xl border
                    transition-all duration-300 group
                    ${sidebarCollapsed ? 'justify-center py-3' : 'gap-3.5 px-3.5 py-3'}
                    ${isActive
                      ? 'bg-gradient-to-r from-[#9f7aea]/15 to-[#cfbcff]/5 border-purple-500/20 text-white shadow-[0_0_15px_rgba(159,122,234,0.06)]'
                      : 'border-transparent text-white/50 hover:text-white/90 hover:bg-white/[0.04]'
                    }
                  `}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2, scale: sidebarCollapsed ? 1.05 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full bg-gradient-to-b from-[#cfbcff] to-[#9f7aea]"
                      style={{ boxShadow: '0 0 10px rgba(207, 188, 255, 0.6)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'text-[#cfbcff]' : ''}`} 
                    strokeWidth={isActive ? 2 : 1.8}
                    style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(207, 188, 255, 0.4))' } : {}}
                  />
                  
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1a1625] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.06] space-y-1.5">
          <Link href="/profile" onClick={() => setSidebarOpen(false)}>
            <div className={`
              flex items-center rounded-xl transition-all duration-300 group
              border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/[0.08]
              ${sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-3'}
            `}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <User className="w-4 h-4 text-white z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] opacity-40 blur-[4px]" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#cfbcff] transition-colors">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-white/40 truncate mt-0.5">{user?.email || 'user@email.com'}</p>
                </div>
              )}
            </div>
          </Link>

          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-white/40 hover:text-red-400 hover:bg-red-500/[0.08]
              transition-all duration-200 mt-1
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
