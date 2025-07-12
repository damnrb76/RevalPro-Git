import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Google Authentication Functions
export const signInWithGoogle = async () => {
  try {
    console.log("Attempting Google sign-in...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign-in successful:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    // Handle specific Firebase auth errors
    if (error.code === 'auth/popup-blocked') {
      console.error("Popup was blocked by the browser");
      alert("Please allow popups for this site to use Google sign-in");
    } else if (error.code === 'auth/unauthorized-domain') {
      console.error("Domain not authorized in Firebase");
      const currentDomain = window.location.hostname;
      alert(`Domain "${currentDomain}" is not authorized in Firebase Console. Please add this domain to your Firebase project's authorized domains list.`);
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export default app;