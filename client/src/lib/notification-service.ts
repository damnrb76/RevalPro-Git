/**
 * Notification Service for RevalPro
 * Handles browser notifications and reminder scheduling for revalidation deadlines
 */

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

  // Private method to schedule browser notification
  private scheduleBrowserNotification(notification: ScheduledNotification): void {
    const delay = notification.scheduledDate.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        if (this.settings.browserNotifications && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: notification.id,
            requireInteraction: notification.priority === 'high',
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