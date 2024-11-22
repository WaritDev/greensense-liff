const loadFarmData = async () => {
  try {
    const mockData = {
      totalFields: 150, // จำนวนไร่ทั้งหมด
      totalPlantedArea: 120, // พื้นที่ที่ปลูกแล้ว (ไร่)
      expectedYield: 100000, // ผลผลิตที่คาดว่าจะได้ (กิโลกรัม)
      totalIncome: 1500000, // รายได้รวม (บาท)
      activities: [
        { 
          date: '2024-11-21', 
          description: 'หว่านเมล็ดพันธุ์แปลง A (พื้นที่ 20 ไร่)', 
          type: 'planting' 
        },
        { 
          date: '2024-11-20', 
          description: 'ฉีดพ่นปุ๋ยแปลง B', 
          type: 'maintenance' 
        },
        { 
          date: '2024-11-19', 
          description: 'เก็บเกี่ยวแปลง C ได้ผลผลิต 15,000 กก.', 
          type: 'harvest' 
        }
      ]
    };
    return mockData;
  } catch (error) {
    console.error('Error loading farm data:', error);
    throw error;
  }
};

const loadFarmDataFromCSV = async () => {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const csvText = await response.text();
    
    const rows = csvText.split('\n').map(row => 
      row.split(',').map(cell => cell.trim())
    );
    
    const validRows = rows.filter(row => row.length > 1 && row[0]);
    const headers = validRows[0];
    const data = validRows.slice(1);
    
    // ค้นหา column ที่เกี่ยวข้องกับ LINE UID
    const uidIndex = headers.findIndex(header => 
      header.toLowerCase().includes('line') || header.toLowerCase().includes('uid')
    );
    
    if (uidIndex === -1) {
      throw new Error('LINE UID column not found in CSV');
    }

    // กรองข้อมูลเฉพาะของเกษตรกรคนนั้นๆ
    const userFarms = data.filter(row => row[uidIndex] === userId);
    
    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    const farmData = userFarms.map(row => ({
      fieldId: row[headers.findIndex(h => h.includes('field'))],
      area: parseFloat(row[headers.findIndex(h => h.includes('area'))]),
      cropType: row[headers.findIndex(h => h.includes('crop'))],
      plantingDate: row[headers.findIndex(h => h.includes('planting'))],
      expectedHarvestDate: row[headers.findIndex(h => h.includes('harvest'))],
      status: row[headers.findIndex(h => h.includes('status'))]
    }));
    
    return farmData;
  } catch (error) {
    console.error('Error loading farm data from CSV:', error);
    return [];
  }
};
