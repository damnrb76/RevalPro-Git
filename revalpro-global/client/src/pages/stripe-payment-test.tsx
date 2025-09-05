import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react';

interface CheckoutSession {
  sessionId: string;
  url: string;
}

const testCards = [
  {
    number: '4242 4242 4242 4242',
    type: 'Success',
    description: 'Always succeeds',
    variant: 'default' as const
  },
  {
    number: '4000 0027 6000 3184',
    type: '3D Secure',
    description: 'Requires authentication',
    variant: 'secondary' as const
  },
  {
    number: '4000 0000 0000 0002',
    type: 'Declined',
    description: 'Always declined',
    variant: 'destructive' as const
  },
  {
    number: '4000 0000 0000 9995',
    type: 'Insufficient Funds',
    description: 'Card declined - insufficient funds',
    variant: 'destructive' as const
  }
];

const subscriptionPlans = [
  {
    key: 'standard_monthly_gbp',
    name: 'Standard Monthly',
    price: '£4.99/month',
    description: 'Perfect for individual nurses'
  },
  {
    key: 'standard_annual_gbp',
    name: 'Standard Annual',
    price: '£49.99/year',
    description: 'Save ~£10 annually'
  },
  {
    key: 'premium_monthly_gbp',
    name: 'Premium Monthly',
    price: '£9.99/month',
    description: 'Advanced features included'
  },
  {
    key: 'premium_annual_gbp',
    name: 'Premium Annual',
    price: '£89.99/year',
    description: 'Save ~£30 annually'
  }
];

export default function StripePaymentTest() {
  const [sessions, setSessions] = useState<Record<string, CheckoutSession>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const createCheckoutSession = async (lookupKey: string) => {
    setLoading(prev => ({ ...prev, [lookupKey]: true }));
    
    try {
      const response = await fetch('/api/test/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          lookupKey,
          customerEmail: 'test@revalpro.co.uk',
          userId: 999
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSessions(prev => ({ ...prev, [lookupKey]: data }));
      } else {
        console.error('Checkout failed:', data);
        alert(`Checkout failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Network error occurred');
    } finally {
      setLoading(prev => ({ ...prev, [lookupKey]: false }));
    }
  };

  const openCheckout = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Stripe Payment Testing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test the complete Stripe checkout flow with various subscription plans and test cards. 
          All test payments use Stripe's test environment - no real charges will be made.
        </p>
      </div>

      {/* Test Cards Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Test Cards for Payment Testing
          </CardTitle>
          <CardDescription>
            Use these test card numbers in the Stripe checkout form. 
            Use any future expiry date (e.g., 12/34) and any 3-digit CVC.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {testCards.map((card, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-mono text-sm">{card.number}</div>
                  <div className="text-sm text-muted-foreground">{card.description}</div>
                </div>
                <Badge variant={card.variant}>{card.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plan Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan Testing</CardTitle>
          <CardDescription>
            Create checkout sessions for each subscription plan and test the payment flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.description}</div>
                  <div className="text-lg font-bold text-primary">{plan.price}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  {sessions[plan.key] ? (
                    <>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Session Created</span>
                      </div>
                      <Button 
                        onClick={() => openCheckout(sessions[plan.key].url)}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Checkout
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => createCheckoutSession(plan.key)}
                      disabled={loading[plan.key]}
                      variant="outline"
                    >
                      {loading[plan.key] ? 'Creating...' : 'Create Session'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      {Object.keys(sessions).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Created Sessions</CardTitle>
            <CardDescription>
              Session details for debugging and verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(sessions).map(([key, session]) => (
                <div key={key} className="p-4 border rounded-lg space-y-2">
                  <div className="font-semibold">
                    {subscriptionPlans.find(p => p.key === key)?.name}
                  </div>
                  <div className="text-sm space-y-1">
                    <div><strong>Session ID:</strong> <code className="text-xs">{session.sessionId}</code></div>
                    <div><strong>Checkout URL:</strong> 
                      <a 
                        href={session.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1 text-xs break-all"
                      >
                        {session.url}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Testing Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Create Session" for any subscription plan above</li>
            <li>Once created, click "Open Checkout" to open the Stripe payment form</li>
            <li>Use test card <code>4242 4242 4242 4242</code> for successful payments</li>
            <li>Enter any future expiry date (e.g., 12/34) and any 3-digit CVC (e.g., 123)</li>
            <li>Complete the checkout process</li>
            <li>Verify the success page loads correctly</li>
            <li>Check your Stripe dashboard for the test payment</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> All payments are in test mode. No real charges will be made to any cards.
              The webhook handling and subscription activation logic is fully implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}