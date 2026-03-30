import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Log config (remove in production)
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain || '❌ Missing',
  projectId: firebaseConfig.projectId || '❌ Missing',
  storageBucket: firebaseConfig.storageBucket || '❌ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId || '❌ Missing',
  appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing'
});

// Check if all required fields are present
const missingFields = [];
if (!firebaseConfig.apiKey) missingFields.push('VITE_FIREBASE_API_KEY');
if (!firebaseConfig.authDomain) missingFields.push('VITE_FIREBASE_AUTH_DOMAIN');
if (!firebaseConfig.projectId) missingFields.push('VITE_FIREBASE_PROJECT_ID');
if (!firebaseConfig.storageBucket) missingFields.push('VITE_FIREBASE_STORAGE_BUCKET');
if (!firebaseConfig.messagingSenderId) missingFields.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
if (!firebaseConfig.appId) missingFields.push('VITE_FIREBASE_APP_ID');

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingFields);
  console.error('Please check your .env file and restart the dev server');
  throw new Error(`Missing Firebase config: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');

  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');

  // Initialize Auth
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { db, auth };
export default app;
