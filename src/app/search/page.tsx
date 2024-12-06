"use client";

import { useSearchParams } from "next/navigation";
import { useSearchMovies } from "@/hooks/useMovies";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion } from "framer-motion";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(query);

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  // Handle loading state
  if (isLoading) return <LoadingSkeleton />;

  // Handle no results or empty query
  if (!data || !data.pages[0]?.results?.length) {
    return (
      <NoResults
        message={
          query ? `No movies found for "${query}"` : "Try searching for a movie"
        }
      />
    );
  }

  const allMovies = data.pages.flatMap((page) => page.results || []);

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Search Results for &quot;{query}&quot;
      </motion.h1>

      <MovieGrid movies={allMovies} prefix="search" />

      {/* Loading indicator */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="text-gray-400">Loading more...</div>
        )}
      </div>
    </div>
  );
}
