// This is a React component for the admin dashboard
// Place this in your client/src/components/ directory

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CampaignStats {
  campaignType: string;
  totalSent: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;
  clickRate: number;
}

interface EmailAnalytics {
  totalEmailsSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  overallOpenRate: number;
  overallClickRate: number;
  campaignStats: CampaignStats[];
  emailsBySentDate: { date: string; count: number }[];
}

export function EmailAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<EmailAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/email-analytics?daysBack=${daysBack}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching email analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [daysBack]);

  if (loading) {
    return <div className="p-4">Loading email analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-4">No email analytics available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Email Automation Analytics</h1>
        <select
          value={daysBack}
          onChange={(e) => setDaysBack(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEmailsSent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">{analytics.totalOpened} opened</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overallClickRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">{analytics.totalClicked} clicked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalEmailsSent > 0
                ? ((analytics.totalBounced / analytics.totalEmailsSent) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-gray-500">{analytics.totalBounced} bounced</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Performance metrics for each email campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-4">Campaign</th>
                  <th className="text-right py-2 px-4">Sent</th>
                  <th className="text-right py-2 px-4">Opened</th>
                  <th className="text-right py-2 px-4">Open Rate</th>
                  <th className="text-right py-2 px-4">Clicked</th>
                  <th className="text-right py-2 px-4">Click Rate</th>
                  <th className="text-right py-2 px-4">Bounced</th>
                </tr>
              </thead>
              <tbody>
                {analytics.campaignStats.map((campaign) => (
                  <tr key={campaign.campaignType} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {campaign.campaignType.replace(/_/g, ' ')}
                    </td>
                    <td className="text-right py-3 px-4">{campaign.totalSent}</td>
                    <td className="text-right py-3 px-4">{campaign.opened}</td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {campaign.openRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{campaign.clicked}</td>
                    <td className="text-right py-3 px-4">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                        {campaign.clickRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{campaign.bounced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>quiz_no_login:</strong> Sent 2 days after quiz completion to users who haven't logged in
          </div>
          <div>
            <strong>quiz_no_subscribe:</strong> Sent 3 days after quiz to users who haven't subscribed
          </div>
          <div>
            <strong>blog_no_app:</strong> Sent 4 days after blog visit to users who haven't created an account
          </div>
          <div>
            <strong>app_no_first_task:</strong> Sent 7 days after signup to users who haven't completed first action
          </div>
          <div>
            <strong>free_user_14d:</strong> Sent 14 days after signup to free users to encourage upgrade
          </div>
          <div>
            <strong>subscription_cancelled:</strong> Sent immediately when user cancels subscription (win-back)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
