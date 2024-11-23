import { connectToDatabase } from './mongodb';

export async function saveUserProfile(profile) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('users');

    // อัพเดทหรือสร้างข้อมูลใหม่
    const result = await collection.updateOne(
      { userId: profile.userId },
      {
        $set: {
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
          lastLogin: new Date(),
        }
      },
      { upsert: true } // สร้างใหม่ถ้ายังไม่มีข้อมูล
    );

    return result;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}
