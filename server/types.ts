/**
 * Server-side type definitions for the RevalPro application
 */

/**
 * Interface for NMC registration verification response
 */
export interface RegistrationVerificationResult {
  pin: string;
  name: string;
  registrationStatus: 'Registered' | 'Lapsed' | 'Not Found';
  expiryDate?: string;
  qualifications?: string[];
  error?: string;
}



/**
 * Interface for NMC important dates
 */
export interface NmcDates {
  applicationDeadline?: string;
  revalidationDeadline?: string;
  renewalPeriodStart?: string;
  renewalPeriodEnd?: string;
}

/**
 * Interface for NMC guidance document
 */
export interface NmcGuidance {
  title: string;
  url: string;
  lastUpdated?: string;
  keyPoints?: string[];
}

/**
 * Interface for FAQ items
 */
export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

/**
 * Interface for NMC Code section
 */
export interface NmcCodeSection {
  id: string;
  title: string;
  description: string;
  subsections?: {
    id: string;
    title: string;
    points: string[];
  }[];
}