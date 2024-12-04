"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import { useMovieList } from "@/hooks/useMovieList";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { setFilters, filterMovies } = useMovieList();

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => movieApi.searchMovies(query),
    enabled: query.length > 0,
  });

  const filteredMovies = data?.results ? filterMovies(data.results) : [];

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title={`Search Results for "${query}"`}
        subtitle={`Found ${filteredMovies.length} movies`}
        onFilterChange={setFilters}
        onFilterReset={() => setFilters({ rating: 0, genre: null })}
      />

      {!filteredMovies?.length ? (
        <NoResults
          message="No movies found"
          subMessage={`No results found for "${query}". Try a different search term.`}
        />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="search" />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPageContent />
    </Suspense>
  );
}
