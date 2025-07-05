import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { createCustomer, createSubscription, getSubscription, cancelSubscription, reactivateSubscription, changeSubscriptionPlan } from "./stripe";
import { PLAN_DETAILS } from "../shared/subscription-plans";
import Stripe from "stripe";
import { checkNmcServiceStatus, verifyRegistration, calculateNmcImportantDates, getLatestRevalidationRequirements, checkNmcMaintenanceStatus } from "./nmc-api";
import { getRevalidationAdvice, generateReflectiveTemplate, suggestCpdActivities } from "./ai-service";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Simple server to serve the static frontend
// The actual data is stored in the browser using IndexedDB
export async function registerRoutes(app: Express): Promise<Server> {
  // Direct beta applications HTML page (priority route)
  app.get("/beta-view", async (req, res) => {
    try {
      const applications = await storage.getAllBetaApplications();
      
      res.setHeader('Content-Type', 'text/html');
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beta Applications - RevalPro</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f3f4f6; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: #1e40af; margin: 0 0 10px 0; font-size: 28px; }
        .subtitle { color: #6b7280; margin-bottom: 25px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; color: #374151; font-size: 14px; }
        td { font-size: 14px; }
        tr:hover { background: #f9fafb; }
        .name { font-weight: 600; color: #1f2937; }
        .email { color: #2563eb; text-decoration: none; }
        .email:hover { text-decoration: underline; }
        .specialty { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .empty { text-align: center; padding: 60px 20px; color: #6b7280; }
        .links { margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6; }
        .links a { color: #2563eb; text-decoration: none; margin-right: 20px; font-weight: 500; }
        .links a:hover { text-decoration: underline; }
        .count { font-weight: 600; color: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Beta Applications</h1>
        <p class="subtitle">Facebook advertising campaign results: <span class="count">${applications.length} total applications</span></p>
        
        ${applications.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>NMC PIN</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Work Location</th>
                    <th>Submitted</th>
                </tr>
            </thead>
            <tbody>
                ${applications.map(app => `
                <tr>
                    <td class="name">${app.name}</td>
                    <td><a href="mailto:${app.email}" class="email">${app.email}</a></td>
                    <td>${app.nmcPin || 'Not provided'}</td>
                    <td><span class="specialty">${app.nursingSpecialty}</span></td>
                    <td>${app.experience}</td>
                    <td>${app.workLocation}</td>
                    <td>${new Date(app.submittedAt).toLocaleDateString('en-GB')}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : `
        <div class="empty">
            <h3>No applications submitted yet</h3>
            <p>Beta applications will appear here when nurses submit the signup form.</p>
        </div>
        `}
        
        <div class="links">
            <strong>Quick Links:</strong><br><br>
            <a href="/beta-signup">Beta Signup Form</a>
            <a href="/api/beta-applications">Raw JSON Data</a>
            <a href="/">Back to App</a>
        </div>
    </div>
</body>
</html>`);
    } catch (error) {
      res.status(500).send(`<h1>Error</h1><p>Failed to load applications: ${error}</p>`);
    }
  });

  // For deployment debugging - this will help diagnose what's happening on the root URL
  app.get('/api/ping', (_req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
  });
  
  // Set up authentication routes and middleware
  setupAuth(app);



  // AI Assistant API routes
  app.post("/api/ai/revalidation-advice", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }
      
      const advice = await getRevalidationAdvice(question);
      res.json({ advice });
    } catch (error) {
      console.error("Error getting revalidation advice:", error);
      res.status(500).json({ error: "Failed to get revalidation advice" });
    }
  });

  app.post("/api/ai/reflection-template", async (req, res) => {
    try {
      const { experience, codeSection } = req.body;
      if (!experience || !codeSection) {
        return res.status(400).json({ error: "Experience and code section are required" });
      }
      
      const template = await generateReflectiveTemplate(experience, codeSection);
      res.json({ template });
    } catch (error) {
      console.error("Error generating reflection template:", error);
      res.status(500).json({ error: "Failed to generate reflection template" });
    }
  });

  app.post("/api/ai/cpd-suggestions", async (req, res) => {
    try {
      const { specialty, interests } = req.body;
      if (!specialty) {
        return res.status(400).json({ error: "Specialty is required" });
      }
      
      const suggestions = await suggestCpdActivities(specialty, interests || "");
      res.json({ suggestions });
    } catch (error) {
      console.error("Error getting CPD suggestions:", error);
      res.status(500).json({ error: "Failed to get CPD suggestions" });
    }
  });
  
  // Google user registration handler
  app.post("/api/register-google-user", async (req, res) => {
    try {
      const { username, email, uid, displayName } = req.body;

      if (!username || !uid) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(200).json({ message: "User already exists" });
      }

      // Create a special password hash for Google users (uses UID)
      const hashedPassword = await hashPassword(`google_${uid}`);

      // Create user in our system with additional fields
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || null,
        currentPlan: "free",
        profileImage: null,
        jobTitle: null,
      });

      // Add profile information if we have it
      if (displayName) {
        try {
          await storage.createUserProfile({
            userId: user.id,
            name: displayName,
            registrationNumber: "",
            expiryDate: "",
            email: email || null,
            jobTitle: null,
            profileImage: null,
          });
        } catch (profileError) {
          console.error("Error creating profile for Google user:", profileError);
          // Continue anyway as the user was created
        }
      }

      // Success
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating Google user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'RevalPro UK API is running' });
  });

  // Demo account creation endpoint for testing
  app.post("/api/create-demo-account", async (req, res) => {
    try {
      const demoUsername = "demo@revalpro.com";
      const demoPassword = "demo123";
      const requestedPlan = req.body?.plan || "standard"; // Default to standard, allow override
      
      // Check if demo account already exists and delete it first
      const existingUser = await storage.getUserByUsername(demoUsername);
      if (existingUser) {
        await storage.deleteUser(existingUser.id);
      }
      
      // Create fresh demo account using simple hash to match auth.ts
      const hashedPassword = `hashed_${demoPassword}`;
      const user = await storage.createUser({
        username: demoUsername,
        password: hashedPassword,
      });
      
      // Update with requested plan features
      await storage.updateUserStripeInfo(user.id, {
        currentPlan: requestedPlan,
        subscriptionStatus: "active",
        stripeSubscriptionId: "demo_subscription",
        subscriptionPeriod: "annual",
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        cancelAtPeriodEnd: false,
      });
      
      res.json({ 
        message: "Demo account created successfully", 
        username: demoUsername,
        password: demoPassword,
        plan: requestedPlan
      });
    } catch (error) {
      console.error("Error creating demo account:", error);
      res.status(500).json({ error: "Failed to create demo account" });
    }
  });

  // Demo login endpoint that bypasses password verification
  app.post("/api/demo-login", async (req, res) => {
    try {
      const demoUsername = "demo@revalpro.com";
      const user = await storage.getUserByUsername(demoUsername);
      
      if (!user) {
        return res.status(404).json({ error: "Demo account not found. Create it first." });
      }
      
      // Log the user in directly (bypassing password check)
      req.login(user, (err) => {
        if (err) {
          console.error("Demo login error:", err);
          return res.status(500).json({ error: "Failed to log in demo user" });
        }
        res.status(200).json(user);
      });
    } catch (error) {
      console.error("Error with demo login:", error);
      res.status(500).json({ error: "Failed to demo login" });
    }
  });
  
  // NMC API integration endpoints
  // These endpoints provide integration with the UK Nursing & Midwifery Council
  
  // Get NMC service status
  app.get('/api/nmc/service-status', async (req, res) => {
    try {
      const status = await checkNmcServiceStatus();
      res.json(status);
    } catch (error) {
      console.error('Error getting NMC service status:', error);
      res.status(500).json({ 
        error: 'Failed to check NMC service status',
        status: 'Unavailable', 
        lastChecked: new Date().toISOString() 
      });
    }
  });
  
  // Verify NMC registration
  app.post('/api/nmc/verify-registration', async (req, res) => {
    try {
      const { pin, dateOfBirth } = req.body;
      
      if (!pin) {
        return res.status(400).json({ error: 'NMC PIN is required' });
      }
      
      const result = await verifyRegistration(pin, dateOfBirth);
      res.json(result);
    } catch (error) {
      console.error('Error verifying NMC registration:', error);
      res.status(500).json({ 
        error: 'Failed to verify registration',
        pin: req.body.pin || '',
        name: '',
        registrationStatus: 'Not Found'
      });
    }
  });
  
  // Get important NMC dates based on expiry date
  app.post('/api/nmc/important-dates', async (req, res) => {
    try {
      const { expiryDate } = req.body;
      
      if (!expiryDate) {
        return res.status(400).json({ error: 'Expiry date is required' });
      }
      
      const dates = calculateNmcImportantDates(expiryDate);
      res.json(dates);
    } catch (error) {
      console.error('Error calculating NMC dates:', error);
      res.status(500).json({ error: 'Failed to calculate important dates' });
    }
  });
  
  // Get latest revalidation requirements from NMC
  app.get('/api/nmc/revalidation-requirements', async (req, res) => {
    try {
      const requirements = await getLatestRevalidationRequirements();
      res.json(requirements);
    } catch (error) {
      console.error('Error getting revalidation requirements:', error);
      res.status(500).json({ error: 'Failed to get revalidation requirements' });
    }
  });
  
  // Check if NMC portal is under maintenance
  app.get('/api/nmc/maintenance-status', async (req, res) => {
    try {
      const underMaintenance = await checkNmcMaintenanceStatus();
      res.json({ underMaintenance });
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      res.status(500).json({ 
        error: 'Failed to check maintenance status',
        underMaintenance: true 
      });
    }
  });
  


  // NMC guidelines endpoints (static data)
  app.get('/api/guidelines/revalidation', (req, res) => {
    res.json({
      title: 'NMC Revalidation Guidelines',
      url: 'https://www.nmc.org.uk/revalidation/',
      description: 'Official NMC guidelines for completing your revalidation requirements.'
    });
  });

  app.get('/api/guidelines/the-code', (req, res) => {
    res.json({
      title: 'The Code',
      url: 'https://www.nmc.org.uk/standards/code/',
      description: 'Professional standards of practice and behaviour for nurses, midwives and nursing associates.'
    });
  });

  // FAQ data
  app.get('/api/faq', (req, res) => {
    res.json([
      {
        question: "What happens if I don't meet the revalidation requirements?",
        answer: "If you fail to meet the revalidation requirements, your registration may lapse. If this happens, you would need to apply for readmission. The readmission process is more complex than revalidation."
      },
      {
        question: "Who can be my confirmer?",
        answer: "Your confirmer should be your line manager where possible. They can be an NMC-registered nurse or midwife, another healthcare professional, or someone else who is familiar with your work."
      },
      {
        question: "What counts as participatory learning?",
        answer: "Participatory learning involves interaction with other professionals. This could include attending conferences, taking part in case reviews, or participating in group discussions about clinical practices."
      },
      {
        question: "How do I know when my revalidation is due?",
        answer: "Your revalidation application date is the first day of the month in which your registration expires. You'll receive notifications from the NMC before this date."
      },
      {
        question: "Can I submit my revalidation application early?",
        answer: "Yes, you can submit your application from 60 days before your application date. However, all requirements must be completed prior to submission."
      }
    ]);
  });

  // Subscription Management Endpoints

  // Get available subscription plans
  app.get("/api/subscription/plans", (req, res) => {
    res.json(PLAN_DETAILS);
  });

  // Get current user's subscription
  app.get("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const user = req.user;
    const currentPlan = user.currentPlan || "free";
    const planDetails = PLAN_DETAILS[currentPlan];

    // If user has a Stripe subscription, get additional details
    let stripeSubscription = null;
    if (user.stripeSubscriptionId) {
      try {
        stripeSubscription = await getSubscription(user.stripeSubscriptionId);
      } catch (error) {
        console.error("Error fetching Stripe subscription:", error);
      }
    }

    res.json({
      currentPlan,
      planDetails,
      status: user.subscriptionStatus,
      period: user.subscriptionPeriod,
      endDate: user.subscriptionEndDate,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd,
      stripeSubscription: stripeSubscription ? {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
      } : null,
    });
  });

  // Create or update Stripe customer and start subscription
  app.post("/api/subscription/create", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    try {
      const { planId, period } = req.body;
      if (!planId || !period || !["monthly", "annual"].includes(period)) {
        return res.status(400).json({ error: "Invalid plan or period" });
      }

      const user = req.user;
      const planDetails = PLAN_DETAILS[planId];
      
      if (!planDetails) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      // Free plan doesn't need Stripe
      if (planId === "free") {
        await storage.updateUserStripeInfo(user.id, {
          currentPlan: "free",
          subscriptionStatus: "active",
          stripeSubscriptionId: null,
          subscriptionPeriod: null,
          subscriptionEndDate: null,
          cancelAtPeriodEnd: false,
        });
        return res.json({ success: true, plan: "free" });
      }

      // Development mode: Allow testing paid plans without Stripe integration
      if (process.env.NODE_ENV === "development") {
        // Simulate successful subscription for testing
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + (period === "annual" ? 1 : 0));
        endDate.setMonth(endDate.getMonth() + (period === "monthly" ? 1 : 0));

        await storage.updateUserStripeInfo(user.id, {
          currentPlan: planId,
          subscriptionStatus: "active",
          stripeSubscriptionId: `dev_sub_${Date.now()}`,
          subscriptionPeriod: period,
          subscriptionEndDate: endDate,
          cancelAtPeriodEnd: false,
        });
        
        return res.json({ 
          success: true, 
          plan: planId,
          message: "Development mode: Subscription activated for testing" 
        });
      }

      // Production mode: Use actual Stripe integration
      const priceId = planDetails.stripePriceId[period];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid price ID for selected plan and period" });
      }

      // Create or get customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        customerId = await createCustomer({
          email: user.email || "unknown@example.com",
          name: user.username,
          userId: user.id,
        });
      }

      // Create subscription
      const subscription = await createSubscription({
        customerId,
        priceId,
        userId: user.id,
      });

      res.json({
        subscriptionId: subscription.subscriptionId,
        clientSecret: subscription.clientSecret,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Cancel subscription
  app.post("/api/subscription/cancel", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    try {
      const user = req.user;
      const { immediate } = req.body;

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription" });
      }

      await cancelSubscription(user.stripeSubscriptionId, immediate);

      if (immediate) {
        await storage.updateUserStripeInfo(user.id, {
          subscriptionStatus: "canceled",
          currentPlan: "free",
          subscriptionPeriod: null,
          subscriptionEndDate: null,
          cancelAtPeriodEnd: false,
        });
      } else {
        await storage.updateUserStripeInfo(user.id, {
          cancelAtPeriodEnd: true,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  // Reactivate subscription (if cancel at period end)
  app.post("/api/subscription/reactivate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    try {
      const user = req.user;

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription" });
      }

      if (!user.cancelAtPeriodEnd) {
        return res.status(400).json({ error: "Subscription is not scheduled for cancellation" });
      }

      await reactivateSubscription(user.stripeSubscriptionId);
      await storage.updateUserStripeInfo(user.id, {
        cancelAtPeriodEnd: false,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      res.status(500).json({ error: "Failed to reactivate subscription" });
    }
  });

  // Change subscription plan
  app.post("/api/subscription/change-plan", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    try {
      const user = req.user;
      const { planId, period } = req.body;

      if (!planId || !period || !["monthly", "annual"].includes(period)) {
        return res.status(400).json({ error: "Invalid plan or period" });
      }

      const planDetails = PLAN_DETAILS[planId];
      if (!planDetails) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      // If user is on free plan and wants to upgrade
      if (user.currentPlan === "free" && planId !== "free") {
        // Redirect to create subscription flow
        return res.json({
          redirect: true,
          action: "create",
          plan: planId,
          period,
        });
      }

      // If user wants to downgrade to free plan
      if (planId === "free") {
        if (!user.stripeSubscriptionId) {
          return res.status(400).json({ error: "No active subscription to cancel" });
        }

        // Cancel subscription at period end
        await cancelSubscription(user.stripeSubscriptionId, false);
        await storage.updateUserStripeInfo(user.id, {
          cancelAtPeriodEnd: true,
        });

        return res.json({ success: true });
      }

      // User wants to change to a different paid plan
      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription to update" });
      }

      const priceId = planDetails.stripePriceId[period];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid price ID for selected plan and period" });
      }

      await changeSubscriptionPlan(user.stripeSubscriptionId, priceId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error changing subscription plan:", error);
      res.status(500).json({ error: "Failed to change subscription plan" });
    }
  });

  // Stripe webhook handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).send('Stripe configuration error');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16' as any,
    });
    
    // This is where you would validate the webhook signature
    // if you have a webhook secret configured
    // For testing purposes, we'll just process the event
    
    try {
      // For testing, just cast the request body to an event
      const event = req.body as Stripe.Event;
      
      // Handle the event based on its type
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
        case 'invoice.payment_succeeded':
        case 'invoice.payment_failed':
          // Process the event
          console.log(`Processing webhook event: ${event.type}`);
          // Here, you would call functions to update your database
          // based on the subscription changes
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.json({received: true});
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  // Admin middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    if (!req.user.isAdmin && !req.user.isSuperAdmin) {
      return res.sendStatus(403);
    }
    next();
  };

  // Admin Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin statistics" });
    }
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password field for security
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:userId/plan", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { plan } = req.body;
      
      if (!plan || !["free", "standard", "premium"].includes(plan)) {
        return res.status(400).json({ error: "Invalid plan specified" });
      }

      const updatedUser = await storage.updateUserPlan(userId, plan);
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user plan:", error);
      res.status(500).json({ error: "Failed to update user plan" });
    }
  });

  app.delete("/api/admin/users/:userId", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Prevent super admin from deleting themselves
      if (req.user.id === userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }

      const deleted = await storage.deleteUser(userId);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Beta Signup Routes
  app.post("/api/beta-signup", async (req, res) => {
    try {
      // Map form fields to storage format
      const formData = req.body;
      const mappedApplication = {
        name: formData.name,
        email: formData.email,
        nmcPin: formData.nmcPin,
        nursingSpecialty: formData.nursingSpecialty,
        workLocation: formData.workLocation,
        experience: formData.experience,
        currentChallenges: formData.motivation || "No specific challenges mentioned",
        expectations: formData.motivation || "General interest in beta testing",
        testingAvailability: "Flexible",
        agreeToTerms: formData.agreeTerms,
        allowContact: formData.agreeMarketing || true
      };
      
      const application = await storage.createBetaApplication(mappedApplication);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating beta application:", error);
      res.status(500).json({ error: "Failed to submit beta application" });
    }
  });

  // Alternative endpoint for beta applications (same functionality)
  app.post("/api/beta-applications", async (req, res) => {
    try {
      const application = await storage.createBetaApplication(req.body);
      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating beta application:", error);
      res.status(500).json({ error: "Failed to submit beta application" });
    }
  });

  app.get("/api/admin/beta-applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllBetaApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching beta applications:", error);
      res.status(500).json({ error: "Failed to fetch beta applications" });
    }
  });

  // Public beta applications endpoint for easier access
  app.get("/api/beta-applications", async (req, res) => {
    try {
      const applications = await storage.getAllBetaApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching beta applications:", error);
      res.status(500).json({ error: "Failed to fetch beta applications" });
    }
  });

  // Direct HTML view for beta applications (bypasses React routing issues)
  app.get("/view-beta-applications", async (req, res) => {
    try {
      const applications = await storage.getAllBetaApplications();
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beta Applications - RevalPro</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; color: #374151; }
        tr:hover { background-color: #f8f9fa; }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .email { color: #2563eb; text-decoration: none; }
        .email:hover { text-decoration: underline; }
        .empty { text-align: center; padding: 40px; color: #6b7280; }
        .links { margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 6px; }
        .links a { color: #2563eb; text-decoration: none; margin-right: 20px; }
        .links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Beta Applications (${applications.length} total)</h1>
        <p>Submitted beta tester applications for your Facebook advertising campaign</p>
        
        ${applications.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>NMC PIN</th>
                    <th>Specialty</th>
                    <th>Experience</th>
                    <th>Work Location</th>
                    <th>Submitted</th>
                </tr>
            </thead>
            <tbody>
                ${applications.map(app => `
                <tr>
                    <td><strong>${app.name}</strong></td>
                    <td><a href="mailto:${app.email}" class="email">${app.email}</a></td>
                    <td>${app.nmcPin || 'Not provided'}</td>
                    <td><span class="badge">${app.nursingSpecialty}</span></td>
                    <td>${app.experience}</td>
                    <td>${app.workLocation}</td>
                    <td>${new Date(app.submittedAt).toLocaleDateString('en-GB')}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : `
        <div class="empty">
            <h3>No applications yet</h3>
            <p>Beta applications will appear here when submitted through the signup form.</p>
        </div>
        `}
        
        <div class="links">
            <strong>Quick Links:</strong><br><br>
            <a href="/beta-signup">Beta Signup Form</a>
            <a href="/api/beta-applications">Raw JSON Data</a>
            <a href="/">Back to App</a>
        </div>
    </div>
</body>
</html>`;
      
      res.send(html);
    } catch (error) {
      console.error("Error generating beta applications view:", error);
      res.status(500).send(`<h1>Error</h1><p>Failed to load beta applications: ${error.message}</p>`);
    }
  });

  // AI Assistant Routes
  app.post("/api/ai/advice", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }
      
      const response = await getRevalidationAdvice(question);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI advice endpoint:", error);
      res.status(500).json({ error: "Failed to get AI advice" });
    }
  });

  app.post("/api/ai/reflection", async (req, res) => {
    try {
      const { experience, codeSection } = req.body;
      
      if (!experience || !codeSection) {
        return res.status(400).json({ error: "Experience and code section are required" });
      }
      
      const response = await generateReflectiveTemplate(experience, codeSection);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI reflection endpoint:", error);
      res.status(500).json({ error: "Failed to generate reflection template" });
    }
  });

  app.post("/api/ai/cpd-suggestions", async (req, res) => {
    try {
      const { specialty, interests } = req.body;
      
      if (!specialty || !interests) {
        return res.status(400).json({ error: "Specialty and interests are required" });
      }
      
      const response = await suggestCpdActivities(specialty, interests);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI CPD suggestions endpoint:", error);
      res.status(500).json({ error: "Failed to generate CPD suggestions" });
    }
  });

  // Email signup for coming soon page
  app.post("/api/register-interest", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Log the interest registration
      console.log(`New interest registration: ${email} at ${new Date().toISOString()}`);
      
      // Import email service
      const { sendInterestNotification, sendWelcomeEmail } = await import('./email-service');
      
      // Send notification email to revalpro2025@gmail.com
      const notificationSent = await sendInterestNotification(email);
      
      // Send welcome email to the user
      const welcomeSent = await sendWelcomeEmail(email);
      
      if (notificationSent && welcomeSent) {
        console.log(`Emails sent successfully for signup: ${email}`);
      } else {
        console.log(`Some emails failed to send for: ${email}`);
      }
      
      res.json({ 
        success: true, 
        message: "Thank you for registering your interest! We'll notify you when RevalPro launches." 
      });
      
    } catch (error) {
      console.error("Error processing interest registration:", error);
      res.status(500).json({ error: "Failed to register interest" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
