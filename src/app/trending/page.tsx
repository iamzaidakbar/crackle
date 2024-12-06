"use client";

import { useTrendingMovies } from "@/hooks/useMovies";
import BasePageLayout from "@/components/BasePageLayout";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import MovieStats from "@/components/MovieStats";
import PageHeader from "@/components/PageHeader";

export default function TrendingPage() {
  const { filters, setFilters, resetFilters } = usePersistedFilters("trending");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTrendingMovies();

  const allMovies = data?.pages.flatMap((page) => page.results) || [];
  const filteredMovies = filterMovies(allMovies, filters);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <PageHeader
          title="Trending Movies"
          subtitle="What's hot this week"
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={resetFilters}
        />
        <MovieStats totalMovies={data?.pages[0]?.total_results || 0} />
      </div>
      <BasePageLayout
        movies={filteredMovies}
        isLoading={isLoading}
        prefix="trending"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
