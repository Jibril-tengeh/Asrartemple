import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string | null;
  name: string | null;
  role: string;
  isBanned: boolean;
  mysteryToolsDisabled: boolean;
  isTrusted: boolean;
  emailVerified: boolean;
  photoURL?: string | null;
  coverPhotoURL?: string | null;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        // Enforce email verification (unless we want to allow unverified access to some parts,
        // but for now, we include it in the user object so UI can react)
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Auto-promote to admin in DB if email matches
        const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com'];
        if (firebaseUser.email && adminEmails.includes(firebaseUser.email)) {
          getDoc(userRef).then(async (snap) => {
             if (snap.exists() && snap.data().role !== 'admin') {
                try {
                  const { updateDoc } = await import('firebase/firestore');
                  await updateDoc(userRef, { role: 'admin' });
                } catch (e) { console.error(e) }
             } else if (!snap.exists()) {
                try {
                  const { setDoc } = await import('firebase/firestore');
                  await setDoc(userRef, { email: firebaseUser.email, role: 'admin', createdAt: new Date() });
                } catch (e) { console.error(e) }
             }
          });
        }
        
        // Listen to user document changes to update role/ban status in real-time
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          let currentRole = 'user';
          if (docSnap.exists()) {
            currentRole = docSnap.data().role || 'user';
          }
          const adminEmails = ['jibriltengeh4@gmail.com', 'sbireino@gmail.com'];
          if (firebaseUser.email && adminEmails.includes(firebaseUser.email)) {
             currentRole = 'admin';
          }
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: currentRole,
              isBanned: data.isBanned || false,
              mysteryToolsDisabled: data.mysteryToolsDisabled || false,
              isTrusted: data.isTrusted || false,
              emailVerified: firebaseUser.emailVerified,
              photoURL: data.photoURL || firebaseUser.photoURL || null,
              coverPhotoURL: data.coverPhotoURL || null
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              role: currentRole,
              isBanned: false,
              mysteryToolsDisabled: false,
              isTrusted: false,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || null,
              coverPhotoURL: null
            });
          }
          setLoading(false);
        }, (error) => {
          console.error("AuthContext userRef onSnapshot error:", error);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
