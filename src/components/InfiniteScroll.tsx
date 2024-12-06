"use client";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";

interface InfiniteScrollProps {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export default function InfiniteScroll({
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage = () => {},
}: InfiniteScrollProps) {
  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  return (
    <motion.div
      ref={loadMoreRef}
      className="text-center p-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center">
          <motion.div
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400 mt-2">Finding more gems for you...</p>
        </div>
      ) : hasNextPage ? (
        <motion.div
          className="text-gray-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Keep scrolling for more movies ✨
        </motion.div>
      ) : (
        <motion.div
          className="text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          You&apos;ve reached the end! 🎬
        </motion.div>
      )}
    </motion.div>
  );
}
