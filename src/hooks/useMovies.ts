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
    staleTime: 1000 * 60 * 5, // 5 minutes
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

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => movieApi.getSimilarMovies(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    gcTime: 1000 * 60 * 60, // Keep in garbage collection for 1 hour
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

export function usePagedMovies(page: number) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
    staleTime: 1000 * 60 * 5,
    placeholderData: (oldData) => oldData,
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
