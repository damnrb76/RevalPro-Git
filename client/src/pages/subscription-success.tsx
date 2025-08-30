import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Star, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getPlanDetails } from '@shared/subscription-plans';

export default function SubscriptionSuccessPage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Extract session details from URL (works with Stripe checkout sessions)
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const planId = urlParams.get('plan') || 'standard';
  const period = urlParams.get('period') || 'monthly';
  
  const planDetails = getPlanDetails(planId as any);

  // Invalidate queries to refresh subscription data
  useEffect(() => {
    // Immediate invalidation
    queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    
    // Also do a delayed refetch to ensure webhook has processed
    // Sometimes there's a small delay between user returning and webhook processing
    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    }, 2000); // 2 second delay
    
    return () => clearTimeout(timer);
  }, [queryClient]);

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'premium':
        return <Crown className="h-12 w-12 text-purple-500" />;
      case 'standard':
        return <Star className="h-12 w-12 text-blue-500" />;
      default:
        return <Shield className="h-12 w-12 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'standard':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500';
    }
  };

  const getHighlightedFeatures = () => {
    return planDetails.features.filter(feature => feature.highlighted && feature.included);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            🎉 Welcome to {planDetails.name}!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your subscription is now active
          </p>
          <Badge className={`${getPlanColor(planId)} text-white px-4 py-2 text-sm`}>
            {planDetails.name} - {period} billing
          </Badge>
        </div>

        {/* Plan Benefits */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getPlanIcon(planId)}
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              You now have access to
            </CardTitle>
            <CardDescription>
              All {planDetails.name} features are now available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {getHighlightedFeatures().map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Get the most out of your {planDetails.name} subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Complete your profile</h4>
                <p className="text-sm text-gray-600">
                  Set up your NMC registration details and nursing specialty
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Start tracking your progress</h4>
                <p className="text-sm text-gray-600">
                  Log your practice hours, CPD activities, and reflections
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Explore AI assistance</h4>
                <p className="text-sm text-gray-600">
                  Use our AI assistant for personalized revalidation guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation('/subscription')}
            className="flex-1 max-w-48"
          >
            Manage Subscription
          </Button>
          <Button
            onClick={() => setLocation('/dashboard')}
            className="flex-1 max-w-48"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Need help getting started? {' '}
            {planDetails.features.find(f => f.title.includes('Priority email support'))?.included ? (
              <span className="text-green-600 font-semibold">
                You have priority email support included with your plan.
              </span>
            ) : (
              <span>
                Check out our help section or contact support.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}