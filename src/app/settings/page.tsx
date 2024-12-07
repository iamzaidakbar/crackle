"use client";

import AnimatedBackground from "@/components/settings/AnimatedBackground";
import DataSourceSelector from "@/components/settings/DataSourceSelector";
import SettingsHeader from "@/components/settings/SettingsHeader";
import { useDataSource } from "@/hooks/useDataSource";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaDatabase, FaServer, FaCheck } from "react-icons/fa";

export default function SettingsPage() {
  const { dataSource, setDataSource, isLoading } = useDataSource();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDataSourceChange = (source: "real" | "tmdb") => {
    setDataSource(source);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Animation */}
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header Section */}
          <SettingsHeader />

          {/* Main Content */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* Data Source Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FaDatabase className="text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Data Source
                  </h2>
                  <p className="text-sm text-gray-400">
                    Choose your preferred data source
                  </p>
                </div>
              </div>

              <DataSourceSelector
                currentSource={dataSource}
                onSourceChange={handleDataSourceChange}
                isLoading={isLoading}
              />
            </motion.div>

            {/* API Status Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <FaServer className="text-2xl text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    API Status
                  </h2>
                  <p className="text-sm text-gray-400">
                    Current API connection status
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        dataSource === "real" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    />
                    <span className="text-gray-300">
                      {dataSource === "real"
                        ? "Real Backend"
                        : "Movie Database"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Active</span>
                </div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: showSuccess ? 1 : 0,
                    y: showSuccess ? 0 : 10,
                  }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <FaCheck />
                  <span className="text-sm">Settings saved successfully</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
