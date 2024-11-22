async function createFarmAreaSelector() {
    return new Promise((resolve, reject) => {
      try {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex flex-col';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white flex flex-col h-full';
        
        // Header with instructions
        const header = document.createElement('div');
        header.className = 'p-4 bg-green-600 text-white text-center';
        header.innerHTML = `
          <h2 class="text-lg font-semibold mb-1">วาดพื้นที่แปลงเกษตร</h2>
          <p class="text-sm">แตะที่แผนที่เพื่อวาดจุดแปลง (อย่างน้อย 3 จุด)</p>
        `;
        
        // Toolbar with controls
        const toolbar = document.createElement('div');
        toolbar.className = 'flex justify-between items-center p-2 bg-gray-100';
        
        const leftControls = document.createElement('div');
        leftControls.className = 'space-x-2';
        
        const undoButton = document.createElement('button');
        undoButton.innerHTML = '↩️ ย้อนกลับ';
        undoButton.className = 'px-3 py-1 bg-white border rounded-full text-sm shadow-sm';
        
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '🗑️ เริ่มใหม่';
        clearButton.className = 'px-3 py-1 bg-white border rounded-full text-sm shadow-sm';
        
        leftControls.appendChild(undoButton);
        leftControls.appendChild(clearButton);
        
        const completeButton = document.createElement('button');
        completeButton.innerHTML = '✅ ยืนยันพื้นที่';
        completeButton.className = 'px-3 py-1 bg-green-600 text-white rounded-full text-sm shadow-sm disabled:opacity-50';
        completeButton.disabled = true;
        
        toolbar.appendChild(leftControls);
        toolbar.appendChild(completeButton);
        
        // Map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map';
        mapContainer.className = 'flex-1';
        
        // Area info and inputs
        const bottomPanel = document.createElement('div');
        bottomPanel.className = 'p-4 bg-white border-t';
        
        const areaDisplay = document.createElement('div');
        areaDisplay.className = 'text-center mb-3 text-sm font-semibold text-gray-700';
        areaDisplay.textContent = 'เลือกจุดอย่างน้อย 3 จุดและกดยืนยันพื้นที่';
        
        const form = document.createElement('div');
        form.className = 'space-y-3 safe-bottom';
        form.innerHTML = `
          <input 
            type="text" 
            placeholder="ชื่อแปลง" 
            class="w-full p-3 border rounded-lg text-lg"
            disabled
          >
          <div class="grid grid-cols-2 gap-2">
            <button class="p-3 bg-gray-200 rounded-lg text-gray-700">ยกเลิก</button>
            <button class="p-3 bg-gray-300 text-gray-500 rounded-lg" disabled>บันทึก</button>
          </div>
        `;
        
        bottomPanel.appendChild(areaDisplay);
        bottomPanel.appendChild(form);
        
        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(toolbar);
        modalContent.appendChild(mapContainer);
        modalContent.appendChild(bottomPanel);
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
        
        // Initialize map
        const map = new longdo.Map({
          placeholder: mapContainer,
          language: 'th',
          location: { lon: 100.523186, lat: 13.736717 },
          zoom: 15
        });
        
        let points = [];
        let markers = [];
        let lines = [];
        let polygon = null;
        let isCompleted = false;
        
        // คำนวณพื้นที่
        function calculateArea(coords) {
          if (coords.length < 3) return 0;
          let area = 0;
          for (let i = 0; i < coords.length; i++) {
            const j = (i + 1) % coords.length;
            area += coords[i].lon * coords[j].lat;
            area -= coords[j].lon * coords[i].lat;
          }
          area = Math.abs(area) * 111319.9 * 111319.9 / 2;
          return area;
        }
        
        function updateAreaDisplay() {
          if (!isCompleted) {
            areaDisplay.textContent = `เลือกไว้ ${points.length} จุด` + (points.length >= 3 ? ' - พร้อมยืนยันพื้นที่' : '');
            return;
          }
          const area = calculateArea(points);
          const areaInRai = area / 1600;
          areaDisplay.textContent = `พื้นที่: ${areaInRai.toFixed(2)} ไร่ (${area.toFixed(0)} ตร.ม.)`;
        }
        
        function drawPoint(location, index) {
          const marker = new longdo.Marker(location, {
            title: `จุดที่ ${index + 1}`,
            icon: {
              url: 'https://map.longdo.com/mmmap/images/pin_mark.png',
              offset: { x: 12, y: 45 }
            },
            detail: `จุดที่ ${index + 1}`
          });
          markers.push(marker);
          map.Overlays.add(marker);
        }
        
        function drawLine(point1, point2) {
          const line = new longdo.Polyline([point1, point2], {
            lineWidth: 2,
            lineColor: '#22c55e'
          });
          lines.push(line);
          map.Overlays.add(line);
        }
        
        function updateLines() {
          // Clear existing lines
          lines.forEach(l => map.Overlays.remove(l));
          lines = [];
          
          // Draw new lines connecting points
          for (let i = 0; i < points.length; i++) {
            const nextIndex = (i + 1) % points.length;
            if (!isCompleted && i === points.length - 1) break;
            drawLine(points[i], points[nextIndex]);
          }
        }
        
        function createPolygon() {
          if (polygon) {
            map.Overlays.remove(polygon);
          }
          polygon = new longdo.Polygon(points, {
            fillColor: '#22c55e',
            fillOpacity: 0.3,
            lineWidth: 3,
            lineColor: '#22c55e'
          });
          map.Overlays.add(polygon);
        }
        
        function clearAll() {
          points = [];
          markers.forEach(m => map.Overlays.remove(m));
          lines.forEach(l => map.Overlays.remove(l));
          if (polygon) map.Overlays.remove(polygon);
          markers = [];
          lines = [];
          polygon = null;
          isCompleted = false;
          completeButton.disabled = true;
          const nameInput = form.querySelector('input');
          const saveBtn = form.querySelectorAll('button')[1];
          nameInput.disabled = true;
          nameInput.value = '';
          saveBtn.disabled = true;
          saveBtn.className = 'p-3 bg-gray-300 text-gray-500 rounded-lg';
          updateAreaDisplay();
        }
        
        function undoLastPoint() {
          if (points.length > 0) {
            points.pop();
            if (markers.length > 0) {
              map.Overlays.remove(markers.pop());
            }
            updateLines();
            if (points.length < 3) {
              completeButton.disabled = true;
            }
            updateAreaDisplay();
          }
        }
        
        // Event handlers
        map.Event.bind('click', function(mouse) {
          if (isCompleted) return;
          
          const location = map.location(mouse);
          points.push(location);
          
          // Draw new point
          drawPoint(location, points.length - 1);
          
          // Update lines
          updateLines();
          
          // Enable complete button if we have 3 or more points
          if (points.length >= 3) {
            completeButton.disabled = false;
          }
          
          updateAreaDisplay();
        });
        
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              map.location({
                lon: position.coords.longitude,
                lat: position.coords.latitude
              });
              map.zoom(17);
            },
            (error) => {
              console.warn('Error getting location:', error);
            }
          );
        }
        
        undoButton.onclick = undoLastPoint;
        clearButton.onclick = clearAll;
        
        completeButton.onclick = () => {
          if (points.length < 3) return;
          
          isCompleted = true;
          createPolygon();
          updateLines();
          updateAreaDisplay();
          
          // Enable name input and save button
          const nameInput = form.querySelector('input');
          const saveBtn = form.querySelectorAll('button')[1];
          nameInput.disabled = false;
          saveBtn.disabled = false;
          saveBtn.className = 'p-3 bg-green-600 text-white rounded-lg';
          
          // Disable map clicking
          completeButton.disabled = true;
        };
        
        const [cancelBtn, saveBtn] = form.querySelectorAll('button');
        const nameInput = form.querySelector('input');
        
        cancelBtn.onclick = () => {
          document.body.removeChild(modalContainer);
          resolve(null);
        };
        
        saveBtn.onclick = () => {
          if (!isCompleted) return;
          
          if (!nameInput.value.trim()) {
            alert('กรุณาระบุชื่อแปลง');
            nameInput.focus();
            return;
          }
          
          const area = calculateArea(points);
          const farmArea = {
            name: nameInput.value.trim(),
            type: 'polygon',
            size: area / 1600, // แปลงเป็นไร่
            coordinates: points.map(point => ({
              latitude: point.lat,
              longitude: point.lon
            })),
            area: area
          };
          
          document.body.removeChild(modalContainer);
          resolve(farmArea);
        };
        
      } catch (error) {
        console.error('Error in createFarmAreaSelector:', error);
        reject(error);
      }
    });
  }