"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { prefetchMovieDetails, prefetchSimilarMovies } from "@/hooks/useMovies";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const { data: similarMovies } = useQuery({
    queryKey: ["similar-movies", movie.id],
    queryFn: () => movieApi.getSimilarMovies(movie.id),
    enabled: isHovered,
  });

  const handleSimilarMovieClick = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation(); // Prevent triggering parent card's click
    router.push(`/movie/${movieId}`);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    prefetchMovieDetails(movie.id);
    prefetchSimilarMovies(movie.id);
    setIsHovered(true);
  };

  return (
    <motion.div
      className="group relative w-full h-full rounded-lg overflow-hidden cursor-pointer"
      onHoverStart={handleMouseEnter}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Poster Image */}
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        priority={index < 6}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Content */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-3 sm:p-4"
        initial={false}
        animate={{
          y: isHovered ? 0 : "100%",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <FaStar className="text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
            {movie.overview}
          </p>

          {/* Similar Movies */}
          <AnimatePresence>
            {isHovered && similarMovies?.results && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-2 space-y-2"
              >
                <h4 className="text-xs sm:text-sm font-medium text-gray-400">
                  Similar Movies
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {similarMovies.results.slice(0, 4).map((similar: Movie) => (
                    <motion.button
                      key={similar.id}
                      onClick={(e) => handleSimilarMovieClick(e, similar.id)}
                      className="flex-shrink-0 w-12 sm:w-14 aspect-[2/3] relative rounded-md overflow-hidden 
                      group/similar focus:outline-none focus:ring-2 focus:ring-blue-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                        alt={similar.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 48px, 56px"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/similar:bg-black/0 transition-colors" />

                      {/* Tooltip */}
                      <div
                        className="absolute opacity-0 group-hover/similar:opacity-100 transition-opacity 
                      bottom-0 left-0 right-0 p-1 bg-black/80 text-[10px] text-white text-center truncate"
                      >
                        {similar.title}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Title for non-hover state */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-3 sm:p-4"
        initial={false}
        animate={{
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <h3
            className="text-sm sm:text-base font-semibold text-white line-clamp-2 
            drop-shadow-lg"
          >
            {movie.title}
          </h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <FaStar className="text-xs sm:text-sm" />
            <span className="text-xs sm:text-sm text-white drop-shadow-lg">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
