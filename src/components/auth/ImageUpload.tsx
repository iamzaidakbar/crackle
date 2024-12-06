"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaCheck, FaExclamation } from "react-icons/fa";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
        setError("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      };

      reader.onerror = () => {
        setError("Failed to read file");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    }
  };

  return (
    <div className="flex flex-col items-center -mt-14 mb-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-32 h-32 rounded-full overflow-hidden relative bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700 cursor-pointer shadow-xl"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full h-full"
            >
              <Image
                src={preview}
                alt="Profile"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/10 to-purple-600/10">
              <FaCamera className="w-10 h-10 text-gray-400" />
            </div>
          )}

          {/* Success/Error Animation */}
          <AnimatePresence>
            {(showSuccess || error) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm
                          ${error ? "bg-red-500/20" : "bg-green-500/20"}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className={`rounded-full p-3 ${
                    error ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {error ? (
                    <FaExclamation className="w-6 h-6 text-white" />
                  ) : (
                    <FaCheck className="w-6 h-6 text-white" />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {error ? (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {error}
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-400"
        >
          {preview ? "Click to change photo" : "Click to add photo"}
        </motion.p>
      )}
    </div>
  );
}
