/**
 * Notification Service for RevalPro
 * Handles browser notifications and reminder scheduling for revalidation deadlines
 */

// Extended notification options interface for TypeScript compatibility
interface ExtendedNotificationOptions extends NotificationOptions {
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface NotificationSettings {
  enabled: boolean;
  revalidationReminders: boolean;
  weeklyProgress: boolean;
  deadlineAlerts: boolean;
  browserNotifications: boolean;
}

export interface ScheduledNotification {
  id: string;
  title: string;
  message: string;
  type: 'revalidation' | 'progress' | 'deadline' | 'cpd' | 'reflection';
  scheduledDate: Date;
  userId: number;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface UserBehaviorData {
  loginTimes?: string[];
  completionRates?: Record<string, number>;
  preferences?: Record<string, any>;
  daysUntilDeadline?: number;
  overallCompletion?: number;
}

export interface UserPatterns {
  mostActiveHour: number;
  preferredDays: string[];
  mostNeededReminder: 'revalidation' | 'progress' | 'deadline' | 'cpd' | 'reflection';
  urgencyLevel: 'low' | 'medium' | 'high';
  confidence: number;
  completionPatterns: Record<string, number>;
  engagementScore: number;
}

export interface AIScheduleResult {
  optimalTime: Date;
  title: string;
  message: string;
  type: 'revalidation' | 'progress' | 'deadline' | 'cpd' | 'reflection';
  priority: 'low' | 'medium' | 'high';
  confidence: number;
}

class NotificationService {
  private notifications: ScheduledNotification[] = [];
  private settings: NotificationSettings = {
    enabled: false,
    revalidationReminders: true,
    weeklyProgress: true,
    deadlineAlerts: true,
    browserNotifications: false,
  };

  constructor() {
    this.loadFromStorage();
    this.requestPermission();
  }

  // Request browser notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Update notification settings
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage();
  }

  // Get current settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Schedule a notification
  scheduleNotification(notification: Omit<ScheduledNotification, 'id' | 'isRead'>): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: ScheduledNotification = {
      ...notification,
      id,
      isRead: false,
    };

    this.notifications.push(newNotification);
    this.saveToStorage();
    
    // Schedule browser notification if enabled and permission granted
    if (this.settings.browserNotifications && Notification.permission === 'granted') {
      this.scheduleBrowserNotification(newNotification);
    }

    return id;
  }

  // Schedule revalidation deadline reminders
  scheduleRevalidationReminders(expiryDate: Date, userId: number): void {
    if (!this.settings.enabled || !this.settings.revalidationReminders) return;

    const now = new Date();
    const expiry = new Date(expiryDate);
    
    // 6 months before expiry
    const sixMonthsBefore = new Date(expiry);
    sixMonthsBefore.setMonth(sixMonthsBefore.getMonth() - 6);
    if (sixMonthsBefore > now) {
      this.scheduleNotification({
        title: 'Revalidation Reminder - 6 Months',
        message: 'Your NMC registration expires in 6 months. Start gathering your revalidation evidence now.',
        type: 'revalidation',
        scheduledDate: sixMonthsBefore,
        userId,
        priority: 'medium',
      });
    }

    // 3 months before expiry
    const threeMonthsBefore = new Date(expiry);
    threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);
    if (threeMonthsBefore > now) {
      this.scheduleNotification({
        title: 'Revalidation Reminder - 3 Months',
        message: 'Your NMC registration expires in 3 months. Ensure you have all required evidence.',
        type: 'revalidation',
        scheduledDate: threeMonthsBefore,
        userId,
        priority: 'medium',
      });
    }

    // 60 days before expiry (NMC application window opens)
    const applicationWindow = new Date(expiry);
    applicationWindow.setDate(applicationWindow.getDate() - 60);
    if (applicationWindow > now) {
      this.scheduleNotification({
        title: 'NMC Application Window Open',
        message: 'You can now submit your revalidation application to the NMC. Don\'t delay!',
        type: 'deadline',
        scheduledDate: applicationWindow,
        userId,
        priority: 'high',
      });
    }

