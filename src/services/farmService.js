const loadFarmData = async () => {
    try {
      const mockData = {
        totalHouses: 5,
        totalAnimals: 1500,
        totalIncome: 250000,
        activities: [
          { date: '2024-11-21', description: 'เพิ่มไก่ใหม่ 100 ตัว', type: 'add' },
          { date: '2024-11-20', description: 'ขายไข่ได้ 1,000 ฟอง', type: 'sale' },
          { date: '2024-11-19', description: 'ทำวัคซีนโรงเรือน A', type: 'health' }
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
      
      const uidIndex = headers.findIndex(header => 
        header.toLowerCase().includes('line') || header.toLowerCase().includes('uid')
      );
      
      if (uidIndex === -1) {
        throw new Error('LINE UID column not found in CSV');
      }
  
      const userFarms = data.filter(row => row[uidIndex] === userId);
      return userFarms;
    } catch (error) {
      console.error('Error loading farm data from CSV:', error);
      return [];
    }
  };