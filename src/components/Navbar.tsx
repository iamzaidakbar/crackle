"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { navLinks } from "@/utils/links";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { dropdownGenres } from "@/utils/genre";
import { useLoadingBar } from "@/hooks/useLoadingBar";
import { useClickEffect } from "@/hooks/useClickEffect";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const router = useRouter();
  const { isClicked, handleClick } = useClickEffect();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <motion.button
      onClick={() => handleClick(() => router.push(href))}
      className={`relative px-4 py-2 rounded-lg transition-colors
                ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
                ${isClicked ? "scale-95 opacity-80" : ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 bg-white/10 rounded-lg -z-10"
        />
      )}

      {/* Click Effect */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm rounded-lg"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGenres, setShowGenres] = useState(false);
  const { startLoading, stopLoading } = useLoadingBar();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const genreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        genreDropdownRef.current &&
        !genreDropdownRef.current.contains(event.target as Node)
      ) {
        setShowGenres(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    startLoading();
    const timeout = setTimeout(stopLoading, 500);
    return () => clearTimeout(timeout);
  }, [pathname, startLoading, stopLoading]);

  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-500"
      : "text-gray-300 hover:text-white transition-colors";

  const handleLogout = async () => {
    try {
      startLoading();
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      stopLoading();
    }
  };

  const handleGenreClick = (genreId: number) => {
    startLoading();
    setShowGenres(false);
    setIsMobileMenuOpen(false);
    router.push(`/genres?selected=${genreId}`);
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startLoading();
    setShowGenres(false);
    setIsMobileMenuOpen(false);
    router.push("/genres");
  };

  if (!user?.token || !user?.id) {
    return null;
  }

  return (
    <nav className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Crackle
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            {/* Genre Dropdown */}
            <div
              className="relative"
              ref={genreDropdownRef}
              onMouseEnter={() => setShowGenres(true)}
              onMouseLeave={() => setShowGenres(false)}
            >
              <button
                className={`flex items-center gap-2 ${isActive("/genres")}`}
              >
                Genres
                <motion.span
                  animate={{ rotate: showGenres ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown />
                </motion.span>
              </button>

              <AnimatePresence>
                {showGenres && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] mt-6
                    bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800
                    shadow-xl shadow-black/20 overflow-hidden"
                    style={{ transformOrigin: "top center" }}
                  >
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 
                      bg-gray-950 border-l border-t border-gray-800 rotate-45"
                    />
                    {/* Genre dropdown content */}
                    <div className="p-6 grid grid-cols-2 gap-6">
                      {dropdownGenres.map((category, idx) => (
                        <motion.div
                          key={category.category}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.2 }}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-gray-500 px-2 flex items-center gap-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-800" />
                            <span className="flex-shrink-0">
                              {category.category}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-l from-gray-800" />
                          </h3>
                          <div className="space-y-3">
                            {category.genres.map((genre) => (
                              <div
                                key={genre.id}
                                onClick={() => handleGenreClick(genre.id)}
                                className="cursor-pointer"
                              >
                                <motion.div
                                  whileHover={{ x: 4, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.3 }}
                                  className={`p-4 rounded-xl bg-gradient-to-br ${genre.color} 
                                  hover:bg-opacity-90 transition-all duration-300 
                                  flex items-center gap-5 group relative overflow-hidden`}
                                >
                                  <span
                                    className="w-12 h-12 flex items-center justify-center 
                                    bg-black/30 rounded-xl text-2xl group-hover:scale-110 
                                    transition-transform duration-300 backdrop-blur-sm"
                                  >
                                    {genre.icon}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-base font-medium text-gray-100 mb-1">
                                      {genre.name}
                                    </div>
                                    <div className="text-sm text-gray-300 line-clamp-1">
                                      {genre.description}
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div
                      onClick={handleExploreClick}
                      className="p-5 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 
                      border-t border-gray-800 hover:from-blue-900 hover:via-blue-800 
                      hover:to-blue-900 transition-all duration-300 text-center
                      flex items-center justify-center gap-3 group cursor-pointer"
                    >
                      <span
                        className="text-sm font-medium text-gray-200 
                        group-hover:text-white transition-all duration-300"
                      >
                        Explore All Genres
                      </span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-gray-300 group-hover:text-white"
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search and User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* User Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {user ? (
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <motion.span
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-6 w-64 bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-xl shadow-black/20 overflow-hidden"
                    style={{ transformOrigin: "top right" }}
                  >
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-950 border-l border-t border-gray-800 rotate-45" />

                    <div className="p-4 border-b border-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                          {user?.image ? (
                            <Image
                              src={user?.image}
                              alt={user?.name || "User"}
                              fill
                              className="object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-white truncate">
                            {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
                      >
                        <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                          <FaUser />
                        </span>
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
                      >
                        <span className="p-2 bg-red-500/10 text-red-400 rounded-lg group-hover:scale-110 transition-transform">
                          <FaSignOutAlt />
                        </span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <SearchBar />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 ${isActive(link.href)}`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Mobile Genre Menu */}
                <div className="px-4">
                  <button
                    onClick={() => setShowGenres(!showGenres)}
                    className="flex items-center justify-between w-full py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Genres
                    <FaChevronDown
                      className={`transform transition-transform duration-200 ${
                        showGenres ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showGenres && (
                    <div className="mt-2 space-y-2 pl-4">
                      {dropdownGenres.map((category) => (
                        <div key={category.category}>
                          <div className="text-sm font-medium text-gray-500 mb-2">
                            {category.category}
                          </div>
                          {category.genres.map((genre) => (
                            <button
                              key={genre.id}
                              onClick={() => handleGenreClick(genre.id)}
                              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                            >
                              <span className="mr-2">{genre.icon}</span>
                              {genre.name}
                            </button>
                          ))}
                        </div>
                      ))}
                      <button
                        onClick={handleExploreClick}
                        className="w-full mt-4 px-4 py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2"
                      >
                        Explore All Genres
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
