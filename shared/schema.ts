import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  created: timestamp("created").notNull().defaultNow(),
  
  // Subscription fields
  currentPlan: text("current_plan").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  subscriptionPeriod: text("subscription_period"),  // "monthly" or "annual"
  subscriptionEndDate: timestamp("subscription_end_date"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// User Profile
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  registrationNumber: text("registration_number").notNull(),
  expiryDate: date("expiry_date").notNull(),
  email: text("email"),
  profileImage: text("profile_image"),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  expiryDate: z.coerce.date(),
}).pick({
  name: true,
  registrationNumber: true,
  expiryDate: true,
  email: true,
  profileImage: true,
});

// Practice Hours
export const practiceHours = pgTable("practice_hours", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  hours: integer("hours").notNull(),
  workSetting: text("work_setting").notNull(),
  scope: text("scope").notNull(),
  notes: text("notes"),
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
  notes: true,
});

// CPD Records
export const cpdRecords = pgTable("cpd_records", {
  id: serial("id").primaryKey(),
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
  date: date("date").notNull(),
  title: text("title").notNull(),
  experience: text("experience").notNull(),
  natureOfExperience: text("nature_of_experience").notNull(),
  whatLearned: text("what_learned").notNull(),
  howChanged: text("how_changed").notNull(),
  codeRelation: text("code_relation").notNull(),
  created: timestamp("created").notNull().defaultNow(),
});

export const insertReflectiveAccountSchema = createInsertSchema(reflectiveAccounts, {
  date: z.coerce.date(),
}).pick({
  date: true,
  title: true,
  experience: true,
  natureOfExperience: true,
  whatLearned: true,
  howChanged: true,
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

export type Confirmation = typeof confirmations.$inferSelect;
export type InsertConfirmation = z.infer<typeof insertConfirmationSchema>;

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
