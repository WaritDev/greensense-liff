const updateFarmSensorData = (farms) => {
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">ข้อมูลเซนเซอร์ฟาร์ม</h2>
        <div class="space-y-4">
          ${farms.length ? farms.map(farm => `
            <div class="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
              <div class="mb-4">
                <div class="flex justify-between items-center mb-3">
                  <div>
                    <div class="text-sm font-medium text-gray-600">Farm ID</div>
                    <div class="text-lg font-semibold text-gray-900">${farm[0]}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-600">พิกัด</div>
                    <div class="text-sm text-gray-900">${farm[2]}, ${farm[3]}</div>
                  </div>
                </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div class="sensor-card">
                  <div class="sensor-label">อุณหภูมิ</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[4]}</span>
                    <span class="sensor-unit">°C</span>
                  </div>
                </div>
  
                <div class="sensor-card">
                  <div class="sensor-label">ความชื้น</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[5]}</span>
                    <span class="sensor-unit">%</span>
                  </div>
                </div>
  
                <div class="sensor-card">
                  <div class="sensor-label">ความเข้มแสง</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[6]}</span>
                    <span class="sensor-unit">lux</span>
                  </div>
                </div>
  
                <div class="sensor-card">
                  <div class="sensor-label">ความชื้นในดิน</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[7]}</span>
                    <span class="sensor-unit">%</span>
                  </div>
                </div>
  
                <div class="sensor-card">
                  <div class="sensor-label">ปริมาณน้ำฝน</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[8]}</span>
                    <span class="sensor-unit">mm</span>
                  </div>
                </div>
  
                <div class="sensor-card">
                  <div class="sensor-label">ความเร็วลม</div>
                  <div class="flex items-baseline">
                    <span class="sensor-value">${farm[9]}</span>
                    <span class="sensor-unit">m/s</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="text-center p-4 text-gray-500">
              ไม่พบข้อมูลฟาร์มสำหรับผู้ใช้นี้
            </div>
          `}
        </div>
      </div>
    `;
  
    document.getElementById('farmSensorComponent').innerHTML = template;
  };