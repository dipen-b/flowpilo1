"use client";

import React, { useEffect } from "react";
import { useUIStore } from "@/stores/ui";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useUIStore();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      // Theme is already set in store, just apply it
      const root = document.documentElement;
      if (savedTheme === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    }
  }, []);

  return <>{children}</>;
}

export default ThemeProvider;
