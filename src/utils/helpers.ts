import { Movie } from "@/types/movie";
import { FilterState } from "@/types/filters";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterMovies = (movies: Movie[] = [], filters: FilterState) => {
  if (!Array.isArray(movies)) return [];

  return movies.filter((movie) => {
    // Genre filter
    if (filters.genres?.length && movie.genre_ids) {
      if (!movie.genre_ids.some((id) => filters.genres.includes(id))) {
        return false;
      }
    }

    // Rating filter
    if (filters.rating && movie.vote_average) {
      if (movie.vote_average < filters.rating) {
        return false;
      }
    }

    return true;
  });
};

export const generateMovieCardId = (
  movieId: number,
  index: number,
  prefix = "movie"
): string => {
  const timestamp = Date.now();
  return `${prefix}-${movieId}-${index}-${timestamp}`;
};
