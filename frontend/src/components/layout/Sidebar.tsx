/* eslint-disable @next/next/no-img-element */
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

  const avatarUrl = user?.avatar_url || (user?.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.avatar}`
    : null);

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
          bg-[#0b0b14]/90 backdrop-blur-2xl
          border-r border-white/[0.06]
          flex flex-col
          transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'w-[88px]' : 'w-[280px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header: Logo + Collapse Button */}
        <div className={`flex items-center h-16 border-b border-white/[0.06] ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center shadow-[0_0_15px_rgba(159,122,234,0.3)] group-hover:shadow-[0_0_20px_rgba(159,122,234,0.5)] transition-shadow">
                <Sparkles className="w-[18px] h-[18px] text-white" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center"
              >
                <span className="text-base font-bold font-display bg-gradient-to-r from-[#cfbcff] to-[#9f7aea] bg-clip-text text-transparent leading-none mb-0.5">
                  AuraAI
                </span>
                <span className="text-[9px] text-white/50 font-medium tracking-[0.2em] uppercase leading-none">Deadliner</span>
              </motion.div>
            )}
          </Link>
          
          {/* Collapse Sidebar Button (Desktop) + Mobile close */}
          {!sidebarCollapsed && (
            <div className="flex items-center gap-1">
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
                className="hidden lg:flex items-center justify-center h-9 w-9 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Expand button when collapsed */}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center h-9 w-9 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all duration-200 group"
            >
              <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-[#110e19] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg font-display">
                Expand Sidebar
              </div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const itemPath = item.href.split('?')[0];
            const isActive = pathname === itemPath;
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className="block">
                <motion.div
                  className={`
                    relative flex items-center transition-all duration-300 group
                    ${sidebarCollapsed 
                      ? 'justify-center py-4 rounded-xl mx-2' 
                      : 'gap-4 px-4 py-3 rounded-xl'
                    }
                    ${isActive
                      ? 'bg-[rgba(207,188,255,0.12)] text-white font-semibold shadow-[0_0_15px_rgba(207,188,255,0.06)]'
                      : 'text-white/50 hover:text-white hover:bg-[rgba(207,188,255,0.12)]'
                    }
                  `}
                  whileHover={{ x: (sidebarCollapsed || isActive) ? 0 : 2, scale: sidebarCollapsed ? 1.05 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Left Border Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[55%] bg-[#cfbcff] rounded-r-full" />
                  )}

                  <Icon 
                    className={`w-[22px] h-[22px] flex-shrink-0 transition-all duration-300 ${isActive ? 'text-[#cfbcff]' : ''}`} 
                    strokeWidth={isActive ? 2 : 1.8}
                    style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(207, 188, 255, 0.4))' } : {}}
                  />
                  
                  {!sidebarCollapsed && (
                    <span className="text-sm truncate leading-none">{item.label}</span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-[#110e19] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg">
                      {item.label}
                    </div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer: Profile Card → Logout */}
        <div className="px-3 pb-4 pt-4 mt-4 border-t border-white/[0.06] space-y-3">
          {/* Profile Card */}
          <Link href="/profile" onClick={() => setSidebarOpen(false)} className="block">
            <div className={`
              flex items-center rounded-2xl transition-all duration-300 group
              border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.08]
              ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 p-3'}
            `}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-xl z-10 relative" />
                ) : user?.name ? (
                  <span className="text-sm font-bold text-white z-10 font-display">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-white z-10" />
                )}
                {!avatarUrl && <div className="absolute inset-0 bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] opacity-40 blur-[4px]" />}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#cfbcff] transition-colors font-display">
                    {user?.name || ''}
                  </p>
                  <p className="text-[10px] text-white/40 truncate mt-0.5 font-display">
                    {user?.email || ''}
                  </p>
                </div>
              )}
              {/* Tooltip for collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-[#110e19] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg font-display">
                  {user?.name || 'Profile'}
                </div>
              )}
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
              text-white/40 hover:text-red-400 hover:bg-red-500/[0.08]
              transition-all duration-200 group relative
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-[20px] h-[20px] flex-shrink-0" strokeWidth={1.8} />
            {!sidebarCollapsed && <span className="text-sm font-medium font-display">Logout</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg bg-[#110e19] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg font-display">
                Logout
              </div>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
