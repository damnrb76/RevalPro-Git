import { apiRequest } from "./queryClient";

/**
 * NMC Integration Service
 * 
 * This service handles integration with the UK Nursing & Midwifery Council (NMC) website
 * Note: NMC does not provide a public API, so this uses a server-side proxy
 * to access their public services and information.
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
 * Verify a nurse's registration with the NMC
 * 
 * @param pin - NMC PIN number
 * @param dateOfBirth - Date of birth (optional, for additional verification)
 */
export async function verifyRegistration(
  pin: string, 
  dateOfBirth?: string
): Promise<RegistrationVerificationResult> {
  try {
    const response = await apiRequest('POST', '/api/nmc/verify-registration', {
      pin,
      dateOfBirth
    });
    
    return await response.json();
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
 * Get important NMC dates for the user based on their registration expiry
 * 
 * @param expiryDate - Registration expiry date
 */
export async function getNmcImportantDates(expiryDate: string): Promise<NmcDates> {
  try {
    const response = await apiRequest('POST', '/api/nmc/important-dates', {
      expiryDate
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting NMC dates:', error);
    
    // Calculate fallback dates based on expiry date
    const expiry = new Date(expiryDate);
    const revalidationDeadline = new Date(expiry);
    revalidationDeadline.setDate(revalidationDeadline.getDate() - 60); // 60 days before expiry
    
    const applicationDeadline = new Date(expiry);
    applicationDeadline.setDate(applicationDeadline.getDate() - 90); // 90 days before expiry
    
    const renewalPeriodStart = new Date(expiry);
    renewalPeriodStart.setDate(renewalPeriodStart.getDate() - 90); // 90 days before expiry
    
    const renewalPeriodEnd = new Date(expiry);
    renewalPeriodEnd.setDate(renewalPeriodEnd.getDate() - 30); // 30 days before expiry
    
    return {
      applicationDeadline: applicationDeadline.toISOString(),
      revalidationDeadline: revalidationDeadline.toISOString(),
      renewalPeriodStart: renewalPeriodStart.toISOString(),
      renewalPeriodEnd: renewalPeriodEnd.toISOString()
    };
  }
}

/**
 * Get direct links to NMC online services
 */
export function getNmcServiceLinks() {
  return {
    login: 'https://www.nmc.org.uk/login/',
    register: 'https://www.nmc.org.uk/registration/joining-the-register/',
    revalidation: 'https://www.nmc.org.uk/revalidation/',
    searchRegister: 'https://www.nmc.org.uk/registration/search-the-register/',
    standards: 'https://www.nmc.org.uk/standards/',
    theCode: 'https://www.nmc.org.uk/standards/code/',
    contact: 'https://www.nmc.org.uk/contact-us/'
  };
}