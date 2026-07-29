import React from "react";
import { cn } from "@/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg bg-secondary-bg border border-border px-3 py-2 text-base text-primary-text placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;
