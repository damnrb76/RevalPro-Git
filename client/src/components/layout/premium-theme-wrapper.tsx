import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface PremiumThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumThemeWrapper({ children, className }: PremiumThemeWrapperProps) {
  // Fetch subscription info
  const { data: subscriptionInfo } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await fetch('/api/subscription');
      if (!response.ok) throw new Error('Failed to fetch subscription');
      return response.json();
    },
  });

  const currentPlan = subscriptionInfo?.currentPlan || 'free';

  // Plan-specific styling
  const planStyles = {
    free: {
      background: "bg-gradient-to-br from-gray-50 to-gray-100",
      accent: "border-gray-200",
      glow: "",
    },
    standard: {
      background: "bg-gradient-to-br from-blue-50 to-indigo-100",
      accent: "border-blue-200",
      glow: "shadow-blue-100/50",
    },
    premium: {
      background: "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100",
      accent: "border-purple-200",
      glow: "shadow-purple-200/50 shadow-lg",
    }
  };

  const style = planStyles[currentPlan as keyof typeof planStyles] || planStyles.free;

  return (
    <div className={cn(
      "min-h-screen",
      style.background,
      style.glow,
      className
    )}>
      {children}
      
      {/* Premium visual effects */}
      {currentPlan === 'premium' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}
      
      {/* Standard plan subtle effects */}
      {currentPlan === 'standard' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/3 via-transparent to-indigo-500/3"></div>
        </div>
      )}
    </div>
  );
}