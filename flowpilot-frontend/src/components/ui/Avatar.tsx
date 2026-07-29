import React from "react";
import { cn } from "@/utils/cn";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", fallback = "?", ...props }, ref) => {
    const sizes = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
      xl: "w-12 h-12",
    };

    const [error, setError] = React.useState(false);

    return (
      <div className={cn("flex items-center justify-center rounded-full bg-gray-600", sizes[size], className)}>
        {!error ? (
          <img
            ref={ref}
            className="w-full h-full rounded-full object-cover"
            onError={() => setError(true)}
            {...props}
          />
        ) : (
          <span className="text-xs font-bold text-white">{fallback}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
