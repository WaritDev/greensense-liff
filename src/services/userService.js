// src/services/user-service.js
import { db } from '../firebase-config';  // ต้องมีการตั้งค่า Firebase ก่อน
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function saveUserProfile(profile) {
    try {
        const userRef = doc(db, 'users', profile.userId);
        
        const userData = {
            ...profile,
            lastUpdated: serverTimestamp(),
            lastLogin: serverTimestamp()
        };

        await setDoc(userRef, userData, { merge: true });
        return userData;
        
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}
