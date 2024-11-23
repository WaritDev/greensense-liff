import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { db } = await connectToDatabase();
        const { userId, displayName, timestamp, platform, lastAccess } = req.body;

        const result = await db.collection('users').updateOne(
            { userId: userId },
            {
                $set: {
                    displayName,
                    platform,
                    lastAccess
                },
                $push: {
                    accessLogs: {
                        timestamp,
                        action: 'login'
                    }
                }
            },
            { upsert: true }
        );

        return res.status(200).json({
            message: 'บันทึกข้อมูลสำเร็จ',
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
            success: false,
            error: error.message
        });
    }
}
