import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, AlertCircle, CheckCircle, ExternalLink, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function TestStripePage() {
  const [_, setLocation] = useLocation();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDemoLogin = async () => {
    try {
      // First create demo account
      const createResponse = await fetch("/api/create-demo-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "premium" }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create demo account");
      }

      // Then login
      const loginResponse = await fetch("/api/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (loginResponse.ok) {
        toast({
          title: "Demo Login Successful",
          description: "You can now test subscription flows",
        });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        throw new Error("Demo login failed");
      }
    } catch (error) {
      toast({
        title: "Demo Login Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testCards = [
    {
      number: '4242 4242 4242 4242',
      description: 'Visa - Successful payment',
      cvc: 'Any 3 digits',
      expiry: 'Any future date',
      color: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    },
    {
      number: '4000 0000 0000 0002',
      description: 'Visa - Card declined',
      cvc: 'Any 3 digits',
      expiry: 'Any future date',
      color: 'bg-red-50 border-red-200',
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    },
    {
      number: '4000 0000 0000 9995',
      description: 'Visa - Insufficient funds',
      cvc: 'Any 3 digits',
      expiry: 'Any future date',
      color: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    },
    {
      number: '4000 0027 6000 3184',
      description: 'Visa - Requires authentication (3D Secure)',
      cvc: 'Any 3 digits',
      expiry: 'Any future date',
      color: 'bg-blue-50 border-blue-200',
      icon: <AlertCircle className="h-4 w-4 text-blue-600" />,
    },
  ];

  const testScenarios = [
    {
      id: 'standard-monthly',
      title: 'Test Standard Monthly',
      description: 'Test Standard plan with monthly billing',
      price: '£4.99/month',
      action: () => setLocation('/checkout?plan=standard&period=monthly'),
    },
    {
      id: 'standard-annual',
      title: 'Test Standard Annual',
      description: 'Test Standard plan with annual billing',
      price: '£49.99/year',
      action: () => setLocation('/checkout?plan=standard&period=annual'),
    },
    {
      id: 'premium-monthly',
      title: 'Test Premium Monthly',
      description: 'Test Premium plan with monthly billing',
      price: '£9.99/month',
      action: () => setLocation('/checkout?plan=premium&period=monthly'),
    },
    {
      id: 'premium-annual',
      title: 'Test Premium Annual',
      description: 'Test Premium plan with annual billing',
      price: '£99.99/year',
      action: () => setLocation('/checkout?plan=premium&period=annual'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Stripe Sandbox Testing</h1>
          <p className="text-gray-600">Test subscription flows with Stripe test mode</p>
          <Badge variant="outline" className="mt-2">
            <CreditCard className="h-3 w-3 mr-1" />
            Test Mode Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Cards */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Test Credit Cards
                </CardTitle>
                <CardDescription>
                  Use these test card numbers in the checkout flow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCards.map((card, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${card.color} cursor-pointer transition-all hover:scale-105`}
                    onClick={() => setSelectedTest(card.number)}
                  >
                    <div className="flex items-start gap-3">
                      {card.icon}
                      <div className="flex-1">
                        <div className="font-mono text-sm font-medium mb-1">
                          {card.number}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {card.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          CVC: {card.cvc} • Expiry: {card.expiry}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> These are test cards that only work in Stripe's test mode.
                    No real payments will be processed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Test Scenarios */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Test Subscription Flows</CardTitle>
                <CardDescription>
                  Test different subscription scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {testScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{scenario.title}</h3>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                        <div className="text-sm font-medium text-blue-600 mt-1">
                          {scenario.price}
                        </div>
                      </div>
                      <Button
                        onClick={scenario.action}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                      >
                        Test Now
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Development Mode Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Development Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Development Mode:</strong> In development, subscriptions are activated
                    immediately without requiring payment. This allows you to test premium features
                    without going through the full Stripe checkout flow.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center space-y-4">
          <Alert className="mb-4">
            <User className="h-4 w-4" />
            <AlertDescription>
              <strong>Authentication Required:</strong> You need to be logged in to test subscription flows.
              Use the demo login button below to quickly create a test account.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={handleDemoLogin}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Quick Demo Login
            </Button>
            <Button
              onClick={() => setLocation('/auth')}
              variant="outline"
            >
              Go to Login Page
            </Button>
            <Button
              onClick={() => setLocation('/subscription')}
              variant="outline"
            >
              View Subscription Plans
            </Button>
            <Button
              onClick={() => setLocation('/dashboard')}
              variant="outline"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        {/* Resources */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Stripe Testing Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Stripe Test Dashboard:</strong>{' '}
                  <a
                    href="https://dashboard.stripe.com/test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    https://dashboard.stripe.com/test
                  </a>
                </p>
                <p>
                  <strong>Test Card Numbers:</strong>{' '}
                  <a
                    href="https://stripe.com/docs/testing#cards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Stripe Testing Documentation
                  </a>
                </p>
                <p>
                  <strong>Webhook Testing:</strong>{' '}
                  <a
                    href="https://stripe.com/docs/webhooks/test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Stripe Webhooks Guide
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}