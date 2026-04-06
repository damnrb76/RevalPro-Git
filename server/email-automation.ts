import { storage } from './storage';
import { db } from './db';
import { userEvents, emailCampaigns, users } from '@shared/schema';
import { eq, and, gt, lt, not, isNull } from 'drizzle-orm';

// Email templates for different campaigns
const EMAIL_TEMPLATES = {
  quiz_no_login: {
    subject: "Your Revalidation Score is Ready - See What You Need to Work On",
    html: (userName: string, score?: number) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Your Revalidation Score is Ready!</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>You completed the RevalPro Revalidation Readiness Quiz${score ? ` and scored <strong>${score}/50</strong>` : ''}.</p>
        <p>Now it's time to see your personalized action plan and start getting ready for revalidation.</p>
        <a href="https://www.revalpro.co.uk/auth" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">View Your Score & Action Plan</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  },
  quiz_no_subscribe: {
    subject: "Nurses Like You Saved 15+ Hours Using RevalPro - Here's How",
    html: (userName: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Ready to Get Revalidation Done?</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>You've taken the first step by completing the Revalidation Readiness Quiz. Now let's make sure you're fully prepared.</p>
        <h3 style="color: #1e40af;">What RevalPro Users Are Saying:</h3>
        <ul style="color: #374151;">
          <li>"Saved me hours of organizing evidence" - Sarah M.</li>
          <li>"The AI templates made reflection so much easier" - James T.</li>
          <li>"Finally organized all my CPD activities in one place" - Emma L.</li>
        </ul>
        <p><strong>Special Offer:</strong> Use code <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px; font-weight: bold;">READY10</span> for 10% off your first month!</p>
        <a href="https://www.revalpro.co.uk/pricing" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">Explore Premium Plans</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  },
  blog_no_app: {
    subject: "The One Thing Missing From Your Revalidation Plan",
    html: (userName: string, blogTitle?: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">You're Researching Revalidation - Let's Help You Prepare</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>We noticed you read our blog post${blogTitle ? ` "${blogTitle}"` : ''}. Great choice!</p>
        <p>But here's the thing: <strong>reading about revalidation is only half the battle</strong>. You need to actually organize your evidence, track your CPD, and prepare your reflection accounts.</p>
        <p>That's where RevalPro comes in. Our app does all the heavy lifting for you:</p>
        <ul style="color: #374151;">
          <li>✓ Automatically organize your training records</li>
          <li>✓ AI-powered reflection templates to save you hours</li>
          <li>✓ Smart reminders so you never miss a deadline</li>
          <li>✓ Beautiful PDF exports ready for NMC submission</li>
        </ul>
        <a href="https://www.revalpro.co.uk/auth" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">Start Free Today</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  },
  app_no_first_task: {
    subject: "Get Started in 5 Minutes - We'll Walk You Through It",
    html: (userName: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Let's Get You Started</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>You've downloaded RevalPro - awesome! But we know the first step can feel overwhelming.</p>
        <p>That's why we've created a quick 5-minute walkthrough to get you up and running:</p>
        <ol style="color: #374151;">
          <li>Add your first practice hours entry (takes 2 minutes)</li>
          <li>Log a CPD activity (takes 1 minute)</li>
          <li>See your progress dashboard update in real-time</li>
        </ol>
        <a href="https://www.revalpro.co.uk/auth" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">Complete Your First Entry</a>
        <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email and we'll guide you through it.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  },
  free_user_14d: {
    subject: "You've Logged 40 Hours - Upgrade to Track Everything",
    html: (userName: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">You're Making Great Progress!</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>Wow! You've been using RevalPro for 2 weeks and logged significant practice hours. That's fantastic!</p>
        <p>But here's what you're missing on the Free plan:</p>
        <ul style="color: #374151;">
          <li>❌ Limited to 2 reflective accounts (you'll need more)</li>
          <li>❌ No AI-assisted reflection templates</li>
          <li>❌ No smart revalidation reminders</li>
          <li>❌ No advanced PDF templates</li>
        </ul>
        <p><strong>Upgrade to Standard</strong> and unlock everything you need for just <strong>£4.99/month</strong>.</p>
        <a href="https://www.revalpro.co.uk/pricing" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">See All Plans</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  },
  subscription_cancelled: {
    subject: "We'd Love to Help - What Went Wrong?",
    html: (userName: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">We're Sorry to See You Go</h2>
        <p>Hi ${userName || 'there'},</p>
        <p>We noticed your RevalPro subscription has been cancelled. We'd love to understand why and see if we can help.</p>
        <p>Was it:</p>
        <ul style="color: #374151;">
          <li>Too expensive?</li>
          <li>Missing a feature you needed?</li>
          <li>Not what you expected?</li>
          <li>Just not the right time?</li>
        </ul>
        <p>Please reply to this email and let us know. We genuinely want to improve RevalPro for nurses like you.</p>
        <p><strong>Special Offer:</strong> If you're willing to give us another chance, use code <span style="background: #fef3c7; padding: 4px 8px; border-radius: 4px; font-weight: bold;">COMEBACK20</span> for 20% off your next 3 months.</p>
        <a href="https://www.revalpro.co.uk/pricing" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0; font-weight: bold;">Reactivate Subscription</a>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent by RevalPro - UK Nursing Revalidation Platform</p>
      </div>
    `
  }
};

// Send email via Resend
async function sendEmailViaResend(email: string, subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@revalpro.co.uk',
        to: email,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return false;
    }

    console.log(`Email sent to ${email}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Check if campaign was already sent to this user
async function hasCampaignBeenSent(userId: number, campaignType: string): Promise<boolean> {
  const result = await db
    .select()
    .from(emailCampaigns)
    .where(
      and(
        eq(emailCampaigns.userId, userId),
        eq(emailCampaigns.campaignType, campaignType)
      )
    )
    .limit(1);

  return result.length > 0;
}

// Record sent campaign
async function recordCampaignSent(userId: number, campaignType: string, emailAddress: string): Promise<void> {
  await db.insert(emailCampaigns).values({
    userId,
    campaignType,
    emailAddress,
  });
}

// Campaign 1: Quiz completed but no app login (after 2 days)
export async function checkQuizNoLoginCampaign(): Promise<void> {
  console.log('Checking Quiz → No Login campaign...');

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  // Find users who completed quiz but never logged in
  const usersToEmail = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        gt(users.created, twoDaysAgo),
        isNull(users.stripeCustomerId) // Never logged in / set up account
      )
    );

  for (const user of usersToEmail) {
    const alreadySent = await hasCampaignBeenSent(user.id, 'quiz_no_login');
    if (!alreadySent) {
      const template = EMAIL_TEMPLATES.quiz_no_login;
      const sent = await sendEmailViaResend(
        user.email,
        template.subject,
        template.html(user.username || 'Nurse')
      );

      if (sent) {
        await recordCampaignSent(user.id, 'quiz_no_login', user.email);
      }
    }
  }
}

// Campaign 2: Quiz completed but didn't subscribe (after 3 days)
export async function checkQuizNoSubscribeCampaign(): Promise<void> {
  console.log('Checking Quiz → No Subscribe campaign...');

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  // Find users who have account but no active subscription
  const usersToEmail = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        gt(users.created, threeDaysAgo),
        not(eq(users.subscriptionStatus, 'active')),
        not(eq(users.currentPlan, 'premium')),
        not(eq(users.currentPlan, 'standard'))
      )
    );

  for (const user of usersToEmail) {
    const alreadySent = await hasCampaignBeenSent(user.id, 'quiz_no_subscribe');
    if (!alreadySent) {
      const template = EMAIL_TEMPLATES.quiz_no_subscribe;
      const sent = await sendEmailViaResend(
        user.email,
        template.subject,
        template.html(user.username || 'Nurse')
      );

      if (sent) {
        await recordCampaignSent(user.id, 'quiz_no_subscribe', user.email);
      }
    }
  }
}

// Campaign 3: Blog visited but no app action (after 4 days)
export async function checkBlogNoAppCampaign(): Promise<void> {
  console.log('Checking Blog → No App campaign...');

  const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);

  // Find users who visited blog but haven't created account
  const blogVisitors = await db
    .select({ userId: userEvents.userId })
    .from(userEvents)
    .where(
      and(
        eq(userEvents.eventType, 'blog_visited'),
        gt(userEvents.created, fourDaysAgo)
      )
    );

  const visitorIds = blogVisitors.map(v => v.userId);

  if (visitorIds.length > 0) {
    const usersToEmail = await db
      .select({ id: users.id, email: users.email, username: users.username })
      .from(users)
      .where(
        and(
          not(eq(users.subscriptionStatus, 'active')),
          not(eq(users.currentPlan, 'premium')),
          not(eq(users.currentPlan, 'standard'))
        )
      );

    for (const user of usersToEmail) {
      const alreadySent = await hasCampaignBeenSent(user.id, 'blog_no_app');
      if (!alreadySent) {
        const template = EMAIL_TEMPLATES.blog_no_app;
        const sent = await sendEmailViaResend(
          user.email,
          template.subject,
          template.html(user.username || 'Nurse')
        );

        if (sent) {
          await recordCampaignSent(user.id, 'blog_no_app', user.email);
        }
      }
    }
  }
}

// Campaign 4: App downloaded but no first task (after 7 days)
export async function checkAppNoFirstTaskCampaign(): Promise<void> {
  console.log('Checking App → No First Task campaign...');

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Find users who created account but haven't completed first task
  const usersToEmail = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        gt(users.created, sevenDaysAgo),
        not(eq(users.hasCompletedInitialSetup, true))
      )
    );

  for (const user of usersToEmail) {
    const alreadySent = await hasCampaignBeenSent(user.id, 'app_no_first_task');
    if (!alreadySent) {
      const template = EMAIL_TEMPLATES.app_no_first_task;
      const sent = await sendEmailViaResend(
        user.email,
        template.subject,
        template.html(user.username || 'Nurse')
      );

      if (sent) {
        await recordCampaignSent(user.id, 'app_no_first_task', user.email);
      }
    }
  }
}

// Campaign 5: Free user after 14 days (convert to paid)
export async function checkFreeUserConversionCampaign(): Promise<void> {
  console.log('Checking Free User Conversion campaign...');

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  // Find free users who have been active for 14+ days
  const usersToEmail = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        lt(users.created, fourteenDaysAgo),
        eq(users.currentPlan, 'free')
      )
    );

  for (const user of usersToEmail) {
    const alreadySent = await hasCampaignBeenSent(user.id, 'free_user_14d');
    if (!alreadySent) {
      const template = EMAIL_TEMPLATES.free_user_14d;
      const sent = await sendEmailViaResend(
        user.email,
        template.subject,
        template.html(user.username || 'Nurse')
      );

      if (sent) {
        await recordCampaignSent(user.id, 'free_user_14d', user.email);
      }
    }
  }
}

// Campaign 6: Subscription cancelled (win back)
export async function checkSubscriptionCancelledCampaign(): Promise<void> {
  console.log('Checking Subscription Cancelled campaign...');

  // Find users with cancelled subscriptions
  const usersToEmail = await db
    .select({ id: users.id, email: users.email, username: users.username })
    .from(users)
    .where(
      and(
        eq(users.subscriptionStatus, 'cancelled'),
        not(eq(users.currentPlan, 'free'))
      )
    );

  for (const user of usersToEmail) {
    const alreadySent = await hasCampaignBeenSent(user.id, 'subscription_cancelled');
    if (!alreadySent) {
      const template = EMAIL_TEMPLATES.subscription_cancelled;
      const sent = await sendEmailViaResend(
        user.email,
        template.subject,
        template.html(user.username || 'Nurse')
      );

      if (sent) {
        await recordCampaignSent(user.id, 'subscription_cancelled', user.email);
      }
    }
  }
}

// Run all campaigns
export async function runAllEmailCampaigns(): Promise<void> {
  console.log('Starting email automation campaigns...');

  try {
    await checkQuizNoLoginCampaign();
    await checkQuizNoSubscribeCampaign();
    await checkBlogNoAppCampaign();
    await checkAppNoFirstTaskCampaign();
    await checkFreeUserConversionCampaign();
    await checkSubscriptionCancelledCampaign();

    console.log('Email campaigns completed successfully');
  } catch (error) {
    console.error('Error running email campaigns:', error);
  }
}
