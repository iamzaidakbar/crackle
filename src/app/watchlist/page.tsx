"use client";

import { useMovieDetails } from "@/hooks/useMovies";
import { useWatchlist } from "@/hooks/useWatchlist";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay, FaStar, FaTrash } from "react-icons/fa";

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        My Watchlist
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {watchlist.map((movieId: number) => (
            <WatchlistItem
              key={movieId}
              movieId={movieId}
              onRemove={() => toggleWatchlist({ movieId, action: "remove" })}
              onClick={() => router.push(`/movie/${movieId}`)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {watchlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-gray-400 text-lg">Your watchlist is empty</p>
          <button
            onClick={() => router.push("/popular")}
            className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 
                     transition-colors"
          >
            Browse Movies
          </button>
        </motion.div>
      )}
    </div>
  );
}

function WatchlistItem({
  movieId,
  onRemove,
  onClick,
}: {
  movieId: number;
  onRemove: () => void;
  onClick: () => void;
}) {
  const { data: movie } = useMovieDetails(movieId);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!movie) return null;

  return (
    <motion.div
      layout
      variants={item}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group rounded-xl overflow-hidden bg-gray-900 shadow-lg"
    >
      <div onClick={onClick} className="relative aspect-[2/1] cursor-pointer">
        <Image
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 
                   text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FaTrash className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold line-clamp-1">{movie.title}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-1 rounded-lg
                     bg-white text-black text-sm font-medium"
          >
            <FaPlay className="text-xs" />
            <span>Play</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
