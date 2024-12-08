"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CustomAlertProps {
  message: string;
  subMessage?: string;
  type: "add" | "remove";
  onClose: () => void;
}

export default function CustomAlert({
  message,
  subMessage,
  type,
  onClose,
}: CustomAlertProps) {
  const progressRef = useRef(100);
  const animationRef = useRef<number>();

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.max(0, 100 - (elapsed / duration) * 100);

      progressRef.current = progress;

      if (progress > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onClose();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                 bg-gray-900/90 backdrop-blur-lg rounded-2xl border border-white/10 
                 shadow-xl shadow-black/20 overflow-hidden"
    >
      <div className="px-6 py-4 relative">
        {/* Content */}
        <div className="flex items-start gap-4">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-2xl"
          >
            {type === "add" ? "🎬" : "✨"}
          </motion.span>
          <div>
            <motion.h3
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="font-medium text-white"
            >
              {message}
            </motion.h3>
            {subMessage && (
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-blue-400"
              >
                {subMessage}
              </motion.p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: progressRef.current / 100 }}
          transition={{ duration: 0.1 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
