import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import Stripe from "stripe";
import { handleWebhookEvent } from "./stripe";

const app = express();

// Stripe webhook endpoint MUST be registered BEFORE express.json()
// because Stripe requires the raw body for signature verification
app.post("/webhook/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('🔔 Webhook received:', {
    hasSignature: !!sig,
    signaturePreview: sig ? String(sig).substring(0, 20) + '...' : 'MISSING',
    hasSecret: !!endpointSecret,
    secretPreview: endpointSecret ? endpointSecret.substring(0, 10) + '...' : 'MISSING',
    bodyLength: req.body ? req.body.length : 0,
  });

  if (!endpointSecret) {
    console.log('Stripe webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;
  try {
    const stripeSecretKey = process.env.NODE_ENV === 'development' 
      ? (process.env.TESTING_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY)
      : process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return res.status(500).send('Stripe not configured');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log('🔧 DEBUG: About to call handleWebhookEvent...');
    
    // Add a timeout to prevent hanging forever
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Webhook handler timeout after 30 seconds')), 30000)
    );
    
    await Promise.race([
      handleWebhookEvent(event),
      timeout
    ]);
    
    console.log('✅ DEBUG: handleWebhookEvent completed successfully');
    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// NOW apply express.json() for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add health check endpoint for Autoscale deployments
app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

// Add a root endpoint for debugging
app.get('/_api_status', (_req, res) => {
  res.status(200).json({
    status: 'Running',
    time: new Date().toISOString(),
    env: app.get('env')
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);



  // Add landing page preview route
  app.get("/landing-preview", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const landingHtml = await fs.readFile('new-landing-page.html', 'utf-8');
      res.send(landingHtml);
    } catch (error) {
      res.status(500).send(`<h1>Error</h1><p>Failed to load landing page: ${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  });

 </p><p>You can log in at: <a href="/login">https://revalpro.co.uk/login</a></p><p><strong>Email:</strong> admin2@revalpro.co.uk<br><strong>Password:</strong> Test123!</p></body></html>`);
      }
      
      // Create new admin
      const hashedPassword = await hashPassword("Test123!");
      await storage.createUser({
        email: "admin2@revalpro.co.uk",
        username: "admin2",
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true,
        currentPlan: "premium",
        subscriptionStatus: "active",
        hasCompletedInitialSetup: true,
      });
      
      res.send(`<!DOCTYPE html>
<html><head><title>Admin Created Successfully</title><style>body{font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#d4edda;border:2px solid #28a745;border-radius:8px;}h1{color:#155724;}code{background:#f8f9fa;padding:2px 6px;border-radius:3px;}</style></head><body><h1>✅ Admin Account Created!</h1><p>Your new admin account has been created successfully.</p><p><strong>Login at:</strong> <a href="/login">https://revalpro.co.uk/login</a></p><hr><p><strong>Email:</strong> <code>admin2@revalpro.co.uk</code><br><strong>Password:</strong> <code>Test123!</code></p><p>You can now log in and create blog posts!</p></body></html>`);
    } catch (error) {
      res.status(500).send(`<!DOCTYPE html>
<html><head><title>Error</title><style>body{font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#f8d7da;border:2px solid #dc3545;border-radius:8px;}h1{color:#721c24;}</style></head><body><h1>❌ Error Creating Admin</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p></body></html>`);
    }
  });
// Add direct beta applications HTML route before Vite middleware
  app.get("/view-beta-applications", async (req, res) => {
    try {
      const { storage } = await import("./storage");
      const applications = await storage.getAllBetaApplications();
      
      const html = `<!DOCTYPE html>
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
      res.status(500).send(`<h1>Error</h1><p>Failed to load beta applications: ${error instanceof Error ? error.message : 'Unknown error'}</p>`);
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    log(`Error: ${err.message || 'Unknown error'}`);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();

  // Emergency admin account creation endpoint - MUST be before Vite middleware
  app.get("/create-admin-emergency-access", async (req, res) => {
    try {
      const { storage } = await import("./storage");
      const { hashPassword } = await import("./auth");
      
      // Check if admin already exists
      const existingAdmin = await storage.getUserByEmail("admin2@revalpro.co.uk");
      
      if (existingAdmin) {
        return res.send(`<!DOCTYPE html>
<html><head><title>Admin Already Exists</title><style>body{font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#fff3cd;border:2px solid #ffc107;border-radius:8px;}h1{color:#856404;}</style></head><body><h1>⚠️ Admin Account Already Exists</h1><p>The admin account <strong>admin2@revalpro.co.uk</strong> already exists.</p><p>You can log in at: <a href="/login">https://revalpro.co.uk/login</a></p><p><strong>Email:</strong> admin2@revalpro.co.uk<br><strong>Password:</strong> Test123!</p></body></html>`);
      }
      
      // Create new admin
      const hashedPassword = await hashPassword("Test123!");
      await storage.createUser({
        email: "admin2@revalpro.co.uk",
        username: "admin2",
        password: hashedPassword,
        isAdmin: true,
        isSuperAdmin: true,
        currentPlan: "premium",
        subscriptionStatus: "active",
        hasCompletedInitialSetup: true,
      });
      
      res.send(`<!DOCTYPE html>
<html><head><title>Admin Created Successfully</title><style>body{font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#d4edda;border:2px solid #28a745;border-radius:8px;}h1{color:#155724;}code{background:#f8f9fa;padding:2px 6px;border-radius:3px;}</style></head><body><h1>✅ Admin Account Created!</h1><p>Your new admin account has been created successfully.</p><p><strong>Login at:</strong> <a href="/login">https://revalpro.co.uk/login</a></p><hr><p><strong>Email:</strong> <code>admin2@revalpro.co.uk</code><br><strong>Password:</strong> <code>Test123!</code></p><p>You can now log in and create blog posts!</p></body></html>`);
    } catch (error) {
      res.status(500).send(`<!DOCTYPE html>
<html><head><title>Error</title><style>body{font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;background:#f8d7da;border:2px solid #dc3545;border-radius:8px;}h1{color:#721c24;}</style></head><body><h1>❌ Error Creating Admin</h1><p>${error instanceof Error ? error.message : 'Unknown error'}</p></body></html>`);
    }
  });

