class CarbonCreditForm {
    constructor(onSubmit) {
      this.onSubmit = onSubmit;
      this.element = document.createElement('div');
      this.render();
      this.attachEvents();
    }
  
    render() {
      this.element.className = 'bg-white rounded-lg shadow-md p-6 mb-6';
      this.element.innerHTML = `
        <h2 class="text-xl font-semibold mb-4">ลงทะเบียน Carbon Credit</h2>
        <form id="farmDataForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">พื้นที่เพาะปลูก (ไร่)</label>
            <input type="number" id="farmArea" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">วันที่เริ่มรอบ</label>
              <input type="date" id="cycleStart" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">วันที่สิ้นสุดรอบ</label>
              <input type="date" id="cycleEnd" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700">ระยะเวลาช่วงแห้ง (วัน)</label>
            <input type="number" id="dryPeriod" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" required>
          </div>
  
          <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            บันทึกข้อมูล
          </button>
        </form>
      `;
    }
  
    attachEvents() {
      const form = this.element.querySelector('#farmDataForm');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
          farmArea: parseFloat(this.element.querySelector('#farmArea').value),
          cycleStart: this.element.querySelector('#cycleStart').value,
          cycleEnd: this.element.querySelector('#cycleEnd').value,
          dryPeriod: parseInt(this.element.querySelector('#dryPeriod').value)
        };
        
        if (this.onSubmit) {
          await this.onSubmit(formData);
        }
      });
    }
  
    mount(container) {
      container.appendChild(this.element);
    }
  }
  
  window.initializeCarbonCreditForm = (onSubmit) => {
    const container = document.getElementById('carbonCreditForm');
    const form = new CarbonCreditForm(onSubmit);
    form.mount(container);
    return form;
  };