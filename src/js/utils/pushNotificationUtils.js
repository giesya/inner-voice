// VAPID public key
const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

// Check current notification permission
const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'not-supported';
  }
  return Notification.permission;
};

// Request notification permission
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser');
  }

  const currentPermission = Notification.permission;
  
  if (currentPermission === 'granted') {
    return true;
  }

  if (currentPermission === 'denied') {
    // Show instructions to enable notifications
    const message = 'Notifications are blocked. To enable them:\n\n' +
      '1. Click the lock/info icon in your browser\'s address bar\n' +
      '2. Find "Notifications" in the permissions list\n' +
      '3. Change the setting to "Allow"\n' +
      '4. Refresh the page';
    alert(message);
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    } else {
      console.log('Notification permission denied by user');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Subscribe to push notifications
const subscribeToPushNotifications = async () => {
  try {
    if (!isPushNotificationSupported()) {
      console.log('Push notifications are not supported in this browser');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Notification permission not granted');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Save subscription to IndexedDB
    await savePushSubscription(subscription);
    console.log('Successfully subscribed to push notifications');

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
};

// Get current push subscription
const getCurrentPushSubscription = async () => {
  try {
    if (!isPushNotificationSupported()) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Error getting current push subscription:', error);
    return null;
  }
};

// Unsubscribe from push notifications
const unsubscribeFromPushNotifications = async () => {
  try {
    const subscription = await getCurrentPushSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await deletePushSubscription(subscription.id);
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
};

// Helper function to open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('InnerVoiceDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pushSubscriptions')) {
        db.createObjectStore('pushSubscriptions');
      }
    };
  });
}

export {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  getCurrentPushSubscription,
  unsubscribeFromPushNotifications
};