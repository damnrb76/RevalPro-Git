import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Password Reset Tokens
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens, {
  expiresAt: z.coerce.date(),
}).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

// User Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  profilePicture: text("profile_picture"),
  created: timestamp("created").notNull().defaultNow(),
  
  // Subscription fields
  currentPlan: text("current_plan").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionPeriod: text("subscription_period"),  // "monthly" or "annual"
  subscriptionEndDate: timestamp("subscription_end_date"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  isAdmin: boolean("is_admin").default(false),
  isSuperAdmin: boolean("is_super_admin").default(false),
  hasCompletedInitialSetup: boolean("has_completed_initial_setup").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// User Profile
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  registrationNumber: text("registration_number"),
  expiryDate: date("expiry_date"),
  jobTitle: text("job_title"),
  email: text("email"),
  profileImage: text("profile_image"),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  expiryDate: z.coerce.date().optional(),
}).pick({
  name: true,
  registrationNumber: true,
  expiryDate: true,
  jobTitle: true,
  email: true,
  profileImage: true,
}).extend({
  registrationNumber: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
});

// Weekly Hours Configuration
export const weeklyHoursConfig = pgTable("weekly_hours_config", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  weeklyHours: integer("weekly_hours").notNull(), // Store as hours * 10 for decimal precision
  weeklyBreakdown: text("weekly_breakdown").notNull(), // JSON string of weekly entries
  created: timestamp("created").notNull().defaultNow(),
});

export const insertWeeklyHoursConfigSchema = createInsertSchema(weeklyHoursConfig, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).pick({
  startDate: true,
  endDate: true,
  weeklyHours: true,
  weeklyBreakdown: true,
});

// Practice Hours
export const practiceHours = pgTable("practice_hours", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id"), // Reference to revalidation cycle
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  hours: integer("hours").notNull(),
  workSetting: text("work_setting").notNull(),
  scope: text("scope").notNull(),
  registration: text("registration").notNull(),
  notes: text("notes"),
  weeklyConfigId: integer("weekly_config_id"), // Reference to weekly hours calculation
  created: timestamp("created").notNull().defaultNow(),
});

export const insertPracticeHoursSchema = createInsertSchema(practiceHours, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).pick({
  startDate: true,
  endDate: true,
  hours: true,
  workSetting: true,
  scope: true,
  registration: true,
  notes: true,
});

