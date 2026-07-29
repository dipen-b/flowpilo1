import React from "react";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          "appearance-none flex h-10 w-full rounded-lg bg-secondary-bg border border-border px-3 py-2 text-base text-primary-text placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:border-transparent disabled:opacity-50 disabled:cursor-not-allowed pr-10",
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none"
      />
    </div>
  )
);

Select.displayName = "Select";

export default Select;
