import { initializeApp } from 'firebase/app';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  browserLocalPersistence,
  initializeAuth,
  indexedDBLocalPersistence,
  browserPopupRedirectResolver
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Capacitor } from '@capacitor/core';

const app = initializeApp(firebaseConfig);

// Initialize Auth with IndexedDB persistence which is better for Capacitor
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    if (result) {
      const user = result.user;
      // Check if user exists in firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Create new user
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName,
          role: 'user',
          isBanned: false,
          mysteryToolsDisabled: false,
          isTrusted: false,
          createdAt: new Date()
        });
      }
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};
