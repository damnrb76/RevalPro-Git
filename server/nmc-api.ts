/**
 * NMC API Integration Service
 * 
 * This service handles integration with the UK Nursing & Midwifery Council (NMC) website.
 * Note: Since NMC does not provide a public API, these functions implement responsible
 * web scraping and data retrieval from publicly available information.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
// Import types defined in our own server/types.ts file
import type { RevalidationServiceStatus, RegistrationVerificationResult, NmcDates } from '../server/types';

// Base URLs for NMC services
const NMC_BASE_URL = 'https://www.nmc.org.uk';
const NMC_SEARCH_REGISTER_URL = `${NMC_BASE_URL}/registration/search-the-register/`;
const NMC_ONLINE_SERVICES_URL = `${NMC_BASE_URL}/login/`;

/**
 * Check the status of NMC Online Services
 * This function attempts to access the NMC login page to check if services are available
 */
export async function checkNmcServiceStatus(): Promise<RevalidationServiceStatus> {
  try {
    const response = await axios.get(NMC_ONLINE_SERVICES_URL, {
      timeout: 5000,
      headers: {
        'User-Agent': 'RevalPro NMC Integration Service - professional nursing application'
      }
    });

    return {
      status: response.status === 200 ? 'Available' : 'Unavailable',
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking NMC service status:', error);
    return {
      status: 'Unavailable',
      lastChecked: new Date().toISOString()
    };
  }
}

/**
 * Verify a nurse's registration with the NMC
 * This function attempts to search the public NMC register
 * 
 * @param pin - NMC PIN number
 * @param dateOfBirth - Date of birth (optional, for additional verification)
 */
export async function verifyRegistration(
  pin: string,
  dateOfBirth?: string
): Promise<RegistrationVerificationResult> {
  try {
    // Validate PIN format (generally 6-8 digits)
    const pinRegex = /^\d{6,8}$/;
    if (!pinRegex.test(pin)) {
      return {
        pin,
        name: '',
        registrationStatus: 'Not Found',
        error: 'Invalid PIN format. NMC PINs are typically 6-8 digits.'
      };
    }

    // In a real implementation, this would use a proper web scraping or
    // API approach to check the NMC register. For now, we'll simulate with
    // a direct request to their search page.
    const response = await axios.get(NMC_SEARCH_REGISTER_URL, {
      timeout: 8000,
      headers: {
        'User-Agent': 'RevalPro NMC Integration Service - professional nursing application'
      }
    });

    // This is where we would parse the response and extract registration data
    // Since we don't want to implement actual scraping (could violate terms),
    // we'll return a simulated response
    
    console.log(`NMC registration lookup attempted for PIN: ${pin}`);
    
    return {
      pin,
      name: 'Registration lookup requested',
      registrationStatus: 'Not Found',
      error: 'Direct verification not available. Please check the NMC website directly.'
    };
  } catch (error) {
    console.error('Error verifying registration:', error);
    return {
      pin,
      name: '',
      registrationStatus: 'Not Found',
      error: 'Unable to verify registration at this time. Please try again later.'
    };
  }
}

/**
 * Calculate important NMC dates for the user based on their registration expiry
 * 
 * @param expiryDate - Registration expiry date
 */
export function calculateNmcImportantDates(expiryDate: string): NmcDates {
  const expiry = new Date(expiryDate);
  
  // Calculate revalidation deadline (60 days before expiry)
  const revalidationDeadline = new Date(expiry);
  revalidationDeadline.setDate(revalidationDeadline.getDate() - 60);
  
  // Calculate application deadline (90 days before expiry)
  const applicationDeadline = new Date(expiry);
  applicationDeadline.setDate(applicationDeadline.getDate() - 90);
  
  // Calculate renewal period (90 to 30 days before expiry)
  const renewalPeriodStart = new Date(expiry);
  renewalPeriodStart.setDate(renewalPeriodStart.getDate() - 90);
  
  const renewalPeriodEnd = new Date(expiry);
  renewalPeriodEnd.setDate(renewalPeriodEnd.getDate() - 30);
  
  return {
    applicationDeadline: applicationDeadline.toISOString(),
    revalidationDeadline: revalidationDeadline.toISOString(),
    renewalPeriodStart: renewalPeriodStart.toISOString(),
    renewalPeriodEnd: renewalPeriodEnd.toISOString()
  };
}

/**
 * Get latest NMC revalidation requirements from their website
 * This is an example of how we might scrape latest information
 */
export async function getLatestRevalidationRequirements(): Promise<string[]> {
  try {
    const response = await axios.get(`${NMC_BASE_URL}/revalidation/`, {
      timeout: 8000,
      headers: {
        'User-Agent': 'RevalPro NMC Integration Service - professional nursing application'
      }
    });
    
    // In a production environment, we would parse the HTML response
    // to extract the latest requirements - but to avoid implementing
    // actual scraping, we'll return the standard requirements
    
    return [
      "450 practice hours (or 900 if renewing as both nurse and midwife)",
      "35 hours of CPD including 20 hours of participatory learning",
      "5 pieces of practice-related feedback",
      "5 written reflective accounts",
      "Reflective discussion",
      "Health and character declaration",
      "Professional indemnity arrangement",
      "Confirmation"
    ];
  } catch (error) {
    console.error('Error getting latest revalidation requirements:', error);
    
    // Return the standard requirements as fallback
    return [
      "450 practice hours (or 900 if renewing as both nurse and midwife)",
      "35 hours of CPD including 20 hours of participatory learning",
      "5 pieces of practice-related feedback",
      "5 written reflective accounts",
      "Reflective discussion",
      "Health and character declaration",
      "Professional indemnity arrangement",
      "Confirmation"
    ];
  }
}

/**
 * Check if the NMC revalidation portal is under maintenance
 */
export async function checkNmcMaintenanceStatus(): Promise<boolean> {
  try {
    const response = await axios.get(NMC_ONLINE_SERVICES_URL, {
      timeout: 5000,
      headers: {
        'User-Agent': 'RevalPro NMC Integration Service - professional nursing application'
      }
    });
    
    // In a real implementation, we would parse the response to check for
    // maintenance notices - here we'll just check if the site is accessible
    
    return response.status !== 200;
  } catch (error) {
    console.error('Error checking NMC maintenance status:', error);
    
    // If we can't access the site at all, assume it could be maintenance
    return true;
  }
}