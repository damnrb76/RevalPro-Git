import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface Analytics {
  totalUsers: number;
  paidUsers: number;
  freeUsers: number;
  stripeCustomers: number;
  planBreakdown: { plan: string; count: number }[];
  recentRegistrations: { date: string; count: number }[];
  firstRegistration: string | null;
  latestRegistration: string | null;
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Check admin access
  if (!user?.isAdmin && !user?.isSuperAdmin) {
    setLocation("/dashboard");
    return <div></div>;
  }

  const { data: analytics, isLoading, error } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
    enabled: !!(user?.isAdmin || user?.isSuperAdmin)
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <div className="text-red-600">Failed to load analytics data</div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Since {formatDate(analytics.firstRegistration)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Users</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.paidUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.paidUsers / analytics.totalUsers) * 100).toFixed(1)}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.freeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics.freeUsers / analytics.totalUsers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stripe Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.stripeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.stripeCustomers > analytics.paidUsers ? "Includes cancelled" : "Active customers"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>Current subscription breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {analytics.planBreakdown.map((plan) => (
              <div key={plan.plan} className="flex items-center space-x-2">
                <Badge 
                  variant={plan.plan === 'free' ? 'secondary' : plan.plan === 'premium' ? 'default' : 'outline'}
                  className="text-sm"
                >
                  {plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)}
                </Badge>
                <span className="font-semibold">{plan.count}</span>
                <span className="text-sm text-gray-500">
                  ({((plan.count / analytics.totalUsers) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registration Activity</CardTitle>
          <CardDescription>Daily registration counts (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.recentRegistrations.slice(0, 10).map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{formatDate(day.date)}</span>
                </div>
                <Badge variant="outline">{day.count} registrations</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Facts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>First Registration:</span>
            <span className="font-medium">{formatDate(analytics.firstRegistration)}</span>
          </div>
          <div className="flex justify-between">
            <span>Latest Registration:</span>
            <span className="font-medium">{formatDate(analytics.latestRegistration)}</span>
          </div>
          <div className="flex justify-between">
            <span>Revenue Conversion:</span>
            <span className="font-medium text-green-600">
              {((analytics.paidUsers / analytics.totalUsers) * 100).toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}