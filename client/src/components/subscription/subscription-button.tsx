import { Button, ButtonProps } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { Crown, Star } from "lucide-react";
import { forwardRef } from "react";

interface SubscriptionButtonProps extends ButtonProps {
  requiredPlan?: "standard" | "premium";
  feature?: string;
  upgradePrompt?: boolean;
  showPlanIndicator?: boolean;
  children: React.ReactNode;
}

const SubscriptionButton = forwardRef<HTMLButtonElement, SubscriptionButtonProps>(({
  requiredPlan = "standard",
  feature,
  upgradePrompt = true,
  showPlanIndicator = true,
  children,
  onClick,
  disabled,
  ...props
}, ref) => {
  const { hasAccess, requiresUpgrade, showUpgradePrompt, currentPlan } = useSubscription();

  const hasRequiredAccess = hasAccess(requiredPlan);
  const needsUpgrade = requiresUpgrade(requiredPlan);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (needsUpgrade && upgradePrompt) {
      event.preventDefault();
      const featureName = feature || "This feature";
      showUpgradePrompt(featureName, requiredPlan);
      return;
    }
    
    if (onClick) {
      onClick(event);
    }
  };

  // Show plan indicator for restricted features
  const PlanIcon = requiredPlan === "premium" ? Crown : Star;
  const shouldShowIndicator = showPlanIndicator && needsUpgrade;
  
  return (
    <Button
      {...props}
      ref={ref}
      onClick={handleClick}
      disabled={disabled || (needsUpgrade && !upgradePrompt)}
    >
      {shouldShowIndicator && (
        <PlanIcon className="mr-2 h-4 w-4 text-amber-500" />
      )}
      {children}
      {shouldShowIndicator && (
        <span className="ml-2 text-xs opacity-70">
          ({requiredPlan === "premium" ? "Premium" : "Standard"}+)
        </span>
      )}
    </Button>
  );
});

SubscriptionButton.displayName = "SubscriptionButton";

export default SubscriptionButton;