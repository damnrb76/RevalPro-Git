// Subscription plans definition for RevalPro

export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  STANDARD: "standard",
  PREMIUM: "premium",
} as const;

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];

export interface PlanFeature {
  title: string;
  included: boolean;
  limit?: number | string;
  highlighted?: boolean;
}

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  stripePriceId: {
    monthly: string | null;
    annual: string | null;
  };
  features: PlanFeature[];
  recommended?: boolean;
  mostPopular?: boolean;
}

// Subscription plan details with features and pricing
export const PLAN_DETAILS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    id: "free",
    name: "Free",
    description: "Essential tools for NMC revalidation",
    price: {
      monthly: 0,
      annual: 0,
    },
    stripePriceId: {
      monthly: null,
      annual: null,
    },
    features: [
      { title: "Track practice hours", included: true },
      { title: "Basic CPD logging", included: true },
      { title: "Training records management", included: true, highlighted: true },
      { title: "Up to 3 reflective accounts", included: true, limit: "3" },
      { title: "Basic PDF export", included: true },
      { title: "NMC revalidation guidance", included: true },
      { title: "Local data storage", included: true },
      { title: "AI-assisted reflection templates", included: false },
      { title: "Unlimited reflective accounts", included: false },
      { title: "Advanced PDF templates", included: false },
      { title: "No reminders or notifications", included: false },
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    description: "Everything you need for a smooth revalidation",
    price: {
      monthly: 4.99,
      annual: 49.99, // Save almost £10 - equivalent to ~2 months free
    },
    stripePriceId: {
      monthly: "standard_monthly_gbp", // Using lookup key
      annual: "standard_annual_gbp", // Using lookup key
    },
    mostPopular: true,
    features: [
      { title: "Track practice hours", included: true },
      { title: "Comprehensive CPD logging", included: true },
      { title: "Training records management", included: true },
      { title: "Unlimited reflective accounts", included: true, highlighted: true },
      { title: "Full PDF export suite", included: true },
      { title: "NMC revalidation guidance", included: true },
      { title: "AI-assisted reflection templates", included: true, highlighted: true },
      { title: "Local data storage", included: true },
      { title: "Feedback collection tools", included: true, highlighted: true },
      { title: "Infographic summary generator", included: true },
      { title: "Weekly hours calculator", included: true },
      { title: "Smart revalidation reminders (6mo, 3mo, 60 days, 30 days)", included: true, highlighted: true },
      { title: "Weekly progress check notifications", included: true },
      { title: "CPD activity reminders", included: true },
      { title: "Browser notification alerts", included: true },
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    description: "The ultimate revalidation companion for professionals",
    price: {
      monthly: 9.99,
      annual: 89.99, // Save nearly £30 - equivalent to ~3 months free
    },
    stripePriceId: {
      monthly: "premium_monthly_gbp", // Using lookup key
      annual: "premium_annual_gbp", // Using lookup key
    },
    recommended: true,
    features: [
      { title: "Track practice hours", included: true },
      { title: "Comprehensive CPD logging", included: true },
      { title: "Training records management", included: true },
      { title: "Unlimited reflective accounts", included: true },
      { title: "Advanced PDF export templates", included: true, highlighted: true },
      { title: "NMC revalidation guidance", included: true },
      { title: "AI-assisted reflection templates", included: true },
      { title: "Advanced AI revalidation assistant", included: true, highlighted: true },
      { title: "Local data storage & backup", included: true },
      { title: "Feedback collection & analysis", included: true, highlighted: true },
      { title: "Weekly hours calculator", included: true },
      { title: "AI-powered adaptive reminder scheduling", included: true, highlighted: true },
      { title: "Personalized notification content by specialty", included: true, highlighted: true },
      { title: "Advanced deadline tracking & escalation alerts", included: true },
      { title: "Smart reflection writing prompts", included: true },
      { title: "Progress analytics & completion rate alerts", included: true },
      { title: "Rich browser notifications with action buttons", included: true },
      { title: "Health declaration management", included: true },
      { title: "Revalidation cycle tracking", included: true },
      { title: "Confirmation statements", included: true },
    ],
  },
};

// Helper function to get plan details
export function getPlanDetails(plan: SubscriptionPlan): PlanDetails {
  return PLAN_DETAILS[plan];
}

// Helper function to get price in formatted currency
export function formatPrice(price: number): string {
  return price === 0
    ? "Free"
    : new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 2,
      }).format(price);
}