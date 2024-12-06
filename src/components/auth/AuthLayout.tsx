"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { fadeIn } from "@/utils/animations";
import AnimatedBackground from "./AnimatedBackground";
// import { FaFilm } from "react-icons/fa";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#1D1D42] to-gray-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>

      {/* Animated Dots */}
      <AnimatedBackground />

      {/* Logo - Fixed at top with blur effect
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed  top-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-white/5 shadow-xl">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-600 rounded-xl p-2 shadow-lg shadow-blue-500/20"
          >
            <FaFilm className="w-full h-full text-white" />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Crackle
          </span>
        </div>
      </motion.div> */}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto pt-12 pb-12 px-4">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="w-full max-w-md mx-auto relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
