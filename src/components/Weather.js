// ฟังก์ชันสำหรับดึงข้อมูลพิกัดจาก Firebase
const getFarmLocation = async (userId) => {
  try {
    const userRef = database.ref(`users/${userId}/farms`);
    const snapshot = await userRef.once('value');
    const farmData = snapshot.val();

    // ถ้าไม่มีข้อมูลใน Firebase ให้ลองดึงจาก localStorage
    if (!farmData) {
      const storedFarmArea = localStorage.getItem("farmArea");
      if (storedFarmArea) {
        const localData = JSON.parse(storedFarmArea);
        return {
          latitude: localData.center.lat,
          longitude: localData.center.lng
        };
      }
      throw new Error('ไม่พบข้อมูลพิกัดฟาร์ม');
    }

    if (!farmData) {
      document.getElementById('farmSummaryComponent').innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
          <p class="text-center text-gray-500">ไม่พบข้อมูลแปลงเกษตร</p>
        </div>
      `;
      return;
    }

    return {
      latitude: farmData.centerLocation.latitude,
      longitude: farmData.centerLocation.longitude
    };
  } catch (error) {
    console.error('Error getting farm location:', error);
    throw error;
  }
};

// ปรับปรุงฟังก์ชัน fetchWeatherData
const fetchWeatherData = async () => {
  try {
    // ดึงข้อมูลพิกัดจาก Firebase
    const location = await getFarmLocation(state.userId);
    
    // สร้าง URL สำหรับ API call
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=729d42b6df004d3cb8d102651242211&q=${location.latitude},${location.longitude}&lang=th`;
    
    // เรียก API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Weather API response was not ok');
    }
    
    const data = await response.json();
    updateWeatherCard(data);

    // บันทึกข้อมูลสภาพอากาศล่าสุดลง localStorage เผื่อกรณี offline
    localStorage.setItem('lastWeatherData', JSON.stringify({
      data: data,
      timestamp: new Date().getTime()
    }));

  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // ถ้าเกิดข้อผิดพลาด ให้ลองดึงข้อมูลจาก localStorage
    const lastWeatherData = localStorage.getItem('lastWeatherData');
    if (lastWeatherData) {
      const { data, timestamp } = JSON.parse(lastWeatherData);
      const timeDiff = (new Date().getTime() - timestamp) / (1000 * 60); // แปลงเป็นนาที
      
      // ถ้าข้อมูลไม่เก่าเกิน 30 นาที ให้แสดงข้อมูลจาก localStorage
      if (timeDiff <= 30) {
        updateWeatherCard(data);
        
      } else {
        // ถ้าข้อมูลเก่าเกิน 30 นาที
        document.getElementById('weatherCardComponent').innerHTML = `
          <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
            <div class="text-center text-gray-500">
              <p>ไม่สามารถโหลดข้อมูลสภาพอากาศได้</p>
              <p class="text-sm mt-2">กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p>
            </div>
          </div>
        `;
      }
    }
  }
};


const updateWeatherCard = (weatherData) => {
  const localTime = new Date(weatherData.location.localtime).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });

  const template = `
    <div class="bg-white rounded-lg shadow-md p-3 sm:p-6 h-full">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h2 class="text-base sm:text-xl font-semibold">สภาพอากาศปัจจุบัน</h2>
          <p class="text-xs sm:text-sm text-gray-500">${weatherData.location.name}, ${weatherData.location.region}</p>
        </div>
        <span class="text-xs sm:text-sm text-gray-500">${localTime}</span>
      </div>
      
      <div class="flex items-center justify-center mb-4 sm:mb-6">
        <div class="text-center">
          <img src="${weatherData.current.condition.icon}" 
               alt="${weatherData.current.condition.text}"
               class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-2">
          <p class="text-gray-600 text-base sm:text-lg">${weatherData.current.condition.text}</p>
          <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">${weatherData.current.temp_c}°C</p>
          <p class="text-xs sm:text-sm text-gray-500">รู้สึกเหมือน ${weatherData.current.feelslike_c}°C</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:gap-3">
        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ความชื้น</div>
          <div class="text-sm sm:text-base font-semibold text-blue-600">${weatherData.current.humidity}%</div>
        </div>

        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ความเร็วลม</div>
          <div class="text-sm sm:text-base font-semibold text-blue-600">${weatherData.current.wind_kph} กม./ชม.</div>
        </div>

        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ทิศทางลม</div>
          <div class="text-sm sm:text-base font-semibold text-blue-600">${weatherData.current.wind_dir}</div>
        </div>

        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ความกดอากาศ</div>
          <div class="text-sm sm:text-base font-semibold text-blue-600">${weatherData.current.pressure_mb} มิลลิบาร์</div>
        </div>

        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ทัศนวิสัย</div>
          <div class="text-sm sm:text-base font-semibold text-blue-600">${weatherData.current.vis_km} กม.</div>
        </div>

        <div class="p-2 sm:p-3 bg-blue-50 rounded">
          <div class="text-xs sm:text-sm text-gray-500">ปริมาณน้ำฝน</div>
          <div class="text-sm sm:text-base font-semibold ${weatherData.current.precip_mm > 0 ? 'text-blue-600' : 'text-amber-600'}">
            ${weatherData.current.precip_mm} มม.
          </div>
        </div>
      </div>

      <div class="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 text-right">
        อัพเดทล่าสุด: ${new Date(weatherData.current.last_updated).toLocaleString('th-TH')}
      </div>
    </div>
  `;

  document.getElementById('weatherCardComponent').innerHTML = template;

  
};

// ปรับปรุงการเรียกใช้งานฟังก์ชัน
const initializeWeather = () => {
  // เรียกครั้งแรก
  fetchWeatherData();
  
  // ตั้งเวลาอัพเดททุก 5 นาที
  setInterval(fetchWeatherData, 5 * 60 * 1000);
  
  // เพิ่ม event listener สำหรับการกลับมาออนไลน์
  window.addEventListener('online', fetchWeatherData);
};

// เรียกใช้งานใน main function หรือหลังจาก initialize แอพ
initializeWeather();