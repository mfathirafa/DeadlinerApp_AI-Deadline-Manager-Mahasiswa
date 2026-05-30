/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Menu, Clock, AlertTriangle, Brain, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { useDashboard } from '@/hooks/useDashboard';
import { useTasks } from '@/hooks/useTasks';
import { useCourses } from '@/hooks/useCourses';
import SearchResultsDropdown from './SearchResultsDropdown';
import { SearchResult } from './SearchResultItem';

export default function TopBar() {
  const router = useRouter();
  const { toggleSidebar, openNewTaskModal, setSearchQuery } = useUIStore();
  const { user } = useAuth();
  const avatarUrl = user?.avatar_url || (user?.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.avatar}`
    : null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Search and results state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Queries for Search
  const { data: dashboard } = useDashboard();
  const { data: tasks = [] } = useTasks();
  const { data: courses = [] } = useCourses();

  const { data: notifications = [], refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // Search debounce 250ms with loading feedback state
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDebouncedQuery('');
      setSearchQuery('');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
      setSearchQuery(searchTerm);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchQuery]);

  // Outside click listener to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter and prioritize exact matches, capped at 8 results total
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    // 1. Tasks
    tasks.forEach((task: any) => {
      const title = task.title.toLowerCase();
      const desc = (task.description || '').toLowerCase();
      let score = 0;
      if (title === q || title.startsWith(q)) {
        score = 2;
      } else if (title.includes(q) || desc.includes(q)) {
        score = 1;
      }
      if (score > 0) {
        results.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.title,
          subtitle: task.course?.name || 'Tugas',
          score,
          originalItem: task,
        });
      }
    });

    // 2. Courses
    courses.forEach((course: any) => {
      const name = course.name.toLowerCase();
      const code = (course.code || '').toLowerCase();
      let score = 0;
      if (name === q || name.startsWith(q) || code === q) {
        score = 2;
      } else if (name.includes(q) || code.includes(q)) {
        score = 1;
      }
      if (score > 0) {
        results.push({
          id: `course-${course.id}`,
          type: 'course',
          title: course.name,
          subtitle: course.code || 'Mata Kuliah',
          score,
          originalItem: course,
        });
      }
    });

    // 3. AI Insights
    const aiInsights = dashboard?.ai_insights || [];
    aiInsights.forEach((insight: any) => {
      const title = insight.title.toLowerCase();
      const desc = (insight.description || '').toLowerCase();
      let score = 0;
      if (title === q || title.startsWith(q)) {
        score = 2;
      } else if (title.includes(q) || desc.includes(q)) {
        score = 1;
      }
      if (score > 0) {
        results.push({
          id: `insight-${insight.id}`,
          type: 'insight',
          title: insight.title,
          subtitle: 'AI Insight',
          score,
          originalItem: insight,
        });
      }
    });

    // 4. Recommendations
    const recommendations = dashboard?.recommendations || [];
    recommendations.forEach((rec: any) => {
      const title = rec.title.toLowerCase();
      const desc = (rec.description || '').toLowerCase();
      let score = 0;
      if (title === q || title.startsWith(q)) {
        score = 2;
      } else if (title.includes(q) || desc.includes(q)) {
        score = 1;
      }
      if (score > 0) {
        results.push({
          id: `recommendation-${rec.id}`,
          type: 'recommendation',
          title: rec.title,
          subtitle: 'AI Recommendation',
          score,
          originalItem: rec,
        });
      }
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [debouncedQuery, tasks, courses, dashboard]);

  // Reset active index when query results change
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredResults]);

  // Selection actions
  const handleItemClick = (item: SearchResult) => {
    setSearchFocused(false);
    setSearchTerm('');
    setSearchQuery('');
    const searchInput = document.querySelector('input[placeholder="Cari..."]') as HTMLInputElement;
    if (searchInput) {
      searchInput.blur();
    }

    if (item.type === 'task') {
      router.push(`/deadlines?edit=${item.originalItem.id}`);
    } else if (item.type === 'course') {
      router.push('/courses');
    } else if (item.type === 'insight') {
      router.push('/ai-insights');
    } else if (item.type === 'recommendation') {
      const rec = item.originalItem;
      const titleLower = rec.title.toLowerCase();
      const actionLower = rec.action.toLowerCase();

      if (titleLower.includes('mata kuliah') || actionLower.includes('course') || actionLower.includes('mata kuliah')) {
        router.push('/courses');
      } else if (titleLower.includes('tugas') || actionLower.includes('create task') || actionLower.includes('task')) {
        openNewTaskModal();
      } else if (titleLower.includes('pomodoro') || actionLower.includes('calendar') || actionLower.includes('kalender') || actionLower.includes('jadwal')) {
        router.push('/calendar');
      } else if (actionLower.includes('deadline') || actionLower.includes('tugas') || actionLower.includes('detail')) {
        router.push('/deadlines');
      }
    }
  };

  // Keyboard navigation
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filteredResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredResults.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[activeIndex]) {
        handleItemClick(filteredResults[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchFocused(false);
      const searchInput = document.querySelector('input[placeholder="Cari..."]') as HTMLInputElement;
      if (searchInput) {
        searchInput.blur();
      }
    }
  };

  // Command palette focus shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Cari..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        sticky top-0 z-30
        h-16 flex items-center justify-between gap-4
        px-4 sm:px-6 border-b border-white/[0.04]
        bg-[#0b0b14]/60 backdrop-blur-xl
      `}
    >
      {/* LEFT: AuraAI Logo + Mobile Menu Toggle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05] transition-all flex-shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center shadow-[0_0_15px_rgba(159,122,234,0.3)] group-hover:shadow-[0_0_20px_rgba(159,122,234,0.5)] transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold font-display bg-gradient-to-r from-[#cfbcff] to-[#9f7aea] bg-clip-text text-transparent hidden sm:inline-block leading-none">
            AuraAI
          </span>
        </Link>
      </div>

      {/* CENTER: Search Bar */}
      <div 
        ref={searchContainerRef}
        className="flex-1 flex justify-center max-w-[420px] w-full h-10 relative mx-auto"
      >
        <div className="relative w-full h-full">
          <Search
            style={{ left: '16px' }}
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none z-10"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Cari..."
            style={{ paddingLeft: '48px' }}
            className="w-full h-full pr-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-zinc-500 placeholder:text-xs placeholder:font-normal focus:outline-none focus:border-white/20 transition-colors duration-200"
          />
          <AnimatePresence>
            {searchFocused && (
              <SearchResultsDropdown
                results={filteredResults}
                query={searchTerm}
                activeIndex={activeIndex}
                isSearching={isSearching}
                onItemClick={handleItemClick}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: New Task Button, Notification Bell, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Button
          onClick={() => openNewTaskModal()}
          size="sm"
          glow
          icon={<Plus className="w-4 h-4" />}
          className="hidden sm:flex"
        >
          <span>Buat Tugas</span>
        </Button>

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
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setDropdownOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="
                    absolute right-0 mt-3 w-[300px] sm:w-[360px] rounded-2xl
                    border border-white/[0.08] bg-[#110e19]/95 backdrop-blur-2xl
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
                        <Bell className="w-12 h-12 text-white/10 mx-auto mb-2" />
                        <h3 className="text-sm font-semibold text-white/60 mb-1">Belum ada notifikasi</h3>
                        <p className="text-xs text-white/30 mb-3">Semua pemberitahuan Anda akan muncul di sini</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => refetch()}
                        >
                          Refresh Notifikasi
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar Link */}
        <Link href="/profile" className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/[0.05] transition-all">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center flex-shrink-0 relative overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-lg z-10 relative" />
            ) : user?.name ? (
              <span className="text-xs font-bold text-white z-10 font-display">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-4 h-4 text-white z-10" />
            )}
            {!avatarUrl && <div className="absolute inset-0 bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] opacity-40 blur-[4px]" />}
          </div>
        </Link>
      </div>
    </motion.header>
  );
}
