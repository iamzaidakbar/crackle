import { TMDBVideo } from "@/types/video";
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api/movies",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      Cookies.remove("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

const VIDSRC_BASE_URL = "https://vidsrc.xyz/embed/movie";

export const movieApi = {
  async getPopularMovies(page: number) {
    const response = await fetch(
      `/api/movies?endpoint=/movie/popular?page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async getTopRatedMovies(page: number) {
    const response = await fetch(
      `/api/movies?endpoint=/movie/top_rated?page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async getTrendingMovies(page: number) {
    const response = await fetch(
      `/api/movies?endpoint=/trending/movie/week?page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  getMovieDetails: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}`,
      },
    });
    return response.data;
  },

  getSimilarMovies: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/similar`,
      },
    });
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1) => {
    const response = await api.get("", {
      params: {
        endpoint: `/search/movie?query=${query}&page=${page}`,
      },
    });
    return response.data;
  },

  getMovieStream: async (tmdbId: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${tmdbId}/videos`,
      },
    });

    const officialTrailer = response.data.results.find(
      (video: TMDBVideo) =>
        video.official && video.type === "Trailer" && video.site === "YouTube"
    );

    if (officialTrailer) {
      return {
        type: "youtube",
        key: officialTrailer.key,
      };
    }

    return {
      type: "stream",
      url: `${VIDSRC_BASE_URL}/${tmdbId}`,
    };
  },

  getMovieReviews: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/reviews`,
      },
    });
    return response.data;
  },

  getMovieRecommendations: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/recommendations`,
      },
    });
    return response.data;
  },

  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await api.get("", {
      params: {
        endpoint: `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
      },
    });
    return response.data;
  },

  getMovieCredits: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/credits`,
      },
    });
    return response.data;
  },
};
