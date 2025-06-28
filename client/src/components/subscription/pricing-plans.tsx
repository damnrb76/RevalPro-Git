import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PlanDetails, PLAN_DETAILS, SubscriptionPlan } from "@shared/subscription-plans";
import { useAuth } from "@/hooks/use-auth";
import { CheckIcon, XIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CheckoutForm from "@/components/subscription/checkout-form";

// Make sure to call loadStripe outside of a component's render
// to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PricingPlans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [period, setPeriod] = useState<"monthly" | "annual">("annual"); // Default to annual
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Get user's current subscription
  const { data: subscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["/api/subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) throw new Error("Failed to fetch subscription");
      return res.json();
    },
    enabled: !!user,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ planId, period }: { planId: SubscriptionPlan; period: "monthly" | "annual" }) => {
      const res = await apiRequest("POST", "/api/subscription/create", { planId, period });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create subscription");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.plan === "free") {
        toast({
          title: "Free plan activated",
          description: "You are now on the free plan",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
        return;
      }

      // Development mode: subscription activated immediately
      if (data.success && data.message && data.message.includes("Development mode")) {
        toast({
          title: "Subscription activated!",
          description: `You are now on the ${data.plan} plan`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
        return;
      }

      // Production mode: show payment form
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (immediate: boolean) => {
      const res = await apiRequest("POST", "/api/subscription/cancel", { immediate });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/subscription/reactivate", {});
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to reactivate subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription reactivated",
        description: "Your subscription has been reactivated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Change plan mutation
  const changePlanMutation = useMutation({
    mutationFn: async ({ planId, period }: { planId: SubscriptionPlan; period: "monthly" | "annual" }) => {
      const res = await apiRequest("POST", "/api/subscription/change-plan", { planId, period });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to change plan");
      }
      return res.json();
    },
    onSuccess: (data) => {
      // If the response tells us to redirect to the create subscription flow
      if (data.redirect && data.action === "create") {
        createSubscriptionMutation.mutate({
          planId: data.plan,
          period: data.period,
        });
        return;
      }

      toast({
        title: "Plan changed",
        description: "Your subscription plan has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (planId: SubscriptionPlan) => {
    // If this is the current plan, do nothing
    if (subscription?.currentPlan === planId) {
      return;
    }

    setSelectedPlan(planId);

    // If the user is already subscribed, handle plan change
    if (subscription?.currentPlan && subscription.currentPlan !== "free") {
      changePlanMutation.mutate({ planId, period });
      return;
    }

    // Otherwise, create a new subscription
    createSubscriptionMutation.mutate({ planId, period });
  };

  const isCurrentPlan = (planId: SubscriptionPlan) => {
    return subscription?.currentPlan === planId;
  };

  const isLoading = 
    subscriptionLoading ||
    createSubscriptionMutation.isPending ||
    cancelSubscriptionMutation.isPending ||
    reactivateSubscriptionMutation.isPending ||
    changePlanMutation.isPending;

  // If the subscription is being set up and we have a client secret, show the payment form
  if (clientSecret) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Complete Your Subscription
        </h2>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          RevalPro Subscription Plans
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Choose the right plan for your revalidation journey
        </p>
        

      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative flex items-center space-x-3 rounded-lg bg-gray-100 p-2">
          <span className={`${period === "monthly" ? "text-blue-600 font-bold" : "text-gray-600"}`}>Monthly</span>
          <Switch
            checked={period === "annual"}
            onCheckedChange={(checked) => setPeriod(checked ? "annual" : "monthly")}
            id="billing-period"
          />
          <Label htmlFor="billing-period" className={`${period === "annual" ? "text-blue-600 font-bold" : "text-gray-600"}`}>
            Annual <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Save up to 20%</span>
          </Label>
        </div>
      </div>

      {/* Current subscription status */}
      {subscription && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
          <h3 className="text-lg font-medium text-gray-900">Your Current Subscription</h3>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Plan:</span>{" "}
              <span className="text-blue-600 font-semibold">
                {subscription.planDetails?.name || "Free"}
              </span>
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span className={`capitalize ${subscription.status === "active" ? "text-green-600" : "text-amber-600"}`}>
                {subscription.status || "Inactive"}
              </span>
            </div>
            {subscription.period && (
              <div>
                <span className="font-medium">Billing:</span>{" "}
                <span className="capitalize">{subscription.period}</span>
              </div>
            )}
            {subscription.endDate && (
              <div>
                <span className="font-medium">Next billing date:</span>{" "}
                <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Subscription actions */}
          {subscription.currentPlan !== "free" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {subscription.cancelAtPeriodEnd ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => reactivateSubscriptionMutation.mutate()}
                  disabled={isLoading}
                >
                  Resume Subscription
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => cancelSubscriptionMutation.mutate(false)}
                    disabled={isLoading}
                  >
                    Cancel at Period End
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to cancel immediately? You will lose access to premium features.")) {
                        cancelSubscriptionMutation.mutate(true);
                      }
                    }}
                    disabled={isLoading}
                  >
                    Cancel Immediately
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-8 lg:space-y-0">
        {/* Free plan */}
        <PlanCard
          plan={PLAN_DETAILS.free}
          period={period}
          isCurrentPlan={isCurrentPlan("free")}
          onSelect={handleSelectPlan}
          disabled={isLoading}
        />

        {/* Standard plan */}
        <PlanCard
          plan={PLAN_DETAILS.standard}
          period={period}
          isCurrentPlan={isCurrentPlan("standard")}
          onSelect={handleSelectPlan}
          disabled={isLoading}
        />

        {/* Premium plan */}
        <PlanCard
          plan={PLAN_DETAILS.premium}
          period={period}
          isCurrentPlan={isCurrentPlan("premium")}
          onSelect={handleSelectPlan}
          disabled={isLoading}
        />
      </div>

      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>
          All plans include secure data storage and compliance with NHS data protection standards.
        </p>
        <p className="mt-2">
          Have questions? Contact us at <a href="mailto:support@revalpro.uk" className="text-blue-600 hover:underline">support@revalpro.uk</a>
        </p>
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: PlanDetails;
  period: "monthly" | "annual";
  isCurrentPlan: boolean;
  onSelect: (planId: SubscriptionPlan) => void;
  disabled: boolean;
}

function PlanCard({ plan, period, isCurrentPlan, onSelect, disabled }: PlanCardProps) {
  const price = period === "monthly" ? plan.price.monthly : plan.price.annual;
  const priceText = price === 0 ? "Free" : `£${price}${period === "monthly" ? "/month" : "/year"}`;

  return (
    <Card className={`
      flex flex-col h-full
      ${plan.recommended ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow'}
      ${plan.mostPopular ? 'ring-2 ring-indigo-500 shadow-lg' : ''}
    `}>
      <CardHeader className="pb-4">
        {plan.mostPopular && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
            Most Popular
          </div>
        )}
        {plan.recommended && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
            Recommended
          </div>
        )}
        <CardTitle className="text-xl bg-gradient-to-r from-blue-700 to-indigo-700 text-transparent bg-clip-text">
          {plan.name}
        </CardTitle>
        <CardDescription className="text-gray-500">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-4xl font-extrabold">{priceText}</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 mt-0.5">
                {feature.included ? (
                  <CheckIcon className={`h-5 w-5 ${feature.highlighted ? 'text-blue-500' : 'text-green-500'}`} />
                ) : (
                  <XIcon className="h-5 w-5 text-gray-400" />
                )}
              </span>
              <span className={`ml-2 text-sm ${feature.highlighted ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                {feature.title}
                {feature.limit && <span className="text-gray-500 ml-1">({feature.limit})</span>}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          className={`w-full ${plan.recommended ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : ''}`}
          onClick={() => onSelect(plan.id)}
          disabled={disabled || isCurrentPlan}
          variant={isCurrentPlan ? "outline" : "default"}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}