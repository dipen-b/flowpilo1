"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock authentication - store in localStorage
      const mockUser = {
        id: "user-1",
        email: email,
        name: "John Doe",
        role: "owner",
      };

      localStorage.setItem("flowpilot_auth", JSON.stringify(mockUser));
      localStorage.setItem("flowpilot_token", "mock-jwt-token-" + Date.now());

      setIsLoading(false);
      setErrors({});

      // Redirect to dashboard
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/10 mb-4">
            <svg
              className="w-8 h-8 text-primary-text"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-primary-text">FlowPilot</h1>
          <p className="text-secondary-text mt-2">Project Management for Modern Teams</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-red-600 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-text">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2 bg-secondary-bg border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                      errors.email
                        ? "border-red-600 focus:ring-2 focus:ring-red-600/20"
                        : "border-border focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-text">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-secondary-bg border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                      errors.password
                        ? "border-red-600 focus:ring-2 focus:ring-red-600/20"
                        : "border-border focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-border"
                  defaultChecked
                />
                <label htmlFor="remember" className="text-sm text-secondary-text">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block">⌛</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-primary-text/20 bg-black/5">
          <CardContent className="pt-6">
            <p className="text-xs text-secondary-text mb-3 font-semibold">
              📝 DEMO CREDENTIALS
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-secondary-text">Email:</p>
                <code className="text-primary-text font-mono">john@example.com</code>
              </div>
              <div>
                <p className="text-secondary-text">Password:</p>
                <code className="text-primary-text font-mono">password123</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-secondary-text">
          This is a demo app with mock authentication. All data is stored locally.
        </p>
      </div>
    </div>
  );
}
