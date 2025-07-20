import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
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