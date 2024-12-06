"use client";

import { useState } from "react";

export const useClickEffect = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (callback: () => void) => {
    setIsClicked(true);
    setTimeout(() => {
      callback();
      setIsClicked(false);
    }, 300); // Match this with animation duration
  };

  return { isClicked, handleClick };
};
