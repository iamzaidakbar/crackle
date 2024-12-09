"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import MovieGrid from "./MovieGrid";
import LoadingSkeleton from "./LoadingSkeleton";
import { motion } from "framer-motion";
export default function MovieRecommendations() {
  const { recommendations, isLoading } = useRecommendations();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (isLoading) return <LoadingSkeleton />;

  if (!recommendations?.results?.length) return null;

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        Recommendations for{" "}
        <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-5xl pl-4">
          {user?.name}
        </span>
      </motion.h2>
      <MovieGrid movies={recommendations.results} prefix="recommended" />
    </div>
  );
}
