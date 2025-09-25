import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, AlertCircle, Tag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { getPlanDetails } from '@shared/subscription-plans';
import StripeCheckout from '@/components/subscription/stripe-checkout';
import InlineCouponInput from '@/components/coupons/inline-coupon-input';

// Initialize Stripe with testing key in development
const stripePublishableKey = import.meta.env.DEV 
  ? (import.meta.env.TESTING_VITE_STRIPE_PUBLIC_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripePublishableKey);

interface CheckoutPageProps {
  planId?: string;
  period?: 'monthly' | 'annual';
}

interface ValidCoupon {
  code: string;
  description: string;
  planId: string;
  period: string;
}

export default function CheckoutPage({ planId, period }: CheckoutPageProps) {
  const [_, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [validCoupon, setValidCoupon] = useState<ValidCoupon | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

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
        // In development, only use Stripe if we have test keys available
        // Otherwise fall back to development simulation
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
    // Redirect to success for free plan or successful development mode simulation
    if (subscriptionData?.success && (subscriptionData?.plan === 'free' || subscriptionData?.message)) {
      setLocation('/subscription/success?plan=' + actualPlanId + '&period=' + actualPeriod);
    }
  }, [subscriptionData, setLocation, actualPlanId, actualPeriod]);

  const handleSuccess = () => {
    setLocation('/subscription/success?plan=' + actualPlanId + '&period=' + actualPeriod);
  };

  const handleCancel = () => {
    setLocation('/subscription');
  };

  const handleValidCoupon = (coupon: ValidCoupon) => {
    setValidCoupon(coupon);
    setError(null);
  };

  const handleRemoveCoupon = () => {
    setValidCoupon(null);
  };

  const handleCouponRedeemSuccess = (coupon: ValidCoupon) => {
    toast({
      title: "Coupon Redeemed!",
      description: `Your ${coupon.planId} subscription has been activated.`,
    });
    setLocation('/subscription/success?plan=' + coupon.planId + '&period=' + coupon.period + '&coupon=true');
  };

  const redeemCouponDirectly = async () => {
    if (!validCoupon) return;

    setIsRedeeming(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/coupons/redeem", {
        couponCode: validCoupon.code
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleCouponRedeemSuccess(validCoupon);
      } else {
        setError(data.error || "Failed to redeem coupon");
        setValidCoupon(null);
      }
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      setError("Failed to redeem coupon code");
      setValidCoupon(null);
    } finally {
      setIsRedeeming(false);
    }
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

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Coupon Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-blue-600" />
                  Have a Coupon Code?
                </CardTitle>
                <CardDescription>
                  Enter your coupon code to get instant access to your subscription without payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InlineCouponInput
                  onValidCoupon={handleValidCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  disabled={isRedeeming}
                  placeholder="Enter coupon code"
                  label="Coupon Code"
                />
                
                {validCoupon && (
                  <div className="space-y-3">
                    <Alert className="border-green-200 bg-green-50">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Great!</strong> This coupon will give you instant access to {validCoupon.planId} plan 
                        ({validCoupon.period === 'annual' ? 'Annual' : 'Monthly'}) without payment.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      onClick={redeemCouponDirectly}
                      disabled={isRedeeming}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isRedeeming ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Activating Subscription...
                        </>
                      ) : (
                        'Activate Subscription with Coupon'
                      )}
                    </Button>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold">{planDetails.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Billing:</span>
                    <span className="capitalize">{actualPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-semibold">
                      {validCoupon ? (
                        <span className="text-green-600">FREE with coupon</span>
                      ) : (
                        `£${planDetails.price[actualPeriod]}/${actualPeriod.slice(0, -2)}`
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {validCoupon ? 'Payment Method (Optional)' : 'Payment Method'}
                </CardTitle>
                <CardDescription>
                  {validCoupon 
                    ? 'You can activate your subscription with the coupon above, or pay normally below.'
                    : 'Enter your payment details to complete the subscription.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!validCoupon && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">
                      Complete your payment to activate your {planDetails.name} subscription
                    </p>
                  </div>
                )}
                
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
              </CardContent>
            </Card>
            
            {validCoupon && (
              <div className="text-center">
                <Separator className="my-4" />
                <p className="text-sm text-gray-500">
                  Or use the coupon above for instant activation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}