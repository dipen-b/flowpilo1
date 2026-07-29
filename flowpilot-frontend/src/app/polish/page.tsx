"use client";

import { AppLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

interface FormField {
  name: string;
  value: string;
  error?: string;
  success?: boolean;
}

function PolishContent() {
  const [formFields, setFormFields] = useState<Record<string, FormField>>({
    email: { name: "email", value: "", error: undefined, success: false },
    password: { name: "password", value: "", error: undefined, success: false },
    username: { name: "username", value: "", error: undefined, success: false },
  });

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return isValid;
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateUsername = (username: string) => {
    return username.length >= 3;
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormFields({
      ...formFields,
      [fieldName]: { ...formFields[fieldName], value },
    });

    let error: string | undefined;
    let success = false;

    if (fieldName === "email") {
      if (value.length === 0) {
        error = undefined;
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email";
      } else {
        success = true;
      }
    } else if (fieldName === "password") {
      if (value.length === 0) {
        error = undefined;
      } else if (!validatePassword(value)) {
        error = "Password must be at least 8 characters";
      } else {
        success = true;
      }
    } else if (fieldName === "username") {
      if (value.length === 0) {
        error = undefined;
      } else if (!validateUsername(value)) {
        error = "Username must be at least 3 characters";
      } else {
        success = true;
      }
    }

    setFormFields({
      ...formFields,
      [fieldName]: { ...formFields[fieldName], error, success },
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Form submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">UI Polish & Refinement</h1>
          <p className="text-secondary-text">
            Smooth interactions, transitions, and refined visual feedback
          </p>
        </div>

        {/* Smooth Form with Validation */}
        <Card>
          <CardHeader>
            <CardTitle>Refined Form with Validation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg text-green-600 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2">
                  <Check size={20} />
                  {successMessage}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-text">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={formFields.email.value}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2 bg-secondary-bg border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    formFields.email.success
                      ? "border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                      : formFields.email.error
                      ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                      : "border-border focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20"
                  }`}
                />
                {formFields.email.success && (
                  <Check
                    size={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 animate-in scale-in duration-200"
                  />
                )}
                {formFields.email.error && (
                  <AlertCircle
                    size={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 animate-in scale-in duration-200"
                  />
                )}
              </div>
              {formFields.email.error && (
                <p className="text-sm text-red-600 animate-in fade-in slide-in-from-left-2 duration-200">
                  {formFields.email.error}
                </p>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-text">
                Username
              </label>
              <input
                type="text"
                value={formFields.username.value}
                onChange={(e) => handleFieldChange("username", e.target.value)}
                placeholder="john_doe"
                className={`w-full px-4 py-2 bg-secondary-bg border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                  formFields.username.success
                    ? "border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                    : formFields.username.error
                    ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                    : "border-border focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20"
                }`}
              />
              {formFields.username.error && (
                <p className="text-sm text-red-600 animate-in fade-in slide-in-from-left-2 duration-200">
                  {formFields.username.error}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-text">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formFields.password.value}
                  onChange={(e) => handleFieldChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 bg-secondary-bg border-2 rounded-lg transition-all duration-200 focus:outline-none pr-10 ${
                    formFields.password.success
                      ? "border-green-600 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
                      : formFields.password.error
                      ? "border-red-600 focus:border-red-600 focus:ring-2 focus:ring-red-600/20"
                      : "border-border focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formFields.password.error && (
                <p className="text-sm text-red-600 animate-in fade-in slide-in-from-left-2 duration-200">
                  {formFields.password.error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full transition-all duration-200 active:scale-95"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block mr-2">⌛</span>
                  Processing...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Smooth Dropdowns */}
        <Card>
          <CardHeader>
            <CardTitle>Smooth Dropdown Menus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Option A", "Option B", "Option C"].map((option, idx) => (
              <div key={option} className="space-y-2">
                <button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === option ? null : option)
                  }
                  className="w-full flex items-center justify-between p-3 bg-secondary-bg rounded-lg border border-border hover:border-primary-text transition-all duration-200"
                >
                  <span className="text-primary-text">{option}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      activeDropdown === option ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeDropdown === option && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 pl-4">
                    {["Sub-option 1", "Sub-option 2", "Sub-option 3"].map((sub) => (
                      <button
                        key={sub}
                        className="block w-full text-left px-3 py-2 text-secondary-text hover:text-primary-text hover:bg-card-bg rounded-lg transition-colors duration-200"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Smooth Search */}
        <Card>
          <CardHeader>
            <CardTitle>Smooth Search & Filtering</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text group-focus-within:text-primary-text transition-colors duration-200"
              />
              <input
                type="text"
                placeholder="Search projects, tasks, or people..."
                className="w-full pl-10 pr-4 py-3 bg-secondary-bg border-2 border-border rounded-lg focus:outline-none focus:border-primary-text focus:ring-2 focus:ring-accent-purple/20 transition-all duration-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Button States & Transitions */}
        <Card>
          <CardHeader>
            <CardTitle>Button States & Transitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-secondary-text mb-3">Primary Button</p>
              <div className="flex gap-3">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <Button className="bg-green-600 hover:bg-green-700">Success</Button>
                <Button className="bg-red-600 hover:bg-red-700">Danger</Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-secondary-text mb-3">Secondary Button</p>
              <div className="flex gap-3">
                <Button variant="secondary">Default</Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" className="border-green-600 text-green-600 hover:bg-green-600/10">
                  Success
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-secondary-text mb-3">Button with Icon</p>
              <div className="flex gap-3">
                <Button className="flex items-center gap-2">
                  <Check size={16} />
                  Save Changes
                </Button>
                <Button variant="secondary" className="flex items-center gap-2">
                  <ArrowRight size={16} />
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scroll & Layout Animations */}
        <Card>
          <CardHeader>
            <CardTitle>Scroll & Layout Animations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-secondary-bg rounded-lg border border-border animate-in fade-in slide-in-from-left-4 duration-500"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                    opacity: 1,
                    transform: "translateX(0)",
                  }}
                >
                  <p className="font-medium text-primary-text">Animated Item {idx + 1}</p>
                  <p className="text-sm text-secondary-text">Smooth entrance on scroll</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transition Effects Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Transition Effects Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: "Form Validation",
                  effect: "Smooth color + ring transitions, icon fade-in",
                },
                {
                  name: "Dropdown Toggle",
                  effect: "Chevron rotation + content slide/fade",
                },
                {
                  name: "Button States",
                  effect: "Scale, brightness, and shadow transitions",
                },
                {
                  name: "Error Messages",
                  effect: "Slide-in from left with fade animation",
                },
                {
                  name: "Field Focus",
                  effect: "Border color + ring glow with smooth duration",
                },
                {
                  name: "Search Input",
                  effect: "Icon color transition on focus",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-3 bg-secondary-bg rounded-lg border border-border"
                >
                  <p className="font-semibold text-primary-text text-sm mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-secondary-text">{item.effect}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function Polish() {
  return (
    <ProtectedRoute>
      <PolishContent />
    </ProtectedRoute>
  );
}
