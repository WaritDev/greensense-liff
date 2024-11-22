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
    // แปลงเวลาให้เป็นรูปแบบไทย
    const localTime = new Date(weatherData.location.localtime).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-lg sm:text-xl font-semibold">สภาพอากาศปัจจุบัน</h2>
            <p class="text-sm text-gray-500">${weatherData.location.name}, ${weatherData.location.region}</p>
          </div>
          <span class="text-sm text-gray-500">${localTime}</span>
        </div>
        
        <div class="flex items-center justify-center mb-6">
          <div class="text-center">
            <img src="${weatherData.current.condition.icon}" 
                 alt="${weatherData.current.condition.text}"
                 class="w-20 h-20 mx-auto mb-2">
            <p class="text-gray-600 text-lg">${weatherData.current.condition.text}</p>
            <p class="text-3xl font-bold text-blue-600 mt-2">${weatherData.current.temp_c}°C</p>
            <p class="text-sm text-gray-500">รู้สึกเหมือน ${weatherData.current.feelslike_c}°C</p>
          </div>
        </div>
  
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ความชื้น</div>
            <div class="font-semibold text-blue-600">${weatherData.current.humidity}%</div>
          </div>
  
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ความเร็วลม</div>
            <div class="font-semibold text-blue-600">${weatherData.current.wind_kph} กม./ชม.</div>
          </div>
  
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ทิศทางลม</div>
            <div class="font-semibold text-blue-600">${weatherData.current.wind_dir}</div>
          </div>
  
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ความกดอากาศ</div>
            <div class="font-semibold text-blue-600">${weatherData.current.pressure_mb} มิลลิบาร์</div>
          </div>
  
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ทัศนวิสัย</div>
            <div class="font-semibold text-blue-600">${weatherData.current.vis_km} กม.</div>
          </div>
  
          <div class="p-3 bg-blue-50 rounded">
            <div class="text-sm text-gray-500">ปริมาณน้ำฝน</div>
            <div class="font-semibold ${weatherData.current.precip_mm > 0 ? 'text-blue-600' : 'text-amber-600'}">
              ${weatherData.current.precip_mm} มม.
            </div>
          </div>
        </div>
  
        <div class="mt-4 text-xs text-gray-500 text-right">
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
  