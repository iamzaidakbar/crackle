"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";

interface AuthButtonProps {
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  icon?: IconType;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function AuthButton({
  type = "button",
  loading = false,
  disabled = false,
  icon: Icon,
  children,
  onClick,
  variant = "primary",
}: AuthButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full flex items-center justify-center gap-2 py-3 px-4 
                overflow-hidden rounded-xl font-medium
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 group
                ${
                  variant === "primary"
                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
      <span className="relative flex items-center gap-2">
        {Icon && <Icon />}
        {loading ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading...
          </div>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
