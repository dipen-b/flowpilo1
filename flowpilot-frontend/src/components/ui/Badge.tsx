import React from "react";
import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => {
    const variants = {
      default: "bg-secondary-bg text-primary-text",
      primary: "bg-gray-700/10 text-primary-text",
      secondary: "bg-gray-700/10 text-primary-text",
      success: "bg-gray-600/10 text-primary-text",
      warning: "bg-gray-500/10 text-primary-text",
      danger: "bg-gray-400/10 text-primary-text",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs font-medium rounded",
      md: "px-3 py-1.5 text-sm font-medium rounded-md",
    };

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center font-medium", variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
