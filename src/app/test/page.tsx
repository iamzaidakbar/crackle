"use client";

import { usePopularMovies } from "@/hooks/useMovies";
import { Movie } from "@/types/movie";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";

export default function TestPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePopularMovies();

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error loading movies</div>;
  if (!data?.pages) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Infinite Scroll Test</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.pages.map((page, pageIndex) =>
          page.results.map((movie: Movie) => (
            <div
              key={`${pageIndex}-${movie.id}`}
              className="p-4 border rounded"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full rounded"
              />
              <h2 className="mt-2 font-bold">{movie.title}</h2>
              <p className="text-sm text-gray-400">Page: {pageIndex + 1}</p>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator */}
      <div ref={loadMoreRef} className="text-center p-4 mt-4">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Scroll to load more</div>
        ) : (
          <div>No more movies to load</div>
        )}
      </div>
    </div>
  );
}
