"use client";

import { useState, useEffect } from "react";

export function useDataSource() {
  const [dataSource, setDataSource] = useState<"real" | "tmdb">("tmdb");
  const [isLoading, setIsLoading] = useState(false);

  const handleDataSourceChange = async (source: "real" | "tmdb") => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDataSource(source);
      localStorage.setItem("dataSource", source);
    } catch (error) {
      console.error("Error changing data source:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedSource = localStorage.getItem("dataSource") as "real" | "tmdb";
    if (savedSource) {
      setDataSource(savedSource);
    }
  }, []);

  return {
    dataSource,
    setDataSource: handleDataSourceChange,
    isLoading,
  };
}
