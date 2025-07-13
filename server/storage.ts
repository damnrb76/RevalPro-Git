import { users, type User, type InsertUser, betaApplications, type BetaApplication, type InsertBetaApplication, trainingRecords, type TrainingRecord, type InsertTrainingRecord } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  createBetaApplication(application: Omit<BetaApplication, 'id' | 'submittedAt'>): Promise<BetaApplication>;
  getAllBetaApplications(): Promise<BetaApplication[]>;
  
  // Training record methods
  getAllTrainingRecords(): Promise<TrainingRecord[]>;
  createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord>;
  updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord>;
  deleteTrainingRecord(id: number): Promise<boolean>;
  getTrainingRecord(id: number): Promise<TrainingRecord | undefined>;
  
  sessionStore: session.Store;
}

// In-memory storage implementation for users (temporary)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private betaApplications: Map<number, BetaApplication>;
  private trainingRecords: Map<number, TrainingRecord>;
  currentId: number;
  currentBetaId: number;
  currentTrainingId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.betaApplications = new Map();
    this.trainingRecords = new Map();
    this.currentId = 1;
    this.currentBetaId = 1;
    this.currentTrainingId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: this.currentId++, 
      ...insertUser,
      email: null,
      profilePicture: null,
      created: new Date(),
      currentPlan: "premium", // Changed from "free" to "premium" for testing before release
      stripeCustomerId: null,
      stripeSubscriptionId: "test_premium_subscription", // Test subscription ID
      subscriptionStatus: "active", // Changed from "inactive" to "active"
      subscriptionPeriod: "annual", // Set to annual for testing
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set 1 year from now
      cancelAtPeriodEnd: false,
      isAdmin: false,
      isSuperAdmin: false,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.stripeCustomerId === customerId) {
        return user;
      }
    }
    return undefined;
  }

  async updateUserStripeInfo(userId: number, info: SubscriptionInfo): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...info };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUserPlan(userId: number, plan: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, currentPlan: plan };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async deleteUser(userId: number): Promise<boolean> {
    return this.users.delete(userId);
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    freeUsers: number;
    standardUsers: number;
    premiumUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
  }> {
    const users = Array.from(this.users.values());
    return {
      totalUsers: users.length,
      freeUsers: users.filter(u => u.currentPlan === "free").length,
      standardUsers: users.filter(u => u.currentPlan === "standard").length,
      premiumUsers: users.filter(u => u.currentPlan === "premium").length,
      activeSubscriptions: users.filter(u => u.subscriptionStatus === "active").length,
      totalRevenue: 0, // Would calculate based on subscription data
    };
  }

  async createBetaApplication(application: Omit<BetaApplication, 'id' | 'submittedAt'>): Promise<BetaApplication> {
    const betaApplication: BetaApplication = {
      id: this.currentBetaId++,
      ...application,
      submittedAt: new Date(),
    };
    this.betaApplications.set(betaApplication.id, betaApplication);
    return betaApplication;
  }

  async getAllBetaApplications(): Promise<BetaApplication[]> {
    return Array.from(this.betaApplications.values());
  }

  // Training record methods
  async getAllTrainingRecords(): Promise<TrainingRecord[]> {
    return Array.from(this.trainingRecords.values());
  }

  async createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord> {
    const trainingRecord: TrainingRecord = {
      id: this.currentTrainingId++,
      ...record,
      created: new Date(),
    };
    this.trainingRecords.set(trainingRecord.id, trainingRecord);
    return trainingRecord;
  }

  async updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord> {
    const existingRecord = this.trainingRecords.get(id);
    if (!existingRecord) {
      throw new Error("Training record not found");
    }
    
    const updatedRecord = { ...existingRecord, ...record };
    this.trainingRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteTrainingRecord(id: number): Promise<boolean> {
    return this.trainingRecords.delete(id);
  }

  async getTrainingRecord(id: number): Promise<TrainingRecord | undefined> {
    return this.trainingRecords.get(id);
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  private memStorage: MemStorage;

  constructor() {
    // Keep the memory storage for users and other data
    this.memStorage = new MemStorage();
  }

  // Delegate user methods to memory storage
  async getUser(id: number): Promise<User | undefined> {
    return this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.memStorage.getUserByUsername(username);
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    return this.memStorage.getUserByStripeCustomerId(customerId);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.memStorage.createUser(user);
  }

  async updateUserStripeInfo(userId: number, info: SubscriptionInfo): Promise<User> {
    return this.memStorage.updateUserStripeInfo(userId, info);
  }

  async getAllUsers(): Promise<User[]> {
    return this.memStorage.getAllUsers();
  }

  async updateUserPlan(userId: number, plan: string): Promise<User> {
    return this.memStorage.updateUserPlan(userId, plan);
  }

  async deleteUser(userId: number): Promise<boolean> {
    return this.memStorage.deleteUser(userId);
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    freeUsers: number;
    standardUsers: number;
    premiumUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
  }> {
    return this.memStorage.getAdminStats();
  }

  get sessionStore() {
    return this.memStorage.sessionStore;
  }

  // Beta applications - use persistent database storage
  async createBetaApplication(application: Omit<BetaApplication, 'id' | 'submittedAt'>): Promise<BetaApplication> {
    const [betaApplication] = await db
      .insert(betaApplications)
      .values(application)
      .returning();
    return betaApplication;
  }

  async getAllBetaApplications(): Promise<BetaApplication[]> {
    return await db.select().from(betaApplications);
  }

  // Training records - use persistent database storage
  async getAllTrainingRecords(): Promise<TrainingRecord[]> {
    return await db.select().from(trainingRecords);
  }

  async createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord> {
    const [trainingRecord] = await db
      .insert(trainingRecords)
      .values(record)
      .returning();
    return trainingRecord;
  }

  async updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord> {
    const [updatedRecord] = await db
      .update(trainingRecords)
      .set(record)
      .where(eq(trainingRecords.id, id))
      .returning();
    
    if (!updatedRecord) {
      throw new Error("Training record not found");
    }
    
    return updatedRecord;
  }

  async deleteTrainingRecord(id: number): Promise<boolean> {
    const result = await db
      .delete(trainingRecords)
      .where(eq(trainingRecords.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getTrainingRecord(id: number): Promise<TrainingRecord | undefined> {
    const result = await db
      .select()
      .from(trainingRecords)
      .where(eq(trainingRecords.id, id))
      .limit(1);
    
    return result[0];
  }
}

export const storage = new DatabaseStorage();