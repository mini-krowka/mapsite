// filters.js
// ============================================
// Категории техники
const equipmentCategories = [
    { tag: 'Авиация',                   labelRu: 'Авиация',     labelEn: 'Aircraft' },
    { tag: 'Артиллерия',                labelRu: 'Артиллерия',  labelEn: 'Artillery' },
    { tag: 'БПЛА',                      labelRu: 'БПЛА',        labelEn: 'UAV' },
    { tag: 'Бронированный транспорт',   labelRu: 'Бронемашины', labelEn: 'AFV' },
    { tag: 'ПВО',                       labelRu: 'ПВО',         labelEn: 'GBAD' },
    { tag: 'Танк',                      labelRu: 'Танки',       labelEn: 'Tanks' },
    { tag: 'Небронированный транспорт', labelRu: 'Транспорт',   labelEn: 'Vehicles' },
    { tag: 'Другое',                    labelRu: 'Другое',      labelEn: 'Other' },
    { tag: 'Другое/Нет данных',         labelRu: 'Нет данных',  labelEn: 'No data' }
];

// Категории атак (полностью аналогично)
const attackCategories = [
    { tag: 'Объект неустановленного назначения',               labelRu: 'Объект неустановленного назначения', labelEn: 'Unidentified facility' },
    { tag: 'Предприятие ВПК',                                  labelRu: 'Предприятие ВПК',                    labelEn: 'Defense industry facility' },
    { tag: 'ЖД инфраструктура',                                labelRu: 'ЖД инфраструктура',                  labelEn: 'Railway infrastructure' },
    { tag: 'Аэродром',                                         labelRu: 'Аэродром',                           labelEn: 'Airfield' },
    { tag: 'Предприятие гражданского или двойного назначения', labelRu: 'Предприятие гражданского или двойного назначения', labelEn: 'Civil or dual-use facility' },
    { tag: 'ПВО, РЛС и ракетное вооружение',                   labelRu: 'ПВО, РЛС и ракетное вооружение',     labelEn: 'Air defense, radar, missile weapons' },
    { tag: 'Подстанция',                                       labelRu: 'Подстанция',                         labelEn: 'Substation' },
    { tag: 'Склад',                                            labelRu: 'Склад',                              labelEn: 'Warehouse' },
    { tag: 'Склад ГСМ',                                        labelRu: 'Склад ГСМ',                          labelEn: 'Fuel depot' },
    { tag: 'Энергогенерация',                                  labelRu: 'Энергогенерация',                    labelEn: 'Power generation' },
    { tag: 'Тяговая подстанция',                               labelRu: 'Тяговая подстанция',                 labelEn: 'Traction substation' },
    { tag: 'Мост',                                             labelRu: 'Мост',                               labelEn: 'Bridge' },
    { tag: 'Газовая инфраструктура',                           labelRu: 'Газовая инфраструктура',             labelEn: 'Gas infrastructure' },
    { tag: 'Судно',                                            labelRu: 'Судно',                              labelEn: 'Ship' },
    { tag: 'Склад боеприпасов',                                labelRu: 'Склад боеприпасов',                  labelEn: 'Ammunition depot' },
    { tag: 'Стоянка грузового транспорта',                     labelRu: 'Стоянка грузового транспорта',       labelEn: 'Truck parking' },
    { tag: 'ППД',                                              labelRu: 'ППД',                                labelEn: 'Permanent deployment point' },
    { tag: 'Поезда и локомотивы',                              labelRu: 'Поезда и локомотивы',                labelEn: 'Trains and locomotives' }
];

// Глобальные переменные для фильтров
window.allEquipmentMarkers = [];     // { marker, category }
window.selectedEquipmentCategories = null;  // null = все, иначе массив
window.isMilEquipVisible = false;

window.allAttacksMarkers = [];
window.selectedAttacksCategories = null;
window.isAttacksVisible = false;

// Вспомогательный флаг для предотвращения рекурсии
let isUpdatingFilter = false;

// ========== ОБЩИЕ УТИЛИТЫ ==========
function syncSelectAllState(selectAllId, checkboxClass) {
    const selectAll = document.getElementById(selectAllId);
    if (!selectAll) return;
    const catCheckboxes = document.querySelectorAll(`.${checkboxClass}`);
    const allChecked = Array.from(catCheckboxes).every(cb => cb.checked);
    selectAll.checked = allChecked;
}

// ========== ФИЛЬТР ТЕХНИКИ ==========
function initEquipmentFilter() {
    const container = document.getElementById('equip-category-list');
    if (!container) return;
    container.innerHTML = '';
    equipmentCategories.forEach(cat => {
        const label = currentLang === 'ru' ? cat.labelRu : cat.labelEn;
        const div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" class="equip-cat-checkbox" value="${cat.tag}"> ${label}</label>`;
        container.appendChild(div);
    });
    
    const selectAll = document.getElementById('equip-select-all');
    const catCheckboxes = document.querySelectorAll('.equip-cat-checkbox');
    
    // Восстановление состояния
    if (window.selectedEquipmentCategories === null) {
        selectAll.checked = true;
        catCheckboxes.forEach(cb => cb.checked = true);
    } else if (window.selectedEquipmentCategories.length === 0) {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => cb.checked = false);
    } else {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => {
            cb.checked = window.selectedEquipmentCategories.includes(cb.value);
        });
    }
    
    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        catCheckboxes.forEach(cb => cb.checked = isChecked);
        updateEquipmentFilter();
    });
    
    catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            syncSelectAllState('equip-select-all', 'equip-cat-checkbox');
            updateEquipmentFilter();
        });
    });
}

