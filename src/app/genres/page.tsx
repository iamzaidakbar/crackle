"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { movieApi } from "@/lib/api";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import GenrePageSkeleton from "@/components/GenrePageSkeleton";
import GenreListSkeleton from "@/components/GenreListSkeleton";
import { genreData } from "@/utils/genre";
import { FaArrowLeft, FaFilm, FaFire, FaStar } from "react-icons/fa";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const GenreStats = ({ count }: { count: number }) => {
  const stats = [
    {
      icon: <FaFilm className="text-blue-500" />,
      label: "Movies",
      value: count,
    },
    {
      icon: <FaFire className="text-orange-500" />,
      label: "Trending",
      value: Math.floor(count * 0.3),
    },
    {
      icon: <FaStar className="text-yellow-500" />,
      label: "Top Rated",
      value: Math.floor(count * 0.15),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50"
        >
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {stat.value.toLocaleString()}
          </h3>
          <p className="text-gray-400 mt-2">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const GenreHeader = ({
  genre,
  onBack,
}: {
  genre: {
    id: number;
    name: string;
    icon: string;
    description: string;
    color: string;
  };
  onBack: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden rounded-2xl mb-8 ${genre.color}`}
  >
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,255,255,0.2),_transparent)] opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <div className="relative p-8 space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Genres</span>
      </button>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{genre.name}</h1>
        <p className="text-white/70">{genre.description}</p>
      </div>
    </div>
  </motion.div>
);

const GenreList = ({
  onGenreSelect,
}: {
  onGenreSelect: (id: number) => void;
}) => {
  const { isLoading } = useQuery({
    queryKey: ["genre-preview"],
    queryFn: () => movieApi.getPopularMovies(1),
  });

  if (isLoading) {
    return <GenreListSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-white mb-8"
      >
        Explore Movie Genres
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {genreData.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white/90 mb-4">
              {category.category}
            </h2>
            <div className="grid gap-4">
              {category.genres.map((genre) => (
                <motion.div
                  key={genre.id}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onGenreSelect(genre.id)}
                  className={`p-4 rounded-xl cursor-pointer bg-gradient-to-br ${genre.color} 
                  relative overflow-hidden group`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center bg-white/10 
                      rounded-lg backdrop-blur-sm text-2xl group-hover:scale-110 transition-transform"
                    >
                      {genre.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {genre.name}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-1">
                        {genre.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                    initial={false}
                    whileHover={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const GenreContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = Number(searchParams.get("selected")) || null;
  const { filters } = usePersistedFilters(`genre_${selectedGenre}`);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", "genre", selectedGenre],
      queryFn: ({ pageParam = 1 }) =>
        selectedGenre !== null
          ? movieApi.getMoviesByGenre(selectedGenre, pageParam)
          : Promise.reject("No genre selected"),
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      enabled: selectedGenre !== null,
      initialPageParam: 1,
    });

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const currentGenre = genreData
    .flatMap((category) => category.genres)
    .find((genre) => genre.id === selectedGenre);

  const filteredMovies = data?.pages
    .flatMap((page) => page.results)
    .filter((movie) => filterMovies(movie, filters));

  if (!selectedGenre) {
    return isLoading ? (
      <GenreListSkeleton />
    ) : (
      <GenreList
        onGenreSelect={(id) => router.push(`/genres?selected=${id}`)}
      />
    );
  }

  if (isLoading) {
    return <GenrePageSkeleton />;
  }

  if (!currentGenre) return <NoResults />;

  return (
    <div className="container mx-auto px-4 py-8">
      <GenreHeader genre={currentGenre} onBack={() => router.push("/genres")} />
      <GenreStats
        count={
          data?.pages.reduce((total, page) => total + page.total_results, 0) ||
          0
        }
      />
      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <MovieGrid
            movies={filteredMovies}
            prefix={`genre-${selectedGenre}`}
          />

          {/* Loading indicator */}
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center"
          >
            {isFetchingNextPage && (
              <div className="text-gray-400">Loading more...</div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default function GenresPage() {
  return <GenreContent />;
}
