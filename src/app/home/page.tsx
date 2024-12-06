"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Hero from "@/components/Hero";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import NoResults from "@/components/NoResults";
import HeroSkeleton from "@/components/HeroSkeleton";
import MovieGrid from "@/components/MovieGrid";
import PageHeader from "@/components/PageHeader";
import PageHeaderSkeleton from "@/components/PageHeaderSkeleton";
import Pagination from "@/components/Pagination";
import PaginationSkeleton from "@/components/PaginationSkeleton";
import { useMovieList } from "@/hooks/useMovieList";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import { motion } from "framer-motion";
import { features, stats } from "@/utils/constants";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { page, handlePageChange } = useMovieList();
  const { filters, setFilters, resetFilters } = usePersistedFilters("home");
  const { user } = useAuth();

  const { data: trendingData } = useInfiniteQuery({
    queryKey: ["movies", "trending"],
    queryFn: ({ pageParam = 1 }) => movieApi.getTrendingMovies(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const { data, isLoading } = useInfiniteQuery({
    queryKey: ["movies", "popular"],
    queryFn: ({ pageParam = 1 }) => movieApi.getPopularMovies(pageParam),
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const currentPageData = data?.pages[page - 1];
  const filteredMovies = currentPageData?.results
    ? filterMovies(currentPageData.results, filters)
    : [];
  const totalPages = Math.min(currentPageData?.total_pages ?? 0, 500);

  if (isLoading || !trendingData?.pages[0]) {
    return (
      <div className="min-h-screen space-y-16">
        <HeroSkeleton />
        <div className="container mx-auto px-4 space-y-16">
          {/* Stats Section Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50 animate-pulse"
              >
                <div className="h-8 w-24 mx-auto bg-gray-700 rounded mb-2" />
                <div className="h-4 w-32 mx-auto bg-gray-700 rounded" />
              </div>
            ))}
          </div>

          {/* Popular Movies Section Skeleton */}
          <div className="space-y-8">
            <PageHeaderSkeleton />
            <MovieGridSkeleton />
            <PaginationSkeleton />
          </div>

          {/* Features Section Skeleton */}
          <div className="py-16">
            <div className="h-8 w-48 mx-auto bg-gray-800 rounded-lg animate-pulse mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 space-y-4"
                >
                  <div className="h-10 w-10 bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
                  <div className="h-20 w-full bg-gray-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstTrendingMovie = trendingData.pages[0]?.results[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      {/* Hero Section */}
      {firstTrendingMovie && <Hero movie={firstTrendingMovie} />}

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <AnimatedCounter value={value} />
              </h3>
              <p className="text-gray-400 mt-2">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Popular Movies Section */}
        <div className="space-y-8">
          <PageHeader
            title="Popular Movies"
            subtitle="Most watched movies this week"
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={resetFilters}
            showFilters={!!user}
            initialFilters={filters}
          />

          {filteredMovies.length > 0 ? (
            <>
              <MovieGrid movies={filteredMovies} prefix="home" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <NoResults
              message="No movies match your filters"
              subMessage="Try adjusting your filters or search criteria"
            />
          )}
        </div>

        {/* Features Section */}
        <div className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ title, description, icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30
                hover:bg-gray-800/50 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
