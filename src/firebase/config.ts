// Import the functions you need from the SDKs you need
import { FirebaseApp as FireApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Opcional
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  // apiKey: "AIzaSyCStCkwnW_1gLh0SUTjIZ5RPAZ3F4dxtR8",
  // authDomain: "givers-2c61a.firebaseapp.com",
  // projectId: "givers-2c61a",
  // storageBucket: "givers-2c61a.firebasestorage.app",
  // messagingSenderId: "998926391526",
  // appId: "1:998926391526:web:627062bbf8ad2204a90327",
  // measurementId: "G-63LQ6T639T"
};

// Initialize Firebase
const FirebaseApp: FireApp = initializeApp(firebaseConfig);
export const FirebaseAuth: Auth = getAuth(FirebaseApp);
export const FirebaseDB: Firestore = getFirestore(FirebaseApp);
export const FirebaseStorage = getStorage(FirebaseApp);