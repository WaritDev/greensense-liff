const initializeProfile = async (profile) => {
  // เพิ่มการบันทึกข้อมูลลง MongoDB
  try {
    const response = await fetch('/api/users/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        lastActive: new Date()
      })
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถบันทึกข้อมูลได้');
    }

    // ดึงข้อมูลการใช้งานล่าสุด
    const userData = await response.json();
    const lastLogin = new Date(userData.result?.lastLogin || Date.now());
    const lastLoginText = lastLogin.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8 relative">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
          <div class="relative">
            <img 
              width="80px" 
              height="80px" 
              src="${profile.pictureUrl}" 
              class="rounded-full border-4 border-green-400 mb-3 sm:mb-0"
              alt="${profile.displayName}'s profile"
            />
            <span class="absolute bottom-3 sm:bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div class="text-center sm:text-left">
            <div class="text-lg sm:text-xl font-semibold">
              <span class="text-green-600">${profile.displayName}</span>
            </div>
            <div class="text-sm text-gray-600">
              รหัสผู้ใช้: <span class="font-mono">${profile.userId}</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              <i class="fas fa-clock mr-1"></i> เข้าใช้งานล่าสุด: ${lastLoginText}
            </div>
          </div>
        </div>
        <div class="text-sm text-gray-500 border-t pt-3 mt-3">
          <div class="flex items-center justify-between">
            <span>
              <i class="fas fa-leaf text-green-500 mr-1"></i> สถานะ: 
              <span class="text-green-600">ออนไลน์</span>
            </span>
            <button 
              onclick="refreshProfile()"
              class="text-green-600 hover:text-green-700 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('profileComponent').innerHTML = template;

  } catch (error) {
    console.error('Error initializing profile:', error);
    showToast('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'error');
    
    // แสดงเทมเพลตแบบพื้นฐานในกรณีที่มีข้อผิดพลาด
    const fallbackTemplate = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8 relative">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
          <img 
            width="80px" 
            height="80px" 
            src="${profile.pictureUrl}" 
            class="rounded-full border-4 border-green-400 mb-3 sm:mb-0"
            alt="${profile.displayName}'s profile"
          />
          <div class="text-center sm:text-left">
            <div class="text-lg sm:text-xl font-semibold">
              <span class="text-green-600">${profile.displayName}</span>
            </div>
            <div class="text-sm text-gray-600">
              รหัสผู้ใช้: <span class="font-mono">${profile.userId}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('profileComponent').innerHTML = fallbackTemplate;
  }
};

// ฟังก์ชันสำหรับรีเฟรชข้อมูลโปรไฟล์
const refreshProfile = async () => {
  try {
    showLoading("กำลังรีเฟรชข้อมูล...");
    const profile = await liff.getProfile();
    await initializeProfile(profile);
  } catch (error) {
    console.error('Error refreshing profile:', error);
    showToast('ไม่สามารถรีเฟรชข้อมูลได้', 'error');
  } finally {
    hideLoading();
  }
};
