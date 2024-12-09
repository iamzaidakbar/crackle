"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { movieApi } from "@/lib/api";
import Image from "next/image";
import {
  FaStar,
  FaClock,
  FaCalendar,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MovieDetailSkeleton from "@/components/MovieDetailSkeleton";
import { Movie } from "@/types/movie";
import CastAndCrew from "@/components/CastAndCrew";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Handle mute/unmute using YouTube API
  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      // Post message to YouTube player
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
        }),
        "*"
      );
    }
  }, [isMuted, isPlaying]);

  const playTrailer = () => {
    if (!user) {
      router.push("/auth/login?message=Please login to watch trailer");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => movieApi.getMovieDetails(movieId),
  });

  const { data: similarMovies } = useQuery({
    queryKey: ["similar", movieId],
    queryFn: () => movieApi.getSimilarMovies(movieId),
    enabled: !!movie,
  });

  const { data: videoSource } = useQuery({
    queryKey: ["movie-stream", movieId],
    queryFn: () => movieApi.getMovieStream(movieId),
  });

  const { data: credits } = useQuery({
    queryKey: ["movie", movieId, "credits"],
    queryFn: () => movieApi.getMovieCredits(movieId),
    enabled: !!movieId,
  });

  if (isLoadingMovie || !movie) {
    return <MovieDetailSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop/Video */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            >
              <div className="absolute inset-0 z-10" />

              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${
                  videoSource?.key
                }?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&origin=${
                  typeof window !== "undefined" ? window.location.origin : ""
                }`}
                className="w-full h-full"
                allow="autoplay"
                style={{ border: "none", pointerEvents: "none" }}
                frameBorder="0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="container mx-auto flex gap-8 items-end">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block w-64 aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-yellow-500">
                  <FaStar />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendar />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>

              <p className="text-gray-300 max-w-2xl line-clamp-3 md:line-clamp-none">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4 relative z-30">
                {videoSource && (
                  <motion.button
                    onClick={playTrailer}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg 
                    hover:bg-red-500 transition-colors group"
                  >
                    <FaPlay className="group-hover:animate-pulse" />
                    {isPlaying ? "Watch Poster" : "Watch Trailer"}
                  </motion.button>
                )}
                {isPlaying && (
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex items-center justify-center w-12 h-12 rounded-full 
                      bg-white/5 backdrop-blur-sm border border-white/10 transition-all 
                      hover:border-white/20 group z-30"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      ) : (
                        <FaVolumeUp className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cast and Crew Section */}
      {credits && (
        <div className="container mx-auto px-4">
          <CastAndCrew cast={credits.cast} crew={credits.crew} />
        </div>
      )}

      {/* Similar Movies Section */}
      {similarMovies?.results?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>

          <div className="relative group">
            {/* Left Arrow */}
            <AnimatePresence>
              {showLeftArrow && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-0 bottom-0 z-10 
                           bg-gradient-to-r from-black/80 to-transparent
                           group-hover:from-black/90
                           w-24 flex items-center justify-start
                           transition-all duration-300
                           group-hover:opacity-100 opacity-0"
                >
                  <div className="pl-4 pr-8 py-20 hover:pl-6 transition-all">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/10 backdrop-blur-sm rounded-full p-3
                               hover:bg-white/20 transition-colors"
                    >
                      <FaChevronLeft className="text-white text-2xl" />
                    </motion.div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Arrow */}
            <AnimatePresence>
              {showRightArrow && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-0 bottom-0 z-10 
                           bg-gradient-to-l from-black/80 to-transparent
                           group-hover:from-black/90
                           w-24 flex items-center justify-end
                           transition-all duration-300
                           group-hover:opacity-100 opacity-0"
                >
                  <div className="pr-4 pl-8 py-20 hover:pr-6 transition-all">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/10 backdrop-blur-sm rounded-full p-3
                               hover:bg-white/20 transition-colors"
                    >
                      <FaChevronRight className="text-white text-2xl" />
                    </motion.div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Movies Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
            >
              {similarMovies.results.map((movie: Movie, index: number) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[200px] cursor-pointer"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden group/card">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover transform transition-transform duration-300 
                               group-hover/card:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent 
                                  opacity-0 group-hover/card:opacity-100 transition-opacity"
                    >
                      <div className="absolute bottom-0 p-4">
                        <h3 className="text-white font-medium line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
