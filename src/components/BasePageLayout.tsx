"use client";

import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import MovieGrid from "./MovieGrid";
import NoResults from "./NoResults";
import { FilterState } from "@/types/filters";
import { Movie } from "@/types/movie";
import PageHeaderSkeleton from "./PageHeaderSkeleton";
import MovieGridSkeleton from "./MovieGridSkeleton";
import InfiniteScroll from "./InfiniteScroll";
import InfiniteScrollSkeleton from "./InfiniteScrollSkeleton";

interface BasePageLayoutProps {
  title: string;
  subtitle: string;
  movies?: Movie[];
  isLoading?: boolean;
  prefix: string;
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export default function BasePageLayout({
  title,
  subtitle,
  movies = [],
  isLoading = false,
  prefix,
  filters,
  onFilterChange,
  onResetFilters,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: BasePageLayoutProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHeaderSkeleton />
        <MovieGridSkeleton />
        <InfiniteScrollSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
      />

      {!movies?.length ? (
        <NoResults onReset={onResetFilters} />
      ) : (
        <>
          <MovieGrid movies={movies} prefix={prefix} />
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </>
      )}
    </motion.div>
  );
}
