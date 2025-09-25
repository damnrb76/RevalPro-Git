import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

declare global {
  namespace Express {
    // Define User interface for Express session - matches our schema
    interface User {
      id: number;
      username?: string | null;
      password: string;
      email: string;
      profilePicture?: string | null;
      created: Date;
      currentPlan?: string | null;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
      subscriptionStatus?: string | null;
      subscriptionPeriod?: string | null;
      subscriptionEndDate?: Date | null;
      cancelAtPeriodEnd?: boolean | null;
      isAdmin?: boolean | null;
      isSuperAdmin?: boolean | null;
      hasCompletedInitialSetup?: boolean | null;
    }
  }
}

// For demo purposes, we'll use a very simple hash function
// In a real app, you'd use a proper password hashing library
export function hashPassword(password: string) {
  return `hashed_${password}`;
}

function comparePasswords(supplied: string, stored: string) {
  // Simple compare for demo
  return stored === `hashed_${supplied}`;
}

export function setupAuth(app: Express) {
  // Create a random session secret
  const randomSecret = randomBytes(32).toString("hex");
  const sessionSecret = process.env.SESSION_SECRET || randomSecret;
  
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Complete initial setup endpoint
  app.post("/api/user/complete-setup", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const user = req.user as User;
      await storage.updateUserSetupStatus(user.id, true);
      
      // Update the user in the session
      const updatedUser = await storage.getUser(user.id);
      req.login(updatedUser!, (err) => {
        if (err) {
          console.error('Session update error:', err);
        }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Complete setup error:', error);
      res.status(500).json({ error: 'Failed to complete setup' });
    }
  });
}