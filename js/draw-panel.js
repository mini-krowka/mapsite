// Панель рисования для карты
class DrawPanel {
    constructor(map) {
        // Проверяем, что map является объектом карты Leaflet
        if (!map || typeof map.addLayer !== 'function') {
            console.error('Invalid map object provided to DrawPanel');
            return;
        }

        this.map = map;
        this.isDrawing = false;
        this.currentTool = null;
        this.currentColor = THEME.colors.primary;
        this.currentWidth = 3;
        
        // Создаем FeatureGroup и добавляем на карту правильным способом
        this.drawnItems = L.featureGroup();
        this.map.addLayer(this.drawnItems);
        
        this.tempLayer = L.featureGroup();
        this.map.addLayer(this.tempLayer);
        
        this.startPoint = null;
        this.currentElement = null;
        this.isEraserActive = false;
        this.selectedIcon = null;
        
        this.initPanel();
        this.setupEventListeners();
        
        console.log('DrawPanel успешно инициализирован');
    }

    initPanel() {
        // Создаем кнопку переключения панели
        this.toggleBtn = L.control({position: 'topleft'});
        this.toggleBtn.onAdd = () => {
            this.toggleBtnContainer = L.DomUtil.create('button', 'draw-toggle-btn');
            this.toggleBtnContainer.innerHTML = '✏️';
            this.toggleBtnContainer.title = 'Панель рисования';
            return this.toggleBtnContainer;
        };
        this.toggleBtn.addTo(this.map);

        // Создаем саму панель
        this.panel = L.control({position: 'topleft'});
        this.panel.onAdd = () => {
            this.panelContainer = L.DomUtil.create('div', 'draw-panel hidden');
            this.panelContainer.innerHTML = this.getPanelHTML();
            return this.panelContainer;
        };
        this.panel.addTo(this.map);
    }

    getPanelHTML() {
        return `
            <div class="draw-tools">
                <button class="draw-tool-btn" data-tool="line" title="Прямая линия">📏</button>
                <button class="draw-tool-btn" data-tool="freehand" title="Произвольная линия">✍️</button>
                <button class="draw-tool-btn" data-tool="arrow" title="Стрелка">➡️</button>
                <button class="draw-tool-btn" data-tool="rectangle" title="Прямоугольник">⬜</button>
                <button class="draw-tool-btn" data-tool="ellipse" title="Эллипс">⭕</button>
            </div>

            <div class="draw-controls">
                <div class="color-picker">
                    <span>Цвет:</span>
                    <input type="color" id="draw-color" value="${this.currentColor}">
                </div>
                <div class="width-slider">
                    <span>Толщина:</span>
                    <input type="range" id="draw-width" min="1" max="10" value="${this.currentWidth}">
                    <span id="width-value">${this.currentWidth}</span>
                </div>
            </div>

            <div class="icons-panel">
                <button class="icon-btn" data-icon="flag" title="Флаг">🚩</button>
                <button class="icon-btn" data-icon="target" title="Цель">🎯</button>
                <button class="icon-btn" data-icon="warning" title="Внимание">⚠️</button>
                <button class="icon-btn" data-icon="star" title="Звезда">⭐</button>
                <button class="icon-btn" data-icon="heart" title="Сердце">❤️</button>
                <button class="icon-btn" data-icon="skull" title="Череп">💀</button>
            </div>

            <div class="actions-panel">
                <button class="action-btn delete" id="clear-all">Очистить всё</button>
                <button class="action-btn" id="eraser-btn">Ластик</button>
                <button class="action-btn" id="exit-drawing-mode">Выйти из режима</button>
                <button class="action-btn screenshot" id="screenshot-btn">Скриншот</button>
                <button class="action-btn screenshot" id="save-screenshot">Сохранить скрин</button>
            </div>
            
            <div class="drawing-status" id="drawing-status">
                Режим: Ожидание
            </div>
        `;
    }

