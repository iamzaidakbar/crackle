"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import { scaleIn } from "@/utils/animations";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  if (user) return <UnauthorizedAccess />;

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      await login(data.user);
    } catch (error) {
      setErrors({
        password: error instanceof Error ? error.message : "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div variants={scaleIn} className="space-y-8">
        {/* Logo Section */}
        <motion.div className="text-center space-y-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 mx-auto"
          >
            <FaSignInAlt className="w-full h-full text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          <p className="text-gray-400">Sign in to continue watching</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 backdrop-blur-md bg-white/[0.02] rounded-3xl p-8 border border-white/10"
        >
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FaEnvelope}
            placeholder="Enter your email"
            error={errors.email}
            index={0}
          />

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FaLock}
            placeholder="Enter your password"
            error={errors.password}
            index={1}
          />

          <AuthButton type="submit" loading={loading} icon={FaSignInAlt}>
            Sign In
          </AuthButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm rounded-lg">
              <span className="px-2 bg-gray-900 text-gray-400 rounded-lg">
                New to Crackle?
              </span>
            </div>
          </div>

          <Link
            href="/auth/signup"
            className="block text-center text-blue-400 hover:text-blue-300 
                     transition-colors duration-200"
          >
            Create an account
          </Link>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}
