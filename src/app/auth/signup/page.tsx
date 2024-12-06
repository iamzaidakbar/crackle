"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import { scaleIn } from "@/utils/animations";
import PasswordStrength from "@/components/auth/PasswordStrength";
import ImageUpload from "@/components/auth/ImageUpload";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const { login, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  if (user) return <UnauthorizedAccess />;

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      await login(data.user);
    } catch (error) {
      setErrors({
        email: error instanceof Error ? error.message : "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div variants={scaleIn} className="space-y-8">
        {/* Form Header */}
        <motion.div className="text-center space-y-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-4 mx-auto"
          >
            <FaUserPlus className="w-full h-full text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Create Account
            </span>
          </h1>
          <p className="text-gray-400">Join the Crackle community</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 backdrop-blur-md bg-white/[0.02] rounded-3xl p-8 border border-white/10"
        >
          <ImageUpload value={image} onChange={setImage} />

          <FormInput
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={FaUser}
            placeholder="Enter your name"
            error={errors.name}
            index={0}
          />

          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FaEnvelope}
            placeholder="Enter your email"
            error={errors.email}
            index={1}
          />

          <div className="space-y-2">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={FaLock}
              placeholder="Create a password"
              error={errors.password}
              index={2}
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={FaLock}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            index={3}
          />

          <AuthButton type="submit" loading={loading} icon={FaUserPlus}>
            Create Account
          </AuthButton>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm rounded-lg">
              <span className="px-2 bg-gray-900 text-gray-400 rounded-lg">
                Already have an account?
              </span>
            </div>
          </div>

          <Link
            href="/auth/login"
            className="block text-center text-blue-400 hover:text-blue-300 
                     transition-colors duration-200"
          >
            Sign in instead
          </Link>
        </motion.form>
      </motion.div>
    </AuthLayout>
  );
}
