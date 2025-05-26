import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Define the session store type
const MemoryStore = createMemoryStore(session);

// Extend the interface with any CRUD methods and session store
export interface SubscriptionInfo {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  currentPlan?: string;
  subscriptionPeriod?: string | null;
  subscriptionEndDate?: Date | null;
  cancelAtPeriodEnd?: boolean;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByStripeCustomerId(customerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, info: SubscriptionInfo): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserPlan(userId: number, plan: string): Promise<User>;
  deleteUser(userId: number): Promise<boolean>;
  getAdminStats(): Promise<{
    totalUsers: number;
    freeUsers: number;
    standardUsers: number;
    premiumUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
  }>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours - prune expired entries
    });
    
    // Add demo user for testing with simple hashing
    this.users.set(1, {
      id: 1, 
      username: "demouser",
      password: "hashed_hello", // Simple hash for "hello"
      email: null,
      profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=nursehero",
      created: new Date(),
      currentPlan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "inactive",
      subscriptionPeriod: null,
      subscriptionEndDate: null,
      cancelAtPeriodEnd: false,
      isAdmin: false,
      isSuperAdmin: false
    });

    // Add super admin account with full privileges
    this.users.set(2, {
      id: 2,
      username: "RevalProAdmin",
      password: "hashed_5up3ru53r!", // Simple hash for "5up3ru53r!"
      email: "admin@revalpro.co.uk",
      profilePicture: "https://api.dicebear.com/7.x/personas/svg?seed=superadmin",
      created: new Date(),
      currentPlan: "premium", // Super admin gets premium access
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "active",
      subscriptionPeriod: "annual",
      subscriptionEndDate: null, // Never expires
      cancelAtPeriodEnd: false,
      isAdmin: true,
      isSuperAdmin: true
    });
    this.currentId = 3; // Start new users at ID 3
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const timestamp = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      email: null,
      profilePicture: insertUser.username 
        ? `https://api.dicebear.com/7.x/personas/svg?seed=${insertUser.username}` 
        : null,
      created: timestamp,
      currentPlan: "free",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "inactive",
      subscriptionPeriod: null,
      subscriptionEndDate: null,
      cancelAtPeriodEnd: false,
      isAdmin: false,
      isSuperAdmin: false
    };
    this.users.set(id, user);
    return user;
  }
  
  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.stripeCustomerId === customerId,
    );
  }
  
  async updateUserStripeInfo(userId: number, info: SubscriptionInfo): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = {
      ...user,
      ...info
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