    // 1 month before expiry
    const oneMonthBefore = new Date(expiry);
    oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
    if (oneMonthBefore > now) {
      this.scheduleNotification({
        title: 'Urgent: Registration Expires Soon',
        message: 'Your NMC registration expires in 1 month. Submit your revalidation now!',
        type: 'deadline',
        scheduledDate: oneMonthBefore,
        userId,
        priority: 'high',
      });
    }
  }

  // Schedule weekly progress reminders
  scheduleWeeklyProgressReminder(userId: number): void {
    if (!this.settings.enabled || !this.settings.weeklyProgress) return;

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0); // 10 AM

    this.scheduleNotification({
      title: 'Weekly Progress Check',
      message: 'Take a moment to update your practice hours and CPD activities for this week.',
      type: 'progress',
      scheduledDate: nextWeek,
      userId,
      priority: 'low',
    });
  }

  // Schedule CPD deadline reminders
  scheduleCpdReminder(userId: number): void {
    if (!this.settings.enabled) return;

    const reminder = new Date();
    reminder.setDate(reminder.getDate() + 30); // Remind in 30 days
    reminder.setHours(14, 0, 0, 0); // 2 PM

    this.scheduleNotification({
      title: 'CPD Activity Reminder',
      message: 'Have you completed any CPD activities recently? Don\'t forget to log them!',
      type: 'cpd',
      scheduledDate: reminder,
      userId,
      priority: 'low',
    });
  }

  // Schedule reflection reminder
  scheduleReflectionReminder(userId: number): void {
    if (!this.settings.enabled) return;

    const reminder = new Date();
    reminder.setDate(reminder.getDate() + 14); // Remind in 2 weeks
    reminder.setHours(16, 0, 0, 0); // 4 PM

    this.scheduleNotification({
      title: 'Reflection Reminder',
      message: 'Time to write a new reflective account about your recent practice experiences.',
      type: 'reflection',
      scheduledDate: reminder,
      userId,
      priority: 'medium',
    });
  }

  // Get pending notifications for a user
  getPendingNotifications(userId: number): ScheduledNotification[] {
    const now = new Date();
    return this.notifications.filter(
      notif => notif.userId === userId && 
               notif.scheduledDate <= now && 
               !notif.isRead
    ).sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.scheduledDate.getTime() - b.scheduledDate.getTime();
    });
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
    }
  }

  // Clear old notifications (older than 30 days)
  clearOldNotifications(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    this.notifications = this.notifications.filter(
      notif => notif.scheduledDate > cutoffDate || !notif.isRead
    );
    this.saveToStorage();
  }

  // Private method to schedule browser notification with action buttons
  private scheduleBrowserNotification(notification: ScheduledNotification): void {
    const delay = notification.scheduledDate.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        if (this.settings.browserNotifications && Notification.permission === 'granted') {
          // Register service worker for action buttons
          this.registerServiceWorker();
          
          // Create rich notification with action buttons
          const actions = this.getNotificationActions(notification.type);
          
          navigator.serviceWorker.ready.then(registration => {
            const notificationOptions: ExtendedNotificationOptions = {
              body: notification.message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: notification.id,
              requireInteraction: notification.priority === 'high',
              actions: actions,
              data: {
                notificationId: notification.id,
                type: notification.type,
                url: this.getNotificationUrl(notification.type)
              },
              vibrate: notification.priority === 'high' ? [200, 100, 200] : [100],
              timestamp: Date.now()
            };
            
            registration.showNotification(notification.title, notificationOptions);
          });
        }
      }, delay);
    }
  }

  // Load notifications from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('revalpro_notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.notifications?.map((n: any) => ({
          ...n,
          scheduledDate: new Date(n.scheduledDate),
        })) || [];
        this.settings = { ...this.settings, ...data.settings };
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  // Register service worker for rich notifications
  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw-notifications.js');
        console.log('Notification service worker registered:', registration);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    }
  }

  // Get notification actions based on type
  private getNotificationActions(type: string): Array<{action: string; title: string; icon?: string}> {
    switch (type) {
      case 'revalidation':
        return [
          {
            action: 'view-progress',
            title: '📊 View Progress',
            icon: '/icons/progress.png'
          },
          {
            action: 'snooze',
            title: '⏰ Remind Later',
            icon: '/icons/snooze.png'
          }
        ];
      case 'cpd':
        return [
          {
            action: 'log-cpd',
            title: '📝 Log Activity',
            icon: '/icons/add.png'
          },
          {
            action: 'view-cpd',
            title: '📚 View CPD',
            icon: '/icons/view.png'
          }
        ];
      case 'reflection':
        return [
          {
            action: 'write-reflection',
            title: '✍️ Write Now',
            icon: '/icons/write.png'
          },
          {
            action: 'remind-tomorrow',
            title: '📅 Tomorrow',
            icon: '/icons/calendar.png'
          }
        ];
      case 'progress':
        return [
          {
            action: 'update-hours',
            title: '⏱️ Log Hours',
            icon: '/icons/time.png'
          },
          {
            action: 'view-dashboard',
            title: '🏠 Dashboard',
            icon: '/icons/home.png'
          }
        ];
      case 'deadline':
        return [
          {
            action: 'urgent-action',
            title: '🚨 Take Action',
            icon: '/icons/urgent.png'
          },
          {
            action: 'view-requirements',
            title: '📋 Check List',
            icon: '/icons/checklist.png'
          }
        ];
      default:
        return [
          {
            action: 'view',
            title: '👀 View',
            icon: '/icons/view.png'
          }
        ];
    }
  }

  // Get URL for notification type
  private getNotificationUrl(type: string): string {
    switch (type) {
      case 'revalidation':
        return '/dashboard';
      case 'cpd':
        return '/cpd';
      case 'reflection':
        return '/reflections';
      case 'progress':
        return '/dashboard';
      case 'deadline':
        return '/revalidation-dates';
      default:
        return '/dashboard';
    }
  }

  // AI-powered adaptive scheduling
  async scheduleAdaptiveReminder(userId: number, userBehavior: UserBehaviorData): Promise<string> {
    const aiSchedule = await this.calculateOptimalReminderTime(userBehavior);
    
    return this.scheduleNotification({
      title: aiSchedule.title,
      message: aiSchedule.message,
      type: aiSchedule.type,
      scheduledDate: aiSchedule.optimalTime,
      userId,
      priority: aiSchedule.priority,
    });
  }

  // Calculate optimal reminder time using AI patterns
  private async calculateOptimalReminderTime(behaviour: UserBehaviorData): Promise<AIScheduleResult> {
    // Analyze user patterns
    const patterns = this.analyseUserPatterns(behaviour);
    
    // Determine optimal scheduling based on:
    // 1. Most active app usage times
    // 2. Historical completion rates
    // 3. Day of week preferences
    // 4. Task complexity vs available time
    
    const optimalHour = patterns.mostActiveHour;
    const optimalDay = patterns.preferredDays[0];
    const nextOptimalDate = this.getNextOptimalDate(optimalDay, optimalHour);
    
    // AI-generated personalized message
    const personalizedMessage = this.generatePersonalizedMessage(patterns);
    
    return {
      optimalTime: nextOptimalDate,
      title: this.generateContextualTitle(patterns),
      message: personalizedMessage,
      type: patterns.mostNeededReminder,
      priority: patterns.urgencyLevel,
      confidence: patterns.confidence
    };
  }

  // Analyse user behaviour patterns
  private analyseUserPatterns(behaviour: UserBehaviorData): UserPatterns {
    // Mock AI analysis - in production this would use ML
    const loginTimes = behaviour.loginTimes || [];
    const completionRates = behaviour.completionRates || {};
    const preferences = behaviour.preferences || {};
    
    // Find most active hour
    const hourCounts = loginTimes.reduce((acc, time) => {
      const hour = new Date(time).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostActiveHour = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '10';
    
    // Determine preferred days (mock analysis)
    const preferredDays = ['tuesday', 'wednesday', 'thursday']; // Professional days
    
    // Calculate completion rates by reminder type
    const bestPerformingType = Object.entries(completionRates)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'progress';
    
    return {
      mostActiveHour: parseInt(mostActiveHour),
      preferredDays,
      mostNeededReminder: bestPerformingType as any,
      urgencyLevel: this.calculateUrgency(behaviour),
      confidence: 0.85, // AI confidence score
      completionPatterns: completionRates,
      engagementScore: this.calculateEngagement(behaviour)
    };
  }

  // Generate next optimal date
  private getNextOptimalDate(preferredDay: string, hour: number): Date {
    const dayMap = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6, 'sunday': 0
    };
    
    const targetDay = dayMap[preferredDay as keyof typeof dayMap];
    const now = new Date();
    const nextDate = new Date(now);
    
    // Find next occurrence of preferred day
    const daysUntilTarget = (targetDay - now.getDay() + 7) % 7 || 7;
    nextDate.setDate(now.getDate() + daysUntilTarget);
    nextDate.setHours(hour, 0, 0, 0);
    
    return nextDate;
  }

  // Generate personalized message based on patterns
  private generatePersonalizedMessage(patterns: UserPatterns): string {
    const messages = {
      high_engagement: [
        "You've been doing great with your revalidation progress! Time for the next step.",
        "Your consistency is impressive - let's keep the momentum going!",
        "Based on your progress pattern, this is the perfect time to update."
      ],
      medium_engagement: [
        "A gentle reminder to check in with your revalidation progress.",
        "It's been a while since your last update - let's get back on track!",
        "Your future self will thank you for staying on top of this."
      ],
      low_engagement: [
        "Don't let your revalidation deadline sneak up - take 5 minutes now.",
        "Small steps today prevent big stress later. Quick update?",
        "Your NMC registration matters - let's make some progress."
      ]
    };
    
    const engagementLevel = patterns.engagementScore > 0.7 ? 'high_engagement' :
                          patterns.engagementScore > 0.4 ? 'medium_engagement' : 'low_engagement';
    
    const messageList = messages[engagementLevel];
    return messageList[Math.floor(Math.random() * messageList.length)];
  }

  // Generate contextual title
  private generateContextualTitle(patterns: UserPatterns): string {
    const titles = {
      'cpd': 'CPD Activity Time 📚',
      'reflection': 'Reflection Moment ✍️',
      'progress': 'Progress Check-in 📊',
      'revalidation': 'Revalidation Update 🎯',
      'deadline': 'Important Deadline ⚠️'
    };
    
    return titles[patterns.mostNeededReminder] || 'RevalPro Reminder 🔔';
  }

  // Calculate urgency level
  private calculateUrgency(behaviour: UserBehaviorData): 'low' | 'medium' | 'high' {
    // Mock urgency calculation based on deadlines and completion rates
    const daysUntilDeadline = behavior.daysUntilDeadline || 365;
    const completionPercentage = behavior.overallCompletion || 0;
    
    if (daysUntilDeadline < 60 && completionPercentage < 0.8) return 'high';
    if (daysUntilDeadline < 120 && completionPercentage < 0.6) return 'medium';
    return 'low';
  }

  // Calculate engagement score
  private calculateEngagement(behavior: UserBehaviorData): number {
    // Mock engagement calculation
    const loginFrequency = behavior.loginTimes?.length || 0;
    const avgCompletionRate = Object.values(behavior.completionRates || {})
      .reduce((sum, rate) => sum + rate, 0) / Object.keys(behavior.completionRates || {}).length || 0;
    
    return Math.min((loginFrequency * 0.1 + avgCompletionRate * 0.9), 1.0);
  }

  // Test rich notification with action buttons
  async testRichNotification(userId: number): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    await this.requestPermission();
    await this.registerServiceWorker();

    const testNotification = {
      id: `test_${Date.now()}`,
      title: '🧪 Rich Notification Test',
      message: 'This notification has action buttons! Try clicking them.',
      type: 'progress' as const,
      scheduledDate: new Date(),
      userId,
      isRead: false,
      priority: 'medium' as const
    };

    this.scheduleBrowserNotification(testNotification);
  }

  // Save notifications to localStorage
  private saveToStorage(): void {
    try {
      const data = {
        notifications: this.notifications,
        settings: this.settings,
      };
      localStorage.setItem('revalpro_notifications', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();