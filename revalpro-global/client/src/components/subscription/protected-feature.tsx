import { useSubscription } from "@/hooks/use-subscription";
import SubscriptionGuard from "./subscription-guard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Crown, Star, Lock } from "lucide-react";

interface ProtectedFeatureProps {
  children: React.ReactNode;
  feature: string;
  requiredPlan?: "standard" | "premium";
  description?: string;
  showWhenRestricted?: boolean;
  restrictedContent?: React.ReactNode;
}

export default function ProtectedFeature({
  children,
  feature,
  requiredPlan = "standard",
  description,
  showWhenRestricted = false,
  restrictedContent
}: ProtectedFeatureProps) {
  const { hasAccess, currentPlan, isLoading } = useSubscription();

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-gray-100 rounded-md"></div>;
  }

  const hasRequiredAccess = hasAccess(requiredPlan);

  // If user has access, show the feature
  if (hasRequiredAccess) {
    return <>{children}</>;
  }

  // If user doesn't have access but we want to show something when restricted
  if (showWhenRestricted) {
    return (
      <div className="relative">
        {/* Blur the content */}
        <div className="blur-sm pointer-events-none select-none">
          {restrictedContent || children}
        </div>
        
        {/* Overlay with upgrade prompt */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-md">
          <Alert className="max-w-sm border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              {feature} - {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Feature
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              {description || `Upgrade to ${requiredPlan} to access ${feature.toLowerCase()}.`}
              <div className="mt-2">
                <a 
                  href="/subscription" 
                  className="text-amber-700 underline hover:text-amber-800"
                >
                  View subscription plans →
                </a>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Default: show upgrade guard
  return (
    <SubscriptionGuard 
      requiredPlan={requiredPlan} 
      feature={feature}
    >
      {children}
    </SubscriptionGuard>
  );
}

// Convenience components for common subscription tiers
export const StandardFeature = ({ children, feature, ...props }: Omit<ProtectedFeatureProps, 'requiredPlan'>) => (
  <ProtectedFeature requiredPlan="standard" feature={feature} {...props}>
    {children}
  </ProtectedFeature>
);

export const PremiumFeature = ({ children, feature, ...props }: Omit<ProtectedFeatureProps, 'requiredPlan'>) => (
  <ProtectedFeature requiredPlan="premium" feature={feature} {...props}>
    {children}  
  </ProtectedFeature>
);