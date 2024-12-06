"use client";

import { motion } from "framer-motion";
import { FaGithub, FaGoogle } from "react-icons/fa";

const socialButtons = [
  {
    icon: FaGoogle,
    name: "Google",
    color: "from-blue-500 to-blue-500",
  },
  {
    icon: FaGithub,
    name: "GitHub",
    color: "from-gray-700 to-gray-900",
  },
];

export default function SocialLogin() {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {socialButtons.map((button) => (
          <motion.button
            key={button.name}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl
                     bg-gradient-to-r ${button.color} 
                     hover:opacity-90 transition-opacity`}
          >
            <button.icon className="text-white" />
            <span className="text-sm text-white font-medium">
              {button.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
