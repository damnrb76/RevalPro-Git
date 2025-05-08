import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

// Simple server to serve the static frontend
// The actual data is stored in the browser using IndexedDB
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
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
