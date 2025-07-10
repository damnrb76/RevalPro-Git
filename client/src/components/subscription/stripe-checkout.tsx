import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StripeCheckoutProps {
  planId: string;
  period: 'monthly' | 'annual';
  planName: string;
  price: number;
  clientSecret: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StripeCheckout({
  planId,
  period,
  planName,
  price,
  clientSecret,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscription/success?plan=${planId}&period=${period}`,
        },
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: error.message || 'An error occurred during payment',
          variant: "destructive",
        });
      } else {
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${planName}! Your subscription is now active.`,
        });
        onSuccess?.();
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      toast({
        title: "Payment Error",
        description: 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-700">Payment Successful!</CardTitle>
          <CardDescription>
            Your {planName} subscription is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              You now have access to all {planName} features.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>
          Subscribe to {planName} - £{price.toFixed(2)}/{period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Card Information Banner */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Test Mode:</strong> Use card number 4242 4242 4242 4242 with any future date and CVC for testing.
            </AlertDescription>
          </Alert>

          {/* Subscription Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{planName} Plan</span>
              <Badge variant={period === 'annual' ? 'default' : 'secondary'}>
                {period === 'annual' ? 'Annual' : 'Monthly'}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Billing period</span>
              <span>{period === 'annual' ? '12 months' : '1 month'}</span>
            </div>
            <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>£{price.toFixed(2)}</span>
            </div>
            {period === 'annual' && (
              <div className="text-xs text-green-600">
                💰 Save 2 months with annual billing
              </div>
            )}
          </div>

          {/* Payment Element */}
          <div className="min-h-[200px]">
            <PaymentElement 
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                }
              }}
            />
          </div>

          {/* Error Display */}
          {paymentError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay £{price.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}