function updateEquipmentFilter() {
    if (isUpdatingFilter) return;
    isUpdatingFilter = true;
    
    const selectAll = document.getElementById('equip-select-all');
    const catCheckboxes = document.querySelectorAll('.equip-cat-checkbox');
    const milEquipBtn = document.getElementById('mil-equip-btn');
    
    if (selectAll.checked) {
        window.selectedEquipmentCategories = null;
        window.isMilEquipVisible = true;
        milEquipBtn.classList.add('active');
        applyEquipmentFilter();
    } else {
        const selected = Array.from(catCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        window.selectedEquipmentCategories = selected;
        if (selected.length === 0) {
            window.isMilEquipVisible = false;
            milEquipBtn.classList.remove('active');
            hideAllEquipmentMarkers();
        } else {
            window.isMilEquipVisible = true;
            milEquipBtn.classList.add('active');
            applyEquipmentFilter();
        }
    }
    isUpdatingFilter = false;
}

function applyEquipmentFilter() {
    if (!window.isMilEquipVisible) {
        hideAllEquipmentMarkers();
        return;
    }
    window.allEquipmentMarkers.forEach(item => {
        const shouldShow = (window.selectedEquipmentCategories === null) ||
                           window.selectedEquipmentCategories.includes(item.category);
        if (shouldShow) {
            if (!map.hasLayer(item.marker)) item.marker.addTo(map);
        } else {
            if (map.hasLayer(item.marker)) map.removeLayer(item.marker);
        }
    });
}

function hideAllEquipmentMarkers() {
    window.allEquipmentMarkers.forEach(item => {
        if (map.hasLayer(item.marker)) map.removeLayer(item.marker);
    });
}

function toggleEquipmentMenu() {
    const menu = document.getElementById('equipment-filter-menu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    if (!isVisible) {
        const btn = document.getElementById('mil-equip-btn');
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY) + 'px';
        menu.style.left = (rect.left + window.scrollX) + 'px';
        menu.style.display = 'block';
        if (window.allEquipmentMarkers.length === 0 && window.milequipKmlPaths) {
            initMilequipLayer(window.milequipKmlPaths).then(() => applyEquipmentFilter());
        } else {
            applyEquipmentFilter();
        }
    } else {
        menu.style.display = 'none';
    }
}

// Функция для обновления заголовка кнопки техники
function updateMilEquipButtonTitle() {
    const btn = document.getElementById('mil-equip-btn');
    if (btn) {
        const t = translations[currentLang];
        btn.title = window.isMilEquipVisible ? (t.hideEquipment || 'Скрыть технику') : (t.showEquipment || 'Показать технику');
    }
}

// ========== ФИЛЬТР АТАК ==========
function initAttacksFilter() {
    const container = document.getElementById('attacks-category-list');
    if (!container) return;
    container.innerHTML = '';
    attackCategories.forEach(cat => {
        const label = currentLang === 'ru' ? cat.labelRu : cat.labelEn;
        const div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" class="attacks-cat-checkbox" value="${cat.tag}"> ${label}</label>`;
        container.appendChild(div);
    });
    
    const selectAll = document.getElementById('attacks-select-all');
    const catCheckboxes = document.querySelectorAll('.attacks-cat-checkbox');
    
    if (window.selectedAttacksCategories === null) {
        selectAll.checked = true;
        catCheckboxes.forEach(cb => cb.checked = true);
    } else if (window.selectedAttacksCategories.length === 0) {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => cb.checked = false);
    } else {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => {
            cb.checked = window.selectedAttacksCategories.includes(cb.value);
        });
    }
    
    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        catCheckboxes.forEach(cb => cb.checked = isChecked);
        updateAttacksFilter();
    });
    
    catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            syncSelectAllState('attacks-select-all', 'attacks-cat-checkbox');
            updateAttacksFilter();
        });
    });
}

