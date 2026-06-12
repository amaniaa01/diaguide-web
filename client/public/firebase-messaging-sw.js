importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCwIuAF3kVVSUIsvHZovBetYc3KlauMAZE",
  authDomain: "diaguide-web.firebaseapp.com",
  projectId: "diaguide-web",
  storageBucket: "diaguide-web.firebasestorage.app",
  messagingSenderId: "28880167123",
  appId: "1:28880167123:web:976cebd4296fb487373426"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo192.png'
  });
});