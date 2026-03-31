import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { rtdb } from './firebase';
import { Notification } from '../types/partner';

export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  const notificationsRef = ref(rtdb, `notifications/${userId}`);
  
  return onValue(notificationsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const notificationList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value,
      })).sort((a, b) => b.created_at - a.created_at);
      callback(notificationList);
    } else {
      callback([]);
    }
  });
}

export async function sendNotification(userId: string, notification: Omit<Notification, 'id' | 'created_at' | 'read'>) {
  const notificationsRef = ref(rtdb, `notifications/${userId}`);
  const newNotificationRef = push(notificationsRef);
  
  await set(newNotificationRef, {
    ...notification,
    read: false,
    created_at: serverTimestamp(),
  });
}
