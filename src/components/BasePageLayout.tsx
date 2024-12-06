"use client";

import { motion } from "framer-motion";
import MovieGrid from "./MovieGrid";
import NoResults from "./NoResults";
import { Movie } from "@/types/movie";
import InfiniteScroll from "./InfiniteScroll";
import LoadingSkeleton from "./LoadingSkeleton";

interface BasePageLayoutProps {
  movies: Movie[];
  isLoading: boolean;
  prefix: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export default function BasePageLayout({
  movies,
  isLoading,
  prefix,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: BasePageLayoutProps) {
  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      {!movies?.length ? (
        <NoResults />
      ) : (
        <>
          <MovieGrid movies={movies} prefix={prefix} />
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </>
      )}
    </motion.div>
  );
}
