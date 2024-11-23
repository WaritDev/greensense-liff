const updateFarmSummary = async (userId) => {
  try {
    // ดึงข้อมูลจาก Firebase
    const farmRef = database.ref(`users/${userId}/farms`);
    const snapshot = await farmRef.once('value');
    const farmData = snapshot.val();

    if (!farmData) {
      document.getElementById('farmSummaryComponent').innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
          <p class="text-center text-gray-500">ไม่พบข้อมูลแปลงเกษตร กดจัดการพื้นที่แปลงเกษตรเพื่อเริ่มต้น</p>
        </div>
      `;
      return;
    }

    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
        <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">ข้อมูลแปลงนาโดยรวม</h2>
        <div class="space-y-2 sm:space-y-3 flex-grow">
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>พิกัดละติจูด</span>
            <span class="font-semibold text-blue-600">${farmData.centerLocation.latitude.toFixed(6)}</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>พิกัดลองจิจูด</span>
            <span class="font-semibold text-blue-600">${farmData.centerLocation.longitude.toFixed(6)}</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>พื้นที่ (ตารางเมตร)</span>
            <span class="font-semibold text-green-600">${farmData.areaInSqm.toLocaleString()} ตร.ม.</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>พื้นที่ (ไร่)</span>
            <span class="font-semibold text-green-600">${farmData.sizeInRai.toFixed(2)} ไร่</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>วันที่บันทึกข้อมูล</span>
            <span class="font-semibold text-gray-600">${new Date(farmData.createdAt).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('farmSummaryComponent').innerHTML = template;

  } catch (error) {
    console.error('Error fetching farm data:', error);
    document.getElementById('farmSummaryComponent').innerHTML = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
        <p class="text-center text-green-500">กดจัดการพื้นที่แปลงเกษตรเพื่อเริ่มต้น</p>
      </div>
    `;
  }
};
