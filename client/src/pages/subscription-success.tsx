import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";

export default function SubscriptionSuccess() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Extract the payment_intent and payment_intent_client_secret from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get("payment_intent");
    const paymentIntentClientSecret = params.get("payment_intent_client_secret");
    const redirectStatus = params.get("redirect_status");

    // If these exist, it means Stripe has redirected here after payment
    if (paymentIntent && paymentIntentClientSecret && redirectStatus) {
      // Check the redirect status
      if (redirectStatus === "succeeded") {
        toast({
          title: "Payment successful!",
          description: "Your subscription has been activated.",
        });

        // Refresh subscription data
        queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
      } else {
        toast({
          title: "Payment failed",
          description: "There was an issue with your payment. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [location, toast]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-8 text-center">
        <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Thank You for Your Subscription!
        </h1>
        
        <p className="text-lg mb-8 text-gray-600">
          Your payment has been processed successfully and your subscription is now active.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8 inline-block">
          <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-left text-blue-700 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Enjoy premium features of RevalPro</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Track your revalidation progress with enhanced tools</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Contact support if you need any assistance with your account</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/subscription")}
          >
            View Subscription Details
          </Button>
        </div>
      </Card>
    </div>
  );
}