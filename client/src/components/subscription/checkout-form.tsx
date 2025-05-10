import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/subscription/success",
      },
      // If you want to handle the redirect manually instead, skip the redirect
      // and handleNextSteps() will be called
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else {
      // Payment succeeded!
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated.",
      });
      
      // Invalidate subscription data to refresh it
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      
      // Redirect to subscription page or dashboard
      navigate("/");
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Details</h3>
          <PaymentElement />
        </div>
        
        {errorMessage && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded border border-red-100">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Payment"
            )}
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 text-center">
          <p>Your payment is processed securely through Stripe.</p>
          <p>You will not be charged until you confirm your payment.</p>
        </div>
      </form>
    </Card>
  );
}