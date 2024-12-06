"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { formControls } from "@/utils/animations";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: IconType;
  placeholder: string;
  error?: string;
  index: number;
}

export default function FormInput({
  id,
  label,
  type,
  value,
  onChange,
  icon: Icon,
  placeholder,
  error,
  index,
}: FormInputProps) {
  return (
    <motion.div
      variants={formControls}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Icon />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-3 py-3 border rounded-xl 
                   bg-gray-900/50 text-gray-300 placeholder-gray-500
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200
                   ${error ? "border-red-500" : "border-gray-700"}`}
          placeholder={placeholder}
          required
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
