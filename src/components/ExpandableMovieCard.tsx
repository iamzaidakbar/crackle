"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSimilarMovies } from "@/hooks/useMovies";
import { useQueryClient } from "@tanstack/react-query";

interface ExpandableMovieCardProps {
  movie: Movie;
  index: number;
}

export default function ExpandableMovieCard({
  movie,
  index,
}: ExpandableMovieCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get cache status from queryClient
  const queryClient = useQueryClient();
  const isCached = queryClient.getQueryData(["similar-movies", movie.id]);

  // Handle hover with conditional debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isHovered) {
      if (isCached) {
        // Immediate expansion if data is cached
        setShouldFetch(true);
        setIsExpanded(true);
      } else {
        // Delay if data needs to be fetched
        timeoutId = setTimeout(() => {
          setShouldFetch(true);
          setIsExpanded(true);
        }, 500);
      }
    } else {
      setShouldFetch(false);
      setIsExpanded(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isHovered, isCached, movie.id]);

  const { data: similarMovies } = useSimilarMovies(movie.id, {
    enabled: shouldFetch,
  });

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        scale: isExpanded ? 1.1 : 1,
        zIndex: isExpanded ? 10 : 0,
        y: isExpanded ? -10 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Base Image */}
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
        className="w-full h-auto"
        priority={index < 6}
      />

      {/* Loading Bar - Updated */}
      {isHovered && !similarMovies && (
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-20"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}

      {/* Content Overlay */}
      {isExpanded && similarMovies && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end"
        >
          <div className="space-y-2">
            <h3 className="text-lg font-bold leading-tight">{movie.title}</h3>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500" />
                <span className="font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>

            {similarMovies.results?.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-medium text-gray-300 mb-1">
                  Similar
                </div>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {similarMovies.results.slice(0, 3).map((similar: Movie) => (
                    <motion.div
                      key={similar.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/movie/${similar.id}`);
                      }}
                      className="relative w-10 aspect-[2/3] rounded overflow-hidden"
                    >
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                        alt={similar.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
