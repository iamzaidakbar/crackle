import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { queryClient } from "@/lib/react-query";

export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam = 1 }) => movieApi.getPopularMovies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useTopRatedMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: ({ pageParam = 1 }) => movieApi.getTopRatedMovies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

export function useTrendingMovies() {
  return useInfiniteQuery({
    queryKey: ["movies", "trending"],
    queryFn: ({ pageParam = 1 }) => movieApi.getTrendingMovies(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}

// Keep these unchanged as they don't need pagination
export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.getMovieDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

interface SimilarMoviesOptions {
  enabled?: boolean;
}

export function useSimilarMovies(
  movieId: number,
  options: SimilarMoviesOptions = {}
) {
  return useQuery({
    queryKey: ["similar-movies", movieId],
    queryFn: () => movieApi.getSimilarMovies(movieId),
    enabled: !!movieId && options.enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Prefetch function for movie details
export function prefetchMovieDetails(id: number) {
  return queryClient.prefetchQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.getMovieDetails(id),
    staleTime: 1000 * 60 * 30,
  });
}

// Add prefetching for similar movies
export function prefetchSimilarMovies(id: number) {
  return queryClient.prefetchQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => movieApi.getSimilarMovies(id),
    staleTime: 1000 * 60 * 30,
  });
}

export const useSearchMovies = (query: string) => {
  return useInfiniteQuery({
    queryKey: ["search-movies", query],
    queryFn: ({ pageParam = 1 }) => movieApi.searchMovies(query, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.total_pages) return undefined;
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: !!query,
    initialPageParam: 1,
  });
};
