import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Brain, Zap, Clock, CheckCircle, Settings, Play, RefreshCw } from 'lucide-react';
import { notificationService, UserBehaviorData } from '@/lib/notification-service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function NotificationTest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [testingInProgress, setTestingInProgress] = useState(false);
  const [aiScheduleResult, setAiScheduleResult] = useState<any>(null);

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Check service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsServiceWorkerReady(true);
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, action, targetUrl } = event.data;
    
    if (type === 'NOTIFICATION_ACTION') {
      toast({
        title: `Action Triggered: ${action}`,
        description: `User clicked notification action. Would navigate to: ${targetUrl}`,
      });
    } else if (type === 'SNOOZE_NOTIFICATION') {
      toast({
        title: "Notification Snoozed",
        description: "The reminder will appear again in 2 hours.",
      });
    } else if (type === 'REMIND_TOMORROW') {
      toast({
        title: "Tomorrow Reminder Set",
        description: "The reminder will appear again tomorrow at the same time.",
      });
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return;
    }

    const permission = await notificationService.requestPermission();
    setPermissionStatus(Notification.permission);
    
    if (permission) {
      toast({
        title: "Permission Granted!",
        description: "You can now receive rich browser notifications.",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings to test this feature.",
        variant: "destructive"
      });
    }
  };

  const testRichNotification = async () => {
    if (!user) return;
    
    setTestingInProgress(true);
    try {
      await notificationService.testRichNotification(user.id);
      toast({
        title: "Rich Notification Sent!",
        description: "Check your browser notifications. You should see action buttons you can click.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send rich notification. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setTestingInProgress(false);
    }
  };

  const testAIAdaptiveScheduling = async () => {
    if (!user) return;

    setTestingInProgress(true);
    try {
      // Mock user behavior data for testing
      const mockBehaviorData: UserBehaviorData = {
        loginTimes: [
          new Date(Date.now() - 86400000).toISOString(), // Yesterday
          new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        ],
        completionRates: {
          'cpd': 0.8,
          'reflection': 0.6,
          'progress': 0.9,
          'revalidation': 0.7
        },
        preferences: {
          preferredTime: '10:00',
          preferredDays: ['tuesday', 'wednesday']
        },
        daysUntilDeadline: 90,
        overallCompletion: 0.65
      };

      const scheduleId = await notificationService.scheduleAdaptiveReminder(user.id, mockBehaviorData);
      
      // Get the AI analysis result for display
      const aiSchedule = await (notificationService as any).calculateOptimalReminderTime(mockBehaviorData);
      setAiScheduleResult(aiSchedule);

      toast({
        title: "AI Scheduling Complete!",
        description: `Adaptive reminder scheduled with ${Math.round(aiSchedule.confidence * 100)}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "AI Scheduling Failed",
        description: "Could not create adaptive reminder. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setTestingInProgress(false);
    }
  };

  const testImmediateNotifications = async () => {
    if (!user) return;

    const notificationTypes = ['revalidation', 'cpd', 'reflection', 'progress', 'deadline'];
    
    for (let i = 0; i < notificationTypes.length; i++) {
      setTimeout(() => {
        const type = notificationTypes[i] as any;
        notificationService.scheduleNotification({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Test`,
          message: `Testing ${type} notification with action buttons. Click the actions to see them work!`,
          type,
          scheduledDate: new Date(Date.now() + 1000), // 1 second delay
          userId: user.id,
          priority: i % 2 === 0 ? 'high' : 'medium'
        });
      }, i * 2000); // Stagger notifications
    }

    toast({
      title: "Multiple Notifications Scheduled",
      description: "5 different notification types will appear over the next 10 seconds.",
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Please log in to test the notification features.</p>
            <Button className="mt-4" onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          Rich Notification & AI Scheduling Test
        </h1>
        <p className="text-gray-600">
          Test the advanced notification features including action buttons and AI-powered adaptive scheduling.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Permission Status</p>
                <p className="text-lg font-semibold">
                  {permissionStatus === 'granted' ? 'Granted' :
                   permissionStatus === 'denied' ? 'Denied' : 'Not Requested'}
                </p>
              </div>
              <Badge variant={permissionStatus === 'granted' ? 'default' : 'secondary'}>
                {permissionStatus === 'granted' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Worker</p>
                <p className="text-lg font-semibold">
                  {isServiceWorkerReady ? 'Ready' : 'Loading'}
                </p>
              </div>
              <Badge variant={isServiceWorkerReady ? 'default' : 'secondary'}>
                {isServiceWorkerReady ? <CheckCircle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Browser Support</p>
                <p className="text-lg font-semibold">
                  {'Notification' in window ? 'Supported' : 'Not Supported'}
                </p>
              </div>
              <Badge variant={'Notification' in window ? 'default' : 'destructive'}>
                <Settings className="h-4 w-4" />
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rich-notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rich-notifications" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Rich Notifications
          </TabsTrigger>
          <TabsTrigger value="ai-scheduling" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Scheduling
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rich-notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rich Browser Notifications with Action Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Rich notifications include interactive action buttons that users can click without opening the app.
                  These work even when the browser is minimized or in the background.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {permissionStatus !== 'granted' && (
                  <Button onClick={requestNotificationPermission} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Request Notification Permission
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={testRichNotification}
                    disabled={permissionStatus !== 'granted' || testingInProgress}
                    className="flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Test Rich Notification
                  </Button>

                  <Button 
                    onClick={testImmediateNotifications}
                    disabled={permissionStatus !== 'granted' || testingInProgress}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Bell className="h-4 w-4" />
                    Test Multiple Types
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Available Action Buttons by Type:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <strong>Revalidation:</strong> View Progress, Remind Later
                  </div>
                  <div>
                    <strong>CPD:</strong> Log Activity, View CPD
                  </div>
                  <div>
                    <strong>Reflection:</strong> Write Now, Tomorrow
                  </div>
                  <div>
                    <strong>Progress:</strong> Log Hours, Dashboard
                  </div>
                  <div>
                    <strong>Deadline:</strong> Take Action, Check List
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-scheduling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Adaptive Reminder Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  AI analyzes user behavior patterns (login times, completion rates, preferences) to determine 
                  the optimal time and method for sending reminders, maximizing engagement and completion rates.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={testAIAdaptiveScheduling}
                disabled={testingInProgress}
                className="w-full flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Generate AI-Powered Schedule
              </Button>

              {aiScheduleResult && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      AI Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Optimal Time</p>
                        <p className="text-lg">{aiScheduleResult.optimalTime.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Confidence Level</p>
                        <p className="text-lg">{Math.round(aiScheduleResult.confidence * 100)}%</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Recommended Type</p>
                        <p className="text-lg capitalize">{aiScheduleResult.type}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-600">Priority Level</p>
                        <Badge variant={aiScheduleResult.priority === 'high' ? 'destructive' : 
                                      aiScheduleResult.priority === 'medium' ? 'default' : 'secondary'}>
                          {aiScheduleResult.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-sm text-gray-600 mb-1">Personalized Message</p>
                      <p className="text-sm bg-white p-3 rounded border">
                        "{aiScheduleResult.message}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">AI Analysis Factors:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Most active app usage times (based on login patterns)</li>
                  <li>Historical completion rates by reminder type</li>
                  <li>Day of week preferences (professional vs. personal days)</li>
                  <li>Task complexity vs. available time windows</li>
                  <li>User engagement scores and response patterns</li>
                  <li>Deadline urgency and completion percentage</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>First, grant notification permissions using the button above</li>
            <li>Test rich notifications - look for action buttons you can click</li>
            <li>Click action buttons to see how they trigger different app behaviors</li>
            <li>Test AI scheduling to see personalized timing and messaging</li>
            <li>Check browser console for detailed logging of notification events</li>
          </ol>
          
          <Alert className="mt-4">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Rich notifications with action buttons require HTTPS in production. 
              The service worker handles action clicks and can open specific app pages.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}