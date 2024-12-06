"use client";

import { useSearchMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import { useSearchParams } from "next/navigation";
import { TMDBResponse } from "@/types/movie";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { filters, setFilters, resetFilters } = usePersistedFilters("search");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSearchMovies(query);

  const allMovies =
    data?.pages.flatMap((page: TMDBResponse) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <BasePageLayout
      title={`Search Results: ${query}`}
      subtitle={`Found ${allMovies.length} movies`}
      movies={filteredMovies}
      isLoading={isLoading}
      prefix="search"
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={resetFilters}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
