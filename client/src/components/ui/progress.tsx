import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: number
    max: number
    variant?: "default" | "nhs-blue" | "nhs-green" | "nhs-light-blue" | "nhs-warm-yellow" | "nhs-red" | 
             "revalpro-blue" | "revalpro-dark-blue" | "revalpro-green" | "revalpro-orange" | "revalpro-purple" | "revalpro-pink"
  }
>(({ className, value, max, variant = "default", ...props }, ref) => {
  const percentage = value && max ? Math.min(Math.round((value / max) * 100), 100) : 0
  
  const getVariantClass = (variant: string) => {
    switch (variant) {
      // RevalPro colors
      case "revalpro-blue":
        return "bg-revalpro-blue";
      case "revalpro-dark-blue":
        return "bg-revalpro-dark-blue";
      case "revalpro-green":
        return "bg-revalpro-green";
      case "revalpro-orange":
        return "bg-revalpro-orange";
      case "revalpro-purple":
        return "bg-revalpro-purple";
      case "revalpro-pink":
        return "bg-revalpro-pink";
      // Legacy NHS colors  
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
      className={cn("h-[10px] rounded-[5px] bg-revalpro-grey overflow-hidden", className)}
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
