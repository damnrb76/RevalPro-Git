import { useAuth } from "@/hooks/use-auth";
import PricingPlans from "@/components/subscription/pricing-plans";
import { Loader2 } from "lucide-react";
import { Navigate } from "wouter";

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

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <PricingPlans />
    </div>
  );
}