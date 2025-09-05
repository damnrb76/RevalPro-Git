import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Star, Shield, ArrowRight } from "lucide-react";
import { getPlanDetails } from "@shared/subscription-plans";

interface SubscriptionGuardProps {
  children: React.ReactNode;
  requiredPlan?: "standard" | "premium";
  feature?: string;
  fallbackComponent?: React.ReactNode;
  inline?: boolean;
}

const planIcons = {
  free: null,
  standard: Star,
  premium: Crown,
};

const planColors = {
  free: "text-gray-500",
  standard: "text-blue-600", 
  premium: "text-purple-600",
};

export default function SubscriptionGuard({ 
  children, 
  requiredPlan = "standard", 
  feature, 
  fallbackComponent,
  inline = false 
}: SubscriptionGuardProps) {
  const { data: subscriptionInfo, isLoading } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await fetch('/api/subscription');
      if (!response.ok) throw new Error('Failed to fetch subscription');
      return response.json();
    },
  });

  if (isLoading) {
    return inline ? null : <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  const currentPlan = subscriptionInfo?.currentPlan || 'free';
  
  // Check if user has access
  const hasAccess = () => {
    if (requiredPlan === "standard") {
      return currentPlan === "standard" || currentPlan === "premium";
    }
    if (requiredPlan === "premium") {
      return currentPlan === "premium";
    }
    return true;
  };

  // If user has access, render children
  if (hasAccess()) {
    return <>{children}</>;
  }

  // If custom fallback provided, use that
  if (fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // Default upgrade prompt
  const requiredPlanDetails = getPlanDetails(requiredPlan);
  const RequiredIcon = planIcons[requiredPlan];

  if (inline) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-600">
        {RequiredIcon && <RequiredIcon className="h-4 w-4" />}
        <span>Requires {requiredPlanDetails.name}</span>
        <Button size="sm" variant="link" className="p-0 h-auto text-amber-600" asChild>
          <a href="/subscription">Upgrade</a>
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          {RequiredIcon && <RequiredIcon className="h-5 w-5" />}
          {feature ? `${feature} Requires ${requiredPlanDetails.name}` : `${requiredPlanDetails.name} Required`}
        </CardTitle>
        <CardDescription className="text-amber-700">
          {feature 
            ? `To access ${feature.toLowerCase()}, you need a ${requiredPlanDetails.name} subscription.`
            : `This feature requires a ${requiredPlanDetails.name} subscription to access.`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white" asChild>
            <a href="/subscription" className="flex items-center gap-2">
              Upgrade to {requiredPlanDetails.name}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/subscription">View All Plans</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}