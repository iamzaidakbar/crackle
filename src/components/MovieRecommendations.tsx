"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import MovieGrid from "./MovieGrid";
import LoadingSkeleton from "./LoadingSkeleton";
import { motion } from "framer-motion";

export default function MovieRecommendations() {
  const { recommendations, isLoading } = useRecommendations();

  if (isLoading) return <LoadingSkeleton />;

  if (!recommendations?.results?.length) return null;

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        Recommended for You
      </motion.h2>
      <MovieGrid movies={recommendations.results} prefix="recommended" />
    </div>
  );
}
