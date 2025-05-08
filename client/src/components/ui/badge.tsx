import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        // NHS-specific variants
        "nhs-blue": "bg-nhs-blue text-white",
        "nhs-light-blue": "bg-nhs-light-blue text-white",
        "nhs-dark-blue": "bg-nhs-dark-blue text-white",
        "nhs-green": "bg-nhs-green text-white",
        "nhs-light-green": "bg-nhs-light-green text-nhs-black",
        "nhs-red": "bg-nhs-red text-white",
        "nhs-warm-yellow": "bg-nhs-warm-yellow text-nhs-black",
        // Status badges
        completed: "bg-nhs-green text-white",
        "in-progress": "bg-nhs-light-blue text-white",
        "not-started": "bg-nhs-red text-white",
        "attention-needed": "bg-nhs-warm-yellow text-nhs-black",
      },
      size: {
        default: "h-6 px-2 py-1",
        sm: "h-5 px-1.5 py-0.5 text-xs",
        lg: "h-7 px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
