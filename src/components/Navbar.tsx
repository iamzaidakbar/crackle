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
  FaCog,
  FaBookmark,
  FaSearch,
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
      className={`relative px-4 py-2 rounded-lg transition-all duration-300
                ${isActive ? "font-bold" : "text-gray-400 hover:text-white"}
                ${isClicked ? "scale-95 opacity-80" : ""}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Text Content with Animation */}
      <motion.span
        className={`relative z-10 inline-block ${
          isActive
            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            : ""
        }`}
        whileHover={{
          y: -2,
          transition: { duration: 0.2 },
        }}
        animate={
          isActive
            ? {
                textShadow: [
                  "0 0 0px #fff",
                  "0 0 15px #3b82f6",
                  "0 0 0px #fff",
                ],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }
            : {}
        }
      >
        {children}
      </motion.span>

      {/* Enhanced Ripple Effect */}
      <AnimatePresence>
        {isClicked && (
          <>
            {/* Inner ripple */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full bg-white/30 -z-10"
              style={{ originX: 0.5, originY: 0.5 }}
            />
            {/* Outer ripple */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0.3 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full bg-white/20 -z-10"
              style={{ originX: 0.5, originY: 0.5 }}
            />
          </>
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
                      {/* Settings Option */}
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                          <FaCog />
                        </span>
                        <span>Settings</span>
                      </Link>

                      {/* Profile Option */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                          <FaUser />
                        </span>
                        <span>Profile</span>
                      </Link>

                      {/* Watchlist Option */}
                      <Link
                        href="/watchlist"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all group"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="p-2 bg-green-500/10 text-green-400 rounded-lg group-hover:scale-110 transition-transform">
                          <FaBookmark />
                        </span>
                        <span>Watchlist</span>
                      </Link>

                      {/* Logout Option */}
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
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50"
            >
              <div className="container mx-auto p-4 space-y-6">
                {/* Navigation Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <motion.button
                      key={href}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        router.push(href);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl 
                                 ${
                                   pathname === href
                                     ? "bg-blue-500/10 text-blue-400"
                                     : "bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"
                                 }`}
                    >
                      <Icon className="text-xl" />
                      <span className="text-sm font-medium">{label}</span>
                    </motion.button>
                  ))}

                  {/* Quick Actions */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push("/search");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"
                  >
                    <FaSearch className="text-xl" />
                    <span className="text-sm font-medium">Search</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push("/watchlist");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"
                  >
                    <FaBookmark className="text-xl" />
                    <span className="text-sm font-medium">Watchlist</span>
                  </motion.button>
                </div>

                {/* Settings and Logout */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-800/30 text-gray-400 hover:bg-gray-800/50"
                  >
                    <FaCog className="text-lg" />
                    <span className="text-sm font-medium">Settings</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="text-sm font-medium">Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
