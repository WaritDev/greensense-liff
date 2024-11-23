// src/api/userLog.js
import fs from 'fs';
import path from 'path';

export const saveUserLog = async (userData) => {
  try {
    const logPath = path.join(process.cwd(), 'src', 'data', 'user_logs.csv');
    const logDir = path.dirname(logPath);

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // สร้างข้อมูล CSV
    const csvLine = `${userData.userId},${userData.displayName},${userData.timestamp}\n`;

    // ถ้าไฟล์ยังไม่มี ให้สร้าง header
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, 'userId,displayName,timestamp\n');
    }

    // เขียนข้อมูลต่อท้ายไฟล์
    fs.appendFileSync(logPath, csvLine);

    return { success: true };
  } catch (error) {
    console.error('Error saving user log:', error);
    throw new Error('ไม่สามารถบันทึกข้อมูลได้');
  }
};

export const readUserLogs = () => {
  try {
    const logPath = path.join(process.cwd(), 'src', 'data', 'user_logs.csv');
    
    if (!fs.existsSync(logPath)) {
      return [];
    }

    const content = fs.readFileSync(logPath, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        return {
          userId: values[0],
          displayName: values[1],
          timestamp: values[2]
        };
      });
  } catch (error) {
    console.error('Error reading user logs:', error);
    throw new Error('ไม่สามารถอ่านข้อมูลได้');
  }
};

