'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Menu, Clock, AlertTriangle, Brain } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import Button from '@/components/ui/Button';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';

export default function TopBar() {
  const { toggleSidebar, openNewTaskModal } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        sticky top-0 z-30
        h-16 flex items-center justify-between gap-4
        px-6 border-b border-white/[0.04]
        bg-[#0f0d13]/60 backdrop-blur-xl
      `}
    >
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search tasks, courses..."
            style={{ paddingLeft: '48px' }}
            className="
              w-full pr-4 py-2 rounded-xl
              bg-white/[0.04] border border-white/[0.06]
              text-sm text-white placeholder:text-white/30
              focus:outline-none focus:border-white/[0.12]
              focus:bg-white/[0.06] transition-all duration-200
            "
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`
              relative p-2 rounded-xl transition-all duration-200 active:scale-95
              ${dropdownOpen 
                ? 'bg-white/[0.08] text-white' 
                : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
              }
            `}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9f7aea] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9f7aea] shadow-[0_0_6px_rgba(159,122,234,0.6)]"></span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop overlay for closing dropdown on clicking outside */}
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Glassmorphism Notification Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="
                    absolute right-0 mt-3 w-[320px] sm:w-[360px] rounded-2xl
                    border border-white/[0.08] bg-[#16131d]/95 backdrop-blur-2xl
                    p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden
                  "
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#9f7aea]/25 text-[#cfbcff] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllRead.mutate()}
                        className="text-[11px] text-[#cfbcff] hover:text-[#cfbcff]/80 transition-colors font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* Scrollable list */}
                  <div className="max-h-[300px] overflow-y-auto space-y-2 -mx-1 px-1">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => {
                        const isUnread = !notif.read_at;
                        const type = notif.data?.type;
                        let Icon = Bell;
                        let iconColors = 'bg-white/[0.04] text-white/60';

                        if (type === 'deadline_near') {
                          Icon = Clock;
                          iconColors = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
                        } else if (type === 'overdue') {
                          Icon = AlertTriangle;
                          iconColors = 'bg-red-500/10 text-red-400 border border-red-500/20';
                        } else if (type === 'recommendation') {
                          Icon = Brain;
                          iconColors = 'bg-purple-500/10 text-[#cfbcff] border border-purple-500/20';
                        }

                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              if (isUnread) {
                                markRead.mutate(notif.id);
                              }
                            }}
                            className={`
                              flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer
                              ${isUnread
                                ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04]'
                                : 'hover:bg-white/[0.02] border border-transparent opacity-60'
                              }
                            `}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors}`}>
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p className={`text-xs font-semibold truncate ${isUnread ? 'text-white' : 'text-white/70'}`}>
                                  {notif.data?.title}
                                </p>
                                {isUnread && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#9f7aea] flex-shrink-0 mt-1 shadow-[0_0_4px_#9f7aea]" />
                                )}
                              </div>
                              <p className="text-[11px] text-white/40 mt-0.5 leading-normal line-clamp-2">
                                {notif.data?.message}
                              </p>
                              <p className="text-[9px] text-white/20 mt-1">
                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                        <p className="text-xs text-white/30">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={openNewTaskModal}
          size="sm"
          glow
          icon={<Plus className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>
    </motion.header>
  );
}
