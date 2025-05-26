import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { notificationService } from '@/lib/notification-service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function NotificationDemo() {
  const { user } = useAuth();
  const { toast } = useToast();

  const createTestNotification = () => {
    if (!user) return;

    // Create a test notification for immediate display
    const notificationId = notificationService.scheduleNotification({
      title: 'Test Revalidation Reminder',
      message: 'This is a demo notification to show the system is working! Your NMC registration deadline is approaching.',
      type: 'revalidation',
      scheduledDate: new Date(), // Schedule for right now
      userId: user.id,
      priority: 'high',
    });

    toast({
      title: "Demo Notification Created!",
      description: "Check the notification bell in the header - you should see a red badge appear.",
    });

    return notificationId;
  };

  const createWeeklyReminder = () => {
    if (!user) return;

    notificationService.scheduleNotification({
      title: 'Weekly Progress Check',
      message: 'Time to update your practice hours and log any new CPD activities from this week.',
      type: 'progress',
      scheduledDate: new Date(),
      userId: user.id,
      priority: 'medium',
    });

    toast({
      title: "Weekly Reminder Created!",
      description: "Another notification has been added to test the system.",
    });
  };

  const setupRevalidationReminders = () => {
    if (!user) return;

    // Create a fake revalidation date 3 months from now for demo
    const fakeExpiryDate = new Date();
    fakeExpiryDate.setMonth(fakeExpiryDate.getMonth() + 3);

    notificationService.scheduleRevalidationReminders(fakeExpiryDate, user.id);

    toast({
      title: "Revalidation Reminders Set Up!",
      description: "Multiple reminder notifications have been scheduled based on your revalidation date.",
    });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Please log in to test the notification system.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Notification System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Test the notification system by creating demo notifications. Check the bell icon in the header to see them appear!
        </p>
        
        <div className="grid gap-3">
          <Button 
            onClick={createTestNotification}
            className="flex items-center gap-2"
            variant="default"
          >
            <AlertTriangle className="h-4 w-4" />
            Create High Priority Test Notification
          </Button>

          <Button 
            onClick={createWeeklyReminder}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Clock className="h-4 w-4" />
            Create Weekly Progress Reminder
          </Button>

          <Button 
            onClick={setupRevalidationReminders}
            className="flex items-center gap-2"
            variant="secondary"
          >
            <Calendar className="h-4 w-4" />
            Set Up Full Revalidation Schedule
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Red badge appears on the bell icon in the header</li>
            <li>• Click the bell to see your notifications</li>
            <li>• Notifications are organized by priority (high/medium/low)</li>
            <li>• Browser notifications may appear if you grant permission</li>
            <li>• Notifications persist until you mark them as read</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}