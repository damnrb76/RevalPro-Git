import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import Stripe from "stripe";
import { handleWebhookEvent, stripe } from "./stripe";

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
    signaturePreviewSecret: endpointSecret ? endpointSecret.substring(0, 10) + '...' : 'MISSING',
    bodyLength: req.body ? req.body.length : 0,
  });

  if (!endpointSecret) {
    console.log('Stripe webhook secret not configured');
    return res.status(400).send('Webhook secret not configured');
  }

  let event;
  try {
    // Use the shared Stripe instance from ./stripe.ts which handles key selection and security
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

// Health check endpoint is now handled in routes.ts with Stripe check

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
  let server;
  try {
    server = await registerRoutes(app);
  } catch (err) {
    console.error('Failed to register routes:', err);
    process.exit(1);
  }

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

  // Emergency admin account creation endpoint is now handled in routes.ts

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    log(`Error: ${err.message || 'Unknown error'}`);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT) || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`🚀 Server started successfully`);
    log(`📡 Listening on port ${PORT}`);
    log(`🌍 Environment: ${app.get("env")}`);
  });
})();
