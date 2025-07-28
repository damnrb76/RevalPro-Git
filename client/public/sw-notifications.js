// Service Worker for Rich Notifications with Action Buttons
// This handles notification clicks and action button interactions

self.addEventListener('install', event => {
  console.log('Notification service worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Notification service worker activated');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};
  
  // Close the notification
  notification.close();
  
  // Handle different actions
  let url = '/dashboard'; // Default URL
  
  if (action) {
    // Handle specific action buttons
    switch (action) {
      case 'view-progress':
        url = '/dashboard';
        break;
      case 'log-cpd':
        url = '/cpd';
        break;
      case 'write-reflection':
        url = '/reflections';
        break;
      case 'update-hours':
        url = '/practice-hours';
        break;
      case 'urgent-action':
        url = '/revalidation-dates';
        break;
      case 'view-requirements':
        url = '/dashboard';
        break;
      case 'snooze':
        // Handle snooze action - reschedule notification
        handleSnoozeAction(data);
        return;
      case 'remind-tomorrow':
        // Handle remind tomorrow action
        handleRemindTomorrow(data);
        return;
      default:
        url = data.url || '/dashboard';
    }
  } else {
    // Handle main notification click
    url = data.url || '/dashboard';
  }
  
  // Open/focus the app with the appropriate URL
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        // Check if there's already a window open
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            client.postMessage({
              type: 'NOTIFICATION_ACTION',
              action: action || 'view',
              notificationId: data.notificationId,
              targetUrl: url
            });
            return;
          }
        }
        
        // No existing window, open a new one
        return self.clients.openWindow(self.location.origin + url);
      })
  );
});

// Handle snooze action
function handleSnoozeAction(data) {
  // Send message to main app to reschedule
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SNOOZE_NOTIFICATION',
        notificationId: data.notificationId,
        originalType: data.type
      });
    });
  });
  
  // Show confirmation
  self.registration.showNotification('Reminder Snoozed ⏰', {
    body: 'We\'ll remind you again in 2 hours.',
    icon: '/favicon.ico',
    tag: 'snooze-confirmation',
    requireInteraction: false,
    actions: []
  });
}

// Handle remind tomorrow action
function handleRemindTomorrow(data) {
  // Send message to main app to reschedule for tomorrow
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'REMIND_TOMORROW',
        notificationId: data.notificationId,
        originalType: data.type
      });
    });
  });
  
  // Show confirmation
  self.registration.showNotification('Tomorrow Reminder Set 📅', {
    body: 'We\'ll remind you again tomorrow at the same time.',
    icon: '/favicon.ico',
    tag: 'tomorrow-confirmation',
    requireInteraction: false,
    actions: []
  });
}

// Handle background sync for notification actions
self.addEventListener('sync', event => {
  if (event.tag === 'notification-action-sync') {
    event.waitUntil(syncNotificationActions());
  }
});

function syncNotificationActions() {
  // Handle any pending notification actions when back online
  return Promise.resolve();
}

// Listen for messages from the main app
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SHOW_RICH_NOTIFICATION':
      showRichNotification(data);
      break;
    case 'UPDATE_NOTIFICATION_BADGE':
      updateNotificationBadge(data.count);
      break;
    default:
      console.log('Unknown message type:', type);
  }
});

// Show rich notification with action buttons
function showRichNotification(notificationData) {
  const {
    title,
    body,
    actions = [],
    icon = '/favicon.ico',
    badge = '/favicon.ico',
    tag,
    requireInteraction = false,
    vibrate = [100],
    data = {}
  } = notificationData;
  
  self.registration.showNotification(title, {
    body,
    icon,
    badge,
    tag,
    requireInteraction,
    actions,
    data,
    vibrate,
    timestamp: Date.now()
  });
}

// Update notification badge
function updateNotificationBadge(count) {
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(count);
  }
}