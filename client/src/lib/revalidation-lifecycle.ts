// Revalidation Lifecycle Management Service
// Handles automatic cycle creation, data archiving, and audit retrieval

import { format, addYears, isAfter, isBefore } from 'date-fns';

export interface RevalidationCycleData {
  id?: number;
  userId: number;
  cycleNumber: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'archived';
  submissionDate?: Date;
  nmcSubmissionReference?: string;
  carryForwardData?: string; // JSON of core metrics
  archivedData?: string; // Complete data snapshot
}

export interface CoreMetrics {
  jobTitle: string;
  weeklyHours: number;
  workSetting: string;
  scope: string;
  registration: string;
  registrationNumber: string;
  expiryDate: Date;
}

export interface RevalidationSnapshot {
  cycleInfo: RevalidationCycleData;
  practiceHours: any[];
  cpdRecords: any[];
  feedbackRecords: any[];
  reflectiveAccounts: any[];
  reflectiveDiscussions: any[];
  healthDeclarations: any[];
  confirmations: any[];
  trainingRecords: any[];
  userProfile: any;
  submissionTimestamp: string;
}

export class RevalidationLifecycleService {
  
  /**
   * Initialize a new revalidation cycle for a user
   */
  static async initializeNewCycle(userId: number, coreMetrics: CoreMetrics): Promise<RevalidationCycleData> {
    // Get the last cycle to determine the next cycle number
    const lastCycle = await this.getLastCycle(userId);
    const cycleNumber = lastCycle ? lastCycle.cycleNumber + 1 : 1;
    
    // NMC revalidation is every 3 years
    const startDate = lastCycle ? new Date(lastCycle.endDate) : new Date();
    const endDate = addYears(startDate, 3);
    
    const newCycle: RevalidationCycleData = {
      userId,
      cycleNumber,
      startDate,
      endDate,
      status: 'active',
      carryForwardData: JSON.stringify(coreMetrics)
    };
    
    // Save to database via API
    const response = await fetch('/api/revalidation-cycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCycle)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create new revalidation cycle');
    }
    
