import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    max: number
    variant?: "default" | "nhs-blue" | "nhs-green" | "nhs-light-blue" | "nhs-warm-yellow" | "nhs-red"
  }
>(({ className, value, max, variant = "default", ...props }, ref) => {
  const percentage = value && max ? Math.min(Math.round((value / max) * 100), 100) : 0
  
  const getVariantClass = (variant: string) => {
    switch (variant) {
      case "nhs-blue":
        return "bg-nhs-blue";
      case "nhs-green":
        return "bg-nhs-green";
      case "nhs-light-blue":
        return "bg-nhs-light-blue";
      case "nhs-warm-yellow":
        return "bg-nhs-warm-yellow";
      case "nhs-red":
        return "bg-nhs-red";
      default:
        return "bg-primary";
    }
  }
  
  return (
    <div
      ref={ref}
      className={cn("h-[10px] rounded-[5px] bg-nhs-pale-grey overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-[5px] transition-all", getVariantClass(variant))}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
