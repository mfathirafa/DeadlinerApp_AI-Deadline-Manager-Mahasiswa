'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Palette, Bell, Shield, Moon, Sun,
  Trash2, Save, Monitor,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-white/80 font-medium">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          relative w-11 h-6 rounded-full transition-all duration-300
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
    <div className="space-y-6 w-full max-w-[900px] mx-auto min-w-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
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
        className="space-y-6"
      >
        {/* Appearance */}
        <motion.div variants={item}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Appearance</h2>
                <p className="text-xs text-white/40">Customize how AuraAI looks</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              <ToggleSwitch
                enabled={darkMode}
                onChange={setDarkMode}
                label="Dark Mode"
                description="Use dark theme throughout the app"
              />
              <ToggleSwitch
                enabled={reducedMotion}
                onChange={setReducedMotion}
                label="Reduced Motion"
                description="Minimize animations and transitions"
              />
              <ToggleSwitch
                enabled={compactMode}
                onChange={setCompactMode}
                label="Compact Mode"
                description="Show more content with less spacing"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Notifications</h2>
                <p className="text-xs text-white/40">Manage your notification preferences</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              <ToggleSwitch
                enabled={emailNotifs}
                onChange={setEmailNotifs}
                label="Email Notifications"
                description="Receive deadline reminders via email"
              />
              <ToggleSwitch
                enabled={pushNotifs}
                onChange={setPushNotifs}
                label="Push Notifications"
                description="Browser push notifications for urgencies"
              />
              <ToggleSwitch
                enabled={deadlineReminders}
                onChange={setDeadlineReminders}
                label="Deadline Reminders"
                description="Get notified 24h before deadlines"
              />
              <ToggleSwitch
                enabled={soundEnabled}
                onChange={setSoundEnabled}
                label="Sound Effects"
                description="Play sounds for notifications"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* AI Settings */}
        <motion.div variants={item}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#9f7aea]/15 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-[#cfbcff]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">AI & Intelligence</h2>
                <p className="text-xs text-white/40">Configure AI behavior and analysis</p>
              </div>
            </div>
            <div className="divide-y divide-white/[0.06]">
              <ToggleSwitch
                enabled={autoAnalysis}
                onChange={setAutoAnalysis}
                label="Auto AI Analysis"
                description="Automatically analyze new tasks with AI"
              />
              <ToggleSwitch
                enabled={smartRecommendations}
                onChange={setSmartRecommendations}
                label="Smart Recommendations"
                description="Show AI-powered productivity tips"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Account & Security */}
        <motion.div variants={item}>
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Account & Security</h2>
                <p className="text-xs text-white/40">Manage your account settings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-sm text-white/70 mb-1">Signed in as</p>
                <p className="text-sm font-semibold text-white">{user?.email || 'user@email.com'}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={item} className="flex justify-end">
          <Button
            glow
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
