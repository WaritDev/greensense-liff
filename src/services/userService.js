// user-service.js
import { db } from './firebase-config';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveUserProfile = async (profile) => {
  try {
    const userRef = doc(db, 'users', profile.userId);
    const userSnap = await getDoc(userRef);
    const now = serverTimestamp();

    // สร้างข้อมูลพื้นฐาน
    const userData = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
      language: profile.language,
      lastActive: now,
      lastUpdated: now,
      // ข้อมูลอุปกรณ์
      deviceInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      // ข้อมูล Line Platform
      lineProfile: {
        isLineUser: true,
        isLineVerified: profile.verified || false,
        lineAccessToken: profile.accessToken || null
      }
    };

    // กรณีเป็นผู้ใช้ใหม่
    if (!userSnap.exists()) {
      userData.createdAt = now;
      userData.status = 'active';
      userData.userType = 'line';
      userData.settings = {
        notifications: true,
        theme: 'light',
        language: 'th'
      };
      userData.metrics = {
        totalVisits: 1,
        firstVisit: now,
        lastVisit: now
      };
    } else {
      // กรณีเป็นผู้ใช้เก่า อัพเดทข้อมูล
      const existingData = userSnap.data();
      userData.createdAt = existingData.createdAt;
      userData.settings = existingData.settings || userData.settings;
      userData.metrics = {
        ...existingData.metrics,
        totalVisits: (existingData.metrics?.totalVisits || 0) + 1,
        lastVisit: now
      };
    }

    // บันทึกข้อมูลหลัก
    await setDoc(userRef, userData, { merge: true });

    // บันทึกประวัติการเข้าใช้งาน
    const loginHistoryRef = collection(db, 'users', profile.userId, 'loginHistory');
    await addDoc(loginHistoryRef, {
      timestamp: now,
      deviceInfo: userData.deviceInfo,
      success: true,
      ipAddress: await fetchIPAddress(), // สร้างฟังก์ชันแยก
      location: await getGeolocation() // สร้างฟังก์ชันแยก
    });

    return userData;

  } catch (error) {
    console.error('Error saving user profile:', error);
    throw new Error('ไม่สามารถบันทึกข้อมูลผู้ใช้ได้');
  }
};

// ฟังก์ชันดึงข้อมูล IP Address
const fetchIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
};

// ฟังก์ชันดึงพิกัด
const getGeolocation = () => {
  return new Promise((resolve) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => resolve(null)
      );
    } else {
      resolve(null);
    }
  });
};
