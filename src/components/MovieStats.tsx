"use client";

import { motion } from "framer-motion";
import { FaStar, FaFilm, FaClock } from "react-icons/fa";

interface MovieStatsProps {
  totalMovies: number;
}

export default function MovieStats({ totalMovies }: MovieStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6"
    >
      <div className="p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
        <div className="flex items-center gap-3">
          <FaFilm className="text-blue-500" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {totalMovies.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Total Movies</div>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
        <div className="flex items-center gap-3">
          <FaStar className="text-yellow-500" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {Math.round(totalMovies / 20)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Pages</div>
          </div>
        </div>
      </div>
      <div className="hidden sm:block p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
        <div className="flex items-center gap-3">
          <FaClock className="text-purple-500" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-xs sm:text-sm text-gray-400">Last Updated</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
