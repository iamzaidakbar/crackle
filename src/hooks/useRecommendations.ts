import { useQuery } from "@tanstack/react-query";
import { Movie } from "@/types/movie";
import { movieApi } from "@/lib/api";

interface WatchHistoryItem {
  movieId: number;
  timestamp: number;
  genres: number[];
  rating: number;
}

interface GenreScore {
  [key: number]: number;
}

export function useRecommendations() {
  // Get watch history from localStorage
  const getWatchHistory = (): WatchHistoryItem[] => {
    try {
      const history = localStorage.getItem("watchHistory");
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error reading watch history:", error);
      return [];
    }
  };

  // Calculate genre preferences based on watch history
  const calculateGenrePreferences = (
    history: WatchHistoryItem[]
  ): GenreScore => {
    const genreScores: GenreScore = {};
    const recencyWeight = 0.7; // More recent watches have higher weight
    const ratingWeight = 0.3; // User ratings influence recommendations

    history.forEach((item, index) => {
      // Calculate recency score (0 to 1, newer items closer to 1)
      const recencyScore = (index + 1) / history.length;

      item.genres.forEach((genreId) => {
        if (!genreScores[genreId]) {
          genreScores[genreId] = 0;
        }
        // Combine recency and rating for genre score
        genreScores[genreId] +=
          recencyWeight * recencyScore + ratingWeight * (item.rating / 10);
      });
    });

    return genreScores;
  };

  // Add movie to watch history with duplicate prevention
  const addToWatchHistory = (movie: Movie, rating: number = 7) => {
    if (!movie?.id || !movie?.genre_ids) return;

    const history = getWatchHistory();

    // Check if movie already exists
    const existingIndex = history.findIndex(
      (item) => item.movieId === movie.id
    );

    const newItem: WatchHistoryItem = {
      movieId: movie.id,
      timestamp: Date.now(),
      genres: movie.genre_ids || [],
      rating: Number.isNaN(rating) ? 7 : rating,
    };

    let updatedHistory: WatchHistoryItem[];

    if (existingIndex !== -1) {
      // Update existing entry with new timestamp and keep it at top
      updatedHistory = [
        newItem,
        ...history.slice(0, existingIndex),
        ...history.slice(existingIndex + 1),
      ];
    } else {
      // Add new entry
      updatedHistory = [newItem, ...history];
    }

    // Keep only last 20 unique items
    updatedHistory = updatedHistory.slice(0, 20);

    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory));
  };

  // Get personalized recommendations with additional error handling
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations", "personalized"],
    queryFn: async () => {
      try {
        const history = getWatchHistory();
        if (!history?.length) {
          return movieApi.getPopularMovies(1);
        }

        const genrePreferences = calculateGenrePreferences(history);
        const topGenres = Object.entries(genrePreferences)
          .sort(([, a], [, b]) => (b || 0) - (a || 0)) // Handle potential NaN
          .slice(0, 3)
          .map(([genreId]) => Number(genreId))
          .filter((id) => !Number.isNaN(id)); // Filter out NaN

        if (!topGenres.length) {
          return movieApi.getPopularMovies(1);
        }

        // Get movies for top genres
        const genreMovies = await Promise.all(
          topGenres.map((genreId) => movieApi.getMoviesByGenre(genreId, 1))
        );

        // Combine and sort by vote average with NaN handling
        const allMovies = genreMovies
          .flatMap((response) => response?.results || [])
          .filter(
            (movie) =>
              movie && !history.some((item) => item.movieId === movie.id)
          )
          .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

        // Remove duplicates and return top 20
        const uniqueMovies = Array.from(
          new Map(allMovies.map((movie) => [movie.id, movie])).values()
        ).slice(0, 20);

        return {
          results: uniqueMovies,
          total_results: uniqueMovies.length,
          page: 1,
          total_pages: 1,
        };
      } catch (error) {
        console.error("Error getting recommendations:", error);
        return movieApi.getPopularMovies(1);
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    recommendations,
    isLoading,
    addToWatchHistory,
  };
}
