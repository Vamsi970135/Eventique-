import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";

// Firebase configuration object - should be populated from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Check if Firebase is configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;
};

// Initialize Firebase if configured
let auth: ReturnType<typeof getAuth>;
let app: ReturnType<typeof initializeApp>;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.warn(
    "Firebase is not configured. Please set the environment variables:\n" +
    "VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID"
  );
}

// Google sign-in provider
const googleProvider = new GoogleAuthProvider();

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured");
  return signInWithEmailAndPassword(auth, email, password);
};

// Create new user with email and password
export const createUserWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured");
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with Google popup
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured");
  return signInWithPopup(auth, googleProvider);
};

// Sign out user
export const signOut = async () => {
  if (!isFirebaseConfigured()) throw new Error("Firebase is not configured");
  return firebaseSignOut(auth);
};

// Auth state observer
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  if (!isFirebaseConfigured()) return null;
  return auth.currentUser;
};

export { auth };
