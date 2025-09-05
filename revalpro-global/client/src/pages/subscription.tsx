import { useAuth } from "@/hooks/use-auth";
import PricingPlans from "@/components/subscription/pricing-plans";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function SubscriptionPage() {
  const { user, isLoading } = useAuth();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const [_, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  if (!user) {
    // Using setTimeout to ensure the redirect happens after rendering
    setTimeout(() => setLocation("/auth"), 0);
    return <div className="hidden">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <PricingPlans />
    </div>
  );
}