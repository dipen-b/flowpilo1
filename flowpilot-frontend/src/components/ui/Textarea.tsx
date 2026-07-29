import React from "react";
import { cn } from "@/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-lg bg-secondary-bg border border-border px-3 py-2 text-base text-primary-text placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";

export default Textarea;
