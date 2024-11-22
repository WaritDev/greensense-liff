const updateFarmSummary = (data) => {
  const template = `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
      <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">ข้อมูลแปลงนาโดยรวม</h2>
      <div class="space-y-2 sm:space-y-3 flex-grow">
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>พื้นที่ทั้งหมด</span>
          <span class="font-semibold text-green-600">${data.totalFields} ไร่</span>
        </div>
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>พื้นที่ที่ปลูกแล้ว</span>
          <span class="font-semibold text-green-600">${data.totalPlantedArea} ไร่</span>
        </div>
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>ผลผลิตที่คาดว่าจะได้</span>
          <span class="font-semibold text-green-600">${data.expectedYield.toLocaleString()} กก.</span>
        </div>
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>รายได้รวม (บาท)</span>
          <span class="font-semibold text-green-600">${data.totalIncome.toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>พื้นที่ว่าง</span>
          <span class="font-semibold text-amber-600">${(data.totalFields - data.totalPlantedArea).toLocaleString()} ไร่</span>
        </div>
        <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
          <span>อัตราการใช้พื้นที่</span>
          <span class="font-semibold ${(data.totalPlantedArea/data.totalFields)*100 >= 80 ? 'text-green-600' : 'text-amber-600'}">
            ${((data.totalPlantedArea/data.totalFields)*100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('farmSummaryComponent').innerHTML = template;
};
