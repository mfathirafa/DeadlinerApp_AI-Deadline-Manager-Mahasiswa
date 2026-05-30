/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Bell, Lock, Trash2, Save, Brain, User, Key, Camera
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm text-white/95 font-medium">{label}</p>
        {description && <p className="text-xs text-white/40 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
          ${enabled
            ? 'bg-gradient-to-r from-[#9f7aea] to-[#cfbcff] shadow-[0_0_12px_rgba(159,122,234,0.4)]'
            : 'bg-white/[0.1]'
          }
        `}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const avatarUrl = user?.avatar_url || (user?.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${user.avatar}`
    : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal adalah 2MB.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file harus JPG, JPEG, PNG, atau WEBP.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const response = await authApi.uploadAvatar(selectedFile);
      if (response.success) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        toast.success('Foto profil berhasil diperbarui!');
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal mengunggah foto profil.';
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return;
    setIsDeleting(true);
    try {
      const response = await authApi.deleteAvatar();
      if (response.success) {
        setUser(response.data.user);
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        toast.success('Foto profil berhasil dihapus!');
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal menghapus foto profil.';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Appearance
  const [darkMode, setDarkMode] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // AI Settings
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [smartRecommendations, setSmartRecommendations] = useState(true);

  // Privacy Settings
  const [shareMetrics, setShareMetrics] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(false);
  const [localHistory, setLocalHistory] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-10 w-full max-w-[1600px] mx-auto min-w-0 px-4 md:px-6 lg:px-8 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#cfbcff]" />
          Settings
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Customize your AuraAI experience
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Card 0: Profile Photo Section */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Ubah Foto Profil</h2>
                <p className="text-sm text-white/40 mt-0.5">Unggah atau hapus foto profil Anda untuk personalisasi akun</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-white/[0.06] pt-6 mt-4">
              {/* Preview Image */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] flex items-center justify-center overflow-hidden border border-white/10 shadow-lg relative">
                  {previewUrl || avatarUrl ? (
                    <img 
                      src={previewUrl || avatarUrl || undefined} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user?.name ? (
                    <span className="text-3xl font-bold text-white font-display">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                  {!previewUrl && !avatarUrl && <div className="absolute inset-0 bg-gradient-to-br from-[#9f7aea] to-[#cfbcff] opacity-40 blur-[4px]" />}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 flex flex-col gap-3 w-full sm:w-auto text-center sm:text-left">
                <div>
                  <h3 className="text-sm font-semibold text-white">{user?.name || ''}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{user?.email || ''}</p>
                </div>
                <p className="text-xs text-white/30">
                  Mendukung JPG, JPEG, PNG, atau WEBP (Maksimal 2MB).
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1">
                  {/* Upload button wrapper */}
                  <label className="
                    cursor-pointer h-10 px-4 rounded-xl font-medium text-xs
                    bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white
                    active:scale-95 transition-all duration-200
                    flex items-center justify-center gap-2
                  ">
                    <span>Pilih Foto</span>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>

                  {/* Save upload button */}
                  {selectedFile && (
                    <Button
                      variant="primary"
                      glow
                      size="sm"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Menyimpan...' : 'Simpan Foto'}
                    </Button>
                  )}

                  {/* Delete photo button */}
                  {(user?.avatar || user?.avatar_url) && (
                    <button
                      onClick={handleDeleteAvatar}
                      disabled={isDeleting}
                      className="
                        h-10 px-4 rounded-xl font-medium text-xs
                        bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400
                        active:scale-95 transition-all duration-200
                        flex items-center justify-center gap-2
                      "
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        {/* Card 1: Appearance */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Appearance</h2>
                <p className="text-sm text-white/40 mt-0.5">Customize how AuraAI looks on your device</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] mt-4">
              <ToggleSwitch
                enabled={darkMode}
                onChange={setDarkMode}
                label="Dark Theme Mode"
                description="Use dark interface styling throughout the application"
              />
              <ToggleSwitch
                enabled={reducedMotion}
                onChange={setReducedMotion}
                label="Reduced Motion"
                description="Minimize high-framerate transitions and page animation patterns"
              />
              <ToggleSwitch
                enabled={compactMode}
                onChange={setCompactMode}
                label="Compact Layout"
                description="Display more tasks and information density with tight padding"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 2: Notifications */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-sm text-white/40 mt-0.5">Manage your notification alerts and schedule triggers</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] mt-4">
              <ToggleSwitch
                enabled={emailNotifs}
                onChange={setEmailNotifs}
                label="Email Notifications"
                description="Receive summary lists and academic deadline updates via email"
              />
              <ToggleSwitch
                enabled={pushNotifs}
                onChange={setPushNotifs}
                label="Browser Push Notifications"
                description="Deliver live browser notification popups for highly urgent tasks"
              />
              <ToggleSwitch
                enabled={deadlineReminders}
                onChange={setDeadlineReminders}
                label="Deadline Reminders"
                description="Receive an alert exactly 24 hours before a task becomes due"
              />
              <ToggleSwitch
                enabled={soundEnabled}
                onChange={setSoundEnabled}
                label="Audio Sound Effects"
                description="Play custom audio indicator ticks when completing goals"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 3: AI Settings */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Settings & Insights</h2>
                <p className="text-sm text-white/40 mt-0.5">Configure cognitive automation models and suggestions</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] mt-4">
              <ToggleSwitch
                enabled={autoAnalysis}
                onChange={setAutoAnalysis}
                label="Automated Task Workload Analysis"
                description="Analyze tasks instantly with AI upon creation or text changes"
              />
              <ToggleSwitch
                enabled={smartRecommendations}
                onChange={setSmartRecommendations}
                label="Smart Recommendation Engine"
                description="Generate tailored study reminders and focus techniques on your dashboard"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 4: Account & Security */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Account & Security</h2>
                <p className="text-sm text-white/40 mt-0.5">Manage credentials, passwords, and access tokens</p>
              </div>
            </div>
            <div className="space-y-5 border-t border-white/[0.06] pt-5 mt-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Signed in email address</p>
                  <p className="text-sm font-semibold text-white mt-1">{user?.email || ''}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Key className="w-4 h-4" />}
                  onClick={() => toast.error('Change password functionality is available via reset flow.')}
                >
                  Change Password
                </Button>
              </div>
              <div className="flex justify-start">
                <Button
                  variant="danger"
                  size="md"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={logout}
                >
                  Sign Out of Account
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Card 5: Privacy */}
        <motion.div variants={item}>
          <GlassCard className="p-6 shadow-xl" hover={false}>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Privacy</h2>
                <p className="text-sm text-white/40 mt-0.5">Control how your personal metrics and data are stored</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] mt-4">
              <ToggleSwitch
                enabled={shareMetrics}
                onChange={setShareMetrics}
                label="Anonymized Productivity Metric Sharing"
                description="Share learning patterns anonymously to train collaborative study assistance models"
              />
              <ToggleSwitch
                enabled={profileVisibility}
                onChange={setProfileVisibility}
                label="Peer Study Group Visibility"
                description="Allow classmates in same courses to see your anonymous task completed ratios"
              />
              <ToggleSwitch
                enabled={localHistory}
                onChange={setLocalHistory}
                label="Retain Detailed Task History Logs"
                description="Keep log records of past tasks locally for retroactive workload analysis"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Sticky Save Button - Full width, gradient purple, premium shadow */}
        <motion.div variants={item} className="sticky bottom-6 z-50 w-full">
          <button
            onClick={handleSave}
            className="
              w-full h-14 rounded-xl font-bold text-sm tracking-wide text-slate-950
              bg-gradient-to-r from-[#9f7aea] to-[#cfbcff]
              hover:shadow-[0_0_30px_rgba(207,188,255,0.4)]
              active:scale-[0.99]
              transition-all duration-300
              flex items-center justify-center gap-2
              shadow-[0_8px_32px_rgba(0,0,0,0.6)]
            "
          >
            <Save className="w-4 h-4" />
            Save Configuration Settings
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
