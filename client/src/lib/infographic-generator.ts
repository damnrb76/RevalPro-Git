import { UserProfile, PracticeHours, CpdRecord, FeedbackRecord, ReflectiveAccount, RevalidationStatusEnum } from '@shared/schema';
import { getDaysUntil, formatDateShort, formatDateFull } from './date-utils';
import { RevalidationStatus } from '@shared/schema';

// Types for revalidation summary data
export interface RevalidationSummaryData {
  userProfile: UserProfile | null;
  practiceHours: PracticeHours[];
  cpdRecords: CpdRecord[];
  feedbackRecords: FeedbackRecord[];
  reflectiveAccounts: ReflectiveAccount[];
  hasHealthDeclaration: boolean;
  hasConfirmation: boolean;
  lastUpdated: Date;
}

export interface RevalidationProgress {
  practiceHours: {
    required: number;
    completed: number;
    percentage: number;
  };
  cpd: {
    required: number;
    completed: number;
    percentage: number;
  };
  feedback: {
    required: number;
    completed: number;
    percentage: number;
  };
  reflectiveAccounts: {
    required: number;
    completed: number;
    percentage: number;
  };
  healthDeclaration: boolean;
  confirmation: boolean;
  overallPercentage: number;
  status: RevalidationStatus;
}

/**
 * Calculates revalidation progress from summary data
 */
export function calculateProgress(data: RevalidationSummaryData): RevalidationProgress {
  // NMC Requirements
  // Function to get required practice hours based on registration type
  const getRequiredPracticeHours = (registrationType?: string): number => {
    if (registrationType === "Registered Nurse and Midwife (including Registered Nurse/SCPHN and Midwife/SCPHN)") {
      return 900; // Double requirement for combined registration
    }
    return 450; // Standard requirement
  };
  
  const REQUIRED_CPD_HOURS = 35;
  const REQUIRED_FEEDBACK_RECORDS = 5;
  const REQUIRED_REFLECTIVE_ACCOUNTS = 5;
  
  // Determine registration type from practice hours records (use most recent if multiple)
  const mostRecentRegistration = data.practiceHours.length > 0 
    ? data.practiceHours[data.practiceHours.length - 1].registration 
    : undefined;
  
  const REQUIRED_PRACTICE_HOURS = getRequiredPracticeHours(mostRecentRegistration);
  
  // Calculate total practice hours
  const totalPracticeHours = data.practiceHours.reduce((sum, record) => sum + record.hours, 0);
  const practiceHoursPercentage = Math.min(100, (totalPracticeHours / REQUIRED_PRACTICE_HOURS) * 100);
  
  // Calculate total CPD hours
  const totalCpdHours = data.cpdRecords.reduce((sum, record) => sum + record.hours, 0);
  const cpdPercentage = Math.min(100, (totalCpdHours / REQUIRED_CPD_HOURS) * 100);
  
  // Calculate feedback records
  const feedbackCount = data.feedbackRecords.length;
  const feedbackPercentage = Math.min(100, (feedbackCount / REQUIRED_FEEDBACK_RECORDS) * 100);
  
  // Calculate reflective accounts
  const reflectiveCount = data.reflectiveAccounts.length;
  const reflectivePercentage = Math.min(100, (reflectiveCount / REQUIRED_REFLECTIVE_ACCOUNTS) * 100);
  
  // Calculate overall percentage
  const totalPercentage = [
    practiceHoursPercentage, 
    cpdPercentage, 
    feedbackPercentage, 
    reflectivePercentage,
    data.hasHealthDeclaration ? 100 : 0,
    data.hasConfirmation ? 100 : 0
  ].reduce((sum, value) => sum + value, 0) / 6;
  
  // Determine status
  let status: RevalidationStatus = 'NOT_STARTED';
  if (totalPercentage > 0) {
    status = 'IN_PROGRESS';
  }
  if (totalPercentage === 100) {
    status = 'COMPLETED';
  }
  if (data.userProfile && getDaysUntil(data.userProfile.expiryDate) < 60 && totalPercentage < 100) {
    status = 'ATTENTION';
  }
  
  return {
    practiceHours: {
      required: REQUIRED_PRACTICE_HOURS,
      completed: totalPracticeHours,
      percentage: practiceHoursPercentage
    },
    cpd: {
      required: REQUIRED_CPD_HOURS,
      completed: totalCpdHours,
      percentage: cpdPercentage
    },
    feedback: {
      required: REQUIRED_FEEDBACK_RECORDS,
      completed: feedbackCount,
      percentage: feedbackPercentage
    },
    reflectiveAccounts: {
      required: REQUIRED_REFLECTIVE_ACCOUNTS,
      completed: reflectiveCount,
      percentage: reflectivePercentage
    },
    healthDeclaration: data.hasHealthDeclaration,
    confirmation: data.hasConfirmation,
    overallPercentage: Math.round(totalPercentage),
    status
  };
}

