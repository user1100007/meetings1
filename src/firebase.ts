import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6nu4bKFDHtfuWWoz8aHx1wWrQDetSBtU",
  authDomain: "meetings-30028.firebaseapp.com",
  projectId: "meetings-30028",
  storageBucket: "meetings-30028.firebasestorage.app",
  messagingSenderId: "856086494633",
  appId: "1:856086494633:web:5730f1ad2f1f8fdfd818b8",
  measurementId: "G-BX9XSRG8NQ"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});
export const auth = getAuth(app);
