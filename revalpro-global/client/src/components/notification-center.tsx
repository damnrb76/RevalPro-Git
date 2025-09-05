import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { notificationService, ScheduledNotification } from '@/lib/notification-service';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ScheduledNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const updateNotifications = () => {
        const pending = notificationService.getPendingNotifications(user.id);
        setNotifications(pending);
      };

      updateNotifications();
      
      // Update every minute to check for new notifications
      const interval = setInterval(updateNotifications, 60000);
      
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const unreadCount = notifications.length;

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative p-2"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-sm text-gray-500">
                  No new notifications at the moment.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1 p-2">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            {getPriorityIcon(notification.priority)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(notification.scheduledDate, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            onClick={() => handleMarkAsRead(notification.id)}
                            aria-label="Mark as read"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {index < notifications.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;