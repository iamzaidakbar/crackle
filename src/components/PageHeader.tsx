"use client";

import { motion } from "framer-motion";
import MovieFilters from "./MovieFilters";
import { FilterState } from "@/types/filters";

interface PageHeaderProps {
  gradientTitle?: string;
  title: string;
  subtitle?: string;
  filters?: FilterState;
  showFilters?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  initialFilters?: FilterState;
}

export default function PageHeader({
  gradientTitle = "",
  title,
  subtitle,
  showFilters = true,
  onFilterChange,
  onResetFilters,
  initialFilters,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
      <div className="space-y-1 sm:space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
        >
          {title}
          {gradientTitle && (
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-5xl">
              {gradientTitle}
            </span>
          )}
        </motion.h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-400">{subtitle}</p>
        )}
      </div>
      {showFilters && onFilterChange && onResetFilters && (
        <div className="flex-shrink-0">
          <MovieFilters
            onFilterChange={onFilterChange}
            onFilterReset={onResetFilters}
            initialFilters={initialFilters}
          />
        </div>
      )}
    </div>
  );
}