    setupEventListeners() {
        // Переключение панели
        this.toggleBtnContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePanel();
        });

        // Обработчики для инструментов рисования
        this.panelContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('draw-tool-btn')) {
                this.selectTool(e.target.dataset.tool);
            }

            if (e.target.classList.contains('icon-btn')) {
                this.selectTool('icon');
                this.selectedIcon = e.target.dataset.icon;
            }

            if (e.target.id === 'clear-all') {
                this.clearAll();
            }

            if (e.target.id === 'eraser-btn') {
                this.toggleEraser();
            }

            if (e.target.id === 'exit-drawing-mode') {
                this.exitDrawingMode();
            }

            if (e.target.id === 'screenshot-btn') {
                this.takeScreenshot(false);
            }

            if (e.target.id === 'save-screenshot') {
                this.takeScreenshot(true);
            }
        });

        // Обработчики для настроек
        this.panelContainer.addEventListener('input', (e) => {
            if (e.target.id === 'draw-color') {
                this.currentColor = e.target.value;
            }
            if (e.target.id === 'draw-width') {
                this.currentWidth = parseInt(e.target.value);
                const widthValue = this.panelContainer.querySelector('#width-value');
                if (widthValue) {
                    widthValue.textContent = this.currentWidth;
                }
            }
        });

        // Обработчики событий карты
        this.map.on('mousedown', this.onMapMouseDown.bind(this));
        this.map.on('mousemove', this.onMapMouseMove.bind(this));
        this.map.on('mouseup', this.onMapMouseUp.bind(this));
        this.map.on('click', this.onMapClick.bind(this));
    }

    togglePanel() {
        this.panelContainer.classList.toggle('hidden');
    }

    selectTool(tool) {
        // Выходим из предыдущего режима
        this.exitDrawingMode();
        
        this.currentTool = tool;
        this.isDrawing = (tool !== 'icon');
        this.isEraserActive = false;
        
        // Сбрасываем активные состояния
        this.panelContainer.querySelectorAll('.draw-tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Активируем выбранный инструмент (кроме иконок)
        if (tool !== 'icon') {
            const toolBtn = this.panelContainer.querySelector(`[data-tool="${tool}"]`);
            if (toolBtn) {
                toolBtn.classList.add('active');
            }
        }
        
        // Обновляем курсор и статус
        if (this.isDrawing) {
            this.map.getContainer().style.cursor = 'crosshair';
            this.updateDrawingStatus(`Режим рисования: ${this.getToolName(tool)}`);
        } else if (tool === 'icon') {
            this.map.getContainer().style.cursor = 'crosshair';
            this.updateDrawingStatus(`Режим: Установка иконки (${this.selectedIcon})`);
        } else {
            this.map.getContainer().style.cursor = '';
            this.updateDrawingStatus('Режим: Ожидание');
        }
    }

    // Добавляем новые методы
    exitDrawingMode() {
        this.isDrawing = false;
        this.currentTool = null;
        this.isEraserActive = false;
        this.selectedIcon = null;
        
        // Восстанавливаем перетаскивание карты
        this.map.dragging.enable();
        
        // Сбрасываем курсор
        this.map.getContainer().style.cursor = '';
        
        // Сбрасываем активные состояния кнопок
        this.panelContainer.querySelectorAll('.draw-tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Очищаем временные элементы
        this.currentElement = null;
        this.startPoint = null;
        this.tempLayer.clearLayers();
        
        this.updateDrawingStatus('Режим: Ожидание');
        console.log('Выход из режима рисования');
    }
    
    getToolName(tool) {
        const toolNames = {
            'line': 'Линия',
            'freehand': 'Произвольная линия', 
            'arrow': 'Стрелка',
            'rectangle': 'Прямоугольник',
            'ellipse': 'Эллипс',
            'icon': 'Иконка'
        };
        return toolNames[tool] || tool;
    }

    updateDrawingStatus(message) {
        const statusElement = this.panelContainer.querySelector('#drawing-status');
        if (statusElement) {
            statusElement.textContent = message;
            
            // Добавляем цветовую индикацию
            if (message.includes('Ожидание')) {
                statusElement.style.background = THEME.colors.statusIdleBg;
                statusElement.style.color = THEME.colors.statusIdleText;
            } else {
                statusElement.style.background = THEME.colors.statusOkBg;
                statusElement.style.color = THEME.colors.statusOkText;
            }
        }
    }

    onMapMouseDown(e) {
        // Проверяем, что клик был левой кнопкой мыши
        if (e.originalEvent.button !== 0) return;
        
        if (!this.isDrawing || !this.currentTool || this.currentTool === 'icon') return;

        // Предотвращаем обработку события картой
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();
        e.originalEvent.stopImmediatePropagation();

        this.startPoint = e.latlng;
        
        const style = {
            color: this.currentColor,
            weight: this.currentWidth
        };

        switch (this.currentTool) {
            case 'line':
            case 'arrow':
                this.currentElement = L.polyline([e.latlng, e.latlng], style).addTo(this.tempLayer);
                break;
                
            case 'rectangle':
                this.currentElement = L.rectangle([e.latlng, e.latlng], {
                    ...style,
                    fillOpacity: 0.2
                }).addTo(this.tempLayer);
                break;
                
            case 'ellipse':
                this.currentElement = L.circle(e.latlng, {
                    ...style,
                    fillOpacity: 0.2,
                    radius: 10
                }).addTo(this.tempLayer);
                break;
                
            case 'freehand':
                this.currentElement = L.polyline([e.latlng], style).addTo(this.tempLayer);
                break;
        }

        // Временно отключаем перетаскивание карты
        this.map.dragging.disable();
        
        console.log('Начало рисования:', this.currentTool);
    }


    onMapMouseMove(e) {
        if (!this.isDrawing || !this.currentElement || !this.startPoint) return;

        // Предотвращаем обработку события картой
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        switch (this.currentTool) {
            case 'line':
            case 'arrow':
                this.currentElement.setLatLngs([this.startPoint, e.latlng]);
                break;
                
            case 'rectangle':
                this.currentElement.setBounds([this.startPoint, e.latlng]);
                break;
                
            case 'ellipse':
                const radius = this.startPoint.distanceTo(e.latlng);
                this.currentElement.setRadius(radius);
                break;
                
            case 'freehand':
                const latlngs = this.currentElement.getLatLngs();
                latlngs.push(e.latlng);
                this.currentElement.setLatLngs(latlngs);
                break;
        }
    }

    onMapMouseUp(e) {
        if (!this.isDrawing || !this.currentElement) return;

        // Предотвращаем обработку события картой
        e.originalEvent.preventDefault();
        e.originalEvent.stopPropagation();

        // Восстанавливаем перетаскивание карты
        this.map.dragging.enable();

        // Создаем копию элемента для постоянного хранения
        let permanentElement = null;
        
        switch (this.currentTool) {
            case 'line':
            case 'arrow':
                permanentElement = L.polyline(this.currentElement.getLatLngs(), {
                    color: this.currentColor,
                    weight: this.currentWidth,
                    className: 'leaflet-drawn-element'
                });
                break;
                
            case 'rectangle':
                permanentElement = L.rectangle(this.currentElement.getBounds(), {
                    color: this.currentColor,
                    weight: this.currentWidth,
                    fillOpacity: 0.2,
                    className: 'leaflet-drawn-element'
                });
                break;
                
            case 'ellipse':
                permanentElement = L.circle(this.currentElement.getLatLng(), {
                    color: this.currentColor,
                    weight: this.currentWidth,
                    fillOpacity: 0.2,
                    radius: this.currentElement.getRadius(),
                    className: 'leaflet-drawn-element'
                });
                break;
                
            case 'freehand':
                permanentElement = L.polyline(this.currentElement.getLatLngs(), {
                    color: this.currentColor,
                    weight: this.currentWidth,
                    className: 'leaflet-drawn-element'
                });
                break;
        }

        if (permanentElement) {
            this.drawnItems.addLayer(permanentElement);
            
            // Для стрелки добавляем маркер
            if (this.currentTool === 'arrow') {
                this.addArrowhead(permanentElement);
            }
            
            console.log('Элемент сохранен:', permanentElement);
        }

        this.currentElement = null;
        this.startPoint = null;
        this.tempLayer.clearLayers();
    }

    onMapClick(e) {
        // Размещение иконки
        if (this.currentTool === 'icon' && this.selectedIcon) {
            this.placeIconAt(e.latlng);
        }

        // Режим ластика
        if (this.isEraserActive) {
            this.removeElementAt(e.latlng);
        }
    }

    onMapClick(e) {
        // Размещение иконки
        if (this.currentTool === 'icon' && this.selectedIcon) {
            this.placeIconAt(e.latlng);
        }

        // Режим ластика
        if (this.isEraserActive) {
            this.removeElementAt(e.latlng);
        }
    }

    placeIconAt(latlng) {
        const icon = L.divIcon({
            html: this.getIconHTML(this.selectedIcon),
            className: 'drawn-element',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(latlng, { icon: icon }).addTo(this.drawnItems);
    }

    getIconHTML(iconType) {
        const icons = {
            flag: '🚩',
            target: '🎯',
            warning: '⚠️',
            star: '⭐',
            heart: '❤️',
            skull: '💀'
        };
        
        return `<div style="font-size: 24px; text-align: center;">${icons[iconType]}</div>`;
    }

    addArrowhead(polyline) {
        const latlngs = polyline.getLatLngs();
        if (latlngs.length < 2) return;

        const endPoint = latlngs[latlngs.length - 1];
        
        const arrowIcon = L.divIcon({
            html: '➤',
            className: 'marker-arrow',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        L.marker(endPoint, { icon: arrowIcon }).addTo(this.drawnItems);
    }
    
    setupEraserCursor() {
        // Стиль .leaflet-eraser-cursor задан в css/draw-panel.css
    }


    toggleEraser() {
        this.isEraserActive = !this.isEraserActive;
        this.isDrawing = false;
        this.currentTool = null;
        
        if (this.isEraserActive) {
            this.map.getContainer().classList.add('leaflet-eraser-cursor');
            this.panelContainer.querySelectorAll('.draw-tool-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            console.log('Режим ластика активирован');
        } else {
            this.map.getContainer().classList.remove('leaflet-eraser-cursor');
            console.log('Режим ластика деактивирован');
        }
    }

    removeElementAt(latlng) {
        let closestLayer = null;
        let minDistance = 25; // 25 метров

        this.drawnItems.eachLayer((layer) => {
            let distance = Infinity;
            
            if (layer instanceof L.Marker) {
                // Для маркеров - расстояние до позиции маркера
                distance = latlng.distanceTo(layer.getLatLng());
            } else if (layer instanceof L.Polyline) {
                // Для линий - минимальное расстояние до любой точки линии
                const latlngs = layer.getLatLngs();
                latlngs.forEach(point => {
                    const dist = latlng.distanceTo(point);
                    if (dist < distance) {
                        distance = dist;
                    }
                });
            } else if (layer instanceof L.Polygon) {
                // Для полигонов - расстояние до центра
                const center = layer.getBounds().getCenter();
                distance = latlng.distanceTo(center);
            } else if (layer instanceof L.Circle) {
                // Для кругов - расстояние до центра
                const center = layer.getLatLng();
                distance = latlng.distanceTo(center);
            } else if (layer instanceof L.Rectangle) {
                // Для прямоугольников - расстояние до центра
                const center = layer.getBounds().getCenter();
                distance = latlng.distanceTo(center);
            }

            if (distance < minDistance) {
                minDistance = distance;
                closestLayer = layer;
            }
        });

        if (closestLayer) {
            this.drawnItems.removeLayer(closestLayer);
            console.log('Элемент удален:', closestLayer);
        }
    }

    clearAll() {
        this.drawnItems.clearLayers();
    }

    takeScreenshot(save = false) {
        // Проверяем наличие html2canvas
        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas не подключен');
            alert('Для создания скриншотов требуется библиотека html2canvas');
            return;
        }

        const mapContainer = this.map.getContainer();
        
        html2canvas(mapContainer).then(canvas => {
            if (save) {
                // Сохраняем файл
                const link = document.createElement('a');
                link.download = `map-screenshot-${new Date().getTime()}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } else {
                // Показываем в новом окне
                const win = window.open('', '_blank');
                win.document.write('<img src="' + canvas.toDataURL() + '"/>');
            }
        }).catch(error => {
            console.error('Ошибка при создании скриншота:', error);
            alert('Ошибка при создании скриншота: ' + error.message);
        });
    }
}

// Функция для безопасной инициализации панели рисования
function initDrawPanel() {
    if (window.map && window.map instanceof L.Map) {
        try {
            window.drawPanel = new DrawPanel(window.map);
            console.log('Панель рисования успешно инициализирована');
            return true;
        } catch (error) {
            console.error('Ошибка инициализации панели рисования:', error);
            return false;
        }
    } else {
        console.warn('Карта Leaflet не найдена, панель рисования не может быть инициализирована');
        return false;
    }
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Ждем полной загрузки карты
    setTimeout(() => {
        if (!initDrawPanel()) {
            // Если не удалось, пробуем еще раз через секунду
            setTimeout(initDrawPanel, 1000);
        }
    }, 500);
});

// Экспорт для ручного вызова
window.initDrawPanel = initDrawPanel;