/**
 * Generate a canvas with the revalidation summary infographic
 */
export function generateInfographicCanvas(
  data: RevalidationSummaryData, 
  progress: RevalidationProgress
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas dimensions (A4 like proportions at 96 DPI)
    canvas.width = 800;
    canvas.height = 1131;
    
    // Background and styling constants
    const COLORS = {
      background: '#ffffff',
      primary: '#0072CE', // NHS Blue
      secondary: '#41B6E6', // NHS Light Blue
      accent: '#AE2573', // NHS Purple
      green: '#007F3B', // NHS Green
      yellow: '#FFB81C', // NHS Yellow
      red: '#DA291C', // NHS Red
      gray: '#768692', // NHS Grey
      lightGray: '#E8EDEE', // NHS Light Grey
      text: '#212B32', // NHS Black
      textLight: '#425563' // NHS Dark Grey
    };
    
    const MARGINS = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    };
    
    // Helper functions for drawing
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };
    
    const drawProgressBar = (x: number, y: number, width: number, height: number, percentage: number) => {
      // Background
      drawRoundedRect(x, y, width, height, height / 2, COLORS.lightGray);
      
      // Progress
      if (percentage > 0) {
        const progressWidth = (percentage / 100) * width;
        drawRoundedRect(x, y, progressWidth, height, height / 2, getProgressColor(percentage));
      }
      
      // Percentage text
      ctx.fillStyle = percentage > 70 ? '#ffffff' : COLORS.text;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      const textX = x + (percentage / 100) * width / 2;
      if (percentage > 5) {
        ctx.fillText(Math.round(percentage) + '%', textX, y + height / 2 + 5);
      }
    };
    
    const getProgressColor = (percentage: number) => {
      if (percentage < 25) return COLORS.red;
      if (percentage < 70) return COLORS.yellow;
      return COLORS.green;
    };
    
    // 1. Fill background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw header background
    drawRoundedRect(MARGINS.left, MARGINS.top, canvas.width - MARGINS.left - MARGINS.right, 150, 10, COLORS.primary);
    
    // 3. Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NMC Revalidation Summary', canvas.width / 2, MARGINS.top + 50);
    
    // 4. Add subtitle with date
    const today = formatDateFull(new Date());
    ctx.font = '18px Arial';
    ctx.fillText('Generated on ' + today, canvas.width / 2, MARGINS.top + 90);
    
    // Add user info if available
    let yPos = MARGINS.top + 200;
    if (data.userProfile) {
      ctx.fillStyle = COLORS.text;
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Personal Information', MARGINS.left, yPos);
      
      yPos += 40;
      
      // Add user details
      ctx.font = '16px Arial';
      ctx.fillStyle = COLORS.textLight;
      
      const infoItems = [
        { label: 'Name', value: data.userProfile.name },
        { label: 'NMC PIN', value: data.userProfile.registrationNumber },
        { label: 'Expiry Date', value: formatDateFull(data.userProfile.expiryDate) },
        { label: 'Days Remaining', value: getDaysUntil(data.userProfile.expiryDate) + ' days' }
      ];
      
      infoItems.forEach((item, index) => {
        ctx.fillStyle = COLORS.textLight;
        ctx.fillText(item.label + ':', MARGINS.left, yPos + (index * 30));
        ctx.fillStyle = COLORS.text;
        ctx.font = 'bold 16px Arial';
        ctx.fillText(item.value, MARGINS.left + 150, yPos + (index * 30));
      });
      
      yPos += 150;
    }
    
    // 5. Draw overall progress section
    drawRoundedRect(MARGINS.left, yPos, canvas.width - MARGINS.left - MARGINS.right, 100, 10, COLORS.lightGray);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Overall Completion', MARGINS.left + 20, yPos + 35);
    
    // Draw large progress bar
    const overallBarWidth = 400;
    drawProgressBar(
      MARGINS.left + 200, 
      yPos + 40, 
      overallBarWidth, 
      30, 
      progress.overallPercentage
    );
    
    // Draw status indicator
    const statusColors = {
      'NOT_STARTED': COLORS.gray,
      'IN_PROGRESS': COLORS.yellow,
      'COMPLETED': COLORS.green,
      'ATTENTION': COLORS.red
    };
    
    const statusLabels = {
      'NOT_STARTED': 'Not Started',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'ATTENTION': 'Attention Needed'
    };
    
    ctx.fillStyle = statusColors[progress.status];
    ctx.beginPath();
    ctx.arc(canvas.width - MARGINS.right - 80, yPos + 50, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = COLORS.text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(statusLabels[progress.status], canvas.width - MARGINS.right - 50, yPos + 55);
    
    yPos += 130;
    
    // 6. Draw requirement sections
    const requirementSections = [
      {
        title: 'Practice Hours',
        description: progress.practiceHours.completed + ' of ' + progress.practiceHours.required + ' hours completed',
        percentage: progress.practiceHours.percentage
      },
      {
        title: 'CPD Hours',
        description: progress.cpd.completed + ' of ' + progress.cpd.required + ' hours completed',
        percentage: progress.cpd.percentage
      },
      {
        title: 'Feedback Records',
        description: progress.feedback.completed + ' of ' + progress.feedback.required + ' records collected',
        percentage: progress.feedback.percentage
      },
      {
        title: 'Reflective Accounts',
        description: progress.reflectiveAccounts.completed + ' of ' + progress.reflectiveAccounts.required + ' accounts written',
        percentage: progress.reflectiveAccounts.percentage
      }
    ];
    
    requirementSections.forEach((section, index) => {
      const sectionY = yPos + (index * 100);
      
      ctx.fillStyle = COLORS.text;
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(section.title, MARGINS.left, sectionY);
      
      ctx.font = '16px Arial';
      ctx.fillStyle = COLORS.textLight;
      ctx.fillText(section.description, MARGINS.left, sectionY + 25);
      
      // Draw progress bar
      drawProgressBar(
        MARGINS.left, 
        sectionY + 40, 
        canvas.width - MARGINS.left - MARGINS.right, 
        20, 
        section.percentage
      );
    });
    
    yPos += 420;
    
    // 7. Draw health declaration and confirmation section
    const checklistItems = [
      { 
        title: 'Health Declaration', 
        completed: progress.healthDeclaration,
        description: 'Declaration of health and character'
      },
      { 
        title: 'Confirmation', 
        completed: progress.confirmation,
        description: 'Confirmation from appropriate person'
      }
    ];
    
    drawRoundedRect(MARGINS.left, yPos, canvas.width - MARGINS.left - MARGINS.right, 130, 10, COLORS.lightGray);
    
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Final Requirements', MARGINS.left + 20, yPos + 30);
    
    checklistItems.forEach((item, index) => {
      const itemY = yPos + 60 + (index * 30);
      
      // Checkbox
      ctx.beginPath();
      if (item.completed) {
        ctx.fillStyle = COLORS.green;
        ctx.fillRect(MARGINS.left + 20, itemY - 15, 20, 20);
        
        // Checkmark
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.moveTo(MARGINS.left + 24, itemY - 6);
        ctx.lineTo(MARGINS.left + 30, itemY - 1);
        ctx.lineTo(MARGINS.left + 37, itemY - 10);
        ctx.stroke();
      } else {
        ctx.strokeStyle = COLORS.gray;
        ctx.lineWidth = 2;
        ctx.strokeRect(MARGINS.left + 20, itemY - 15, 20, 20);
      }
      
      // Text
      ctx.fillStyle = COLORS.text;
      ctx.font = 'bold 16px Arial';
      ctx.fillText(item.title, MARGINS.left + 50, itemY);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = COLORS.textLight;
      ctx.fillText(item.description, MARGINS.left + 200, itemY);
    });
    
    yPos += 160;
    
    // 8. Add final notes
    ctx.fillStyle = COLORS.textLight;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('This is a summary of your NMC revalidation progress.', canvas.width / 2, yPos);
    ctx.fillText('Full documentation will be required for official submission.', canvas.width / 2, yPos + 20);
    
    // 9. Add footer with logo-like text
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RevalPro - Nursing Revalidation Assistant', canvas.width / 2, canvas.height - MARGINS.bottom);
    
    // Complete
    resolve(canvas);
  });
}

/**
 * Generate and download an infographic of revalidation summary
 */
export async function downloadRevalidationInfographic(
  summaryData: RevalidationSummaryData
): Promise<void> {
  try {
    // Calculate progress
    const progress = calculateProgress(summaryData);
    
    // Generate canvas with infographic
    const canvas = await generateInfographicCanvas(summaryData, progress);
    
    // Convert to image and download
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    link.href = imgData;
    
    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const name = summaryData.userProfile?.name.replace(/\s+/g, '_') || 'revalidation';
    link.download = name + '_revalidation_summary_' + date + '.png';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating infographic:', error);
    throw error;
  }
}