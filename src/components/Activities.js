const updateActivities = (activities) => {
  // ฟังก์ชันสำหรับแปลงประเภทกิจกรรมเป็นสีและไอคอน
  const getActivityStyle = (type) => {
    switch(type) {
      case 'planting':
        return {
          color: 'bg-green-500',
          icon: '🌱',
          label: 'ปลูก'
        };
      case 'maintenance':
        return {
          color: 'bg-blue-500',
          icon: '🔧',
          label: 'ดูแลรักษา'
        };
      case 'harvest':
        return {
          color: 'bg-amber-500',
          icon: '🌾',
          label: 'เก็บเกี่ยว'
        };
      case 'sale':
        return {
          color: 'bg-emerald-500',
          icon: '💰',
          label: 'ขาย'
        };
      case 'weather':
        return {
          color: 'bg-sky-500',
          icon: '🌤️',
          label: 'สภาพอากาศ'
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: '📝',
          label: 'อื่นๆ'
        };
    }
  };

  const template = `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">กิจกรรมในแปลงนา</h2>
      <div class="space-y-2 sm:space-y-3">
        ${activities.map(activity => {
          const style = getActivityStyle(activity.type);
          return `
            <div class="flex items-start space-x-3 p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base hover:bg-gray-100 transition-colors">
              <div class="flex flex-col items-center space-y-1 pt-1">
                <div class="w-2 h-2 rounded-full ${style.color}"></div>
                <div class="text-xl" title="${style.label}">${style.icon}</div>
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div class="text-xs sm:text-sm text-gray-600">
                    ${new Date(activity.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full ${style.color} bg-opacity-10 text-gray-700">
                    ${style.label}
                  </span>
                </div>
                <div class="mt-1">${activity.description}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      ${activities.length === 0 ? `
        <div class="text-center text-gray-500 py-4">
          ยังไม่มีกิจกรรม
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('activitiesComponent').innerHTML = template;
};
