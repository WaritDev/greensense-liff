const updateActivities = (activities) => {
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">กิจกรรมล่าสุด</h2>
        <div class="space-y-2 sm:space-y-3">
          ${activities.map(activity => `
            <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded text-sm sm:text-base">
              <div class="w-2 h-2 rounded-full ${
                activity.type === 'add' ? 'bg-blue-500' :
                activity.type === 'sale' ? 'bg-green-500' : 'bg-yellow-500'
              }"></div>
              <div class="flex-1">
                <div class="text-xs sm:text-sm text-gray-600">${activity.date}</div>
                <div>${activity.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  
    document.getElementById('activitiesComponent').innerHTML = template;
  };