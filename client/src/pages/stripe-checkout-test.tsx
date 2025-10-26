import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ subscriptionData, onSuccess }: { subscriptionData: any, onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Not Ready",
        description: "Payment form is still loading, please wait...",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful!",
          description: "Your subscription is now active",
        });
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: "Payment Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!stripe || !elements ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Loading payment form...</p>
        </div>
      ) : (
        <div className="p-4 border rounded-lg">
          <PaymentElement />
        </div>
      )}
      
      <div className="flex justify-end items-center gap-2">
        {!stripe && (
          <p className="text-sm text-muted-foreground">Initializing Stripe...</p>
        )}
        <Button 
          type="submit" 
          disabled={!stripe || !elements || isProcessing}
          className="min-w-32"
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </form>
  );
}

export default function StripeCheckoutTest() {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<{ planId: string; period: string } | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const createSubscription = async (planId: string, period: string) => {
    setIsCreatingSubscription(true);
    setSelectedPlan({ planId, period });
    
    try {
      // Force real Stripe checkout by adding useStripe=true
      const response = await apiRequest('POST', '/api/subscription/create?useStripe=true', {
        planId,
        period
      });
      
      const data = await response.json();
      
      if (data.subscriptionId && data.clientSecret) {
        setSubscriptionData(data);
        toast({
          title: "Subscription Created",
          description: "Please complete your payment below",
        });
      } else {
        throw new Error(data.error || "Failed to create subscription");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const handleSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your subscription is now active",
    });
    setSubscriptionData(null);
    setSelectedPlan(null);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to test Stripe checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Real Stripe Checkout Test</h1>
          <p className="text-muted-foreground">
            Test the actual Stripe payment flow with working test price IDs
          </p>
          <Badge variant="outline" className="mt-2">
            Test Mode - Use card: 4242 4242 4242 4242
          </Badge>
        </div>

        {!subscriptionData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Standard Plan
                  <Badge variant="secondary">Most Popular</Badge>
                </CardTitle>
                <CardDescription>
                  Everything you need for smooth revalidation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold">£4.99/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual</span>
                    <span className="font-semibold">£49.99/year</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => createSubscription('standard', 'monthly')}
                    disabled={isCreatingSubscription}
                    className="w-full"
                  >
                    {isCreatingSubscription && selectedPlan?.planId === 'standard' && selectedPlan?.period === 'monthly' 
                      ? "Creating..." 
                      : "Test Monthly Checkout"}
                  </Button>
                  <Button 
                    onClick={() => createSubscription('standard', 'annual')}
                    disabled={isCreatingSubscription}
                    variant="outline"
                    className="w-full"
                  >
                    {isCreatingSubscription && selectedPlan?.planId === 'standard' && selectedPlan?.period === 'annual' 
                      ? "Creating..." 
                      : "Test Annual Checkout"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Premium Plan
                  <Badge>Recommended</Badge>
                </CardTitle>
                <CardDescription>
                  Ultimate revalidation companion for professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly</span>
                    <span className="font-semibold">£9.99/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual</span>
                    <span className="font-semibold">£99.99/year</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => createSubscription('premium', 'monthly')}
                    disabled={isCreatingSubscription}
                    className="w-full"
                  >
                    {isCreatingSubscription && selectedPlan?.planId === 'premium' && selectedPlan?.period === 'monthly' 
                      ? "Creating..." 
                      : "Test Monthly Checkout"}
                  </Button>
                  <Button 
                    onClick={() => createSubscription('premium', 'annual')}
                    disabled={isCreatingSubscription}
                    variant="outline"
                    className="w-full"
                  >
                    {isCreatingSubscription && selectedPlan?.planId === 'premium' && selectedPlan?.period === 'annual' 
                      ? "Creating..." 
                      : "Test Annual Checkout"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Payment</CardTitle>
              <CardDescription>
                {selectedPlan && `${selectedPlan.planId} plan - ${selectedPlan.period} billing`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret: subscriptionData.clientSecret,
                  appearance: {
                    theme: 'stripe',
                  }
                }}
              >
                <CheckoutForm 
                  subscriptionData={subscriptionData} 
                  onSuccess={handleSuccess}
                />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}