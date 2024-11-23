// pages/api/save-user-log.js
import { writeFile, appendFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, displayName, timestamp } = req.body;
    
    // สร้างข้อมูล CSV
    const csvLine = `${userId},${displayName},${timestamp}\n`;
    
    // กำหนดพาธของไฟล์ CSV (ใน Vercel ควรใช้ tmp directory)
    const filePath = '/tmp/user_logs.csv';
    
    try {
      // พยายามเพิ่มข้อมูลต่อท้ายไฟล์
      await appendFile(filePath, csvLine);
    } catch (error) {
      // ถ้าไฟล์ยังไม่มีอยู่ ให้สร้างใหม่พร้อม header
      if (error.code === 'ENOENT') {
        const header = 'userId,displayName,timestamp\n';
        await writeFile(filePath, header + csvLine);
      } else {
        throw error;
      }
    }

    res.status(200).json({ success: true, message: 'บันทึกข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Error saving user log:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
  }
}