// CPD Records
export const cpdRecords = pgTable("cpd_records", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id"), // Reference to revalidation cycle
  date: date("date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  hours: integer("hours").notNull(),
  participatory: boolean("participatory").notNull(),
  relevanceToCode: text("relevance_to_code"),
  attachment: text("attachment"),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertCpdRecordSchema = createInsertSchema(cpdRecords, {
  date: z.coerce.date(),
}).pick({
  date: true,
  title: true,
  description: true,
  hours: true,
  participatory: true,
  relevanceToCode: true,
  attachment: true,
});

// Feedback Records
export const feedbackRecords = pgTable("feedback_records", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id"), // Reference to revalidation cycle
  date: date("date").notNull(),
  source: text("source").notNull(),
  content: text("content").notNull(),
  reflection: text("reflection"),
  attachment: text("attachment"),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertFeedbackRecordSchema = createInsertSchema(feedbackRecords, {
  date: z.coerce.date(),
}).pick({
  date: true,
  source: true,
  content: true,
  reflection: true,
  attachment: true,
});

// Reflective Accounts
export const reflectiveAccounts = pgTable("reflective_accounts", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id"), // Reference to revalidation cycle
  date: date("date").notNull(),
  title: text("title").notNull(),
  reflectiveModel: text("reflective_model").notNull().default("Standard"),
  experience: text("experience").notNull(),
  natureOfExperience: text("nature_of_experience").notNull(),
  whatLearned: text("what_learned").notNull(),
  howChanged: text("how_changed").notNull(),
  // Additional fields for other reflective models
  description: text("description"),
  feelings: text("feelings"),
  evaluation: text("evaluation"),
  analysis: text("analysis"),
  conclusion: text("conclusion"),
  actionPlan: text("action_plan"),
  aesthetic: text("aesthetic"),
  personal: text("personal"),
  ethics: text("ethics"),
  empirics: text("empirics"),
  reflexivity: text("reflexivity"),
  codeRelation: text("code_relation").notNull(),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertReflectiveAccountSchema = createInsertSchema(reflectiveAccounts, {
  date: z.coerce.date(),
}).pick({
  date: true,
  title: true,
  reflectiveModel: true,
  experience: true,
  natureOfExperience: true,
  whatLearned: true,
  howChanged: true,
  // Additional reflective model fields
  description: true,
  feelings: true,
  evaluation: true,
  analysis: true,
  conclusion: true,
  actionPlan: true,
  aesthetic: true,
  personal: true,
  ethics: true,
  empirics: true,
  reflexivity: true,
  codeRelation: true,
});

// Reflective Discussion
export const reflectiveDiscussions = pgTable("reflective_discussions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  partnerName: text("partner_name").notNull(),
  partnerNmcPin: text("partner_nmc_pin").notNull(),
  email: text("email"),
  notes: text("notes"),
  completed: boolean("completed").notNull().default(false),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertReflectiveDiscussionSchema = createInsertSchema(reflectiveDiscussions, {
  date: z.coerce.date(),
}).pick({
  date: true,
  partnerName: true,
  partnerNmcPin: true,
  email: true,
  notes: true,
  completed: true,
});

// Health & Character Declaration
export const healthDeclarations = pgTable("health_declarations", {
  id: serial("id").primaryKey(),
  goodHealth: boolean("good_health"),
  healthChanges: text("health_changes"),
  goodCharacter: boolean("good_character"),
  characterChanges: text("character_changes"),
  completed: boolean("completed").notNull().default(false),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertHealthDeclarationSchema = createInsertSchema(healthDeclarations).pick({
  goodHealth: true,
  healthChanges: true,
  goodCharacter: true,
  characterChanges: true,
  completed: true,
});

// Mandatory Training Records
export const trainingRecords = pgTable("training_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  provider: text("provider").notNull(),
  duration: integer("duration").notNull(), // in hours
  category: text("category").notNull(), // e.g., "Mandatory", "Professional Development", "Specialist"
  status: text("status").notNull().default("completed"), // "completed", "in_progress", "expired", "due"
  expiryDate: date("expiry_date"),
  certificateNumber: text("certificate_number"),
  attachment: text("attachment"),
  notes: text("notes"),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertTrainingRecordSchema = createInsertSchema(trainingRecords, {
  date: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
}).pick({
  date: true,
  title: true,
  description: true,
  provider: true,
  duration: true,
  category: true,
  status: true,
  expiryDate: true,
  certificateNumber: true,
  attachment: true,
  notes: true,
});

// Revalidation Confirmation
export const confirmations = pgTable("confirmations", {
  id: serial("id").primaryKey(),
  confirmerName: text("confirmer_name").notNull(),
  confirmerEmail: text("confirmer_email"),
  confirmerNmcPin: text("confirmer_nmc_pin"),
  confirmerRelationship: text("confirmer_relationship").notNull(),
  confirmationDate: date("confirmation_date"),
  completed: boolean("completed").notNull().default(false),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertConfirmationSchema = createInsertSchema(confirmations, {
  confirmationDate: z.coerce.date(),
}).pick({
  confirmerName: true,
  confirmerEmail: true,
  confirmerNmcPin: true,
  confirmerRelationship: true,
  confirmationDate: true,
  completed: true,
});

// Beta Applications
export const betaApplications = pgTable("beta_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  nmcPin: text("nmc_pin").notNull(),
  nursingSpecialty: text("nursing_specialty").notNull(),
  workLocation: text("work_location").notNull(),
  experience: text("experience").notNull(),
  currentChallenges: text("current_challenges").notNull(),
  expectations: text("expectations").notNull(),
  testingAvailability: text("testing_availability").notNull(),
  agreeToTerms: boolean("agree_to_terms").notNull(),
  allowContact: boolean("allow_contact").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertBetaApplicationSchema = createInsertSchema(betaApplications).pick({
  name: true,
  email: true,
  nmcPin: true,
  nursingSpecialty: true,
  workLocation: true,
  experience: true,
  currentChallenges: true,
  expectations: true,
  testingAvailability: true,
  agreeToTerms: true,
  allowContact: true,
});

// Revalidation Cycles Management
export const revalidationCycles = pgTable("revalidation_cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to user
  cycleNumber: integer("cycle_number").notNull(), // Sequential cycle number (1, 2, 3...)
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: text("status").notNull().default("active"), // "active", "completed", "archived"
  submissionDate: timestamp("submission_date"),
  nmcSubmissionReference: text("nmc_submission_reference"),
  
  // Core metrics carried forward from previous cycle
  carryForwardData: text("carry_forward_data"), // JSON of core metrics (role, hours, etc.)
  
  // Archived data for audit purposes (JSON snapshot of all revalidation data)
  archivedData: text("archived_data"),
  
  created: timestamp("created").notNull().defaultNow(),
  updated: timestamp("updated").notNull().defaultNow(),
});

export const insertRevalidationCycleSchema = createInsertSchema(revalidationCycles, {
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  submissionDate: z.coerce.date().optional(),
}).pick({
  userId: true,
  cycleNumber: true,
  startDate: true,
  endDate: true,
  status: true,
  submissionDate: true,
  nmcSubmissionReference: true,
  carryForwardData: true,
  archivedData: true,
});

// Revalidation Submissions (for audit trail)
export const revalidationSubmissions = pgTable("revalidation_submissions", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id").notNull(), // Reference to revalidation cycle
  userId: integer("user_id").notNull(),
  submissionData: text("submission_data").notNull(), // Complete JSON snapshot
  submissionDate: timestamp("submission_date").notNull().defaultNow(),
  nmcReference: text("nmc_reference"),
  status: text("status").notNull().default("submitted"), // "submitted", "accepted", "returned"
  
  // Audit trail
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  created: timestamp("created").notNull().defaultNow(),
});

// Coupon Codes
export const couponCodes = pgTable("coupon_codes", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  planId: text("plan_id").notNull(), // "standard" or "premium" - what plan this coupon awards
  period: text("period").notNull(), // "monthly" or "annual" - billing period for awarded plan
  maxRedemptions: integer("max_redemptions"), // null for unlimited
  currentRedemptions: integer("current_redemptions").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  
  // Enhanced promotional pricing support
  isPromotional: boolean("is_promotional").notNull().default(false), // True for special promotional campaigns
  promotionalPrice: integer("promotional_price"), // Price in pence (e.g., 499 for £4.99)
  promotionalDuration: integer("promotional_duration"), // Duration in months for promotional price
  regularPrice: integer("regular_price"), // Price in pence after promotional period
  stripeCouponId: text("stripe_coupon_id"), // Reference to Stripe coupon for checkout integration
  
  createdBy: integer("created_by"), // Admin user who created it
  created: timestamp("created").notNull().defaultNow(),
});

// Coupon Redemptions (audit trail)
export const couponRedemptions = pgTable("coupon_redemptions", {
  id: serial("id").primaryKey(),
  couponId: integer("coupon_id").notNull(), // Reference to coupon
  userId: integer("user_id").notNull(), // User who redeemed it
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertRevalidationSubmissionSchema = createInsertSchema(revalidationSubmissions, {
  submissionDate: z.coerce.date().optional(),
}).pick({
  cycleId: true,
  userId: true,
  submissionData: true,
  nmcReference: true,
  status: true,
  ipAddress: true,
  userAgent: true,
});

export const insertCouponCodeSchema = createInsertSchema(couponCodes, {
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
}).pick({
  code: true,
  description: true,
  planId: true,
  period: true,
  maxRedemptions: true,
  isActive: true,
  validFrom: true,
  validUntil: true,
  isPromotional: true,
  promotionalPrice: true,
  promotionalDuration: true,
  regularPrice: true,
  stripeCouponId: true,
  createdBy: true,
});

export const insertCouponRedemptionSchema = createInsertSchema(couponRedemptions, {
  redeemedAt: z.coerce.date().optional(),
}).pick({
  couponId: true,
  userId: true,
  ipAddress: true,
  userAgent: true,
});

// Export types for frontend use
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type PracticeHours = typeof practiceHours.$inferSelect;
export type InsertPracticeHours = z.infer<typeof insertPracticeHoursSchema>;

export type CpdRecord = typeof cpdRecords.$inferSelect;
export type InsertCpdRecord = z.infer<typeof insertCpdRecordSchema>;

export type FeedbackRecord = typeof feedbackRecords.$inferSelect;
export type InsertFeedbackRecord = z.infer<typeof insertFeedbackRecordSchema>;

export type ReflectiveAccount = typeof reflectiveAccounts.$inferSelect;
export type InsertReflectiveAccount = z.infer<typeof insertReflectiveAccountSchema>;

export type ReflectiveDiscussion = typeof reflectiveDiscussions.$inferSelect;
export type InsertReflectiveDiscussion = z.infer<typeof insertReflectiveDiscussionSchema>;

export type HealthDeclaration = typeof healthDeclarations.$inferSelect;
export type InsertHealthDeclaration = z.infer<typeof insertHealthDeclarationSchema>;

export type TrainingRecord = typeof trainingRecords.$inferSelect;
export type InsertTrainingRecord = z.infer<typeof insertTrainingRecordSchema>;

export type Confirmation = typeof confirmations.$inferSelect;
export type InsertConfirmation = z.infer<typeof insertConfirmationSchema>;

export type BetaApplication = typeof betaApplications.$inferSelect;
export type InsertBetaApplication = z.infer<typeof insertBetaApplicationSchema>;

export type RevalidationCycle = typeof revalidationCycles.$inferSelect;
export type InsertRevalidationCycle = z.infer<typeof insertRevalidationCycleSchema>;

export type RevalidationSubmission = typeof revalidationSubmissions.$inferSelect;
export type InsertRevalidationSubmission = z.infer<typeof insertRevalidationSubmissionSchema>;

export type CouponCode = typeof couponCodes.$inferSelect;
export type InsertCouponCode = z.infer<typeof insertCouponCodeSchema>;

export type CouponRedemption = typeof couponRedemptions.$inferSelect;
export type InsertCouponRedemption = z.infer<typeof insertCouponRedemptionSchema>;

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;

// Define NHS Revalidation Status types
export const RevalidationStatusEnum = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ATTENTION: "attention_needed",
} as const;

export type RevalidationStatus = keyof typeof RevalidationStatusEnum;

// Define The Code sections for reflective accounts
export const CodeSectionsEnum = {
  PRIORITISE_PEOPLE: "Prioritise people",
  PRACTISE_EFFECTIVELY: "Practise effectively",
  PRESERVE_SAFETY: "Preserve safety",
  PROMOTE_PROFESSIONALISM: "Promote professionalism and trust",
} as const;

export type CodeSection = typeof CodeSectionsEnum[keyof typeof CodeSectionsEnum];

// Define different reflective models for nursing reflection
export const ReflectiveModelEnum = {
  STANDARD: "Standard NMC",
  GIBBS: "Gibbs Reflective Cycle",
  JOHNS: "Johns' Model of Reflection",
  DRISCOLL: "Driscoll's What? Model",
  KOLB: "Kolb's Learning Cycle",
  ROLFE: "Rolfe's Framework",
} as const;

export type ReflectiveModel = typeof ReflectiveModelEnum[keyof typeof ReflectiveModelEnum];

// Define training categories
export const TrainingCategoryEnum = {
  MANDATORY: "Mandatory",
  PROFESSIONAL_DEVELOPMENT: "Professional Development", 
  SPECIALIST: "Specialist",
  CLINICAL_SKILLS: "Clinical Skills",
  HEALTH_SAFETY: "Health & Safety",
  LEADERSHIP: "Leadership",
  RESEARCH: "Research",
  OTHER: "Other",
} as const;

export type TrainingCategory = typeof TrainingCategoryEnum[keyof typeof TrainingCategoryEnum];

// Define training status
export const TrainingStatusEnum = {
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  EXPIRED: "expired",
  DUE: "due",
} as const;

export type TrainingStatus = typeof TrainingStatusEnum[keyof typeof TrainingStatusEnum];

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorRole: text("author_role"),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  created: timestamp("created").notNull().defaultNow(),
  updated: timestamp("updated").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts, {
  publishedAt: z.coerce.date().optional(),
}).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  author: true,
  authorRole: true,
  featuredImage: true,
  category: true,
  tags: true,
  published: true,
  publishedAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Blog Categories
export const BlogCategoryEnum = {
  REVALIDATION_TIPS: "Revalidation Tips",
  NMC_UPDATES: "NMC Updates",
  CPD_IDEAS: "CPD Ideas",
  NURSING_PRACTICE: "Nursing Practice",
  REFLECTIVE_PRACTICE: "Reflective Practice",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
  NEWS: "News & Updates",
  GUIDES: "How-to Guides",
} as const;

export type BlogCategory = typeof BlogCategoryEnum[keyof typeof BlogCategoryEnum];
