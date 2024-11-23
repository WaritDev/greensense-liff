// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCYWx9i06SUNJubzqRmMz0a4eDGxIDHjuY",
  authDomain: "greensense-7b257.firebaseapp.com",
  projectId: "greensense-7b257",
  storageBucket: "greensense-7b257.firebasestorage.app",
  messagingSenderId: "466569052274",
  appId: "1:466569052274:web:77f6c889e784d6cc1402eb",
  measurementId: "G-RJDZ5D1Y01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };
