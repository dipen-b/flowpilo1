import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circle" | "rect";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rect", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-secondary-bg animate-pulse",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-lg",
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";

export default Skeleton;
