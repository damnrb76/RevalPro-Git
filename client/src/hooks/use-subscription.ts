import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionPlan = "free" | "standard" | "premium";

interface SubscriptionInfo {
  currentPlan: SubscriptionPlan;
  subscriptionStatus: string;
  subscriptionEndDate: string | null;
  cancelAtPeriodEnd: boolean;
}

export function useSubscription() {
  const { toast } = useToast();
  
  const { data: subscriptionInfo, isLoading, error } = useQuery<SubscriptionInfo>({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await fetch('/api/subscription');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      return response.json();
    },
  });

  const currentPlan = subscriptionInfo?.currentPlan || 'free';
  const isFreePlan = currentPlan === 'free';
  const isStandardPlan = currentPlan === 'standard';
  const isPremiumPlan = currentPlan === 'premium';
  const isPaidPlan = currentPlan !== 'free';

  // Helper functions for access checks
  const hasAccess = (requiredPlan: SubscriptionPlan): boolean => {
    if (requiredPlan === 'free') return true;
    if (requiredPlan === 'standard') return isStandardPlan || isPremiumPlan;
    if (requiredPlan === 'premium') return isPremiumPlan;
    return false;
  };

  const requiresUpgrade = (requiredPlan: SubscriptionPlan): boolean => {
    return !hasAccess(requiredPlan);
  };

  // Show upgrade prompt with toast
  const showUpgradePrompt = (feature: string, requiredPlan: SubscriptionPlan = 'standard') => {
    const planName = requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1);
    toast({
      title: "Upgrade Required",
      description: `${feature} requires a ${planName} subscription.`,
      variant: "destructive",
    });
  };

  // Check access and show prompt if needed
  const checkAccessWithPrompt = (feature: string, requiredPlan: SubscriptionPlan = 'standard'): boolean => {
    if (hasAccess(requiredPlan)) {
      return true;
    }
    showUpgradePrompt(feature, requiredPlan);
    return false;
  };

  return {
    // Subscription info
    subscriptionInfo,
    currentPlan,
    isLoading,
    error,
    
    // Plan checks
    isFreePlan,
    isStandardPlan, 
    isPremiumPlan,
    isPaidPlan,
    
    // Access control functions
    hasAccess,
    requiresUpgrade,
    showUpgradePrompt,
    checkAccessWithPrompt,
    
    // Feature-specific checks
    canUseAI: hasAccess('standard'),
    canUseNotifications: hasAccess('standard'),
    canUseAdvancedPDF: hasAccess('standard'),
    canUsePremiumFeatures: hasAccess('premium'),
  };
}