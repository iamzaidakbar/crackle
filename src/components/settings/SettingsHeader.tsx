"use client";

import { motion } from "framer-motion";
import { FaCog } from "react-icons/fa";

export default function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4"
      >
        <FaCog className="w-full h-full text-white" />
      </motion.div>
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        Customize your experience and manage your preferences
      </p>
    </motion.div>
  );
}
