"use client";

import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = () => {
    let score = 0;
    if (!password) return score;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getStrength();
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-500",
  ][strength];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: i < strength ? 1 : 0.5,
              opacity: i < strength ? 1 : 0.2,
            }}
            className={`flex-1 rounded-full ${
              i < strength ? strengthColor : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      {password && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs ${
            strength < 2
              ? "text-red-400"
              : strength < 4
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          {strengthText}
        </motion.p>
      )}
    </div>
  );
}
