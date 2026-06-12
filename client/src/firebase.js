import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import API from './api/axios';

const firebaseConfig = {
  apiKey: "AIzaSyCwIuAF3kVVSUIsvHZovBetYc3KlauMAZE",
  authDomain: "diaguide-web.firebaseapp.com",
  projectId: "diaguide-web",
  storageBucket: "diaguide-web.firebasestorage.app",
  messagingSenderId: "28880167123",
  appId: "1:28880167123:web:976cebd4296fb487373426"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      
      const token = await getToken(messaging, {
        vapidKey: 'BLfSyKcEF4_fkYN9nbqlWpdOqa8AbrGHr7V4PSOAIHtln74GpzqufetiAqXB7OTLpHSV-louigGsLnf76ObYdNQ',
        serviceWorkerRegistration: registration
      });
      
      console.log('FCM Token:', token);
      
      try {
        await API.post('/auth/fcm-token', { fcmToken: token });
        console.log('FCM token saved to server ✅');
      } catch (err) {
        console.error('Error saving FCM token:', err);
      }
      
      return token;
    }
  } catch (err) {
    console.error('Notification permission error:', err);
  }
};

export const showGlucoseReminder = async () => {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('🔔 DiaGuide Reminder', {
        body: 'Welcome back! Time to log your blood glucose level!',
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        tag: 'glucose-reminder'
      });
      console.log('Notification shown! ✅');
    }
  } catch (err) {
    console.error('Error showing notification:', err);
  }
};

export { messaging };