function updateAttacksFilter() {
    if (isUpdatingFilter) return;
    isUpdatingFilter = true;
    
    const selectAll = document.getElementById('attacks-select-all');
    const catCheckboxes = document.querySelectorAll('.attacks-cat-checkbox');
    const attacksBtn = document.getElementById('attacks-on-ua-btn');
    
    if (selectAll.checked) {
        window.selectedAttacksCategories = null;
        window.isAttacksVisible = true;
        attacksBtn.classList.add('active');
        applyAttacksFilter();
    } else {
        const selected = Array.from(catCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        window.selectedAttacksCategories = selected;
        if (selected.length === 0) {
            window.isAttacksVisible = false;
            attacksBtn.classList.remove('active');
            hideAllAttacksMarkers();
        } else {
            window.isAttacksVisible = true;
            attacksBtn.classList.add('active');
            applyAttacksFilter();
        }
    }
    isUpdatingFilter = false;
}

function applyAttacksFilter() {
    if (!window.isAttacksVisible) {
        hideAllAttacksMarkers();
        return;
    }
    window.allAttacksMarkers.forEach(item => {
        const shouldShow = (window.selectedAttacksCategories === null) ||
                           window.selectedAttacksCategories.includes(item.category);
        if (shouldShow) {
            if (!map.hasLayer(item.marker)) item.marker.addTo(map);
        } else {
            if (map.hasLayer(item.marker)) map.removeLayer(item.marker);
        }
    });
}

function hideAllAttacksMarkers() {
    window.allAttacksMarkers.forEach(item => {
        if (map.hasLayer(item.marker)) map.removeLayer(item.marker);
    });
}

function toggleAttacksMenu() {
    const menu = document.getElementById('attacks-filter-menu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    if (!isVisible) {
        const btn = document.getElementById('attacks-on-ua-btn');
        const rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY) + 'px';
        menu.style.left = (rect.left + window.scrollX) + 'px';
        menu.style.display = 'block';
        if (window.allAttacksMarkers.length === 0 && window.attacksOnUaKmlPaths) {
            initAttacksOnUaLayer(window.attacksOnUaKmlPaths).then(() => applyAttacksFilter());
        } else {
            applyAttacksFilter();
        }
    } else {
        menu.style.display = 'none';
    }
}

function updateAttacksOnUaButtonTitle() {
    const btn = document.getElementById('attacks-on-ua-btn');
    if (btn) {
        const t = translations[currentLang];
        btn.title = window.isAttacksVisible ? 
            (t.hideAttacksOnUa || 'Скрыть удары по Украине') : 
            (t.showAttacksOnUa || 'Показать удары по Украине');
    }
}



// Функция для переключения отображения атак на Украину
/*
function toggleAttacksOnUaVisibility() {
    const attacksOnUaBtn = document.getElementById('attacks-on-ua-btn');
    
    // Переключаем флаг
    isAttacksOnUaVisible = !isAttacksOnUaVisible;
    
    if (isAttacksOnUaVisible) {
        // Показываем атаки
        attacksOnUaBtn.classList.add('active');
        
        // Если слои атак еще не загружены, загружаем их
        if (!window.attacksOnUaLayers || window.attacksOnUaLayers.length === 0) {
            console.log('Загрузка атак на Украину...');
            initAttacksOnUaLayer(window.attacksOnUaKmlPaths).then(() => {
                // После загрузки добавляем на карту
                window.attacksOnUaLayers.forEach(layer => {
                    if (layer && !map.hasLayer(layer)) {
                        layer.addTo(map);
                    }
                });
            });
        } else {
            // Если уже загружены, просто добавляем на карту
            window.attacksOnUaLayers.forEach(layer => {
                if (layer && !map.hasLayer(layer)) {
                    layer.addTo(map);
                }
            });
        }
        
        console.log('Атаки на Украину показаны');
    } else {
        // Скрываем атаки
        attacksOnUaBtn.classList.remove('active');
        
        // Убираем слои атак с карты
        if (window.attacksOnUaLayers && window.attacksOnUaLayers.length) {
            window.attacksOnUaLayers.forEach(layer => {
                if (layer && map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
        }
        
        console.log('Атаки на Украину скрыты');
    }
    
    // Обновляем title кнопки
    updateAttacksOnUaButtonTitle();
}
*/

// ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ ФИЛЬТРОВ ==========
function initFilters() {
    initEquipmentFilter();
    initAttacksFilter();
    // Обновим заголовки кнопок
    updateMilEquipButtonTitle();
    updateAttacksOnUaButtonTitle();
}

// Экспортируем функции, которые будут нужны в script.js
window.initFilters = initFilters;
window.toggleEquipmentMenu = toggleEquipmentMenu;
window.toggleAttacksMenu = toggleAttacksMenu;
window.updateMilEquipButtonTitle = updateMilEquipButtonTitle;
window.updateAttacksOnUaButtonTitle = updateAttacksOnUaButtonTitle;
window.applyEquipmentFilter = applyEquipmentFilter;
window.applyAttacksFilter = applyAttacksFilter;
window.hideAllEquipmentMarkers = hideAllEquipmentMarkers;
window.hideAllAttacksMarkers = hideAllAttacksMarkers;

//
document.addEventListener('DOMContentLoaded', function() {
    // Перемещаем меню техники в body
    const equipMenu = document.getElementById('equipment-filter-menu');
    if (equipMenu && equipMenu.parentNode !== document.body) {
        document.body.appendChild(equipMenu);
    }
    
    // Перемещаем меню атак в body
    const attacksMenu = document.getElementById('attacks-filter-menu');
    if (attacksMenu && attacksMenu.parentNode !== document.body) {
        document.body.appendChild(attacksMenu);
    }
});