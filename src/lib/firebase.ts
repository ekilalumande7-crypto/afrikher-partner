import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD031LnIPd-r8JTcpSCeXhnYjPG0a-NpOk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "afrikher-platform.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "afrikher-platform",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "afrikher-platform.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "230093116158",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:230093116158:web:3fa7d88a806910ea41cbaf",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://afrikher-platform-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;
