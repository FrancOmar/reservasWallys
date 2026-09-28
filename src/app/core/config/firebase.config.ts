import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { environment } from '../../../environments/environment';

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let firebaseDb: Firestore;
let firebaseAnalytics: Analytics | null = null;

export function initFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (!getApps().length) {
    firebaseApp = initializeApp(environment.firebase);
  } else {
    firebaseApp = getApp();
  }

  firebaseAuth = getAuth(firebaseApp);
  firebaseDb = getFirestore(firebaseApp);

  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        firebaseAnalytics = getAnalytics(firebaseApp);
      }
    });
  }

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb };
}

export { firebaseApp, firebaseAuth, firebaseDb, firebaseAnalytics };
