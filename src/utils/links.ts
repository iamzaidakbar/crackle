import { IconType } from "react-icons";
import { FaHome, FaFire, FaCompass, FaStar } from "react-icons/fa";

interface NavLink {
  label: string;
  href: string;
  icon: IconType;
}

export const navLinks: NavLink[] = [
  { href: "/home", label: "Home", icon: FaHome },
  { href: "/popular", label: "Popular", icon: FaFire },
  { href: "/top-rated", label: "Top Rated", icon: FaStar },
  { href: "/trending", label: "Trending", icon: FaCompass },
];
