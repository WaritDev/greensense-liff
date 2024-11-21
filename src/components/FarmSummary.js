const updateFarmSummary = (data) => {
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
        <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">ข้อมูลฟาร์มโดยรวม</h2>
        <div class="space-y-2 sm:space-y-3 flex-grow">
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>จำนวนโรงเรือนทั้งหมด</span>
            <span class="font-semibold text-green-600">${data.totalHouses}</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>จำนวนสัตว์ทั้งหมด</span>
            <span class="font-semibold text-green-600">${data.totalAnimals.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
            <span>รายได้รวม (บาท)</span>
            <span class="font-semibold text-green-600">${data.totalIncome.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  
    document.getElementById('farmSummaryComponent').innerHTML = template;
  };