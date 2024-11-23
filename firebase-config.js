// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYWx9i06SUNJubzqRmMz0a4eDGxIDHjuY",
  authDomain: "greensense-7b257.firebaseapp.com",
  projectId: "greensense-7b257",
  storageBucket: "greensense-7b257.firebasestorage.app",
  messagingSenderId: "466569052274",
  appId: "1:466569052274:web:77f6c889e784d6cc1402eb",
  measurementId: "G-RJDZ5D1Y01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);