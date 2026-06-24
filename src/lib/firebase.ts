import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in firestore
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    if (!docSnap.exists()) {
      // Create new user
      await setDoc(userRef, {
        email: user.email,
        name: user.displayName,
        role: 'user', // first user could be admin manually or we just set user
        isBanned: false,
        mysteryToolsDisabled: false,
        isTrusted: false,
        createdAt: new Date()
      });
    }
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const signOut = () => {
  return firebaseSignOut(auth);
};
