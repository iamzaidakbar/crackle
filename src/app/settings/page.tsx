"use client";

import AnimatedBackground from "@/components/settings/AnimatedBackground";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaUser, FaMoon, FaBell, FaLanguage } from "react-icons/fa";

interface Settings {
  theme: "light" | "dark";
  notifications: boolean;
  language: "en" | "es" | "fr";
  autoplay: boolean;
  showAlerts: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    theme: "dark",
    notifications: true,
    language: "en",
    autoplay: true,
    showAlerts: true,
  });

  const languages = {
    en: "English",
    es: "Español",
    fr: "Français",
  };

  const handleSettingChange = (
    key: keyof Settings,
    value: string | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <SettingsHeader />

          <div className="grid gap-6">
            {/* Theme Setting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <FaMoon className="text-2xl text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Theme</h2>
                    <p className="text-sm text-gray-400">
                      Choose your preferred theme
                    </p>
                  </div>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange("theme", e.target.value)}
                  className="bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-gray-600"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </motion.div>

            {/* Notifications Setting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <FaBell className="text-2xl text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Notifications
                    </h2>
                    <p className="text-sm text-gray-400">
                      Manage notification preferences
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) =>
                      handleSettingChange("notifications", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-blue-500"
                  ></div>
                </label>
              </div>
            </motion.div>

            {/* Language Setting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <FaLanguage className="text-2xl text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Language
                    </h2>
                    <p className="text-sm text-gray-400">
                      Select your preferred language
                    </p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    handleSettingChange("language", e.target.value)
                  }
                  className="bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-gray-600"
                >
                  {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Autoplay Setting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-pink-500/10">
                    <FaUser className="text-2xl text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Autoplay
                    </h2>
                    <p className="text-sm text-gray-400">
                      Auto-play next episode
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) =>
                      handleSettingChange("autoplay", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-pink-500"
                  ></div>
                </label>
              </div>
            </motion.div>

            {/* Alerts Setting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-500/10">
                    <FaBell className="text-2xl text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Alert Messages
                    </h2>
                    <p className="text-sm text-gray-400">
                      Show action confirmation alerts
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showAlerts}
                    onChange={(e) =>
                      handleSettingChange("showAlerts", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div
                    className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:after:border-white 
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                                peer-checked:bg-yellow-500"
                  ></div>
                </label>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
