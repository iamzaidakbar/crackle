"use client";

import { motion } from "framer-motion";
import { FaDatabase, FaServer } from "react-icons/fa";

interface DataSourceSelectorProps {
  currentSource: "real" | "tmdb";
  onSourceChange: (source: "real" | "tmdb") => void;
  isLoading: boolean;
}

export default function DataSourceSelector({
  currentSource,
  onSourceChange,
  isLoading,
}: DataSourceSelectorProps) {
  return (
    <div className="grid gap-4">
      {[
        {
          id: "real",
          label: "Real Backend",
          description: "Use your own backend server",
          icon: FaServer,
          gradient: "from-green-500 to-emerald-500",
        },
        {
          id: "tmdb",
          label: "Movie Database",
          description: "Use TMDB as data source",
          icon: FaDatabase,
          gradient: "from-blue-500 to-purple-500",
        },
      ].map((source) => (
        <motion.button
          key={source.id}
          onClick={() => onSourceChange(source.id as "real" | "tmdb")}
          disabled={isLoading}
          className={`relative p-4 rounded-xl border transition-all duration-300
          ${
            currentSource === source.id
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-700/30"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${source.gradient}`}
            >
              <source.icon className="text-xl text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">{source.label}</h3>
              <p className="text-sm text-gray-400">{source.description}</p>
            </div>
            {currentSource === source.id && (
              <motion.div
                layoutId="activeSource"
                className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
