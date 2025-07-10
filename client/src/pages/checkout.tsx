import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { getPlanDetails } from '@shared/subscription-plans';
import StripeCheckout from '@/components/subscription/stripe-checkout';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutPageProps {
  planId?: string;
  period?: 'monthly' | 'annual';
}

export default function CheckoutPage({ planId, period }: CheckoutPageProps) {
  const [_, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

  // Extract parameters from URL if not provided as props
  const urlParams = new URLSearchParams(window.location.search);
  const actualPlanId = planId || urlParams.get('plan') || 'standard';
  const actualPeriod = (period || urlParams.get('period') || 'monthly') as 'monthly' | 'annual';

  // Get plan details
  const planDetails = getPlanDetails(actualPlanId as any);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/auth');
    }
  }, [user, authLoading, setLocation]);

  // Create subscription and get client secret
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription-create', actualPlanId, actualPeriod],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      setIsCreatingSubscription(true);
      setError(null);

      try {
        const response = await apiRequest('POST', '/api/subscription/create', {
          planId: actualPlanId,
          period: actualPeriod,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create subscription');
        }

        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create subscription');
        throw err;
      } finally {
        setIsCreatingSubscription(false);
      }
    },
    enabled: !!user && !!actualPlanId && !!actualPeriod,
    retry: false,
  });

  // Set client secret when subscription is created
  useEffect(() => {
    if (subscriptionData?.clientSecret) {
      setClientSecret(subscriptionData.clientSecret);
    }
    if (subscriptionData?.success && subscriptionData?.message) {
      // Development mode success
      setLocation('/subscription/success?plan=' + actualPlanId + '&period=' + actualPeriod);
    }
  }, [subscriptionData, setLocation, actualPlanId, actualPeriod]);

  const handleSuccess = () => {
    setLocation('/subscription/success?plan=' + actualPlanId + '&period=' + actualPeriod);
  };

  const handleCancel = () => {
    setLocation('/subscription');
  };

  // Loading state
  if (authLoading || isLoadingSubscription || isCreatingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Setting up your subscription</h3>
            <p className="text-gray-600">
              {isCreatingSubscription ? 'Creating your subscription...' : 'Please wait...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Subscription Error</CardTitle>
            <CardDescription>
              We couldn't set up your subscription. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plans
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No client secret means we're not ready for Stripe checkout
  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Preparing checkout</h3>
            <p className="text-gray-600">Setting up secure payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Stripe Elements appearance
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      borderRadius: '8px',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
          <h1 className="text-3xl font-bold mb-2">Complete Your Subscription</h1>
          <p className="text-gray-600">
            You're subscribing to {planDetails.name} - {actualPeriod} billing
          </p>
        </div>

        {/* Checkout Form */}
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
          }}
        >
          <StripeCheckout
            planId={actualPlanId}
            period={actualPeriod}
            planName={planDetails.name}
            price={planDetails.price[actualPeriod]}
            clientSecret={clientSecret}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      </div>
    </div>
  );
}