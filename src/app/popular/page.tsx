"use client";

import { usePopularMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import MovieStats from "@/components/MovieStats";
import PageHeader from "@/components/PageHeader";

export default function PopularPage() {
  const { filters, setFilters, resetFilters } = usePersistedFilters("popular");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePopularMovies();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <PageHeader
          title="Popular Movies"
          subtitle="Most watched movies"
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={resetFilters}
        />
        <MovieStats totalMovies={data?.pages[0]?.total_results || 0} />
      </div>
      <BasePageLayout
        movies={filteredMovies}
        isLoading={isLoading}
        prefix="popular"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
