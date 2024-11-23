// สร้าง namespace สำหรับแอพพลิเคชัน
window.weatherApp = {};

// ฟังก์ชันสำหรับแปลงระดับความรุนแรงเป็นสีและไอคอน
window.weatherApp.getAlertStyle = (severity) => {
  switch(severity.toLowerCase()) {
    case 'extreme':
      return {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: '⚠️',
        label: 'รุนแรงมาก'
      };
    case 'severe':
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: '⚡',
        label: 'รุนแรง'
      };
    case 'moderate':
      return {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: '⚪',
        label: 'ปานกลาง'
      };
    case 'minor':
      return {
        color: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: 'ℹ️',
        label: 'เล็กน้อย'
      };
    default:
      return {
        color: 'bg-gray-500',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: '📝',
        label: 'ไม่ระบุ'
      };
  }
};

// ฟังก์ชันอัพเดท UI
window.weatherApp.updateAlerts = (alertData) => {
  const alertCardElement = document.getElementById('alertCardComponent');
  if (!alertCardElement) {
    console.error('ไม่พบ element ที่มี id "alertCardComponent"');
    return;
  }

  const alerts = alertData.alerts?.alert || [];
  const template = `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h2 class="text-base sm:text-xl font-semibold">การแจ้งเตือนภัยพิบัติ</h2>
          <p class="text-xs sm:text-sm text-gray-500">${alertData.location?.name || ''}, ${alertData.location?.region || ''}</p>
        </div>
        <span class="text-xs sm:text-sm text-gray-500">
          ${new Date().toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      ${alerts.length > 0 ? `
        <div class="space-y-2 sm:space-y-3">
          ${alerts.map(alert => {
            const style = window.weatherApp.getAlertStyle(alert.severity);
            return `
              <div class="p-3 sm:p-4 ${style.bgColor} rounded-lg border border-${style.textColor}/20">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0">
                    <div class="text-xl" title="${style.label}">${style.icon}</div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-sm font-medium ${style.textColor}">
                        ระดับ: ${style.label}
                      </span>
                      <span class="text-xs text-gray-500">
                        ${new Date(alert.effective).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <h3 class="text-sm sm:text-base font-medium mb-1">${alert.event}</h3>
                    <p class="text-sm text-gray-600">${alert.desc}</p>
                    ${alert.instruction ? `
                      <div class="mt-2 p-2 bg-white/50 rounded">
                        <p class="text-sm text-gray-600"><strong>คำแนะนำ:</strong> ${alert.instruction}</p>
                      </div>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="text-center py-8">
          <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-gray-600">ไม่พบการแจ้งเตือนในขณะนี้</p>
        </div>
      `}

      <div class="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 text-right">
        อัพเดทล่าสุด: ${new Date(alertData.current?.last_updated || Date.now()).toLocaleString('th-TH')}
      </div>
    </div>
  `;

  alertCardElement.innerHTML = template;
};

// ฟังก์ชันดึงข้อมูลพิกัด
window.weatherApp.getFarmLocation = async (userId) => {
  try {
    const userRef = database.ref(`users/${userId}/farms`);
    const snapshot = await userRef.once("value");
    const farmData = snapshot.val();

    if (!farmData) {
      const storedFarmArea = localStorage.getItem("farmArea");
      if (storedFarmArea) {
        const localData = JSON.parse(storedFarmArea);
        return {
          latitude: localData.center.lat,
          longitude: localData.center.lng,
        };
      }
      document.getElementById('farmSummaryComponent').innerHTML = `
          <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
            <p class="text-center text-gray-500">ไม่พบข้อมูลแปลงเกษตร</p>
          </div>
        `;
        return;
      throw new Error("ไม่พบข้อมูลพิกัดฟาร์ม");
    }

    return {
      latitude: farmData.centerLocation.latitude,
      longitude: farmData.centerLocation.longitude,
    };
  } catch (error) {
    console.error("Error getting farm location:", error);
    throw error;
  }
};

// ฟังก์ชันดึงข้อมูลการแจ้งเตือน
window.weatherApp.fetchAlertData = async () => {
  try {
    if (!state.userId) {
      throw new Error("ไม่พบ userId");
    }

    const location = await window.weatherApp.getFarmLocation(state.userId);
    const apiUrl = `https://api.weatherapi.com/v1/alerts.json?key=729d42b6df004d3cb8d102651242211&q=${location.latitude},${location.longitude}&lang=th`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather API response was not ok");
    }

    const data = await response.json();
    window.weatherApp.updateAlerts(data);

    localStorage.setItem(
      "lastAlertData",
      JSON.stringify({
        data: data,
        timestamp: new Date().getTime(),
      })
    );
  } catch (error) {
    console.error("Error fetching alert data:", error);

    const lastAlertData = localStorage.getItem("lastAlertData");
    if (lastAlertData) {
      const { data, timestamp } = JSON.parse(lastAlertData);
      const timeDiff = (new Date().getTime() - timestamp) / (1000 * 60);

      if (timeDiff <= 30) {
        window.weatherApp.updateAlerts(data);
      } else {
        const alertCardElement = document.getElementById("alertCardComponent");
        if (alertCardElement) {
          alertCardElement.innerHTML = `
            <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <div class="text-center text-gray-500">
                <p>ไม่สามารถโหลดข้อมูลการแจ้งเตือนได้</p>
                <p class="text-sm mt-2">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p>
              </div>
            </div>
          `;
        }
      }
    }
  }
};

// ฟังก์ชัน initialize
window.weatherApp.initialize = () => {
  if (typeof state === 'undefined' || !state.userId) {
    console.error('state หรือ userId ไม่ถูกกำหนด');
    return;
  }

  window.weatherApp.fetchAlertData();
  setInterval(window.weatherApp.fetchAlertData, 5 * 60 * 1000);
  window.addEventListener("online", window.weatherApp.fetchAlertData);
};

// เรียกใช้งานเมื่อ document พร้อม
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('alertCardComponent')) {
    window.weatherApp.initialize();
  }
});
