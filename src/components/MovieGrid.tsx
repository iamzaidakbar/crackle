"use client";

import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import ExpandableMovieCard from "./ExpandableMovieCard";

interface MovieGridProps {
  movies: Movie[];
  prefix?: string;
}

export default function MovieGrid({
  movies,
  prefix = "movie",
}: MovieGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 
      sm:gap-4 md:gap-6"
      initial="hidden"
      animate="show"
    >
      {movies.map((movie, index) => (
        <ExpandableMovieCard
          key={`${prefix}-${movie.id}-${index}`}
          movie={movie}
          index={index}
        />
      ))}
    </motion.div>
  );
}
