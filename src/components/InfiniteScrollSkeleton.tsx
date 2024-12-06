import { motion } from "framer-motion";

export default function InfiniteScrollSkeleton() {
  return (
    <motion.div
      className="text-center p-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2">
        <motion.div
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        <motion.div
          className="w-2 h-2 bg-purple-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
        />
        <motion.div
          className="w-2 h-2 bg-pink-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
        />
      </div>
      <motion.p
        className="text-gray-400 mt-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading more amazing movies...
      </motion.p>
    </motion.div>
  );
}
