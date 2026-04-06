import { db } from './db';
import { emailCampaigns } from '@shared/schema';
import { eq, and, gte } from 'drizzle-orm';

export interface CampaignStats {
  campaignType: string;
  totalSent: number;
  opened: number;
  clicked: number;
  bounced: number;
  openRate: number;
  clickRate: number;
}

export interface EmailAnalytics {
  totalEmailsSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBounced: number;
  overallOpenRate: number;
  overallClickRate: number;
  campaignStats: CampaignStats[];
  emailsBySentDate: { date: string; count: number }[];
}

export async function getEmailAnalytics(daysBack: number = 30): Promise<EmailAnalytics> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Get all campaigns in the date range
    let campaigns: any[] = [];
    try {
      campaigns = await db
        .select()
        .from(emailCampaigns)
        .where(gte(emailCampaigns.sentAt, startDate));
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // Return empty analytics if table doesn't exist yet
      campaigns = [];
    }

    // Calculate overall stats
    const totalSent = campaigns.length;
    const totalOpened = campaigns.filter(c => c.opened).length;
    const totalClicked = campaigns.filter(c => c.clicked).length;
    const totalBounced = campaigns.filter(c => c.bounced).length;

    const overallOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const overallClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;

    // Group by campaign type
    const campaignTypes = new Set(campaigns.map(c => c.campaignType));
    const campaignStats: CampaignStats[] = [];

    for (const campaignType of campaignTypes) {
      const campaignEmails = campaigns.filter(c => c.campaignType === campaignType);
      const sent = campaignEmails.length;
      const opened = campaignEmails.filter(c => c.opened).length;
      const clicked = campaignEmails.filter(c => c.clicked).length;
      const bounced = campaignEmails.filter(c => c.bounced).length;

      campaignStats.push({
        campaignType: campaignType as string,
        totalSent: sent,
        opened,
        clicked,
        bounced,
        openRate: sent > 0 ? (opened / sent) * 100 : 0,
        clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
      });
    }

    // Group by sent date
    const emailsBySentDate: { [key: string]: number } = {};
    campaigns.forEach(campaign => {
      const date = new Date(campaign.sentAt).toISOString().split('T')[0];
      emailsBySentDate[date] = (emailsBySentDate[date] || 0) + 1;
    });

    const emailsByDateArray = Object.entries(emailsBySentDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalEmailsSent: totalSent,
      totalOpened,
      totalClicked,
      totalBounced,
      overallOpenRate,
      overallClickRate,
      campaignStats: campaignStats.sort((a, b) => b.totalSent - a.totalSent),
      emailsBySentDate: emailsByDateArray,
    };
  } catch (error) {
    console.error('Error in getEmailAnalytics:', error);
    // Return empty analytics on error
    return {
      totalEmailsSent: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      overallOpenRate: 0,
      overallClickRate: 0,
      campaignStats: [],
      emailsBySentDate: [],
    };
  }
}

export async function getCampaignDetails(campaignType: string, daysBack: number = 30): Promise<CampaignStats | null> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let campaigns: any[] = [];
    try {
      campaigns = await db
        .select()
        .from(emailCampaigns)
        .where(
          and(
            eq(emailCampaigns.campaignType, campaignType),
            gte(emailCampaigns.sentAt, startDate)
          )
        );
    } catch (dbError) {
      console.error('Database query error:', dbError);
      campaigns = [];
    }

    if (campaigns.length === 0) {
      return null;
    }

    const sent = campaigns.length;
    const opened = campaigns.filter(c => c.opened).length;
    const clicked = campaigns.filter(c => c.clicked).length;
    const bounced = campaigns.filter(c => c.bounced).length;

    return {
      campaignType,
      totalSent: sent,
      opened,
      clicked,
      bounced,
      openRate: sent > 0 ? (opened / sent) * 100 : 0,
      clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
    };
  } catch (error) {
    console.error('Error in getCampaignDetails:', error);
    return null;
  }
}