    return await response.json();
  }
  
  /**
   * Get the current active cycle for a user
   */
  static async getCurrentCycle(userId: number): Promise<RevalidationCycleData | null> {
    const response = await fetch(`/api/revalidation-cycles/current/${userId}`);
    if (!response.ok) return null;
    return await response.json();
  }
  
  /**
   * Get the last completed cycle for a user
   */
  static async getLastCycle(userId: number): Promise<RevalidationCycleData | null> {
    const response = await fetch(`/api/revalidation-cycles/last/${userId}`);
    if (!response.ok) return null;
    return await response.json();
  }
  
  /**
   * Get all cycles for a user (for audit purposes)
   */
  static async getAllCycles(userId: number): Promise<RevalidationCycleData[]> {
    const response = await fetch(`/api/revalidation-cycles/all/${userId}`);
    if (!response.ok) return [];
    return await response.json();
  }
  
  /**
   * Complete current cycle and create comprehensive data snapshot
   */
  static async completeCycle(userId: number, nmcReference?: string): Promise<RevalidationSnapshot> {
    const currentCycle = await this.getCurrentCycle(userId);
    if (!currentCycle) {
      throw new Error('No active revalidation cycle found');
    }
    
    // Gather all revalidation data for this cycle
    const snapshot = await this.createDataSnapshot(currentCycle.id!, userId);
    
    // Update cycle status
    const updateData = {
      status: 'completed' as const,
      submissionDate: new Date(),
      nmcSubmissionReference: nmcReference,
      archivedData: JSON.stringify(snapshot)
    };
    
    await fetch(`/api/revalidation-cycles/${currentCycle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    
    // Create submission record for audit trail
    await this.createSubmissionRecord(currentCycle.id!, userId, snapshot, nmcReference);
    
    return snapshot;
  }
  
  /**
   * Automatically start new cycle after completion
   */
  static async startNewCycleAfterCompletion(userId: number): Promise<RevalidationCycleData> {
    const completedCycle = await this.getLastCycle(userId);
    if (!completedCycle || !completedCycle.carryForwardData) {
      throw new Error('Cannot start new cycle: no completed cycle with carry-forward data');
    }
    
    // Parse core metrics from completed cycle
    const coreMetrics: CoreMetrics = JSON.parse(completedCycle.carryForwardData);
    
    // Update expiry date for next cycle (add 3 years)
    coreMetrics.expiryDate = addYears(coreMetrics.expiryDate, 3);
    
    // Initialize new cycle with carried forward metrics
    return await this.initializeNewCycle(userId, coreMetrics);
  }
  
  /**
   * Create comprehensive data snapshot for archiving
   */
  private static async createDataSnapshot(cycleId: number, userId: number): Promise<RevalidationSnapshot> {
    const [
      practiceHours,
      cpdRecords,
      feedbackRecords,
      reflectiveAccounts,
      reflectiveDiscussions,
      healthDeclarations,
      confirmations,
      trainingRecords,
      userProfile
    ] = await Promise.all([
      this.fetchData(`/api/practice-hours?cycleId=${cycleId}`),
      this.fetchData(`/api/cpd-records?cycleId=${cycleId}`),
      this.fetchData(`/api/feedback-records?cycleId=${cycleId}`),
      this.fetchData(`/api/reflective-accounts?cycleId=${cycleId}`),
      this.fetchData('/api/reflective-discussions'),
      this.fetchData('/api/health-declarations'),
      this.fetchData('/api/confirmations'),
      this.fetchData('/api/training-records'),
      this.fetchData('/api/user-profile')
    ]);
    
    const cycle = await this.getCurrentCycle(userId);
    
    return {
      cycleInfo: cycle!,
      practiceHours,
      cpdRecords,
      feedbackRecords,
      reflectiveAccounts,
      reflectiveDiscussions,
      healthDeclarations,
      confirmations,
      trainingRecords,
      userProfile,
      submissionTimestamp: new Date().toISOString()
    };
  }
  
  /**
   * Create submission record for audit trail
   */
  private static async createSubmissionRecord(
    cycleId: number,
    userId: number,
    snapshot: RevalidationSnapshot,
    nmcReference?: string
  ): Promise<void> {
    const submissionData = {
      cycleId,
      userId,
      submissionData: JSON.stringify(snapshot),
      nmcReference,
      ipAddress: await this.getUserIP(),
      userAgent: navigator.userAgent
    };
    
    await fetch('/api/revalidation-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    });
  }
  
  /**
   * Retrieve archived data for audit purposes
   */
  static async getArchivedData(cycleId: number): Promise<RevalidationSnapshot | null> {
    const response = await fetch(`/api/revalidation-cycles/${cycleId}/archived-data`);
    if (!response.ok) return null;
    
    const cycle = await response.json();
    if (!cycle.archivedData) return null;
    
    return JSON.parse(cycle.archivedData);
  }
  
  /**
   * Export archived data for audit/compliance
   */
  static async exportArchivedData(cycleId: number, format: 'json' | 'pdf' = 'json'): Promise<void> {
    const snapshot = await this.getArchivedData(cycleId);
    if (!snapshot) {
      throw new Error('No archived data found for this cycle');
    }
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revalidation-cycle-${cycleId}-audit-data.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Generate PDF report (would require PDF generation library)
      throw new Error('PDF export not yet implemented');
    }
  }
  
  /**
   * Check if cycle is nearing expiry (within 6 months)
   */
  static isCycleNearingExpiry(cycle: RevalidationCycleData): boolean {
    const sixMonthsFromNow = addYears(new Date(), 0.5);
    return isAfter(sixMonthsFromNow, new Date(cycle.endDate));
  }
  
  /**
   * Check if cycle has expired
   */
  static isCycleExpired(cycle: RevalidationCycleData): boolean {
    return isAfter(new Date(), new Date(cycle.endDate));
  }
  
  /**
   * Helper method to fetch data
   */
  private static async fetchData(url: string): Promise<any[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      return await response.json();
    } catch {
      return [];
    }
  }
  
  /**
   * Get user's IP address for audit trail
   */
  private static async getUserIP(): Promise<string> {
    try {
      const response = await fetch('/api/user-ip');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

// Utility functions for cycle management
export const RevalidationUtils = {
  
  /**
   * Format cycle dates for display
   */
  formatCyclePeriod(cycle: RevalidationCycleData): string {
    return `${format(new Date(cycle.startDate), 'MMM d, yyyy')} - ${format(new Date(cycle.endDate), 'MMM d, yyyy')}`;
  },
  
  /**
   * Get cycle status with descriptive text
   */
  getCycleStatusText(cycle: RevalidationCycleData): string {
    switch (cycle.status) {
      case 'active': return 'Currently Active';
      case 'completed': return 'Completed & Submitted';
      case 'archived': return 'Archived';
      default: return 'Unknown';
    }
  },
  
  /**
   * Calculate remaining time in cycle
   */
  getRemainingTime(cycle: RevalidationCycleData): string {
    const now = new Date();
    const endDate = new Date(cycle.endDate);
    
    if (isBefore(endDate, now)) {
      return 'Expired';
    }
    
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      return `${years} year${years > 1 ? 's' : ''}, ${remainingDays} days`;
    } else if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  }
};