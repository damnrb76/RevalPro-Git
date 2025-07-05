import { Crown, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanIndicatorProps {
  plan: string;
  variant?: "badge" | "header" | "subtle";
  className?: string;
}

export function PlanIndicator({ plan, variant = "badge", className }: PlanIndicatorProps) {
  const planConfig = {
    free: {
      label: "Free",
      icon: Shield,
      colors: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        gradient: "from-gray-100 to-gray-200"
      }
    },
    standard: {
      label: "Standard",
      icon: Star,
      colors: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-300",
        gradient: "from-blue-100 to-blue-200"
      }
    },
    premium: {
      label: "Premium",
      icon: Crown,
      colors: {
        bg: "bg-gradient-to-r from-purple-100 to-pink-100",
        text: "text-purple-700",
        border: "border-purple-300",
        gradient: "from-purple-100 to-pink-100"
      }
    }
  };

  const config = planConfig[plan as keyof typeof planConfig] || planConfig.free;
  const Icon = config.icon;

  if (variant === "header") {
    return (
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
        config.colors.bg,
        config.colors.text,
        config.colors.border,
        "border shadow-sm",
        className
      )}>
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
      </div>
    );
  }

  if (variant === "subtle") {
    return (
      <div className={cn(
        "flex items-center gap-1 text-xs font-medium",
        config.colors.text,
        className
      )}>
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
      config.colors.bg,
      config.colors.text,
      config.colors.border,
      "border",
      className
    )}>
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </div>
  );
}