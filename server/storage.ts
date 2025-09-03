import {
  users, type User, type InsertUser,
  betaApplications, type BetaApplication, type InsertBetaApplication,
  trainingRecords, type TrainingRecord, type InsertTrainingRecord,
  revalidationCycles, type RevalidationCycle, type InsertRevalidationCycle,
  revalidationSubmissions, type RevalidationSubmission, type InsertRevalidationSubmission,
  couponCodes, type CouponCode, type InsertCouponCode,
  couponRedemptions, type CouponRedemption, type InsertCouponRedemption,
  passwordResetTokens, type PasswordResetToken, type InsertPasswordResetToken
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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
  updateUserSetupStatus(userId: number, completed: boolean): Promise<User>;
  deleteUser(userId: number): Promise<boolean>;
  getAdminStats(): Promise<{
    totalUsers: number;
    freeUsers: number;
    standardUsers: number;
    premiumUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
  }>;
  getAnalytics(): Promise<{
    totalUsers: number;
    paidUsers: number;
    freeUsers: number;
    stripeCustomers: number;
    planBreakdown: { plan: string; count: number }[];
    recentRegistrations: { date: string; count: number }[];
    firstRegistration: string | null;
    latestRegistration: string | null;
  }>;
  createBetaApplication(application: Omit<BetaApplication, 'id' | 'submittedAt'>): Promise<BetaApplication>;
  getAllBetaApplications(): Promise<BetaApplication[]>;
  
  // Training record methods
  getAllTrainingRecords(): Promise<TrainingRecord[]>;
  createTrainingRecord(record: InsertTrainingRecord): Promise<TrainingRecord>;
  updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord>;
  deleteTrainingRecord(id: number): Promise<boolean>;
  getTrainingRecord(id: number): Promise<TrainingRecord | undefined>;
  
  // Revalidation cycle methods
  getCurrentRevalidationCycle(userId: number): Promise<RevalidationCycle | null>;
  getLastRevalidationCycle(userId: number): Promise<RevalidationCycle | null>;
  getAllRevalidationCycles(userId: number): Promise<RevalidationCycle[]>;
  createRevalidationCycle(cycle: InsertRevalidationCycle): Promise<RevalidationCycle>;
  updateRevalidationCycle(id: number, cycle: Partial<InsertRevalidationCycle>): Promise<RevalidationCycle>;
  getRevalidationCycle(id: number): Promise<RevalidationCycle | null>;
  
  // Revalidation submission methods
  createRevalidationSubmission(submission: InsertRevalidationSubmission): Promise<RevalidationSubmission>;
  getRevalidationSubmissions(cycleId: number): Promise<RevalidationSubmission[]>;
  
  // Coupon methods
  getCouponByCode(code: string): Promise<CouponCode | null>;
  redeemCoupon(couponCode: string, userId: number, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; coupon?: CouponCode; error?: string }>;
  createCoupon(coupon: InsertCouponCode): Promise<CouponCode>;
  getAllCoupons(): Promise<CouponCode[]>;
  
  // Password reset methods
  getUserByEmail(email: string): Promise<User | undefined>;
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markPasswordResetTokenAsUsed(tokenId: number): Promise<void>;
  updateUserPassword(userId: number, hashedPassword: string): Promise<User>;
  
  sessionStore: session.Store;
}

