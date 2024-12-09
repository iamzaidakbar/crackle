"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";

export default function MovieReviews({ movieId }: { movieId: number }) {
  const { data: reviews } = useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => movieApi.getMovieReviews(movieId),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Reviews</h2>
      <div className="space-y-4">
        {reviews?.results.map((review: { id: string; content: string }) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gray-900/50 rounded-xl backdrop-blur-sm"
          >
            {/* Review content */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
