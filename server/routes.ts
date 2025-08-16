import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import path from "path";
import { createCustomer, createSubscription, createCheckoutSession, getSubscription, cancelSubscription, reactivateSubscription, changeSubscriptionPlan, handleWebhookEvent } from "./stripe";
import { PLAN_DETAILS } from "../shared/subscription-plans";
import Stripe from "stripe";
import { verifyRegistration, calculateNmcImportantDates, getLatestRevalidationRequirements } from "./nmc-api";
import { getRevalidationAdvice, generateReflectiveTemplate, suggestCpdActivities } from "./ai-service";
import { insertTrainingRecordSchema } from "@shared/schema";

const scryptAsync = promisify(scrypt);

// Initialize Stripe for webhook handling
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Secure password hashing function for regular user accounts
async function hashPasswordSecure(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Helper function to check if user has access to AI features
async function checkAIAccess(req: Request, res: Response): Promise<{ hasAccess: boolean; user?: any }> {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return { hasAccess: false };
  }
  
  const user = await storage.getUser(req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return { hasAccess: false };
  }
  
  // AI features require Standard or Premium plans
  if (user.currentPlan === "free") {
    res.status(403).json({ 
      error: "AI assistant features require Standard or Premium subscription",
      upgradeRequired: true,
      currentPlan: user.currentPlan
    });
    return { hasAccess: false };
  }
  
  return { hasAccess: true, user };
}

