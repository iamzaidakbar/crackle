"use client";

import { useMovieDetails } from "@/hooks/useMovies";
import { useWatchlist } from "@/hooks/useWatchlist";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlay, FaStar, FaTrash, FaFilm } from "react-icons/fa";

export default function WatchlistPage() {
  const router = useRouter();
  const { watchlist, toggleWatchlist } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        <p className="mt-2 text-gray-400">
          {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"} saved
        </p>
      </motion.div>

      {/* Grid Layout */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {watchlist.map((movieId: number, index: number) => (
            <WatchlistItem
              key={movieId}
              movieId={movieId}
              index={index}
              onRemove={() => toggleWatchlist({ movieId, action: "remove" })}
              onClick={() => router.push(`/movie/${movieId}`)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {watchlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="inline-block mb-6 text-4xl text-gray-600"
          >
            <FaFilm />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-3">
            Your watchlist is empty
          </h2>
          <p className="text-gray-400 mb-6">
            Start adding movies to keep track of what you want to watch
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/popular")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                     rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 
                     transition-all shadow-lg hover:shadow-blue-500/25"
          >
            Browse Popular Movies
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

function WatchlistItem({
  movieId,
  index,
  onRemove,
  onClick,
}: {
  movieId: number;
  index: number;
  onRemove: () => void;
  onClick: () => void;
}) {
  const { data: movie } = useMovieDetails(movieId);

  if (!movie) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 },
      }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm 
                 shadow-lg hover:shadow-blue-500/10 border border-white/10 
                 hover:border-white/20 transition-all"
    >
      <div onClick={onClick} className="relative aspect-[2/1] cursor-pointer">
        <Image
          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover transform transition-transform duration-500 
                   group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Remove Button with Animation */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 
                   text-white opacity-0 group-hover:opacity-100 transition-all
                   hover:bg-red-500/50"
        >
          <FaTrash className="w-4 h-4" />
        </motion.button>

        {/* Movie Info Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 
                   rounded-full bg-black/50 backdrop-blur-sm text-sm"
        >
          <FaStar className="text-yellow-500" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </motion.div>
      </div>

      <div className="p-4 space-y-3">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-semibold line-clamp-1 group-hover:text-blue-400 
                   transition-colors"
        >
          {movie.title}
        </motion.h3>

        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-400"
          >
            {new Date(movie.release_date).getFullYear()}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-white/10 hover:bg-white/20 text-white text-sm font-medium
                     transition-colors"
          >
            <FaPlay className="text-xs" />
            <span>Play</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
