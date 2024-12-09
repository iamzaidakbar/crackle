"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Movie } from "@/types/movie";
import {
  FaPlay,
  FaStar,
  FaInfoCircle,
  FaVolumeUp,
  FaVolumeMute,
  FaBookmark,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { useAuth } from "@/contexts/AuthContext";
import { useWatchlist } from "@/hooks/useWatchlist";
interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const { user } = useAuth();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const { data: videoSource } = useQuery({
    queryKey: ["movie-stream", movie.id],
    queryFn: () => movieApi.getMovieStream(movie.id),
  });

  const handlePlayClick = () => {
    if (!isPlaying) {
      if (!user) {
        router.push("/auth/login?message=Please login to watch trailer");
        return;
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-[70vh] sm:h-[85vh] w-full overflow-hidden">
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
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </motion.div>
        ) : (
          <motion.div
            key="player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
          >
            <ReactPlayer
              ref={playerRef}
              url={
                videoSource?.type === "youtube"
                  ? `https://www.youtube.com/watch?v=${videoSource.key}`
                  : videoSource?.url
              }
              width="100%"
              height="100%"
              playing={true}
              muted={isMuted}
              controls={false}
              style={{ position: "absolute", top: 0, left: 0 }}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 0,
                    modestbranding: 1,
                    rel: 0,
                    controls: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                  },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-4 sm:px-6">
        <div
          className={`relative h-full ${
            isPlaying ? "opacity-50 hover:opacity-100" : "opacity-100"
          } transition-opacity duration-300`}
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/2 -translate-y-1/2 max-w-2xl space-y-3 sm:space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.5,
              }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
            >
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {movie.title}
              </span>
            </motion.h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 relative">
              <div
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500/20 
        rounded-full text-yellow-500 font-semibold text-sm sm:text-base"
              >
                <FaStar className="text-sm sm:text-base" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 rounded-full text-blue-400 
                text-xs sm:text-sm"
              >
                Trending Now
              </motion.div>

              {/* Watchlist Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchlist({
                    movieId: movie.id,
                    action: inWatchlist ? "remove" : "add",
                    movieTitle: movie.title,
                  });
                }}
                className={`p-2 rounded-full backdrop-blur-sm z-30 transition-all ${
                  inWatchlist
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-black/20 text-white hover:bg-black/40"
                }`}
              >
                <FaBookmark
                  className={`$ {
              inWatchlist ? "fill-current" : "stroke-current"
            }`}
                />
              </motion.button>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl line-clamp-2 sm:line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {videoSource && (
                <motion.button
                  onClick={handlePlayClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white 
            text-sm sm:text-base rounded-lg hover:bg-red-500 transition-colors group"
                >
                  <FaPlay className="text-sm sm:text-base group-hover:animate-pulse" />
                  {isPlaying ? "Watch Poster" : "Watch Trailer"}
                </motion.button>
              )}
              <motion.button
                onClick={() => router.push(`/movie/${movie.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800/80 text-white 
          text-sm sm:text-base rounded-lg hover:bg-gray-700/80 transition-colors backdrop-blur-sm 
          border border-gray-700/50"
              >
                <FaInfoCircle className="text-sm sm:text-base" />
                More Info
              </motion.button>
              {isPlaying && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full 
            bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:border-white/20 
            group"
                >
                  {isMuted ? (
                    <FaVolumeMute className="text-white/70 text-lg sm:text-xl group-hover:text-white transition-colors" />
                  ) : (
                    <FaVolumeUp className="text-white/70 text-lg sm:text-xl group-hover:text-white transition-colors" />
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