// Helper function to check reflective accounts limit for free users
async function checkReflectiveAccountsLimit(req: Request, res: Response): Promise<{ canCreate: boolean; user?: any }> {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return { canCreate: false };
  }
  
  const user = await storage.getUser(req.user.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return { canCreate: false };
  }
  
  // Free users are limited to 3 reflective accounts
  if (user.currentPlan === "free") {
    // Get current count - this would need to be implemented in storage
    // For now, we'll add a placeholder that should be implemented
    // const currentCount = await storage.getReflectiveAccountsCount(user.id);
    // if (currentCount >= 3) {
    //   res.status(403).json({ 
    //     error: "Free plan is limited to 3 reflective accounts. Upgrade to Standard or Premium for unlimited access.",
    //     limit: 3,
    //     currentCount,
    //     upgradeRequired: true
    //   });
    //   return { canCreate: false };
    // }
  }
  
  return { canCreate: true, user };
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



  // AI Assistant API routes - require Standard/Premium subscription
  app.post("/api/ai/revalidation-advice", async (req, res) => {
    try {
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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
      
      // Create fresh demo account using proper hash function from auth.ts
      const hashedPassword = hashPassword(demoPassword);
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

  // Simple test endpoint
  app.get("/test-stripe", (req, res) => {
    res.json({
      message: "Stripe test endpoints ready!",
      endpoints: {
        "POST /api/subscription/checkout": "Create checkout session with {lookupKey}",
        "GET /api/subscription": "Get current subscription",
        "GET /api/subscription/plans": "Get available plans"
      },
      lookup_keys: ['standard_monthly_gbp', 'standard_annual_gbp', 'premium_monthly_gbp', 'premium_annual_gbp'],
      test_cards: {
        success: '4242 4242 4242 4242',
        sca: '4000 0027 6000 3184',
        declined: '4000 0000 0000 0002'
      }
    });
  });

  // Mobile-friendly test page
  app.get("/test-stripe.html", (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Stripe Test - RevalPro</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            max-width: 100%; 
            margin: 0; 
            padding: 20px; 
            background: #f0f2f5;
        }
        .card { 
            background: white; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 12px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .success { background: #d4edda; border-left: 4px solid #28a745; }
        .error { background: #f8d7da; border-left: 4px solid #dc3545; }
        .info { background: #d1ecf1; border-left: 4px solid #17a2b8; }
        button { 
            background: #007bff; 
            color: white; 
            padding: 14px 20px; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            margin: 8px 0; 
            width: 100%;
            font-size: 16px;
            font-weight: 500;
            transition: background 0.2s;
        }
        button:hover { background: #0056b3; }
        button:active { transform: translateY(1px); }
        h1 { color: #333; margin-bottom: 10px; }
        h2 { color: #495057; margin-bottom: 15px; }
        pre { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 6px; 
            overflow-x: auto; 
            font-size: 14px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .test-cards { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 10px 0;
        }
        .test-cards strong { color: #856404; }
        #results { margin-top: 20px; }
        .loading { opacity: 0.6; pointer-events: none; }
    </style>
</head>
<body>
    <h1>🧪 Stripe Test - RevalPro</h1>
    
    <div class="card">
        <h2>Step 1: Check Login</h2>
        <p>Make sure you're logged in first:</p>
        <button id="loginBtn" onclick="checkLogin()">Check Login Status</button>
        <div id="loginStatus"></div>
    </div>

    <div class="card">
        <h2>Step 2: Test Checkout</h2>
        <p>Test your Stripe checkout sessions:</p>
        <button onclick="testPlan('standard_monthly_gbp', 'Standard Monthly - £4.99')">Standard Monthly</button>
        <button onclick="testPlan('standard_annual_gbp', 'Standard Annual - £49.99')">Standard Annual</button>
        <button onclick="testPlan('premium_monthly_gbp', 'Premium Monthly - £9.99')">Premium Monthly</button>
        <button onclick="testPlan('premium_annual_gbp', 'Premium Annual - £89.99')">Premium Annual</button>
    </div>

    <div class="card test-cards">
        <h2>📱 Test Cards for Payment</h2>
        <p><strong>Success:</strong> 4242 4242 4242 4242</p>
        <p><strong>3DS Challenge:</strong> 4000 0027 6000 3184</p>
        <p><strong>Declined:</strong> 4000 0000 0000 0002</p>
        <p>Use any future expiry date and any 3-digit CVC</p>
    </div>

    <div class="card">
        <h2>Step 3: Quick Tests</h2>
        <button onclick="getCurrentSub()">Check My Subscription</button>
        <button onclick="getPlans()">Show All Plans</button>
    </div>

    <div id="results"></div>

    <script>
        function showResult(message, type = 'info') {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = 'card ' + type;
            div.innerHTML = '<pre>' + message + '</pre>';
            results.appendChild(div);
            results.scrollTop = results.scrollHeight;
        }

        async function checkLogin() {
            const btn = document.getElementById('loginBtn');
            const status = document.getElementById('loginStatus');
            
            btn.textContent = 'Checking...';
            btn.classList.add('loading');
            
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const user = await response.json();
                    status.innerHTML = '<div class="card success">✅ Logged in as: ' + user.username + '</div>';
                    btn.textContent = '✅ Logged In';
                    btn.style.background = '#28a745';
                } else {
                    status.innerHTML = '<div class="card error">❌ Not logged in - Go to your app and login first</div>';
                    btn.textContent = '❌ Not Logged In';
                    btn.style.background = '#dc3545';
                }
            } catch (error) {
                status.innerHTML = '<div class="card error">❌ Error: ' + error.message + '</div>';
                btn.textContent = 'Check Login Status';
                btn.style.background = '#007bff';
            }
            
            btn.classList.remove('loading');
        }

        async function testPlan(lookupKey, planName) {
            showResult('🧪 Testing: ' + planName + ' (' + lookupKey + ')', 'info');
            
            try {
                const response = await fetch('/api/subscription/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lookupKey })
                });

                const data = await response.json();
                
                if (response.ok && data.url) {
                    showResult('✅ SUCCESS! Checkout session created for ' + planName + '\\n\\n🚀 Opening Stripe checkout in new tab...', 'success');
                    // Small delay then open checkout
                    setTimeout(() => {
                        window.open(data.url, '_blank');
                    }, 500);
                } else {
                    showResult('❌ FAILED: ' + JSON.stringify(data, null, 2), 'error');
                }
            } catch (error) {
                showResult('❌ ERROR: ' + error.message, 'error');
            }
        }

        async function getCurrentSub() {
            try {
                const response = await fetch('/api/subscription');
                const data = await response.json();
                showResult('Current subscription:\\n' + JSON.stringify(data, null, 2), response.ok ? 'success' : 'error');
            } catch (error) {
                showResult('❌ Error: ' + error.message, 'error');
            }
        }

        async function getPlans() {
            try {
                const response = await fetch('/api/subscription/plans');
                const data = await response.json();
                showResult('Available plans:\\n' + JSON.stringify(data, null, 2), 'info');
            } catch (error) {
                showResult('❌ Error: ' + error.message, 'error');
            }
        }

        // Check login when page loads
        setTimeout(checkLogin, 500);
    </script>
</body>
</html>`);
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
    if (user.stripeSubscriptionId && 
        !user.stripeSubscriptionId.startsWith('dev_sub_') && 
        !user.stripeSubscriptionId.startsWith('demo_')) {
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

  // Create Checkout Session (recommended approach per GPT)
  app.post("/api/subscription/checkout", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    try {
      const { lookupKey } = req.body;
      const user = req.user;

      if (!lookupKey) {
        return res.status(400).json({ error: "lookupKey is required" });
      }

      // Map lookup key to actual price ID for testing
      const lookupToPriceId: Record<string, string> = {
        'standard_monthly_gbp': 'price_1RjnSJApgglLl36M5X8I82Jl',
        'standard_annual_gbp': 'price_1RjnSJApgglLl36Mk1ebPraW', 
        'premium_monthly_gbp': 'price_1RjnSJApgglLl36MUtHes4SP',
        'premium_annual_gbp': 'price_1RjnSJApgglLl36MzYUwBNkp'
      };
      
      const priceId = lookupToPriceId[lookupKey];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid lookup key" });
      }

      const session = await createCheckoutSession({
        lookupKey: priceId, // Use actual price ID instead of lookup key
        userId: user.id,
        customerEmail: user.email || `user${user.id}@revalpro.co.uk`,
      });

      res.json(session);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create or update Stripe customer and start subscription (legacy method)
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

      // Development mode: Allow testing without real Stripe integration
      // Add ?useStripe=true to test real Stripe checkout flow
      if (process.env.NODE_ENV === "development" && !req.query.useStripe) {
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

      // Don't allow canceling demo or dev subscriptions
      if (user.stripeSubscriptionId.startsWith('demo_') || user.stripeSubscriptionId.startsWith('dev_sub_')) {
        return res.status(400).json({ error: "Cannot cancel demo or development subscription" });
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

      // Don't allow reactivating demo or dev subscriptions
      if (user.stripeSubscriptionId.startsWith('demo_') || user.stripeSubscriptionId.startsWith('dev_sub_')) {
        return res.status(400).json({ error: "Cannot reactivate demo or development subscription" });
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

  // Stripe webhook handler
  app.post("/webhook/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.log('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      await handleWebhookEvent(event);
      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Failed to process webhook' });
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

      // Don't allow changing demo or dev subscriptions
      if (user.stripeSubscriptionId.startsWith('demo_') || user.stripeSubscriptionId.startsWith('dev_sub_')) {
        return res.status(400).json({ error: "Cannot change demo or development subscription" });
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

  // AI Assistant Routes - require Standard/Premium subscription
  app.post("/api/ai/advice", async (req, res) => {
    try {
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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
      // Check subscription access first
      const { hasAccess } = await checkAIAccess(req, res);
      if (!hasAccess) return; // Response already sent by checkAIAccess
      
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

  // Training Records API Routes
  app.get("/api/training-records", async (req, res) => {
    try {
      const records = await storage.getAllTrainingRecords();
      res.json(records);
    } catch (error) {
      console.error("Error fetching training records:", error);
      res.status(500).json({ error: "Failed to fetch training records" });
    }
  });

  app.post("/api/training-records", async (req, res) => {
    try {
      const parsedRecord = insertTrainingRecordSchema.parse(req.body);
      const record = await storage.createTrainingRecord(parsedRecord);
      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating training record:", error);
      res.status(500).json({ error: "Failed to create training record" });
    }
  });

  app.get("/api/training-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const record = await storage.getTrainingRecord(id);
      
      if (!record) {
        return res.status(404).json({ error: "Training record not found" });
      }
      
      res.json(record);
    } catch (error) {
      console.error("Error fetching training record:", error);
      res.status(500).json({ error: "Failed to fetch training record" });
    }
  });

  app.put("/api/training-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsedRecord = insertTrainingRecordSchema.partial().parse(req.body);
      const updatedRecord = await storage.updateTrainingRecord(id, parsedRecord);
      res.json(updatedRecord);
    } catch (error) {
      console.error("Error updating training record:", error);
      res.status(500).json({ error: "Failed to update training record" });
    }
  });

  app.delete("/api/training-records/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTrainingRecord(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Training record not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting training record:", error);
      res.status(500).json({ error: "Failed to delete training record" });
    }
  });

  // Revalidation Lifecycle API Routes
  
  // Get current active cycle for user
  app.get("/api/revalidation-cycles/current/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cycle = await storage.getCurrentRevalidationCycle(userId);
      res.json(cycle);
    } catch (error) {
      console.error("Error fetching current cycle:", error);
      res.status(500).json({ error: "Failed to fetch current revalidation cycle" });
    }
  });

  // Get last completed cycle for user
  app.get("/api/revalidation-cycles/last/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cycle = await storage.getLastRevalidationCycle(userId);
      res.json(cycle);
    } catch (error) {
      console.error("Error fetching last cycle:", error);
      res.status(500).json({ error: "Failed to fetch last revalidation cycle" });
    }
  });

  // Get all cycles for user (audit purposes)
  app.get("/api/revalidation-cycles/all/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cycles = await storage.getAllRevalidationCycles(userId);
      res.json(cycles);
    } catch (error) {
      console.error("Error fetching all cycles:", error);
      res.status(500).json({ error: "Failed to fetch revalidation cycles" });
    }
  });

  // Create new revalidation cycle
  app.post("/api/revalidation-cycles", async (req, res) => {
    try {
      const cycleData = req.body;
      const cycle = await storage.createRevalidationCycle(cycleData);
      res.status(201).json(cycle);
    } catch (error) {
      console.error("Error creating revalidation cycle:", error);
      res.status(500).json({ error: "Failed to create revalidation cycle" });
    }
  });

  // Update revalidation cycle (for completion, submission, etc.)
  app.patch("/api/revalidation-cycles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const cycle = await storage.updateRevalidationCycle(id, updateData);
      res.json(cycle);
    } catch (error) {
      console.error("Error updating revalidation cycle:", error);
      res.status(500).json({ error: "Failed to update revalidation cycle" });
    }
  });

  // Get archived data for specific cycle
  app.get("/api/revalidation-cycles/:id/archived-data", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const cycle = await storage.getRevalidationCycle(id);
      
      if (!cycle) {
        return res.status(404).json({ error: "Revalidation cycle not found" });
      }
      
      res.json(cycle);
    } catch (error) {
      console.error("Error fetching archived data:", error);
      res.status(500).json({ error: "Failed to fetch archived data" });
    }
  });

  // Create revalidation submission record
  app.post("/api/revalidation-submissions", async (req, res) => {
    try {
      const submissionData = req.body;
      const submission = await storage.createRevalidationSubmission(submissionData);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating revalidation submission:", error);
      res.status(500).json({ error: "Failed to create revalidation submission" });
    }
  });

  // Get user's IP address for audit trail
  app.get("/api/user-ip", async (req, res) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      res.json({ ip });
    } catch (error) {
      console.error("Error getting user IP:", error);
      res.json({ ip: 'unknown' });
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
