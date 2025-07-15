import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const value = props.value as string | undefined;
    return (
      <div className="relative group">
        {/* Highlight ring outside input on focus */}
        <div className="pointer-events-none absolute -inset-2 rounded-xl transition-all duration-300 z-0"></div>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={{
            borderColor: (isFocused || (typeof value === 'string' && value.length > 0)) ? '#5A56B3' : '#B3B2E6',
            transition: 'border-color 0.2s',
          }}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
