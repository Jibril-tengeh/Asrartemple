import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface FeatureContextType {
  featureToggles: any;
}

const FeatureContext = createContext<FeatureContextType>({ featureToggles: {} });

export const useFeatures = () => useContext(FeatureContext);

export const FeatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featureToggles, setFeatureToggles] = useState<any>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "settings", "features"),
      (docSnap) => {
        if (docSnap.exists()) {
          setFeatureToggles(docSnap.data());
        } else {
          setFeatureToggles({});
        }
      },
      (error) => {
        console.error("Error fetching feature toggles:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <FeatureContext.Provider value={{ featureToggles }}>
      {children}
    </FeatureContext.Provider>
  );
};
