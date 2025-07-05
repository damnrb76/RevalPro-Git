import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, Sparkles, Zap, Bot, BarChart3, Download, Clock } from "lucide-react";
import { Link } from "wouter";

export function PremiumFeatureShowcase() {
  const { data: subscriptionInfo } = useQuery({
    queryKey: ['/api/subscription'],
    queryFn: async () => {
      const response = await fetch('/api/subscription');
      if (!response.ok) throw new Error('Failed to fetch subscription');
      return response.json();
    },
  });

  const currentPlan = subscriptionInfo?.currentPlan || 'free';

  const planFeatures = {
    free: {
      available: [
        { icon: Clock, label: "Basic practice hours tracking" },
        { icon: Download, label: "Simple PDF exports" }
      ],
      locked: [
        { icon: Bot, label: "AI revalidation assistant", plan: "standard" },
        { icon: BarChart3, label: "Advanced analytics", plan: "premium" },
        { icon: Sparkles, label: "Smart recommendations", plan: "premium" }
      ]
    },
    standard: {
      available: [
        { icon: Clock, label: "Complete practice hours tracking" },
        { icon: Bot, label: "AI revalidation assistant" },
        { icon: Download, label: "Professional PDF exports" }
      ],
      locked: [
        { icon: BarChart3, label: "Advanced analytics & insights", plan: "premium" },
        { icon: Sparkles, label: "Smart recommendations", plan: "premium" },
        { icon: Zap, label: "Priority AI processing", plan: "premium" }
      ]
    },
    premium: {
      available: [
        { icon: Clock, label: "Complete practice hours tracking" },
        { icon: Bot, label: "Full AI revalidation assistant" },
        { icon: BarChart3, label: "Advanced analytics & insights" },
        { icon: Sparkles, label: "Smart recommendations" },
        { icon: Zap, label: "Priority AI processing" },
        { icon: Download, label: "Premium PDF exports" }
      ],
      locked: []
    }
  };

  const features = planFeatures[currentPlan as keyof typeof planFeatures];

  if (currentPlan === 'premium') {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Crown className="h-5 w-5" />
            Premium Experience Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-600 mb-4">
            You have access to all RevalPro features! Enjoy priority AI assistance, advanced analytics, and premium export options.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {features.available.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-purple-600">
                  <Icon className="h-4 w-4" />
                  <span>{feature.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {currentPlan === 'standard' ? (
            <>
              <Star className="h-5 w-5 text-blue-600" />
              Standard Plan Features
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-gray-600" />
              Available Features
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Features */}
        {features.available.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-600 mb-2">✓ Your Current Features</h4>
            <div className="space-y-1">
              {features.available.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                    <Icon className="h-4 w-4" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked Features */}
        {features.locked.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">🔒 Upgrade to Unlock</h4>
            <div className="space-y-1 mb-4">
              {features.locked.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon className="h-4 w-4" />
                    <span>{feature.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {feature.plan}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <Link href="/subscription">
              <Button size="sm" className="w-full">
                {currentPlan === 'standard' ? 'Upgrade to Premium' : 'View Plans'}
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}