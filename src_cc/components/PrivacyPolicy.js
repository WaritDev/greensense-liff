const createPrivacyPolicyModal = () => {
  // Terms of Service Content
  const termsContent = `
    <div class="prose prose-sm">
      <h3 class="text-lg font-semibold mb-4">ข้อกำหนดและเงื่อนไขการใช้บริการ GreenSense</h3>
      
      <h4 class="font-medium mt-4 mb-2">1. คำนิยาม</h4>
      <p>"บริการ" หมายถึง แพลตฟอร์ม GreenSense และบริการที่เกี่ยวข้องทั้งหมด</p>
      <p>"ผู้ใช้" หมายถึง บุคคลหรือนิติบุคคลที่ใช้บริการ GreenSense</p>
      <p>"บริษัท" หมายถึง บริษัทผู้ให้บริการ GreenSense</p>

      <h4 class="font-medium mt-4 mb-2">2. การใช้บริการ</h4>
      <p>2.1 ผู้ใช้ต้องมีอายุไม่ต่ำกว่า 20 ปีบริบูรณ์</p>
      <p>2.2 ผู้ใช้ต้องให้ข้อมูลที่ถูกต้องและเป็นจริงในการลงทะเบียน</p>
      <p>2.3 ผู้ใช้ต้องรักษาความลับของข้อมูลการเข้าสู่ระบบ</p>

      <h4 class="font-medium mt-4 mb-2">3. ข้อจำกัดความรับผิดชอบ</h4>
      <p>3.1 บริษัทไม่รับประกันความถูกต้องของข้อมูลที่แสดงผลแบบเรียลไทม์</p>
      <p>3.2 บริษัทไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้บริการ</p>

      <h4 class="font-medium mt-4 mb-2">4. ทรัพย์สินทางปัญญา</h4>
      <p>4.1 ข้อมูลและเนื้อหาทั้งหมดในบริการเป็นทรัพย์สินของบริษัท</p>
      <p>4.2 ห้ามคัดลอก ดัดแปลง หรือเผยแพร่โดยไม่ได้รับอนุญาต</p>

      <h4 class="font-medium mt-4 mb-2">5. การยกเลิกบริการ</h4>
      <p>5.1 บริษัทมีสิทธิ์ระงับหรือยกเลิกบริการได้โดยไม่ต้องแจ้งล่วงหน้า</p>
      <p>5.2 ผู้ใช้สามารถยกเลิกการใช้บริการได้ตลอดเวลา</p>
    </div>
  `;

  // Privacy Policy Content
  const privacyContent = `
    <div class="prose prose-sm">
      <h3 class="text-lg font-semibold mb-4">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</h3>

      <h4 class="font-medium mt-4 mb-2">1. ข้อมูลที่เราเก็บรวบรวม</h4>
      <p>1.1 ข้อมูลส่วนบุคคล:</p>
      <ul class="list-disc ml-6">
        <li>ชื่อ-นามสกุล</li>
        <li>ที่อยู่</li>
        <li>เบอร์โทรศัพท์</li>
        <li>อีเมล</li>
        <li>LINE ID</li>
      </ul>

      <p class="mt-2">1.2 ข้อมูลการเกษตร:</p>
      <ul class="list-disc ml-6">
        <li>พิกัดแปลงเกษตร</li>
        <li>ขนาดพื้นที่</li>
        <li>ชนิดพืชที่ปลูก</li>
        <li>ข้อมูลการจัดการแปลง</li>
        <li>ข้อมูลจากเซ็นเซอร์ต่างๆ</li>
      </ul>

      <h4 class="font-medium mt-4 mb-2">2. วัตถุประสงค์ในการเก็บข้อมูล</h4>
      <ul class="list-disc ml-6">
        <li>เพื่อให้บริการระบบจัดการฟาร์ม</li>
        <li>เพื่อวิเคราะห์และให้คำแนะนำด้านการเกษตร</li>
        <li>เพื่อพัฒนาและปรับปรุงบริการ</li>
        <li>เพื่อติดต่อและให้ความช่วยเหลือ</li>
      </ul>

      <h4 class="font-medium mt-4 mb-2">3. การเปิดเผยข้อมูล</h4>
      <p>เราอาจเปิดเผยข้อมูลให้กับ:</p>
      <ul class="list-disc ml-6">
        <li>พนักงานและผู้ให้บริการที่เกี่ยวข้อง</li>
        <li>หน่วยงานราชการตามกฎหมาย</li>
        <li>พันธมิตรทางธุรกิจ (เฉพาะเมื่อได้รับความยินยอม)</li>
      </ul>

      <h4 class="font-medium mt-4 mb-2">4. การรักษาความปลอดภัย</h4>
      <p>เรามีมาตรการรักษาความปลอดภัยดังนี้:</p>
      <ul class="list-disc ml-6">
        <li>การเข้ารหัสข้อมูล</li>
        <li>การจำกัดการเข้าถึงข้อมูล</li>
        <li>การสำรองข้อมูล</li>
        <li>การตรวจสอบระบบความปลอดภัยสม่ำเสมอ</li>
      </ul>

      <h4 class="font-medium mt-4 mb-2">5. สิทธิของเจ้าของข้อมูล</h4>
      <p>ท่านมีสิทธิดังต่อไปนี้:</p>
      <ul class="list-disc ml-6">
        <li>สิทธิในการเข้าถึงข้อมูล</li>
        <li>สิทธิในการแก้ไขข้อมูล</li>
        <li>สิทธิในการลบข้อมูล</li>
        <li>สิทธิในการคัดค้านการประมวลผล</li>
        <li>สิทธิในการเพิกถอนความยินยอม</li>
      </ul>
    </div>
  `;

  const template = `
    <div id="privacyPolicyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h2 class="text-xl font-semibold mb-4">ข้อกำหนดและเงื่อนไขการใช้งาน</h2>
          
          <div class="prose prose-sm mb-6">
            <p class="text-gray-600 mb-4">
              การให้ความยินยอมในการประมวลผลข้อมูลส่วนบุคคลและการใช้งาน GreenSense
            </p>
            <p class="text-gray-600 mb-4">
              โปรดอ่านและทำความเข้าใจใน 
              <button id="showTermsBtn" class="text-green-600 underline">ข้อกำหนดและเงื่อนไขการใช้บริการ</button> 
              และ 
              <button id="showPrivacyBtn" class="text-green-600 underline">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</button> 
              สำหรับบริการ GreenSense ก่อนการใช้บริการ
            </p>
          </div>

          <div class="space-y-4 mb-6">
            <div class="flex items-start">
              <input type="checkbox" id="termsCheckbox" class="mt-1 mr-3">
              <label for="termsCheckbox" class="text-sm text-gray-600">
                ข้าพเจ้ายอมรับข้อกำหนดและเงื่อนไขในการใช้บริการ
              </label>
            </div>

            <div class="flex items-start">
              <input type="checkbox" id="privacyCheckbox" class="mt-1 mr-3">
              <label for="privacyCheckbox" class="text-sm text-gray-600">
                ข้าพเจ้ายอมรับนโยบายการคุ้มครองข้อมูลส่วนบุคคล
              </label>
            </div>

            <div class="flex items-start">
              <input type="checkbox" id="consentCheckbox" class="mt-1 mr-3">
              <label for="consentCheckbox" class="text-sm text-gray-600">
                ข้าพเจ้ายินยอมโดยชัดแจ้งให้บริษัทฯ ประมวลผลข้อมูลส่วนบุคคลที่มีความอ่อนไหว รวมถึงแต่ไม่จำกัดเพียง 
                ข้อมูลเกี่ยวกับการเกษตร เช่น สภาพอากาศ ปริมาณน้ำฝน คุณภาพน้ำ อุณหภูมิ พฤติกรรมการจัดการแปลงเกษตร 
                กิจกรรมที่เกี่ยวข้องกับการลดการปล่อยก๊าซเรือนกระจก และข้อมูลอื่น ๆ ที่ข้าพเจ้าอาจเปิดเผยหรือบันทึกไว้บนบริการ GreenSense
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button id="acceptButton" 
              class="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled>
              ตกลง
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Terms and Privacy -->
    <div id="contentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 id="contentTitle" class="text-xl font-semibold"></h3>
            <button id="closeContentBtn" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div id="contentBody"></div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', template);

  const modal = document.getElementById('privacyPolicyModal');
  const acceptButton = document.getElementById('acceptButton');
  const checkboxes = [
    document.getElementById('termsCheckbox'),
    document.getElementById('privacyCheckbox'),
    document.getElementById('consentCheckbox')
  ];

  // Content Modal Elements
  const contentModal = document.getElementById('contentModal');
  const contentTitle = document.getElementById('contentTitle');
  const contentBody = document.getElementById('contentBody');
  const closeContentBtn = document.getElementById('closeContentBtn');
  const showTermsBtn = document.getElementById('showTermsBtn');
  const showPrivacyBtn = document.getElementById('showPrivacyBtn');

  // Show Terms of Service
  showTermsBtn.addEventListener('click', () => {
    contentTitle.textContent = 'ข้อกำหนดและเงื่อนไขการใช้บริการ';
    contentBody.innerHTML = termsContent;
    contentModal.classList.remove('hidden');
  });

   // Enable/disable accept button based on checkboxes
   const updateAcceptButton = () => {
    acceptButton.disabled = !checkboxes.every(checkbox => checkbox.checked);
  };

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateAcceptButton);
  });

  return new Promise((resolve) => {
    acceptButton.addEventListener('click', () => {
      // Save acceptance to localStorage
      localStorage.setItem('privacyPolicyAccepted', 'true');
      modal.remove();
      resolve(true);
    });
  });
};

const checkPrivacyPolicyAcceptance = async () => {
  const accepted = localStorage.getItem('privacyPolicyAccepted');
  if (!accepted) {
    await createPrivacyPolicyModal();
  }
  return true;
};