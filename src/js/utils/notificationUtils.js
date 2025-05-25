// VAPID public key from your API
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY';

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

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      return subscription;
    }

    // Subscribe to push notifications
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Send subscription to server
    await sendSubscriptionToServer(newSubscription);

    return newSubscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscriptionFromServer(subscription);
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
}

// Send subscription to server
async function sendSubscriptionToServer(subscription) {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId: localStorage.getItem('userId')
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }
  } catch (error) {
    console.error('Error sending subscription to server:', error);
    throw error;
  }
}

// Remove subscription from server
async function removeSubscriptionFromServer(subscription) {
  try {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userId: localStorage.getItem('userId')
      })
    });

    if (!response.ok) {
      throw new Error('Failed to remove subscription from server');
    }
  } catch (error) {
    console.error('Error removing subscription from server:', error);
    throw error;
  }
}

// Request notification permission
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeToPushNotifications();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
} 