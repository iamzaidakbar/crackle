"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchMovies } from "@/hooks/useMovies";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { FaSearch, FaTimes } from "react-icons/fa";

const popularSearches = [
  { query: "Marvel", color: "bg-red-500/10 text-red-400" },
  { query: "Star Wars", color: "bg-blue-500/10 text-blue-400" },
  { query: "Harry Potter", color: "bg-yellow-500/10 text-yellow-400" },
  { query: "Lord of the Rings", color: "bg-green-500/10 text-green-400" },
  { query: "DC Comics", color: "bg-purple-500/10 text-purple-400" },
  { query: "Pixar", color: "bg-blue-400/10 text-blue-300" },
  { query: "Studio Ghibli", color: "bg-teal-500/10 text-teal-400" },
  { query: "Christopher Nolan", color: "bg-gray-500/10 text-gray-400" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const query = searchParams.get("q") || "";

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMovies(query);

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchInput(suggestion);
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <motion.div
            initial={false}
            animate={{
              scale: isFocused ? 1.02 : 1,
              y: isFocused ? -2 : 0,
            }}
            className={`flex items-center gap-3 bg-gray-900/50 backdrop-blur-xl 
                       rounded-2xl border transition-all duration-200 ${
                         isFocused
                           ? "border-blue-500/50 shadow-lg shadow-blue-500/10"
                           : "border-gray-800"
                       }`}
          >
            <button
              type="submit"
              className="ml-6 text-xl text-gray-400 hover:text-white transition-colors"
            >
              <FaSearch />
            </button>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 100)}
              placeholder="Search for movies..."
              className="w-full py-4 px-3 bg-transparent text-lg text-white 
                       placeholder:text-gray-500 focus:outline-none"
            />
            <AnimatePresence>
              {searchInput && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchInput("")}
                  className="mr-6 p-2 hover:bg-gray-800/50 rounded-xl 
                           text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Suggestions */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 p-3 
                         bg-gray-900/95 backdrop-blur-xl rounded-xl 
                         border border-gray-800 shadow-xl z-50"
              >
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map(({ query, color }) => (
                    <motion.button
                      key={query}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(query)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${color} 
                                transition-all duration-200`}
                    >
                      {query}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Results Section */}
      {query ? (
        <>
          {isLoading ? (
            <LoadingSkeleton />
          ) : !data?.pages?.[0]?.results?.length ? (
            <NoResults message={`No movies found for "${query}"`} />
          ) : (
            <>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-white"
              >
                Results for &quot;{query}&quot;
              </motion.h2>
              <MovieGrid
                movies={data.pages.flatMap((page) => page.results)}
                prefix="search"
              />
              <div
                ref={loadMoreRef}
                className="h-20 flex items-center justify-center"
              >
                {isFetchingNextPage && (
                  <div className="text-gray-400">Loading more...</div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mt-12"
        >
          <h2 className="text-2xl font-bold text-white">Search for Movies</h2>
          <p className="text-gray-400">
            Use the search bar above or try one of our popular suggestions
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mt-6">
            {popularSearches.slice(0, 4).map(({ query, color }) => (
              <motion.button
                key={query}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSuggestionClick(query)}
                className={`px-4 py-2 rounded-lg text-sm ${color} 
                          transition-all duration-200`}
              >
                {query}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
