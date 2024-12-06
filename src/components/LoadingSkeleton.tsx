"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title skeleton */}
      <motion.div
        className="h-8 w-64 bg-gray-800 rounded-lg"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="aspect-[2/3] bg-gray-800 rounded-lg"
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
