"use client";

import { usePopularMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

export default function PopularPage() {
  const { filters, setFilters, resetFilters } = usePersistedFilters("popular");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePopularMovies();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <BasePageLayout
      title="Popular Movies"
      subtitle="Most watched movies"
      movies={filteredMovies}
      isLoading={isLoading}
      prefix="popular"
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={resetFilters}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
