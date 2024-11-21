const initializeProfile = (profile) => {
    const template = `
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-4 mb-4">
          <img width="80px" height="80px" src="${profile.pictureUrl}" class="rounded-full border-4 border-green-400 mb-3 sm:mb-0"/>
          <div class="text-center sm:text-left">
            <div class="text-lg sm:text-xl font-semibold">สวัสดี คุณ <span class="text-green-600">${profile.displayName}</span></div>
            <div class="text-sm text-gray-600">รหัสผู้ใช้: <span class="font-mono">${profile.userId}</span></div>
          </div>
        </div>
        
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input id="lineMessage" type="text" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="พิมพ์ข้อความ...">
          <button onclick="handleSendMessage()" class="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
            ส่งข้อความ
          </button>
        </div>
      </div>
    `;
  
    document.getElementById('profileComponent').innerHTML = template;
  };
  
  const handleSendMessage = async () => {
    const messageInput = document.getElementById('lineMessage');
    await sendMessage(messageInput.value);
    messageInput.value = '';
  };