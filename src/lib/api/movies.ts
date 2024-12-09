import { api } from "./client";
import { MovieDetails } from "@/types/movie";

export const movieApi = {
  getPopularMovies: async (page: number = 1): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/popular?page=${page}` },
    });
    return response.data;
  },

  getTopRatedMovies: async (page: number = 1): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/top_rated?page=${page}` },
    });
    return response.data;
  },

  getTrendingMovies: async (page: number = 1): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/trending/movie/week?page=${page}` },
    });
    return response.data;
  },

  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/${id}` },
    });
    return response.data;
  },

  getMovieRecommendations: async (id: number): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/${id}/recommendations` },
    });
    return response.data;
  },

  getMovieReviews: async (id: number): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/${id}/reviews` },
    });
    return response.data;
  },

  searchMovies: async (query: string): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: { endpoint: `/search/movie?query=${encodeURIComponent(query)}` },
    });
    return response.data;
  },

  getMoviesByGenre: async (
    genreId: number,
    page: number = 1
  ): Promise<MovieDetails> => {
    const response = await api.get("/movies", {
      params: {
        endpoint: `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
      },
    });
    return response.data;
  },

  getMovieVideos: async (id: number) => {
    const response = await api.get("/movies", {
      params: { endpoint: `/movie/${id}/videos` },
    });
    return response.data;
  },
};
