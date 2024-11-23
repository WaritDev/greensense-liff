// ฟังก์ชันสำหรับดึงข้อมูลพิกัดจาก Firebase
const getFarmLocation = async (userId) => {
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
const fetchAlertData = async () => {
  try {
    const location = await getFarmLocation(state.userId);

    const apiUrl = `https://api.weatherapi.com/v1/alerts.json?key=729d42b6df004d3cb8d102651242211&q=${location.latitude},${location.longitude}&lang=th`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather API response was not ok");
    }

    const data = await response.json();
    updateAlertCard(data);

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
        updateAlertCard(data);
      } else {
        document.getElementById("alertCardComponent").innerHTML = `
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
};

const updateAlertCard = (alertData) => {
  const alerts = alertData.alerts.alert;
  const localTime = new Date().toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ฟังก์ชันสำหรับแปลงระดับความรุนแรงเป็นสีและข้อความ
  const getSeverityInfo = (severity) => {
    switch (severity.toLowerCase()) {
      case "extreme":
        return { color: "red-600", text: "รุนแรงมาก", bgColor: "red-50" };
      case "severe":
        return { color: "orange-600", text: "รุนแรง", bgColor: "orange-50" };
      case "moderate":
        return { color: "yellow-600", text: "ปานกลาง", bgColor: "yellow-50" };
      case "minor":
        return { color: "blue-600", text: "เล็กน้อย", bgColor: "blue-50" };
      default:
        return { color: "gray-600", text: "ไม่ระบุ", bgColor: "gray-50" };
    }
  };

  const template = `
      <div class="bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-3 sm:mb-4">
          <div>
            <h2 class="text-base sm:text-xl font-semibold">การแจ้งเตือนภัยพิบัติ</h2>
            <p class="text-xs sm:text-sm text-gray-500">${
              alertData.location.name
            }, ${alertData.location.region}</p>
          </div>
          <span class="text-xs sm:text-sm text-gray-500">${localTime}</span>
        </div>
  
        ${
          alerts.length > 0
            ? `
          <div class="space-y-3">
            ${alerts
              .map((alert) => {
                const severityInfo = getSeverityInfo(alert.severity);
                return `
                <div class="p-3 sm:p-4 bg-${
                  severityInfo.bgColor
                } rounded-lg border border-${severityInfo.color}/20">
                  <div class="flex items-start gap-3">
                    <div class="flex-shrink-0">
                      ${
                        alert.severity === "extreme"
                          ? `
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                      `
                          : `
                        <svg class="w-6 h-6 text-${severityInfo.color}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      `
                      }
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-medium text-${
                          severityInfo.color
                        }">
                          ระดับ: ${severityInfo.text}
                        </span>
                        <span class="text-xs text-gray-500">
                          ${new Date(alert.effective).toLocaleString("th-TH")}
                        </span>
                      </div>
                      <h3 class="text-sm sm:text-base font-medium mb-1">${
                        alert.event
                      }</h3>
                      <p class="text-sm text-gray-600">${alert.desc}</p>
                      ${
                        alert.instruction
                          ? `
                        <div class="mt-2 p-2 bg-white/50 rounded">
                          <p class="text-sm text-gray-600"><strong>คำแนะนำ:</strong> ${alert.instruction}</p>
                        </div>
                      `
                          : ""
                      }
                    </div>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `
            : `
          <div class="text-center py-8">
            <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-600">ไม่พบการแจ้งเตือนในขณะนี้</p>
          </div>
        `
        }
        
        <div class="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 text-right">
          อัพเดทล่าสุด: ${new Date(
            alertData.current.last_updated
          ).toLocaleString("th-TH")}
        </div>
      </div>
    `;

  document.getElementById("alertCardComponent").innerHTML = template;
};

// ฟังก์ชัน initialize
const initializeAlerts = () => {
  fetchAlertData();
  setInterval(fetchAlertData, 5 * 60 * 1000);
  window.addEventListener("online", fetchAlertData);
};

// เรียกใช้งาน
initializeAlerts();
