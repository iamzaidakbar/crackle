"use client";

import { useTrendingMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

export default function TrendingPage() {
  const { filters, setFilters, resetFilters } = usePersistedFilters("trending");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTrendingMovies();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <BasePageLayout
      title="Trending Movies"
      subtitle="What's hot this week"
      movies={filteredMovies}
      isLoading={isLoading}
      prefix="trending"
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={resetFilters}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
