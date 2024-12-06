"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>(
    []
  );

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
          animate={{
            x: [particle.x, Math.random() * window.innerWidth],
            y: [particle.y, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            left: particle.x,
            top: particle.y,
          }}
        />
      ))}
    </div>
  );
}
