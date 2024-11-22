const initializeProfile = (profile) => {
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
          <img width="80px" height="80px" src="${profile.pictureUrl}" class="rounded-full border-4 border-green-400 mb-3 sm:mb-0"/>
          <div class="text-center sm:text-left">
            <div class="text-lg sm:text-xl font-semibold"> <span class="text-green-600">${profile.displayName}</span></div>
            <div class="text-sm text-gray-600">รหัสผู้ใช้: <span class="font-mono">${profile.userId}</span></div>
          </div>
        </div>
    `;
  
    document.getElementById('profileComponent').innerHTML = template;
  };