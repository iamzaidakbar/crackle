"use client";

import { useTopRatedMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

export default function TopRatedPage() {
  const { filters, setFilters, resetFilters } =
    usePersistedFilters("top-rated");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTopRatedMovies();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <BasePageLayout
      title="Top Rated Movies"
      subtitle="Highest rated movies of all time"
      movies={filteredMovies}
      isLoading={isLoading}
      prefix="top-rated"
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={resetFilters}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
