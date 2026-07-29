"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import { validateRegisterForm } from "@/utils/validation";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        router.push(ROUTES.DASHBOARD);
      } else {
        setErrors({ form: result.error || "Registration failed" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-text mb-2">FlowPilot</h1>
          <p className="text-secondary-text">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-card-bg border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {errors.form && (
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-3">
                <p className="text-sm text-primary-text">{errors.form}</p>
              </div>
            )}

            {/* Name Field */}
            <FormField
              label="Full Name"
              error={errors.name}
              required
            >
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </FormField>

            {/* Email Field */}
            <FormField
              label="Email Address"
              error={errors.email}
              required
            >
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </FormField>

            {/* Password Field */}
            <FormField
              label="Password"
              error={errors.password}
              required
            >
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </FormField>

            {/* Confirm Password Field */}
            <FormField
              label="Confirm Password"
              error={errors.confirmPassword}
              required
            >
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </FormField>

            {/* Terms Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border border-border bg-secondary-bg cursor-pointer accent-accent-purple"
                required
                disabled={isLoading}
              />
              <span className="text-sm text-secondary-text">
                I agree to the{" "}
                <a href="#" className="text-primary-text hover:underline">
                  Terms of Service
                </a>
                {" "}and{" "}
                <a href="#" className="text-primary-text hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-secondary-text">
                Already have an account?{" "}
                <Link
                  href={ROUTES.LOGIN}
                  className="text-primary-text hover:text-blue-400 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-secondary-text mt-6">
          © 2026 FlowPilot. All rights reserved.
        </p>
      </div>
    </div>
  );
}
