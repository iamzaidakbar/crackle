"use client";

import { useRecommendations } from "@/hooks/useRecommendations";
import LoadingSkeleton from "./LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import PageHeader from "./PageHeader";

export default function MovieRecommendations() {
  const { recommendations, isLoading } = useRecommendations();
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  if (isLoading) return <LoadingSkeleton />;
  if (!recommendations?.results?.length) return null;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = direction === "left" ? -400 : 400;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold"
      >
        <PageHeader
          title={
            "Recommendations for you" +
            (user ? ` ${user.name.split(" ")[0]}` : "")
          }
          subtitle="Based on your watch history"
        />
      </motion.h2>

      <div className="relative group">
        {/* Left Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-0 bottom-0 z-10 
                       bg-gradient-to-r from-black/80 to-transparent
                       group-hover:from-black/90
                       w-24 flex items-center justify-start
                       transition-all duration-300
                       group-hover:opacity-100 opacity-0"
            >
              <div className="pl-4 pr-8 py-20 hover:pl-6 transition-all">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-sm rounded-full p-3
                           hover:bg-white/20 transition-colors"
                >
                  <FaChevronLeft className="text-white text-2xl" />
                </motion.div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-0 bottom-0 z-10 
                       bg-gradient-to-l from-black/80 to-transparent
                       group-hover:from-black/90
                       w-24 flex items-center justify-end
                       transition-all duration-300
                       group-hover:opacity-100 opacity-0"
            >
              <div className="pr-4 pl-8 py-20 hover:pr-6 transition-all">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/10 backdrop-blur-sm rounded-full p-3
                           hover:bg-white/20 transition-colors"
                >
                  <FaChevronRight className="text-white text-2xl" />
                </motion.div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Movies Container - add padding to prevent overlap with arrows */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {recommendations.results.map((movie: Movie, index: number) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[200px] cursor-pointer"
              onClick={() => router.push(`/movie/${movie.id}`)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden group/card">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover transform transition-transform duration-300 
                           group-hover/card:scale-110"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent 
                              opacity-0 group-hover/card:opacity-100 transition-opacity"
                >
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-white font-medium line-clamp-2">
                      {movie.title}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
