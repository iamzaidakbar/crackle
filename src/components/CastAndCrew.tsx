"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  job?: string;
}

interface CastAndCrewProps {
  cast: CastMember[];
  crew: CastMember[];
}

export default function CastAndCrew({ cast, crew }: CastAndCrewProps) {
  const [activeTab, setActiveTab] = useState<"cast" | "crew">("cast");
  const [hoveredPerson, setHoveredPerson] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const displayData = activeTab === "cast" ? cast : crew;

  return (
    <div className="mt-16">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4">
          {["cast", "crew"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "cast" | "crew")}
              className={`relative px-6 py-2 text-lg capitalize ${
                activeTab === tab ? "text-white" : "text-gray-400"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative group">
        {/* Scroll Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 
                     bg-gradient-to-r from-black/80 to-transparent
                     w-16 flex items-center justify-start
                     transition-opacity duration-300
                     group-hover:opacity-100 opacity-0"
          >
            <FaChevronLeft className="text-2xl text-white/70 ml-2" />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 
                     bg-gradient-to-l from-black/80 to-transparent
                     w-16 flex items-center justify-end
                     transition-opacity duration-300
                     group-hover:opacity-100 opacity-0"
          >
            <FaChevronRight className="text-2xl text-white/70 mr-2" />
          </button>
        )}

        {/* People Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {displayData.map((person, index) => (
            <motion.div
              key={`${activeTab}-${person.id}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 w-[160px]"
              onHoverStart={() => setHoveredPerson(person.id)}
              onHoverEnd={() => setHoveredPerson(null)}
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-gray-800">
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <FaUser className="text-4xl text-gray-600" />
                  </div>
                )}
                {hoveredPerson === person.id && (
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent
                               flex items-end p-3 transition-opacity duration-200"
                  >
                    <div className="text-xs text-gray-300">
                      {activeTab === "cast" ? "as" : "Role"}:{" "}
                      <span className="text-white">
                        {person.character || person.job}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm line-clamp-1">
                  {person.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {activeTab === "cast" ? person.character : person.job}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