// In-memory storage implementation for users (temporary)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private betaApplications: Map<number, BetaApplication>;
  private trainingRecords: Map<number, TrainingRecord>;
  private coupons: Map<number, CouponCode>;
  private couponRedemptions: Map<number, CouponRedemption>;
  currentId: number;
  currentBetaId: number;
  currentTrainingId: number;
  currentCouponId: number;
  currentRedemptionId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.betaApplications = new Map();
    this.trainingRecords = new Map();
    this.coupons = new Map();
    this.couponRedemptions = new Map();
    this.currentId = 1;
    this.currentBetaId = 1;
    this.currentTrainingId = 1;
    this.currentCouponId = 1;
    this.currentRedemptionId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Create some test coupons
    this.createTestCoupons();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
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
      username: null,
      profilePicture: null,
      created: new Date(),
      currentPlan: "free", // Production default - users start with free plan
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: "inactive", // Production default
      subscriptionPeriod: null,
      subscriptionEndDate: null,
      cancelAtPeriodEnd: false,
      isAdmin: false,
      isSuperAdmin: false,
      hasCompletedInitialSetup: false,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
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

  async updateUserSetupStatus(userId: number, completed: boolean): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, hasCompletedInitialSetup: completed };
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
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      expiryDate: record.expiryDate instanceof Date ? record.expiryDate.toISOString().split('T')[0] : (record.expiryDate || null),
      created: new Date(),
      status: record.status || 'completed',
      description: record.description || null,
      certificateNumber: record.certificateNumber || null,
      attachment: record.attachment || null,
      notes: record.notes || null
    };
    this.trainingRecords.set(trainingRecord.id, trainingRecord);
    return trainingRecord;
  }

  async updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord> {
    const existingRecord = this.trainingRecords.get(id);
    if (!existingRecord) {
      throw new Error("Training record not found");
    }
    
    const updateData: any = { ...record };
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }
    if (updateData.expiryDate instanceof Date) {
      updateData.expiryDate = updateData.expiryDate.toISOString().split('T')[0];
    } else if (updateData.expiryDate === undefined) {
      updateData.expiryDate = null;
    }
    
    const updatedRecord = { ...existingRecord, ...updateData } as TrainingRecord;
    this.trainingRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteTrainingRecord(id: number): Promise<boolean> {
    return this.trainingRecords.delete(id);
  }

  async getTrainingRecord(id: number): Promise<TrainingRecord | undefined> {
    return this.trainingRecords.get(id);
  }

  // Revalidation cycle methods (stub implementations for memory storage)
  async getCurrentRevalidationCycle(userId: number): Promise<RevalidationCycle | null> {
    return null; // Memory storage doesn't support revalidation cycles
  }

  async getLastRevalidationCycle(userId: number): Promise<RevalidationCycle | null> {
    return null;
  }

  async getAllRevalidationCycles(userId: number): Promise<RevalidationCycle[]> {
    return [];
  }

  async createRevalidationCycle(cycle: InsertRevalidationCycle): Promise<RevalidationCycle> {
    throw new Error("Revalidation cycles not supported in memory storage");
  }

  async updateRevalidationCycle(id: number, cycle: Partial<InsertRevalidationCycle>): Promise<RevalidationCycle> {
    throw new Error("Revalidation cycles not supported in memory storage");
  }

  async getRevalidationCycle(id: number): Promise<RevalidationCycle | null> {
    return null;
  }

  // Revalidation submission methods (stub implementations)
  async createRevalidationSubmission(submission: InsertRevalidationSubmission): Promise<RevalidationSubmission> {
    throw new Error("Revalidation submissions not supported in memory storage");
  }

  async getRevalidationSubmissions(cycleId: number): Promise<RevalidationSubmission[]> {
    return [];
  }

  // Create test coupons
  private createTestCoupons() {
    // Create some test coupons for development
    const testCoupons: CouponCode[] = [
      {
        id: 1,
        code: "STANDARD30",
        description: "30 days Standard plan",
        planId: "standard",
        period: "monthly",
        maxRedemptions: null,
        currentRedemptions: 0,
        isActive: true,
        validFrom: null,
        validUntil: null,
        isPromotional: false,
        promotionalPrice: null,
        promotionalDuration: null,
        regularPrice: null,
        stripeCouponId: null,
        createdBy: null,
        created: new Date(),
      },
      {
        id: 2,
        code: "PREMIUM90",
        description: "90 days Premium plan",
        planId: "premium",
        period: "monthly",
        maxRedemptions: 10,
        currentRedemptions: 0,
        isActive: true,
        validFrom: null,
        validUntil: null,
        isPromotional: false,
        promotionalPrice: null,
        promotionalDuration: null,
        regularPrice: null,
        stripeCouponId: null,
        createdBy: null,
        created: new Date(),
      },
      {
        id: 3,
        code: "YEARLY20",
        description: "1 year Standard plan",
        planId: "standard",
        period: "annual",
        maxRedemptions: 5,
        currentRedemptions: 0,
        isActive: true,
        validFrom: null,
        validUntil: null,
        isPromotional: false,
        promotionalPrice: null,
        promotionalDuration: null,
        regularPrice: null,
        stripeCouponId: null,
        createdBy: null,
        created: new Date(),
      }
    ];

    testCoupons.forEach(coupon => {
      this.coupons.set(coupon.id, coupon);
    });
  }

  // Coupon methods
  async getCouponByCode(code: string): Promise<CouponCode | null> {
    for (const coupon of Array.from(this.coupons.values())) {
      if (coupon.code === code) {
        return coupon;
      }
    }
    return null;
  }

  async redeemCoupon(couponCode: string, userId: number, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; coupon?: CouponCode; error?: string }> {
    try {
      // Get coupon details
      const coupon = await this.getCouponByCode(couponCode);
      
      if (!coupon) {
        return { success: false, error: "Invalid coupon code" };
      }

      if (!coupon.isActive) {
        return { success: false, error: "This coupon is no longer active" };
      }

      // Check validity dates
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return { success: false, error: "This coupon is not yet valid" };
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        return { success: false, error: "This coupon has expired" };
      }

      // Check redemption limits
      if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
        return { success: false, error: "This coupon has reached its redemption limit" };
      }

      // Check if user already redeemed this coupon
      for (const redemption of Array.from(this.couponRedemptions.values())) {
        if (redemption.couponId === coupon.id && redemption.userId === userId) {
          return { success: false, error: "You have already redeemed this coupon" };
        }
      }

      // Create redemption record
      const redemption: CouponRedemption = {
        id: this.currentRedemptionId++,
        couponId: coupon.id,
        userId,
        redeemedAt: new Date(),
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      };
      this.couponRedemptions.set(redemption.id, redemption);

      // Update coupon redemption count
      coupon.currentRedemptions++;
      this.coupons.set(coupon.id, coupon);

      // Award subscription to user
      const endDate = new Date();
      
      // Handle promotional pricing differently
      if (coupon.isPromotional && coupon.promotionalDuration) {
        // For promotional coupons, set end date based on promotional duration
        endDate.setMonth(endDate.getMonth() + coupon.promotionalDuration);
      } else {
        // Regular coupon behavior
        if (coupon.period === "annual") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
      }

      await this.updateUserStripeInfo(userId, {
        currentPlan: coupon.planId,
        subscriptionStatus: "active",
        stripeSubscriptionId: `coupon_${coupon.id}_${userId}_${Date.now()}`,
        subscriptionPeriod: coupon.period,
        subscriptionEndDate: endDate,
        cancelAtPeriodEnd: false,
      });

      return { success: true, coupon };
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      return { success: false, error: "Failed to redeem coupon" };
    }
  }

  async createCoupon(coupon: InsertCouponCode): Promise<CouponCode> {
    const newCoupon: CouponCode = {
      id: this.currentCouponId++,
      ...coupon,
      description: coupon.description ?? null,
      maxRedemptions: coupon.maxRedemptions ?? null,
      isActive: coupon.isActive ?? true,
      validFrom: coupon.validFrom ?? null,
      validUntil: coupon.validUntil ?? null,
      isPromotional: coupon.isPromotional ?? false,
      promotionalPrice: coupon.promotionalPrice ?? null,
      promotionalDuration: coupon.promotionalDuration ?? null,
      regularPrice: coupon.regularPrice ?? null,
      stripeCouponId: coupon.stripeCouponId ?? null,
      createdBy: coupon.createdBy ?? null,
      currentRedemptions: 0,
      created: new Date(),
    };
    this.coupons.set(newCoupon.id, newCoupon);
    return newCoupon;
  }

  async getAllCoupons(): Promise<CouponCode[]> {
    return Array.from(this.coupons.values());
  }

  // Password reset methods (placeholder implementations for MemStorage)
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    throw new Error("Password reset not supported in MemStorage");
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    throw new Error("Password reset not supported in MemStorage");
  }

  async markPasswordResetTokenAsUsed(tokenId: number): Promise<void> {
    throw new Error("Password reset not supported in MemStorage");
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    throw new Error("Password reset not supported in MemStorage");
  }

  async getAnalytics(): Promise<{
    totalUsers: number;
    paidUsers: number;
    freeUsers: number;
    stripeCustomers: number;
    planBreakdown: { plan: string; count: number }[];
    recentRegistrations: { date: string; count: number }[];
    firstRegistration: string | null;
    latestRegistration: string | null;
  }> {
    const allUsers = Array.from(this.users.values());
    
    const totalUsers = allUsers.length;
    const freeUsers = allUsers.filter(u => u.currentPlan === 'free').length;
    const paidUsers = allUsers.filter(u => u.currentPlan !== 'free').length;
    const stripeCustomers = allUsers.filter(u => u.stripeCustomerId).length;
    
    const planCounts = allUsers.reduce((acc, user) => {
      const plan = user.currentPlan || 'free';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      count
    }));
    
    const registrationCounts = allUsers.reduce((acc, user) => {
      const date = user.created.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentRegistrations = Object.entries(registrationCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
    
    const sortedUsers = allUsers.sort((a, b) => a.created.getTime() - b.created.getTime());
    const firstRegistration = sortedUsers[0]?.created.toISOString() || null;
    const latestRegistration = sortedUsers[sortedUsers.length - 1]?.created.toISOString() || null;
    
    return {
      totalUsers,
      paidUsers,
      freeUsers,
      stripeCustomers,
      planBreakdown,
      recentRegistrations,
      firstRegistration,
      latestRegistration
    };
  }
}

// Database Storage implementation
export class DatabaseStorage implements IStorage {
  private memStorage: MemStorage;

  constructor() {
    // Keep the memory storage for users and other data
    this.memStorage = new MemStorage();
  }

  // Use database for user methods
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async getUserByStripeCustomerId(customerId: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }

  async updateUserStripeInfo(userId: number, info: SubscriptionInfo): Promise<User> {
    const updateData: any = {};
    if (info.stripeCustomerId !== undefined) updateData.stripeCustomerId = info.stripeCustomerId;
    if (info.stripeSubscriptionId !== undefined) updateData.stripeSubscriptionId = info.stripeSubscriptionId;
    if (info.subscriptionStatus !== undefined) updateData.subscriptionStatus = info.subscriptionStatus;
    if (info.currentPlan !== undefined) updateData.currentPlan = info.currentPlan;
    if (info.subscriptionPeriod !== undefined) updateData.subscriptionPeriod = info.subscriptionPeriod;
    if (info.subscriptionEndDate !== undefined) updateData.subscriptionEndDate = info.subscriptionEndDate;
    if (info.cancelAtPeriodEnd !== undefined) updateData.cancelAtPeriodEnd = info.cancelAtPeriodEnd;
    
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserPlan(userId: number, plan: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ currentPlan: plan })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async updateUserSetupStatus(userId: number, completed: boolean): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ hasCompletedInitialSetup: completed })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, userId));
    return (result.rowCount ?? 0) > 0;
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
    const recordData = {
      ...record,
      date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
      expiryDate: record.expiryDate instanceof Date ? record.expiryDate.toISOString().split('T')[0] : record.expiryDate
    };
    const [trainingRecord] = await db
      .insert(trainingRecords)
      .values(recordData)
      .returning();
    return trainingRecord;
  }

  async updateTrainingRecord(id: number, record: Partial<InsertTrainingRecord>): Promise<TrainingRecord> {
    const updateData: any = { ...record };
    if (updateData.date instanceof Date) {
      updateData.date = updateData.date.toISOString().split('T')[0];
    }
    if (updateData.expiryDate instanceof Date) {
      updateData.expiryDate = updateData.expiryDate.toISOString().split('T')[0];
    }
    
    const [updatedRecord] = await db
      .update(trainingRecords)
      .set(updateData)
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

  // Revalidation cycle methods - use persistent database storage
  async getCurrentRevalidationCycle(userId: number): Promise<RevalidationCycle | null> {
    const result = await db
      .select()
      .from(revalidationCycles)
      .where(and(
        eq(revalidationCycles.userId, userId),
        eq(revalidationCycles.status, 'active')
      ))
      .limit(1);
    
    return result[0] || null;
  }

  async getLastRevalidationCycle(userId: number): Promise<RevalidationCycle | null> {
    const result = await db
      .select()
      .from(revalidationCycles)
      .where(eq(revalidationCycles.userId, userId))
      .orderBy(revalidationCycles.cycleNumber)
      .limit(1);
    
    return result[0] || null;
  }

  async getAllRevalidationCycles(userId: number): Promise<RevalidationCycle[]> {
    return await db
      .select()
      .from(revalidationCycles)
      .where(eq(revalidationCycles.userId, userId))
      .orderBy(revalidationCycles.cycleNumber);
  }

  async createRevalidationCycle(cycle: InsertRevalidationCycle): Promise<RevalidationCycle> {
    const cycleData: any = {
      ...cycle,
      startDate: cycle.startDate instanceof Date ? cycle.startDate.toISOString().split('T')[0] : cycle.startDate,
      endDate: cycle.endDate instanceof Date ? cycle.endDate.toISOString().split('T')[0] : cycle.endDate,
      submissionDate: cycle.submissionDate instanceof Date 
        ? cycle.submissionDate.toISOString().split('T')[0] 
        : (cycle.submissionDate || null)
    };
    const [revalidationCycle] = await db
      .insert(revalidationCycles)
      .values(cycleData)
      .returning();
    return revalidationCycle;
  }

  async updateRevalidationCycle(id: number, cycle: Partial<InsertRevalidationCycle>): Promise<RevalidationCycle> {
    const updateData: any = { ...cycle };
    if (updateData.startDate instanceof Date) {
      updateData.startDate = updateData.startDate.toISOString().split('T')[0];
    }
    if (updateData.endDate instanceof Date) {
      updateData.endDate = updateData.endDate.toISOString().split('T')[0];
    }
    if (updateData.submissionDate instanceof Date) {
      updateData.submissionDate = updateData.submissionDate.toISOString().split('T')[0];
    }
    
    const [updatedCycle] = await db
      .update(revalidationCycles)
      .set(updateData)
      .where(eq(revalidationCycles.id, id))
      .returning();
    
    if (!updatedCycle) {
      throw new Error("Revalidation cycle not found");
    }
    
    return updatedCycle;
  }

  async getRevalidationCycle(id: number): Promise<RevalidationCycle | null> {
    const result = await db
      .select()
      .from(revalidationCycles)
      .where(eq(revalidationCycles.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  // Revalidation submission methods
  async createRevalidationSubmission(submission: InsertRevalidationSubmission): Promise<RevalidationSubmission> {
    const [revalidationSubmission] = await db
      .insert(revalidationSubmissions)
      .values(submission)
      .returning();
    return revalidationSubmission;
  }

  async getRevalidationSubmissions(cycleId: number): Promise<RevalidationSubmission[]> {
    return await db
      .select()
      .from(revalidationSubmissions)
      .where(eq(revalidationSubmissions.cycleId, cycleId))
      .orderBy(revalidationSubmissions.submissionDate);
  }

  // Coupon methods - use persistent database storage
  async getCouponByCode(code: string): Promise<CouponCode | null> {
    const result = await db
      .select()
      .from(couponCodes)
      .where(eq(couponCodes.code, code))
      .limit(1);
    
    return result[0] || null;
  }

  async redeemCoupon(couponCode: string, userId: number, ipAddress?: string, userAgent?: string): Promise<{ success: boolean; coupon?: CouponCode; error?: string }> {
    try {
      // Get coupon details
      const coupon = await this.getCouponByCode(couponCode);
      
      if (!coupon) {
        return { success: false, error: "Invalid coupon code" };
      }

      if (!coupon.isActive) {
        return { success: false, error: "This coupon is no longer active" };
      }

      // Check validity dates
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return { success: false, error: "This coupon is not yet valid" };
      }

      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        return { success: false, error: "This coupon has expired" };
      }

      // Check redemption limits
      if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
        return { success: false, error: "This coupon has reached its redemption limit" };
      }

      // Check if user already redeemed this coupon
      const existingRedemption = await db
        .select()
        .from(couponRedemptions)
        .where(and(
          eq(couponRedemptions.couponId, coupon.id),
          eq(couponRedemptions.userId, userId)
        ))
        .limit(1);

      if (existingRedemption.length > 0) {
        return { success: false, error: "You have already redeemed this coupon" };
      }

      // Create redemption record
      await db.insert(couponRedemptions).values({
        couponId: coupon.id,
        userId,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      });

      // Update coupon redemption count
      await db
        .update(couponCodes)
        .set({ currentRedemptions: coupon.currentRedemptions + 1 })
        .where(eq(couponCodes.id, coupon.id));

      // Award subscription to user
      const endDate = new Date();
      
      // Handle promotional pricing differently
      if (coupon.isPromotional && coupon.promotionalDuration) {
        // For promotional coupons, set end date based on promotional duration
        endDate.setMonth(endDate.getMonth() + coupon.promotionalDuration);
      } else {
        // Regular coupon behavior
        if (coupon.period === "annual") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
          endDate.setMonth(endDate.getMonth() + 1);
        }
      }

      await this.updateUserStripeInfo(userId, {
        currentPlan: coupon.planId,
        subscriptionStatus: "active",
        stripeSubscriptionId: `coupon_${coupon.id}_${userId}_${Date.now()}`,
        subscriptionPeriod: coupon.period,
        subscriptionEndDate: endDate,
        cancelAtPeriodEnd: false,
      });

      return { success: true, coupon };
    } catch (error) {
      console.error("Error redeeming coupon:", error);
      return { success: false, error: "Failed to redeem coupon" };
    }
  }

  async createCoupon(coupon: InsertCouponCode): Promise<CouponCode> {
    const [newCoupon] = await db
      .insert(couponCodes)
      .values(coupon)
      .returning();
    return newCoupon;
  }

  async getAllCoupons(): Promise<CouponCode[]> {
    return await db.select().from(couponCodes);
  }

  // Password reset methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    // Check both users.email and userProfiles.email
    const userByEmail = await db.select().from(users).where(eq(users.email, email));
    if (userByEmail.length > 0) {
      return userByEmail[0];
    }
    
    // If not found in users table, check userProfiles table
    const { userProfiles } = await import("@shared/schema");
    const profileResults = await db.select({
      id: users.id,
      username: users.username,
      password: users.password,
      email: users.email,
      profilePicture: users.profilePicture,
      created: users.created,
      currentPlan: users.currentPlan,
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: users.stripeSubscriptionId,
      subscriptionStatus: users.subscriptionStatus,
      subscriptionPeriod: users.subscriptionPeriod,
      subscriptionEndDate: users.subscriptionEndDate,
      cancelAtPeriodEnd: users.cancelAtPeriodEnd,
      isAdmin: users.isAdmin,
      isSuperAdmin: users.isSuperAdmin,
      hasCompletedInitialSetup: users.hasCompletedInitialSetup,
    })
    .from(users)
    .innerJoin(userProfiles, eq(users.id, userProfiles.id))
    .where(eq(userProfiles.email, email));
    
    return profileResults[0];
  }

  async createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [createdToken] = await db
      .insert(passwordResetTokens)
      .values(token)
      .returning();
    return createdToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const results = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return results[0];
  }

  async markPasswordResetTokenAsUsed(tokenId: number): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenId));
  }

  async updateUserPassword(userId: number, hashedPassword: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getAnalytics(): Promise<{
    totalUsers: number;
    paidUsers: number;
    freeUsers: number;
    stripeCustomers: number;
    planBreakdown: { plan: string; count: number }[];
    recentRegistrations: { date: string; count: number }[];
    firstRegistration: string | null;
    latestRegistration: string | null;
  }> {
    // Get basic user counts
    const allUsers = await db.select().from(users);
    
    const totalUsers = allUsers.length;
    const freeUsers = allUsers.filter(u => u.currentPlan === 'free').length;
    const paidUsers = allUsers.filter(u => u.currentPlan !== 'free').length;
    const stripeCustomers = allUsers.filter(u => u.stripeCustomerId).length;
    
    // Plan breakdown
    const planCounts = allUsers.reduce((acc, user) => {
      const plan = user.currentPlan || 'free';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const planBreakdown = Object.entries(planCounts).map(([plan, count]) => ({
      plan,
      count
    }));
    
    // Recent registrations (last 30 days)
    const registrationCounts = allUsers.reduce((acc, user) => {
      const date = user.created.toISOString().split('T')[0]; // YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recentRegistrations = Object.entries(registrationCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
    
    // First and latest registrations
    const sortedUsers = allUsers.sort((a, b) => a.created.getTime() - b.created.getTime());
    const firstRegistration = sortedUsers[0]?.created.toISOString() || null;
    const latestRegistration = sortedUsers[sortedUsers.length - 1]?.created.toISOString() || null;
    
    return {
      totalUsers,
      paidUsers,
      freeUsers,
      stripeCustomers,
      planBreakdown,
      recentRegistrations,
      firstRegistration,
      latestRegistration
    };
  }
}

export const storage = new DatabaseStorage();