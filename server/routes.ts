import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Simple server to serve the static frontend
// The actual data is stored in the browser using IndexedDB
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
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

      // Create user in our system
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Success
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating Google user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'NurseValidate UK API is running' });
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

  const httpServer = createServer(app);

  return httpServer;
}
