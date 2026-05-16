const admin = require('firebase-admin');
const User = require('./models/User');

// Initialize Firebase Admin with environment variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

// Send notification to a specific FCM token
exports.sendGlucoseReminder = async (fcmToken) => {
  try {
    const message = {
      notification: {
        title: '🔔 DiaGuide Reminder',
        body: 'Time to log your blood glucose level!'
      },
      token: fcmToken
    };

    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (err) {
    console.error('Error sending notification:', err);
  }
};

// Send to all users
exports.sendToAllUsers = async () => {
  try {
    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });
    
    for (const user of users) {
      await exports.sendGlucoseReminder(user.fcmToken);
    }
    
    console.log(`Notifications sent to ${users.length} users`);
  } catch (err) {
    console.error('Error sending to all users:', err);
  }
};