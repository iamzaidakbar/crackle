import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { usePopularMovies } from "@/hooks/useMovies";
import MovieCard from "./MovieCard";
import { Movie } from "@/types/movie";

export function MovieList() {
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.pages.map((page, pageIndex) =>
        page.results.map((movie: Movie, index: number) => (
          <MovieCard
            key={`${pageIndex}-${movie.id}`}
            movie={movie}
            index={index}
          />
        ))
      )}

      <div
        ref={loadMoreRef}
        className="col-span-full h-20 flex items-center justify-center"
      >
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
