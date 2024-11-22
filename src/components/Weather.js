const fetchWeatherData = async () => {
  try {
    const response = await fetch('https://api.weatherapi.com/v1/current.json?key=729d42b6df004d3cb8d102651242211&q=14.235,100.5018&lang=th');
    const data = await response.json();
    updateWeatherCard(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
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

// เรียกใช้งานฟังก์ชัน
fetchWeatherData();

// อัพเดทข้อมูลทุก 5 นาที
setInterval(fetchWeatherData, 5 * 60 * 1000);