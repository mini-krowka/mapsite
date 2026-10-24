// filters.js
// ============================================
// РљР°С‚РµРіРѕСЂРёРё С‚РµС…РЅРёРєРё
const equipmentCategories = [
    { tag: 'РђРІРёР°С†РёСЏ',                   labelRu: 'РђРІРёР°С†РёСЏ',     labelEn: 'Aircraft' },
    { tag: 'РђСЂС‚РёР»Р»РµСЂРёСЏ',                labelRu: 'РђСЂС‚РёР»Р»РµСЂРёСЏ',  labelEn: 'Artillery' },
    { tag: 'Р‘РџР›Рђ',                      labelRu: 'Р‘РџР›Рђ',        labelEn: 'UAV' },
    { tag: 'Р‘СЂРѕРЅРёСЂРѕРІР°РЅРЅС‹Р№ С‚СЂР°РЅСЃРїРѕСЂС‚',   labelRu: 'Р‘СЂРѕРЅРµРјР°С€РёРЅС‹', labelEn: 'AFV' },
    { tag: 'РџР’Рћ',                       labelRu: 'РџР’Рћ',         labelEn: 'GBAD' },
    { tag: 'РўР°РЅРє',                      labelRu: 'РўР°РЅРєРё',       labelEn: 'Tanks' },
    { tag: 'РќРµР±СЂРѕРЅРёСЂРѕРІР°РЅРЅС‹Р№ С‚СЂР°РЅСЃРїРѕСЂС‚', labelRu: 'РўСЂР°РЅСЃРїРѕСЂС‚',   labelEn: 'Vehicles' },
    { tag: 'Р”СЂСѓРіРѕРµ',                    labelRu: 'Р”СЂСѓРіРѕРµ',      labelEn: 'Other' },
    { tag: 'Р”СЂСѓРіРѕРµ/РќРµС‚ РґР°РЅРЅС‹С…',         labelRu: 'РќРµС‚ РґР°РЅРЅС‹С…',  labelEn: 'No data' }
];

// РљР°С‚РµРіРѕСЂРёРё Р°С‚Р°Рє (РїРѕР»РЅРѕСЃС‚СЊСЋ Р°РЅР°Р»РѕРіРёС‡РЅРѕ)
const attackCategories = [
    { tag: 'РћР±СЉРµРєС‚ РЅРµСѓСЃС‚Р°РЅРѕРІР»РµРЅРЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ',               labelRu: 'РћР±СЉРµРєС‚ РЅРµСѓСЃС‚Р°РЅРѕРІР»РµРЅРЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ', labelEn: 'Unidentified facility' },
    { tag: 'РџСЂРµРґРїСЂРёСЏС‚РёРµ Р’РџРљ',                                  labelRu: 'РџСЂРµРґРїСЂРёСЏС‚РёРµ Р’РџРљ',                    labelEn: 'Defense industry facility' },
    { tag: 'Р–Р” РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',                                labelRu: 'Р–Р” РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',                  labelEn: 'Railway infrastructure' },
    { tag: 'РђСЌСЂРѕРґСЂРѕРј',                                         labelRu: 'РђСЌСЂРѕРґСЂРѕРј',                           labelEn: 'Airfield' },
    { tag: 'РџСЂРµРґРїСЂРёСЏС‚РёРµ РіСЂР°Р¶РґР°РЅСЃРєРѕРіРѕ РёР»Рё РґРІРѕР№РЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ', labelRu: 'РџСЂРµРґРїСЂРёСЏС‚РёРµ РіСЂР°Р¶РґР°РЅСЃРєРѕРіРѕ РёР»Рё РґРІРѕР№РЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ', labelEn: 'Civil or dual-use facility' },
    { tag: 'РџР’Рћ, Р Р›РЎ Рё СЂР°РєРµС‚РЅРѕРµ РІРѕРѕСЂСѓР¶РµРЅРёРµ',                   labelRu: 'РџР’Рћ, Р Р›РЎ Рё СЂР°РєРµС‚РЅРѕРµ РІРѕРѕСЂСѓР¶РµРЅРёРµ',     labelEn: 'Air defense, radar, missile weapons' },
    { tag: 'РџРѕРґСЃС‚Р°РЅС†РёСЏ',                                       labelRu: 'РџРѕРґСЃС‚Р°РЅС†РёСЏ',                         labelEn: 'Substation' },
    { tag: 'РЎРєР»Р°Рґ',                                            labelRu: 'РЎРєР»Р°Рґ',                              labelEn: 'Warehouse' },
    { tag: 'РЎРєР»Р°Рґ Р“РЎРњ',                                        labelRu: 'РЎРєР»Р°Рґ Р“РЎРњ',                          labelEn: 'Fuel depot' },
    { tag: 'Р­РЅРµСЂРіРѕРіРµРЅРµСЂР°С†РёСЏ',                                  labelRu: 'Р­РЅРµСЂРіРѕРіРµРЅРµСЂР°С†РёСЏ',                    labelEn: 'Power generation' },
    { tag: 'РўСЏРіРѕРІР°СЏ РїРѕРґСЃС‚Р°РЅС†РёСЏ',                               labelRu: 'РўСЏРіРѕРІР°СЏ РїРѕРґСЃС‚Р°РЅС†РёСЏ',                 labelEn: 'Traction substation' },
    { tag: 'РњРѕСЃС‚',                                             labelRu: 'РњРѕСЃС‚',                               labelEn: 'Bridge' },
    { tag: 'Р“Р°Р·РѕРІР°СЏ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',                           labelRu: 'Р“Р°Р·РѕРІР°СЏ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',             labelEn: 'Gas infrastructure' },
    { tag: 'РЎСѓРґРЅРѕ',                                            labelRu: 'РЎСѓРґРЅРѕ',                              labelEn: 'Ship' },
    { tag: 'РЎРєР»Р°Рґ Р±РѕРµРїСЂРёРїР°СЃРѕРІ',                                labelRu: 'РЎРєР»Р°Рґ Р±РѕРµРїСЂРёРїР°СЃРѕРІ',                  labelEn: 'Ammunition depot' },
    { tag: 'РЎС‚РѕСЏРЅРєР° РіСЂСѓР·РѕРІРѕРіРѕ С‚СЂР°РЅСЃРїРѕСЂС‚Р°',                     labelRu: 'РЎС‚РѕСЏРЅРєР° РіСЂСѓР·РѕРІРѕРіРѕ С‚СЂР°РЅСЃРїРѕСЂС‚Р°',       labelEn: 'Truck parking' },
    { tag: 'РџРџР”',                                              labelRu: 'РџРџР”',                                labelEn: 'Permanent deployment point' },
    { tag: 'РџРѕРµР·РґР° Рё Р»РѕРєРѕРјРѕС‚РёРІС‹',                              labelRu: 'РџРѕРµР·РґР° Рё Р»РѕРєРѕРјРѕС‚РёРІС‹',                labelEn: 'Trains and locomotives' }
];

// Р“СЂСѓРїРїС‹ Р°С‚Р°Рє вЂ“ РєР°Р¶РґР°СЏ РіСЂСѓРїРїР° СЃРѕРґРµСЂР¶РёС‚ РЅРµСЃРєРѕР»СЊРєРѕ РєР°С‚РµРіРѕСЂРёР№
const attackGroups = [
    {
        tag: 'group1',
        labelRu: 'РђСЌСЂРѕРґСЂРѕРјС‹',
        labelEn: 'Air Bases',
        categories: [
            'РђСЌСЂРѕРґСЂРѕРј'
        ]
    },
    {
        tag: 'group2',
        labelRu: 'Р’РѕРµРЅРЅС‹Рµ Р±Р°Р·С‹',
        labelEn: 'Military sites',
        categories: [
            'РџРџР”',
            'РЎРєР»Р°Рґ Р±РѕРµРїСЂРёРїР°СЃРѕРІ'
            
         ]
        
    },
    {
        tag: 'group3',
        labelRu: 'Р“РўРЎ/Р“РЎРњ',
        labelEn: 'GTS/POL',
        categories: [
            'Р“Р°Р·РѕРІР°СЏ РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',
			'РЎРєР»Р°Рґ Р“РЎРњ',
			'РђР—РЎ'
            
         ]
        
    },
    {
        tag: 'group4',
        labelRu: 'Р–Р” РѕР±СЉРµРєС‚С‹',
        labelEn: 'Railways',
        categories: [
            'Р–Р” РёРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР°',
            'РўСЏРіРѕРІР°СЏ РїРѕРґСЃС‚Р°РЅС†РёСЏ',
        ]
    },
    {
        tag: 'group5',
        labelRu: 'Р›РѕРіРёСЃС‚РёРєР°',
        labelEn: 'Logistics',
        categories: [
            'РЎС‚РѕСЏРЅРєР° РіСЂСѓР·РѕРІРѕРіРѕ С‚СЂР°РЅСЃРїРѕСЂС‚Р°',
            'РњРѕСЃС‚'
        ]
    },
    {
        tag: 'group6',
        labelRu: 'РџР’Рћ/Р Р’',
        labelEn: 'AD/GMW',
        categories: [
            'РџР’Рћ, Р Р›РЎ Рё СЂР°РєРµС‚РЅРѕРµ РІРѕРѕСЂСѓР¶РµРЅРёРµ'
        ]
    },
    {
        tag: 'group7',
        labelRu: 'РџСЂРѕРёР·РІРѕРґСЃС‚РІРѕ',
        labelEn: 'Factories',
        categories: [
            'РџСЂРµРґРїСЂРёСЏС‚РёРµ Р’РџРљ',
            'РџСЂРµРґРїСЂРёСЏС‚РёРµ РіСЂР°Р¶РґР°РЅСЃРєРѕРіРѕ РёР»Рё РґРІРѕР№РЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ'
        ]
    },
    
    {
        tag: 'group8',
        labelRu: 'РЎРєР»Р°РґС‹',
        labelEn: 'Warehouses',
        categories: [
            'РЎРєР»Р°Рґ'
        ]
    },
        
    {
        tag: 'group9',
        labelRu: 'РўСЂР°РЅСЃРїРѕСЂС‚',
        labelEn: 'Transport',
        categories: [
            'РЎСѓРґРЅРѕ',
            'РџРѕРµР·РґР° Рё Р»РѕРєРѕРјРѕС‚РёРІС‹'            
        ]
    },
    {
        tag: 'group10',
        labelRu: 'Р­РЅРµСЂРіРµС‚РёРєР°',
        labelEn: 'Energy',
        categories: [
            'Р­РЅРµСЂРіРѕРіРµРЅРµСЂР°С†РёСЏ',
            'РџРѕРґСЃС‚Р°РЅС†РёСЏ',
                   
        ]
    },
    {
        tag: 'group11',
        labelRu: 'РќРµ РѕРїСЂРµРґРµР»РµРЅРѕ',
        labelEn: 'Undefined',
        categories: [
            'РћР±СЉРµРєС‚ РЅРµСѓСЃС‚Р°РЅРѕРІР»РµРЅРЅРѕРіРѕ РЅР°Р·РЅР°С‡РµРЅРёСЏ',
                       
        ]
    }
];

// РћС‚РѕР±СЂР°Р¶РµРЅРёРµ РєР°С‚РµРіРѕСЂРёРё -> РіСЂСѓРїРїР° (РґР»СЏ Р±С‹СЃС‚СЂРѕР№ РїСЂРѕРІРµСЂРєРё)
const categoryToGroupTag = {};
attackGroups.forEach(group => {
    group.categories.forEach(cat => {
        categoryToGroupTag[cat] = group.tag;
    });
});
// Р”РѕСЃС‚СѓРїРµРЅ РёР· CanvasPointsLayer.applyFilter
window.categoryToGroupTag = categoryToGroupTag;


// Р“Р»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ РґР»СЏ С„РёР»СЊС‚СЂРѕРІ
window.allEquipmentMarkers = [];     // { marker, category }
// РЅР°С‡Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ вЂ“ РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ (РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ)
window.selectedEquipmentCategories = [];  // null = РІСЃРµ, РёРЅР°С‡Рµ РјР°СЃСЃРёРІ
window.isMilEquipVisible = false;

window.allAttacksMarkers = [];
// РЅР°С‡Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ вЂ“ РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ (РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ)
window.selectedAttacksCategories = []; // С…СЂР°РЅРёС‚ РјР°СЃСЃРёРІ tag РіСЂСѓРїРї (РёР»Рё null)
window.isAttacksVisible = false;

// Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅС‹Р№ С„Р»Р°Рі РґР»СЏ РїСЂРµРґРѕС‚РІСЂР°С‰РµРЅРёСЏ СЂРµРєСѓСЂСЃРёРё
let isUpdatingFilter = false;

// ========== РћР‘Р©РР• РЈРўРР›РРўР« ==========
function syncSelectAllState(selectAllId, checkboxClass) {
    const selectAll = document.getElementById(selectAllId);
    if (!selectAll) return;
    const catCheckboxes = document.querySelectorAll(`.${checkboxClass}`);
    const allChecked = Array.from(catCheckboxes).every(cb => cb.checked);
    selectAll.checked = allChecked;
}

// ========== Р¤РР›Р¬РўР  РўР•РҐРќРРљР ==========
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
    
    // Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ СЃРѕСЃС‚РѕСЏРЅРёСЏ вЂ“ РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ РѕР·РЅР°С‡Р°РµС‚ РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ
    if (window.selectedEquipmentCategories === null) {
        // null РѕР·РЅР°С‡Р°РµС‚ В«РІСЃРµВ», РЅРѕ РїСЂРё РёРЅРёС†РёР°Р»РёР·Р°С†РёРё С‚Р°РєРѕРіРѕ Р±С‹С‚СЊ РЅРµ РґРѕР»Р¶РЅРѕ
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
    
    // РџСЂРёРјРµРЅСЏРµРј РЅР°С‡Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ С„РёР»СЊС‚СЂР° (СЃРєСЂС‹РІР°РµРј РІСЃС‘)
    updateEquipmentFilter();
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
    if (window.pointsCanvas) window.pointsCanvas.applyFilter();
}

function hideAllEquipmentMarkers() {
    if (window.pointsCanvas) window.pointsCanvas.setLayerTypeVisible('equipment', false);
}

function toggleEquipmentMenu() {
    const menu = document.getElementById('equipment-filter-menu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    if (!isVisible) {
        const btn = document.getElementById('mil-equip-btn');
        const rect = btn.getBoundingClientRect();
        if (isCompactViewport()) {
            menu.style.bottom = '0px';
            menu.style.top = 'auto';
            menu.style.left = '0px';
        } else {
            menu.style.top = (rect.bottom + window.scrollY) + 'px';
            menu.style.left = (rect.left + window.scrollX) + 'px';
            menu.style.bottom = 'auto';
        }
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

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РѕР±РЅРѕРІР»РµРЅРёСЏ Р·Р°РіРѕР»РѕРІРєР° РєРЅРѕРїРєРё С‚РµС…РЅРёРєРё
function updateMilEquipButtonTitle() {
    const btn = document.getElementById('mil-equip-btn');
    if (btn) {
        const t = translations[currentLang];
        btn.title = window.isMilEquipVisible ? (t.hideEquipment || 'РЎРєСЂС‹С‚СЊ С‚РµС…РЅРёРєСѓ') : (t.showEquipment || 'РџРѕРєР°Р·Р°С‚СЊ С‚РµС…РЅРёРєСѓ');
    }
}

// ========== Р¤РР›Р¬РўР  РђРўРђРљ ==========
function initAttacksFilter() {
    const container = document.getElementById('attacks-category-list');
    if (!container) return;
    container.innerHTML = '';
    
    // РЎС‚СЂРѕРёРј С‡РµРєР±РѕРєСЃС‹ РґР»СЏ РіСЂСѓРїРї
    attackGroups.forEach(group => {
        const label = currentLang === 'ru' ? group.labelRu : group.labelEn;
        const div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" class="attacks-cat-checkbox" value="${group.tag}"> ${label}</label>`;
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
    
    updateAttacksFilter();
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
    if (window.pointsCanvas) window.pointsCanvas.applyFilter();
}

function hideAllAttacksMarkers() {
    if (window.pointsCanvas) window.pointsCanvas.setLayerTypeVisible('attacks', false);
}

function toggleAttacksMenu() {
    const menu = document.getElementById('attacks-filter-menu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    if (!isVisible) {
        const btn = document.getElementById('attacks-on-ua-btn');
        const rect = btn.getBoundingClientRect();
        if (isCompactViewport()) {
            menu.style.bottom = '0px';
            menu.style.top = 'auto';
            menu.style.left = '0px';
        } else {
            menu.style.top = (rect.bottom + window.scrollY) + 'px';
            menu.style.left = (rect.left + window.scrollX) + 'px';
            menu.style.bottom = 'auto';
        }
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
            (t.hideAttacksOnUa || 'РЎРєСЂС‹С‚СЊ СѓРґР°СЂС‹ РїРѕ РЈРєСЂР°РёРЅРµ') : 
            (t.showAttacksOnUa || 'РџРѕРєР°Р·Р°С‚СЊ СѓРґР°СЂС‹ РїРѕ РЈРєСЂР°РёРЅРµ');
    }
}

// ========== Р¤РР›Р¬РўР  Р¤РћР РўРР¤РРљРђР¦РР™ ==========
// Р“Р»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ
window.allFortificationLayers = [];    // РјР°СЃСЃРёРІ { layerGroup, filePath, displayName }
window.selectedFortificationFiles = []; // РїСѓСЃС‚РѕР№ РјР°СЃСЃРёРІ вЂ“ РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ // null = РІСЃРµ, РёРЅР°С‡Рµ РјР°СЃСЃРёРІ РІС‹Р±СЂР°РЅРЅС‹С… РїСѓС‚РµР№
window.isFortificationVisible = false; // РїРµСЂРµРѕРїСЂРµРґРµР»РёРј, С‡С‚РѕР±С‹ СѓРїСЂР°РІР»СЏС‚СЊ С‡РµСЂРµР· РєРЅРѕРїРєСѓ

// РќР°Р·РІР°РЅРёСЏ С„Р°Р№Р»РѕРІ С„РѕСЂС‚РёС„РёРєР°С†РёР№ РЅР° СЂР°Р·РЅС‹С… СЏР·С‹РєР°С…
const fortificationFileNames = {
    'CK_Trenches':   { ru: 'РўСЂР°РЅС€РµРё',      en: 'Trenches' },
    'CK_Teeth':      { ru: 'РќР°РґРѕР»Р±С‹',      en: 'Dragon\'s teeth' },
    'CK_Ditches':    { ru: 'Р РІС‹',          en: 'Ditches' },
    'CK_Wire':       { ru: 'РљРѕР»СЋС‡РєР°',      en: 'Barbed wire' }
    // 'ditches3':      { ru: 'Р РІС‹ (СЃС‚Р°СЂС‹Рµ)', en: 'Ditches (old)' },
    // 'Barbed_wire':   { ru: 'РљРѕР»СЋС‡РєР° (СЃС‚Р°СЂР°СЏ)', en: 'Barbed wire (old)' },
    // 'teeth':         { ru: 'РќР°РґРѕР»Р±С‹ (СЃС‚Р°СЂС‹Рµ)', en: 'Dragon\'s teeth (old)' }
};

// Р¤СѓРЅРєС†РёСЏ РґР»СЏ РїРѕР»СѓС‡РµРЅРёСЏ РѕС‚РѕР±СЂР°Р¶Р°РµРјРѕРіРѕ РёРјРµРЅРё С„Р°Р№Р»Р°
function getFortificationDisplayName(filePath, lang = currentLang) {
    let name = filePath.split('/').pop();
    name = name.replace(/\.(kml|geojson)$/i, '');
    if (fortificationFileNames[name] && fortificationFileNames[name][lang]) {
        return fortificationFileNames[name][lang];
    }
    return null; // С„Р°Р№Р» РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚СЃСЏ, РЅРµ РїРѕРєР°Р·С‹РІР°С‚СЊ РІ РјРµРЅСЋ
}

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РјРµРЅСЋ С„РёР»СЊС‚СЂР° С„РѕСЂС‚РёС„РёРєР°С†РёР№
function initFortificationFilter() {
    const container = document.getElementById('fortif-category-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (!window.fortificationKmlPaths || !window.fortificationKmlPaths.length) {
        container.innerHTML = '<div style="color:gray;">РќРµС‚ РґР°РЅРЅС‹С…</div>';
        return;
    }
    
    let hasAny = false;
    window.fortificationKmlPaths.forEach(filePath => {
        const displayName = getFortificationDisplayName(filePath, currentLang);
        if (!displayName) return; // РїСЂРѕРїСѓСЃРєР°РµРј С„Р°Р№Р»С‹ Р±РµР· РїРµСЂРµРІРѕРґР°
        hasAny = true;
        const div = document.createElement('div');
        div.innerHTML = `<label><input type="checkbox" class="fortif-cat-checkbox" value="${filePath.replace(/"/g, '&quot;')}"> ${displayName}</label>`;
        container.appendChild(div);
    });
    
    if (!hasAny) {
        container.innerHTML = '<div style="color:gray;">РќРµС‚ РґР°РЅРЅС‹С…</div>';
        return;
    }
    
    const selectAll = document.getElementById('fortif-select-all');
    const catCheckboxes = document.querySelectorAll('.fortif-cat-checkbox');
    
    // Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ СЃРѕСЃС‚РѕСЏРЅРёСЏ (РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ РЅРёС‡РµРіРѕ РЅРµ РІС‹Р±СЂР°РЅРѕ)
    if (window.selectedFortificationFiles === null) {
        selectAll.checked = true;
        catCheckboxes.forEach(cb => cb.checked = true);
    } else if (window.selectedFortificationFiles.length === 0) {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => cb.checked = false);
    } else {
        selectAll.checked = false;
        catCheckboxes.forEach(cb => {
            cb.checked = window.selectedFortificationFiles.includes(cb.value);
        });
    }
    
    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        catCheckboxes.forEach(cb => cb.checked = isChecked);
        updateFortificationFilter();
    });
    
    catCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            syncSelectAllState('fortif-select-all', 'fortif-cat-checkbox');
            updateFortificationFilter();
        });
    });
    
    // РџСЂРёРјРµРЅСЏРµРј РЅР°С‡Р°Р»СЊРЅРѕРµ СЃРѕСЃС‚РѕСЏРЅРёРµ
    updateFortificationFilter();
}

// РћР±РЅРѕРІР»РµРЅРёРµ С„РёР»СЊС‚СЂР° (РІС‹Р·С‹РІР°РµС‚СЃСЏ РїСЂРё РёР·РјРµРЅРµРЅРёРё С‡РµРєР±РѕРєСЃРѕРІ)
function updateFortificationFilter() {
    if (isUpdatingFilter) return;
    isUpdatingFilter = true;
    
    const selectAll = document.getElementById('fortif-select-all');
    const catCheckboxes = document.querySelectorAll('.fortif-cat-checkbox');
    const fortifBtn = document.getElementById('fortification-btn');
    
    if (selectAll.checked) {
        window.selectedFortificationFiles = null;
        window.isFortificationVisible = true;
        fortifBtn.classList.add('active');
        applyFortificationFilter();
    } else {
        const selected = Array.from(catCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        window.selectedFortificationFiles = selected;
        if (selected.length === 0) {
            window.isFortificationVisible = false;
            fortifBtn.classList.remove('active');
            hideAllFortificationLayers();
        } else {
            window.isFortificationVisible = true;
            fortifBtn.classList.add('active');
            applyFortificationFilter();
        }
    }
    isUpdatingFilter = false;
}

// РџСЂРёРјРµРЅРµРЅРёРµ С‚РµРєСѓС‰РµРіРѕ С„РёР»СЊС‚СЂР° Рє СЃР»РѕСЏРј
function applyFortificationFilter() {
    if (!window.allFortificationLayers.length) return;
    
    if (!window.isFortificationVisible) {
        hideAllFortificationLayers();
        return;
    }
    
    // Р•СЃР»Рё РІС‹Р±СЂР°РЅС‹ РІСЃРµ С„Р°Р№Р»С‹ (null) вЂ“ РїРѕРєР°Р·С‹РІР°РµРј РІСЃРµ СЃР»РѕРё
    if (window.selectedFortificationFiles === null) {
        window.allFortificationLayers.forEach(item => {
            if (!map.hasLayer(item.layerGroup)) item.layerGroup.addTo(map);
        });
        return;
    }
    
    // РРЅР°С‡Рµ РїРѕРєР°Р·С‹РІР°РµРј С‚РѕР»СЊРєРѕ РІС‹Р±СЂР°РЅРЅС‹Рµ
    const selectedSet = new Set(window.selectedFortificationFiles);
    window.allFortificationLayers.forEach(item => {
        const shouldShow = selectedSet.has(item.filePath);
        if (shouldShow) {
            if (!map.hasLayer(item.layerGroup)) item.layerGroup.addTo(map);
        } else {
            if (map.hasLayer(item.layerGroup)) map.removeLayer(item.layerGroup);
        }
    });
}

function hideAllFortificationLayers() {
    window.allFortificationLayers.forEach(item => {
        if (map.hasLayer(item.layerGroup)) map.removeLayer(item.layerGroup);
    });
}

// РџРµСЂРµРєР»СЋС‡РµРЅРёРµ РІРёРґРёРјРѕСЃС‚Рё РјРµРЅСЋ С„РёР»СЊС‚СЂР° С„РѕСЂС‚РёС„РёРєР°С†РёР№
function toggleFortificationMenu() {
    const menu = document.getElementById('fortification-filter-menu');
    if (!menu) return;
    const isVisible = menu.style.display === 'block';
    if (!isVisible) {
        const btn = document.getElementById('fortification-btn');
        const rect = btn.getBoundingClientRect();
        if (isCompactViewport()) {
            menu.style.bottom = '0px';
            menu.style.top = 'auto';
            menu.style.left = '0px';
        } else {
            menu.style.top = (rect.bottom + window.scrollY) + 'px';
            menu.style.left = (rect.left + window.scrollX) + 'px';
            menu.style.bottom = 'auto';
        }
        menu.style.display = 'block';
        // Р•СЃР»Рё СЃР»РѕРё РµС‰С‘ РЅРµ Р·Р°РіСЂСѓР¶РµРЅС‹, Р·Р°РіСЂСѓР¶Р°РµРј РёС…
        if (window.allFortificationLayers.length === 0 && window.fortificationKmlPaths) {
            initFortificationLayerWithFilter(window.fortificationKmlPaths).then(() => applyFortificationFilter());
        } else {
            applyFortificationFilter();
        }
    } else {
        menu.style.display = 'none';
    }
}

// РћР±РЅРѕРІР»РµРЅРёРµ Р·Р°РіРѕР»РѕРІРєР° РєРЅРѕРїРєРё
function updateFortificationButtonTitle() {
    const btn = document.getElementById('fortification-btn');
    if (btn) {
        const t = translations[currentLang];
        btn.title = window.isFortificationVisible ? 
            (t.hideFortifications || 'РЎРєСЂС‹С‚СЊ С„РѕСЂС‚РёС„РёРєР°С†РёРё') : 
            (t.showFortifications || 'РџРѕРєР°Р·Р°С‚СЊ С„РѕСЂС‚РёС„РёРєР°С†РёРё');
    }
}

// РќРѕРІР°СЏ С„СѓРЅРєС†РёСЏ Р·Р°РіСЂСѓР·РєРё С„РѕСЂС‚РёС„РёРєР°С†РёР№ СЃ РїРѕРґРґРµСЂР¶РєРѕР№ РѕС‚РґРµР»СЊРЅС‹С… СЃР»РѕС‘РІ
async function initFortificationLayerWithFilter(kmlFilePaths) {
    // РћС‡РёС‰Р°РµРј СЃС‚Р°СЂС‹Рµ РґР°РЅРЅС‹Рµ
    if (window.allFortificationLayers.length) {
        window.allFortificationLayers.forEach(item => {
            if (map.hasLayer(item.layerGroup)) map.removeLayer(item.layerGroup);
        });
        window.allFortificationLayers = [];
    }
    
    for (const path of kmlFilePaths) {
        // РџСЂРѕРІРµСЂСЏРµРј, РґРѕР»Р¶РµРЅ Р»Рё СЌС‚РѕС‚ С„Р°Р№Р» РѕС‚РѕР±СЂР°Р¶Р°С‚СЊСЃСЏ РІ РјРµРЅСЋ
        const displayName = getFortificationDisplayName(path, currentLang);
        if (!displayName) continue; // РїСЂРѕРїСѓСЃРєР°РµРј
    
        const layerGroup = L.layerGroup();
        const ext = path.split('.').pop().toLowerCase();
        
        try {
            if (ext === 'geojson' || ext === 'json') {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const geojsonData = await response.json();
                const geoJsonLayer = L.geoJSON(geojsonData, {
                    style: function(feature) {
                        return {
                            color: feature.properties?.stroke || THEME.colors.layerRuAF,
                            weight: feature.properties?.['stroke-width'] || 2,
                            opacity: feature.properties?.['stroke-opacity'] || 1,
                            pane: 'vectorLines',
                        };
                    },
                    onEachFeature: function(feature, layer) {
                        if (feature.properties && feature.properties.name) {
                            layer.bindPopup(feature.properties.name);
                        }
                    }
                });
                geoJsonLayer.addTo(layerGroup);
            } else {
                // KML
                await loadKmlToLayer(path, layerGroup, {
                    isPermanent: false,
                    preserveZoom: true,
                    fitBounds: false,
                    pane: 'vectorLines'
                });
            }
            window.allFortificationLayers.push({
                layerGroup: layerGroup,
                filePath: path,
                displayName: displayName
            });
            console.log(`Р—Р°РіСЂСѓР¶РµРЅ СЃР»РѕР№ С„РѕСЂС‚РёС„РёРєР°С†РёРё: ${path}`);
        } catch (error) {
            console.error(`РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё С„РѕСЂС‚РёС„РёРєР°С†РёРё ${path}:`, error);
        }
    }
    
    if (window.isFortificationVisible) applyFortificationFilter();
    else hideAllFortificationLayers();
    
    return window.allFortificationLayers;
}

// ========== РЎР›РћР™ РџРћР”Р РђР—Р”Р•Р›Р•РќРР™ Р’РЎРЈ ==========

// Р“Р»РѕР±Р°Р»СЊРЅС‹Рµ РїРµСЂРµРјРµРЅРЅС‹Рµ РґР»СЏ СЃР»РѕСЏ
window.unitsUaMarkers = [];          // РјР°СЃСЃРёРІ РјР°СЂРєРµСЂРѕРІ
window.isUnitsUaVisible = false;     // С„Р»Р°Рі РІРёРґРёРјРѕСЃС‚Рё
window.unitsUaLayer = null;          // РіСЂСѓРїРї-СЃР»РѕР№
window.unitsUaIconsMap = {};         // СЃР»РѕРІР°СЂСЊ id в†’ { photo, title }
window.unitsUaIconsLoaded = false;   // Р·Р°РіСЂСѓР¶РµРЅ Р»Рё result.json
window.unitsUaDetailsMap = {};       // Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Р№ РѕР±СЉРµРєС‚ РґР»СЏ С…СЂР°РЅРµРЅРёСЏ РґРµС‚Р°Р»СЊРЅРѕР№ РёРЅС„РѕСЂРјР°С†РёРё Рѕ РїРѕРґСЂР°Р·РґРµР»РµРЅРёРё
window.unitsUaDetailMode = false;    // СЂРµР¶РёРј РґРµС‚Р°Р»СЊРЅРѕРіРѕ РїСЂРѕСЃРјРѕС‚СЂР°
window.unitsUaDetailProfileId = null; // ID РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ РІ СЂРµР¶РёРјРµ РґРµС‚Р°Р»РµР№
window.unitsUaSavedMarkers = [];     // СЃРѕС…СЂР°РЅС‘РЅРЅС‹Рµ РјР°СЂРєРµСЂС‹ РџР’Р” РґР»СЏ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёСЏ
window.unitsUaDetailMarkers = [];    // РјР°СЂРєРµСЂС‹ Р‘Р” РІ СЂРµР¶РёРјРµ РґРµС‚Р°Р»РµР№
window.unitsUaDetailPvdMarkers = []; // РјР°СЂРєРµСЂС‹ РџР’Р” РІ СЂРµР¶РёРјРµ РґРµС‚Р°Р»РµР№

// Р¤СѓРЅРєС†РёСЏ РїР°СЂСЃРёРЅРіР° С‚РµРєСЃС‚Р° СЃРѕРѕР±С‰РµРЅРёСЏ РґР»СЏ РёР·РІР»РµС‡РµРЅРёСЏ СЃРѕСЃС‚Р°РІР°, РІРѕРѕСЂСѓР¶РµРЅРёСЏ Рё РјРµС‚РѕРє
function parseUnitsUaDetails(text) {
    const details = {
        composition: '',
        armament: '',
        formation: '',
        armyCorps: '?',
        description: ''
    };
    if (!text) return details;

    // РџР°СЂСЃРёРЅРі "РћРїРёСЃР°РЅРёРµ" вЂ“ РёСЃРєР»СЋС‡Р°РµРј СЃС‚СЂРѕРєРё, РЅР°С‡РёРЅР°СЋС‰РёРµСЃСЏ СЃ РїСЂРµС„РёРєСЃРѕРІ СЃСЃС‹Р»РѕРє
    const descRegex = /РћРїРёСЃР°РЅРёРµ:?\s*([\s\S]*?)(?=\n\s*(?:РўР“|Р¤Р‘|Р®С‚|РўРІ|РРЅСЃС‚|РўРёРє|X|Facebook|Telegram|Youtube|Instagram|TikTok|Twitter|Link|РЎР°Р№С‚|Р’РµР±|http|РЎРѕСЃС‚Р°РІ|Р’РѕРѕСЂСѓР¶РµРЅРёРµ|$))/i;
    const descMatch = text.match(descRegex);
    if (descMatch) {
        details.description = descMatch[1].trim();
    }

    // РС‰РµРј СЃРµРєС†РёСЋ "РЎРѕСЃС‚Р°РІ" вЂ“ РѕС‚ СЃР»РѕРІР° "РЎРѕСЃС‚Р°РІ" (СЃ РґРІРѕРµС‚РѕС‡РёРµРј РёР»Рё Р±РµР·) РґРѕ СЃР»РµРґСѓСЋС‰РµРіРѕ РїСѓСЃС‚РѕРіРѕ Р±Р»РѕРєР° РёР»Рё РґРѕ "Р’РѕРѕСЂСѓР¶РµРЅРёРµ"
    const compRegex = /РЎРѕСЃС‚Р°РІ:?[\s\n]*([\s\S]*?)Р’РѕРѕСЂСѓР¶РµРЅРёРµ/i;
    const compMatch = text.match(compRegex);
    if (compMatch) {
        details.composition = compMatch[1].trim();
    }

    // РС‰РµРј СЃРµРєС†РёСЋ "Р’РѕРѕСЂСѓР¶РµРЅРёРµ" вЂ“ РѕС‚ СЃР»РѕРІР° "Р’РѕРѕСЂСѓР¶РµРЅРёРµ" РґРѕ СЃР»РµРґСѓСЋС‰РµРіРѕ РїСѓСЃС‚РѕРіРѕ Р±Р»РѕРєР° РёР»Рё РґРѕ Р·Р°РіРѕР»РѕРІРєРѕРІ (Р РЎР—Рћ, РўСЏР¶С‘Р»Р°СЏ Р±СЂРѕРЅРµС‚РµС…РЅРёРєР°, Р—РµРЅРёС‚РЅРѕ-СЂР°РєРµС‚РЅС‹Рµ, #)
    const armRegex = /Р’РѕРѕСЂСѓР¶РµРЅРёРµ:?[\s\n]*([^#]+)/i;
    const armMatch = text.match(armRegex);
    if (armMatch) {
        details.armament = armMatch[1].trim();
    }

    // Р¤РѕСЂРјРёСЂРѕРІР°РЅРёРµ РїРѕ С…СЌС€С‚РµРіСѓ
    const formationTags = ['#Р’РЎРЈ', '#РќР“РЈ', '#Р“РџРЎРЈ', '#РњР’Р”'];
    for (const tag of formationTags) {
        if (text.includes(tag)) {
            details.formation = tag.substring(1);
            break;
        }
    }

    // РђСЂРјРµР№СЃРєРёР№ РєРѕСЂРїСѓСЃ
    const akMatch = text.match(/#РђРљ_(\d+)/);
    if (akMatch) details.armyCorps = akMatch[1];

    return details;
}

// Р—Р°РіСЂСѓР·РєР° РёРєРѕРЅРѕРє Рё РЅР°Р·РІР°РЅРёР№ РёР· result.json (РїРѕРґРґРµСЂР¶РєР° photo Рё file_name)
async function loadUnitsUaIcons() {
    if (window.unitsUaIconsLoaded) return;

    const jsonPath = window.unitsUaJsonPath;
    if (!jsonPath) {
        console.error('РџСѓС‚СЊ Рє UnitsUA.json РЅРµ Р·Р°РґР°РЅ (window.unitsUaJsonPath)');
        return;
    }

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        window.unitsUaData = data;

        for (const msg of data.messages) {
            if (!msg.file && !msg.file_name) continue;

            let imagePath = null;
            if (msg.file && typeof msg.file === 'string') {
                imagePath = msg.file;
            } else if (msg.file_name && typeof msg.file_name === 'string') {
                imagePath = 'files/' + msg.file_name;
            }
            if (!imagePath) continue;

            const fullText = getMessageText(msg);
            if (!fullText) continue;

            const idMatch = fullText.match(/^ID\s*:\s*(\d+)/m);
            if (!idMatch) continue;

            const profileId = idMatch[1];
            
            // console.log(`РћР±СЂР°Р±РѕС‚РєР° СЃРѕРѕР±С‰РµРЅРёСЏ ID: ${idMatch ? idMatch[1] : 'unknown'}`);
            const details = parseUnitsUaDetails(fullText);
            // console.log(`Р”РµС‚Р°Р»Рё РґР»СЏ ID ${profileId}:`, details);

            // РР·РІР»РµРєР°РµРј РЅР°Р·РІР°РЅРёРµ (РїРµСЂРІР°СЏ РЅРµРїСѓСЃС‚Р°СЏ СЃС‚СЂРѕРєР° РїРѕСЃР»Рµ ID)
            const lines = fullText.split('\n');
            let title = '';
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('http')) {
                    title = line;
                    break;
                }
            }

            // РЎРѕС…СЂР°РЅСЏРµРј РёРєРѕРЅРєСѓ Рё РЅР°Р·РІР°РЅРёРµ
            window.unitsUaIconsMap[profileId] = {
                photo: imagePath,
                title: title || `РџРѕРґСЂР°Р·РґРµР»РµРЅРёРµ ID:${profileId}`
            };

            // РџР°СЂСЃРёРј РґРµС‚Р°Р»Рё (СЃРѕСЃС‚Р°РІ, РІРѕРѕСЂСѓР¶РµРЅРёРµ, С„РѕСЂРјРёСЂРѕРІР°РЅРёРµ, Р°СЂРјРµР№СЃРєРёР№ РєРѕСЂРїСѓСЃ)
            window.unitsUaDetailsMap[profileId] = parseUnitsUaDetails(fullText);
        }

        window.unitsUaIconsLoaded = true;
        // console.log(`Р—Р°РіСЂСѓР¶РµРЅРѕ ${Object.keys(window.unitsUaIconsMap).length} РїСЂРѕС„РёР»РµР№ СЃ РґРµС‚Р°Р»СЏРјРё`);
    } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё UnitsUA.json:', error);
        window.unitsUaIconsLoaded = true;
    }
}

function getMessageText(msg) {
    if (typeof msg.text === 'string') return msg.text;
    if (Array.isArray(msg.text))
        return msg.text.map(part => (typeof part === 'string' ? part : part.text)).join('');
    return '';
}

// РњРѕР±РёР»СЊРЅРѕРµ СѓСЃС‚СЂРѕР№СЃС‚РІРѕ (hover-С‚СѓР»С‚РёРїС‹ РЅР° СЃРµРЅСЃРѕСЂРЅРѕРј СЌРєСЂР°РЅРµ РЅРµ СЂР°Р±РѕС‚Р°СЋС‚)
function isMobileDevice() {
    return isMobileViewport();
}

// Р¤СѓРЅРєС†РёСЏ РїРѕРёСЃРєР° РїСЂРѕС„РёР»РµР№ РїРѕ С†РёС„СЂР°Рј
// С‚РѕС‡РЅРѕРµ СЃРѕРІРїР°РґРµРЅРёРµ С‡РёСЃР»Р°, РґР»СЏ РѕР±РѕРёС… С‚СЌРіРѕРІ
function getProfileIdsBySearchDigits(digits) {
    const result = new Set();
    if (!window.unitsUaData || !window.unitsUaData.messages) return result;

    const reBr = /#Р‘СЂ_(\d+)/g;
    const rePk = /#РџРє_(\d+)/g;
    const reBt = /#Р‘С‚_(\d+)/g;
    const reGw = /#Р“Р’_(\d+)/g;

    for (const msg of window.unitsUaData.messages) {
        const text = getMessageText(msg);
        let found = false;

        let match;
        while ((match = reBr.exec(text)) !== null) {
            if (match[1] === digits) found = true;
        }
        while ((match = rePk.exec(text)) !== null) {
            if (match[1] === digits) found = true;
        }
        while ((match = reBt.exec(text)) !== null) {
            if (match[1] === digits) found = true;
        }
        while ((match = reGw.exec(text)) !== null) {
            if (match[1] === digits) found = true;
        }

        if (found) {
            const idMatch = text.match(/^ID\s*:\s*(\d+)/m);
            if (idMatch) result.add(idMatch[1]);
        }
    }
    return result;
}

// Р¤СѓРЅРєС†РёСЏ РїРѕРёСЃРєР° РїСЂРѕС„РёР»РµР№ РїРѕ Р±СѓРєРІРµРЅРЅРѕРјСѓ РЅР°Р·РІР°РЅРёСЋ
// С‚РѕС‡РЅРѕРµ СЃРѕРІРїР°РґРµРЅРёРµ РЅР°Р·РІР°РЅРёСЏ РґР»СЏ РІСЃРµС… С‚РµРіРѕРІ: РџРє_, Р‘СЂ_, Р‘С‚_, Р“Р’_, РђРљ_
function getProfileIdsBySearchText(text) {
    const result = new Set();
    if (!window.unitsUaData || !window.unitsUaData.messages) return result;

    // РС‰РµРј РїРѕ РІСЃРµРј С‚РµРіР°Рј, С‚РѕС‡РЅРѕРµ СЃРѕРІРїР°РґРµРЅРёРµ РЅР°Р·РІР°РЅРёСЏ РїРѕСЃР»Рµ РїРѕРґС‡РµСЂРєРёРІР°РЅРёСЏ
    const reBr = /#Р‘СЂ_([Рђ-РЇР°-СЏA-Za-z]+)/g;
    const rePk = /#РџРє_([Рђ-РЇР°-СЏA-Za-z]+)/g;
    const reBt = /#Р‘С‚_([Рђ-РЇР°-СЏA-Za-z]+)/g;
    const reGw = /#Р“Р’_([Рђ-РЇР°-СЏA-Za-z]+)/g;
    const reAk = /#РђРљ_([Рђ-РЇР°-СЏA-Za-z]+)/g;

    for (const msg of window.unitsUaData.messages) {
        const fullText = getMessageText(msg);
        let found = false;

        let match;
        while ((match = reBr.exec(fullText)) !== null) {
            if (match[1] === text) found = true;
        }
        while ((match = rePk.exec(fullText)) !== null) {
            if (match[1] === text) found = true;
        }
        while ((match = reBt.exec(fullText)) !== null) {
            if (match[1] === text) found = true;
        }
        while ((match = reGw.exec(fullText)) !== null) {
            if (match[1] === text) found = true;
        }
        while ((match = reAk.exec(fullText)) !== null) {
            if (match[1] === text) found = true;
        }

        if (found) {
            const idMatch = fullText.match(/^ID\s*:\s*(\d+)/m);
            if (idMatch) result.add(idMatch[1]);
        }
    }
    return result;
}

// РџР°СЂСЃРёРЅРі РґР°С‚С‹ РёР· CSV (С„РѕСЂРјР°С‚ YYYY.MM.DD)
function parseCsvDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // РјРµСЃСЏС†С‹ РІ JS 0-11
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

// РџР°СЂСЃРёРЅРі СЃС‚СЂРѕРєРё CSV
function parseUnitsCsvRow(row) {
    const parts = row.split(',');
    if (parts.length < 7) return null; // РјРёРЅРёРјСѓРј РґРѕ СЃС‚РѕР»Р±С†Р° "РСЃС‚РѕС‡РЅРёРє"
    return {
        profileId: parts[1].trim(),
        date: parts[2].trim(),
        lat: parseFloat(parts[3].trim()),
        lng: parseFloat(parts[4].trim()),
        characteristic: parts[5].trim(),
        link: parts[6].trim(),
        details: parts.length > 7 ? parts.slice(7).join(',').trim() : ''
    };
}

// Р¤СѓРЅРєС†РёСЏ Р·Р°РіСЂСѓР·РєРё С‚РѕС‡РµРє СЃ С„РёР»СЊС‚СЂРѕРј РїРѕ РґР°С‚Рµ (С‚РѕР»СЊРєРѕ РџР’Р”, РЅРµ Р±РѕР»РµРµ РѕРґРЅРѕР№ РЅР° ID)
async function loadUnitsUaWithDateFilter(targetDateStr, allowedProfileIds = null) {
    if (!window.unitsUaCsvPath) {
        console.error('РџСѓС‚СЊ Рє CSV РЅРµ Р·Р°РґР°РЅ РІ data.js');
        return;
    }

    try {
        const response = await fetch(window.unitsUaCsvPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return;

        const dataLines = lines.slice(1); // Р±РµР· Р·Р°РіРѕР»РѕРІРєР°

        const allRows = [];
        for (const line of dataLines) {
            const data = parseUnitsCsvRow(line);
            if (!data) continue;
            if (isNaN(data.lat) || isNaN(data.lng)) continue;
            if (data.characteristic !== 'РџР’Р”') continue;
            if (allowedProfileIds && !allowedProfileIds.has(data.profileId)) continue;
            allRows.push(data);
        }

        const byProfile = {};
        allRows.forEach(row => {
            if (!byProfile[row.profileId]) byProfile[row.profileId] = [];
            byProfile[row.profileId].push(row);
        });

        const targetDate = parseCustomDate(targetDateStr);
        const selectedRows = [];

        for (const profileId in byProfile) {
            const rows = byProfile[profileId];
            const validRows = rows.filter(row => {
                const rowDate = parseCsvDate(row.date);
                return rowDate <= targetDate;
            });
            if (validRows.length === 0) continue;
            const latestRow = validRows.reduce((a, b) => {
                const dateA = parseCsvDate(a.date);
                const dateB = parseCsvDate(b.date);
                return dateA > dateB ? a : b;
            });
            selectedRows.push(latestRow);
        }

        await loadUnitsUaIcons(); // РіР°СЂР°РЅС‚РёСЂСѓРµРј, С‡С‚Рѕ РґРµС‚Р°Р»Рё Р·Р°РіСЂСѓР¶РµРЅС‹

        if (window.unitsUaLayer) {
            window.unitsUaLayer.clearLayers();
        } else {
            window.unitsUaLayer = L.layerGroup();
        }
        window.unitsUaMarkers = [];

        const defaultIcon = L.icon({
            iconUrl: 'img/attack types/Р’Р·СЂС‹РІС‡РёРє.png',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        });

        for (const row of selectedRows) {
            let icon = defaultIcon;
            let unitTitle = '';
            const iconInfo = window.unitsUaIconsMap[row.profileId];
            if (iconInfo) {
                icon = L.icon({
                    iconUrl: `units/ua/${iconInfo.photo}`,
                    iconSize: [28, 32],
                    iconAnchor: [14, 16],
                    popupAnchor: [0, -16]
                });
                unitTitle = iconInfo.title;
            } else {
                unitTitle = `ID:${row.profileId}`;
            }

            const marker = L.marker([row.lat, row.lng], { icon: icon, _profileId: row.profileId });

            // РџРѕР»СѓС‡Р°РµРј РґРµС‚Р°Р»Рё РґР»СЏ РґР°РЅРЅРѕРіРѕ profileId, РµСЃР»Рё РЅРµС‚ вЂ” СЃРѕР·РґР°С‘Рј СЃ РїСѓСЃС‚С‹РјРё Р·РЅР°С‡РµРЅРёСЏРјРё
			const details = window.unitsUaDetailsMap[row.profileId] || { composition: '', armament: '', formation: '', armyCorps: '?', description: '' };

			// Р”Р»СЏ РµРґРёРЅРѕРѕР±СЂР°Р·РёСЏ РІСЃРµРіРґР° РїРѕРєР°Р·С‹РІР°РµРј Р±Р»РѕРєРё, РґР°Р¶Рµ РµСЃР»Рё РґР°РЅРЅС‹Рµ РѕС‚СЃСѓС‚СЃС‚РІСѓСЋС‚
            const descriptionText = details.description.trim() ? details.description : '?';
			const compositionText = details.composition.trim() ? details.composition : '?';
			const armamentText = details.armament.trim() ? details.armament : '?';
			const formationText = details.formation.trim() ? details.formation : '?';
			const armyCorpsText = details.armyCorps || '?';

			// Р¤РѕСЂРјРёСЂСѓРµРј HTML popup
			let popupHtml = `<div style="font-size:14px;"><strong>${escapeHtml(unitTitle)}</strong>`;

            // РћРїРёСЃР°РЅРёРµ (РІСЃРµРіРґР° СЃРІРѕСЂР°С‡РёРІР°РµРјС‹Р№ Р±Р»РѕРє)
            popupHtml += `
                <details class="collapse-block" style="margin-top:8px;">
                <summary>рџ“„ РћРїРёСЃР°РЅРёРµ</summary>
                <div class="collapse-content" style="margin-top: 4px; white-space: pre-wrap;">${escapeHtml(descriptionText).replace(/\n/g, '<br>')}</div>
                </details>`;

			// РЎРѕСЃС‚Р°РІ (РІСЃРµРіРґР° СЃРІРѕСЂР°С‡РёРІР°РµРјС‹Р№ Р±Р»РѕРє)
			popupHtml += `
				<details class="collapse-block" style="margin-top:8px;">
					<summary>рџ“„ РЎРѕСЃС‚Р°РІ</summary>
					<div class="collapse-content" style="margin-top: 4px; white-space: pre-wrap;">${escapeHtml(compositionText).replace(/\n/g, '<br>')}</div>
				</details>`;

			// Р’РѕРѕСЂСѓР¶РµРЅРёРµ (РІСЃРµРіРґР° СЃРІРѕСЂР°С‡РёРІР°РµРјС‹Р№ Р±Р»РѕРє)
			popupHtml += `
				<details class="collapse-block" style="margin-top:8px;">
					<summary>рџ“„ Р’РѕРѕСЂСѓР¶РµРЅРёРµ</summary>
					<div class="collapse-content" style="margin-top: 4px; white-space: pre-wrap;">${escapeHtml(armamentText).replace(/\n/g, '<br>')}</div>
				</details>`;

			// Р¤РѕСЂРјРёСЂРѕРІР°РЅРёРµ (РІСЃРµРіРґР° РІРёРґРёРјР°СЏ СЃС‚СЂРѕРєР°)
			popupHtml += `<div style="margin-top:4px;"><strong>Р¤РѕСЂРјРёСЂРѕРІР°РЅРёРµ:</strong> ${escapeHtml(formationText)}</div>`;

			// РђСЂРјРµР№СЃРєРёР№ РєРѕСЂРїСѓСЃ (РІСЃРµРіРґР° РІРёРґРёРјР°СЏ СЃС‚СЂРѕРєР°)
			popupHtml += `<div style="margin-top:4px;"><strong>РђСЂРјРµР№СЃРєРёР№ РєРѕСЂРїСѓСЃ:</strong> ${escapeHtml(armyCorpsText)}</div>`;
			
			//
			popupHtml += `<div style="margin-top:4px;"><strong>Р”Р°С‚Р°:</strong> ${escapeHtml(row.date)}</div>`;

			//
			popupHtml += `<div class="units-ua-details-btn-wrap"><button class="units-ua-details-btn" onclick="window.showUnitDetailsForProfileId('${row.profileId}'); map.closePopup();">Р“РµРѕРґР°РЅРЅС‹Рµ</button></div>`;
			popupHtml += `</div>`;

            marker.bindPopup(popupHtml, { className: 'units-ua-popup' });
            if (!isMobileDevice()) {
                marker.bindTooltip(unitTitle, { direction: 'top', offset: [0, -16], className: 'map-hover-tooltip' });
            }
            marker.addTo(window.unitsUaLayer);
            window.unitsUaMarkers.push(marker);
        }

        // console.log(`Р—Р°РіСЂСѓР¶РµРЅРѕ ${window.unitsUaMarkers.length} С‚РѕС‡РµРє РџР’Р” СЃ СЂР°СЃС€РёСЂРµРЅРЅРѕР№ РёРЅС„РѕСЂРјР°С†РёРµР№ РґР»СЏ РґР°С‚С‹ ${targetDateStr}`);
    } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё CSV РїРѕРґСЂР°Р·РґРµР»РµРЅРёР№ Р’РЎРЈ:', error);
    }
}

// РџРѕРєР°Р·С‹РІР°РµС‚ РґРµС‚Р°Р»Рё РґР»СЏ РІС‹Р±СЂР°РЅРЅРѕРіРѕ РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ
async function showUnitDetailsForProfileId(profileId) {
    if (window.unitsUaDetailMode && window.unitsUaDetailProfileId === profileId) {
        resetUnitDetails();
        return;
    }

    // РЎР±СЂР°СЃС‹РІР°РµРј РїСЂРµРґС‹РґСѓС‰РёР№ СЂРµР¶РёРј РґРµС‚Р°Р»РµР№, РµСЃР»Рё РѕРЅ Р±С‹Р»
    if (window.unitsUaDetailMode) {
        resetUnitDetails();
    }

    window.unitsUaDetailMode = true;
    window.unitsUaDetailProfileId = profileId;

    // РЎРѕС…СЂР°РЅСЏРµРј С‚РµРєСѓС‰РёРµ РјР°СЂРєРµСЂС‹ РџР’Р” РґР»СЏ РІРѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёСЏ
    window.unitsUaSavedMarkers = [...window.unitsUaMarkers];

    // РћС‡РёС‰Р°РµРј СЃР»РѕР№
    if (window.unitsUaLayer) {
        window.unitsUaLayer.clearLayers();
    }
    window.unitsUaMarkers = [];
    window.unitsUaDetailMarkers = [];
    window.unitsUaDetailPvdMarkers = [];

    // РћРїСЂРµРґРµР»СЏРµРј РёРєРѕРЅРєСѓ РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ
    const unitIconInfo = window.unitsUaIconsMap[profileId];
    const unitTitle = unitIconInfo ? unitIconInfo.title : `ID:${profileId}`;
    const unitIcon = unitIconInfo
        ? L.icon({
            iconUrl: `units/ua/${unitIconInfo.photo}`,
            iconSize: [28, 32],
            iconAnchor: [14, 16],
            popupAnchor: [0, -16]
        })
        : L.icon({
            iconUrl: 'img/attack types/Р’Р·СЂС‹РІС‡РёРє.png',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            popupAnchor: [0, 0]
        });

    // Р”РѕР±Р°РІР»СЏРµРј РѕР±СЂР°С‚РЅРѕ Р°РєС‚СѓР°Р»СЊРЅС‹Р№ РјР°СЂРєРµСЂ (СЃ РѕСЂРёРіРёРЅР°Р»СЊРЅС‹Рј РїРѕРїР°РїРѕРј Рё РєРЅРѕРїРєРѕР№)
    const currentMarker = window.unitsUaSavedMarkers.find(function(m) {
        return m && m.options && m.options._profileId === profileId;
    });
    if (currentMarker) {
        currentMarker.addTo(window.unitsUaLayer);
        window.unitsUaMarkers.push(currentMarker);
    }

    // Р—Р°РіСЂСѓР¶Р°РµРј РІСЃРµ РіРµРѕР»РѕРєР°С†РёРё (РџР’Р” Рё Р‘Р”) РґР»СЏ СЌС‚РѕРіРѕ profileId
    try {
        const response = await fetch(window.unitsUaCsvPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        const lines = csvText.split(/\r?\n/).filter(function(line) { return line.trim().length > 0; });
        if (lines.length === 0) return;

        const dataLines = lines.slice(1);
        for (const line of dataLines) {
            const data = parseUnitsCsvRow(line);
            if (!data) continue;
            if (isNaN(data.lat) || isNaN(data.lng)) continue;
            if (data.profileId !== profileId) continue;

            // РџСЂРѕРїСѓСЃРєР°РµРј Р·Р°РїРёСЃСЊ, РєРѕС‚РѕСЂР°СЏ СѓР¶Рµ РѕС‚РѕР±СЂР°Р¶РµРЅР° Р°РєС‚СѓР°Р»СЊРЅС‹Рј РјР°СЂРєРµСЂРѕРј
            if (currentMarker) {
                const curLatLng = currentMarker.getLatLng();
                if (Math.abs(data.lat - curLatLng.lat) < 0.0001 && Math.abs(data.lng - curLatLng.lng) < 0.0001) {
                    continue;
                }
            }

            if (data.characteristic === 'РџР’Р”') {
                const oldPvdIcon = L.icon({
                    iconUrl: unitIconInfo ? `units/ua/${unitIconInfo.photo}` : 'img/attack types/Р’Р·СЂС‹РІС‡РёРє.png',
                    iconSize: [24, 28],
                    iconAnchor: [10, 12],
                    popupAnchor: [0, -12]
                });
                const pvdMarker = L.marker([data.lat, data.lng], { icon: oldPvdIcon, _profileId: profileId });
                pvdMarker.bindPopup(
                    `<div style="font-size:13px;">
                        <strong>${escapeHtml(unitTitle)}</strong>
                        <div style="margin-top:4px;"><strong>Р”Р°С‚Р°:</strong> ${escapeHtml(data.date)}</div>
                    </div>`,
                    { className: 'units-ua-popup' }
                );
                if (!isMobileDevice()) {
                    pvdMarker.bindTooltip(unitTitle, { direction: 'top', offset: [0, -12], className: 'map-hover-tooltip' });
                }
                pvdMarker.addTo(window.unitsUaLayer);
                window.unitsUaDetailPvdMarkers.push(pvdMarker);
            } else if (data.characteristic === 'Р‘Р”') {
                const bdIcon = L.icon({
                    iconUrl: 'img/attack types/Р’Р·СЂС‹РІС‡РёРє.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 24],
                    popupAnchor: [0, -24]
                });
                const bdMarker = L.marker([data.lat, data.lng], { icon: bdIcon });
                let bdPopup = `<div style="font-size:13px;"><strong>Р‘РѕРµРІС‹Рµ РґРµР№СЃС‚РІРёСЏ</strong>`;
                bdPopup += `<div style="margin-top:4px;"><strong>Р”Р°С‚Р°:</strong> ${escapeHtml(data.date)}</div>`;
                if (data.details) {
                    bdPopup += `<div style="margin-top:4px;"><strong>РџСЂРёРјРµС‡Р°РЅРёРµ:</strong> ${escapeHtml(data.details)}</div>`;
                }
                if (data.link) {
                    bdPopup += `<div style="margin-top:4px;"><a href="${escapeHtml(data.link)}" target="_blank" rel="noopener" title="${escapeHtml(data.link)}">РСЃС‚РѕС‡РЅРёРє</a></div>`;
                }
                bdPopup += `</div>`;
                bdMarker.bindPopup(bdPopup, { className: 'units-ua-popup' });
                if (!isMobileDevice()) {
                    bdMarker.bindTooltip(escapeHtml(data.date), { direction: 'top', offset: [0, -16], className: 'map-hover-tooltip' });
                }
                bdMarker.addTo(window.unitsUaLayer);
                window.unitsUaDetailMarkers.push(bdMarker);
            }
        }
    } catch (error) {
        console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё CSV РґР»СЏ РґРµС‚Р°Р»РµР№:', error);
    }
}

// Р’РѕСЃСЃС‚Р°РЅР°РІР»РёРІР°РµС‚ РІСЃРµ РјР°СЂРєРµСЂС‹ РџР’Р” Рё СѓР±РёСЂР°РµС‚ Р‘Р” РјР°СЂРєРµСЂС‹
function resetUnitDetails() {
    if (!window.unitsUaDetailMode) return;

    window.unitsUaDetailMode = false;
    window.unitsUaDetailProfileId = null;

    if (window.unitsUaLayer) {
        window.unitsUaLayer.clearLayers();
    }

    window.unitsUaMarkers = [];
    window.unitsUaDetailMarkers = [];
    window.unitsUaDetailPvdMarkers = [];

    window.unitsUaSavedMarkers.forEach(function(m) {
        if (m) {
            m.addTo(window.unitsUaLayer);
            window.unitsUaMarkers.push(m);
        }
    });
    window.unitsUaSavedMarkers = [];
}

// РџСЂРѕСЃС‚Р°СЏ С„СѓРЅРєС†РёСЏ СЌРєСЂР°РЅРёСЂРѕРІР°РЅРёСЏ HTML (С‡С‚РѕР±С‹ РёР·Р±РµР¶Р°С‚СЊ XSS)
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// РџРµСЂРµР·Р°РіСЂСѓР·РєР° СЃР»РѕСЏ СЃ СѓС‡С‘С‚РѕРј С‚РµРєСѓС‰РµР№ selectedDate
function reloadUnitsUaLayer() {
    if (window.isUnitsUaVisible) {
        resetUnitDetails();
        const currentDate = window.selectedDate || getCurrentDateFormatted();
        let filterSet = null;
        if (window.unitsSearchDigits) {
            filterSet = window.getProfileIdsBySearchDigits(window.unitsSearchDigits);
        } else if (window.unitsSearchText) {
            filterSet = window.getProfileIdsBySearchText(window.unitsSearchText);
        }
        if (filterSet && filterSet.size === 0) filterSet = new Set();
        loadUnitsUaWithDateFilter(currentDate, filterSet).then(() => {
            // РЈР±РµРґРёРјСЃСЏ, С‡С‚Рѕ СЃР»РѕР№ СЃСѓС‰РµСЃС‚РІСѓРµС‚ (Р·Р°С‰РёС‚Р° РѕС‚ null)
            if (!window.unitsUaLayer) {
                window.unitsUaLayer = L.layerGroup();
            }
            if (!map.hasLayer(window.unitsUaLayer)) {
                window.unitsUaLayer.addTo(map);
            }
        });
    }
}

// Р¤СѓРЅРєС†РёСЏ РїРѕРёСЃРєР°
function applyUnitsSearch() {
    const input = document.getElementById('units-search-input');
    const raw = input.value.trim();
    if (raw && /^\d{1,3}$/.test(raw)) {
        window.unitsSearchDigits = raw;
        window.unitsSearchText = null;
    } else if (raw && raw.length > 0) {
        window.unitsSearchText = raw;
        window.unitsSearchDigits = null;
    } else {
        window.unitsSearchDigits = null;
        window.unitsSearchText = null;
        input.value = '';
    }
    reloadUnitsUaLayer();
}

// РџРµСЂРµРєР»СЋС‡РµРЅРёРµ РІРёРґРёРјРѕСЃС‚Рё СЃР»РѕСЏ
async function toggleUnitsUa() {
    const panel = document.getElementById('units-search-panel');
    const btn = document.getElementById('units-ua-btn');
    
    if (!window.isUnitsUaVisible) {
        // ===== Р’РєР»СЋС‡РµРЅРёРµ СЃР»РѕСЏ =====
        const currentDate = window.selectedDate || getCurrentDateFormatted();
        if (!window.unitsUaLayer) {
            window.unitsUaLayer = L.layerGroup();
        }
        let filterSet = null;
        if (window.unitsSearchDigits) {
            filterSet = window.getProfileIdsBySearchDigits(window.unitsSearchDigits);
        } else if (window.unitsSearchText) {
            filterSet = window.getProfileIdsBySearchText(window.unitsSearchText);
        }
        if (filterSet && filterSet.size === 0) filterSet = new Set();
        try {
            await loadUnitsUaWithDateFilter(currentDate, filterSet);
        } catch (err) {
            console.error('РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё UnitsUA СЃР»РѕСЏ:', err);
        }
        window.unitsUaLayer.addTo(map);
        
        // РџРѕР·РёС†РёРѕРЅРёСЂРѕРІР°РЅРёРµ РїР°РЅРµР»Рё
        if (panel && btn) {
            if (isMobileViewport()) {
                // РјРѕР±РёР»СЊРЅС‹Рµ: С„РёРєСЃРёСЂРѕРІР°РЅРЅС‹Р№ Р»РµРІС‹Р№ РІРµСЂС…РЅРёР№ СѓРіРѕР»
                panel.style.position = 'fixed';
                panel.style.top = '0px';
                panel.style.left = '0px';
            } else {
                // РґРµСЃРєС‚РѕРї: РїРѕРґ РєРЅРѕРїРєРѕР№
                const rect = btn.getBoundingClientRect();
                panel.style.position = 'absolute';
                panel.style.top = (rect.bottom + window.scrollY) + 'px';
                panel.style.left = (rect.left + window.scrollX) + 'px';
            }
            panel.style.display = 'flex';
        }
        
        window.isUnitsUaVisible = true;
        btn.classList.add('active');
    } else {
        // ===== Р’С‹РєР»СЋС‡РµРЅРёРµ СЃР»РѕСЏ =====
        resetUnitDetails();
        if (window.unitsUaLayer && map.hasLayer(window.unitsUaLayer)) {
            map.removeLayer(window.unitsUaLayer);
        }
        if (panel) {
            panel.style.display = 'none';
            const input = document.getElementById('units-search-input');
            if (input) input.value = '';
            window.unitsSearchDigits = null;
            window.unitsSearchText = null;
        }
        window.isUnitsUaVisible = false;
        btn.classList.remove('active');
    }

    // РћР±РЅРѕРІР»СЏРµРј title РєРЅРѕРїРєРё
    // if (btn) {
        // const t = translations[currentLang];
        // btn.title = window.isUnitsUaVisible ?
            // (t.hideUnitsUa || 'РЎРєСЂС‹С‚СЊ РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ Р’РЎРЈ') :
            // (t.showUnitsUa || 'РџРѕРєР°Р·Р°С‚СЊ РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ Р’РЎРЈ');
    // }
}

// РћР±РЅРѕРІР»РµРЅРёРµ РІСЃРїР»С‹РІР°СЋС‰РµР№ РїРѕРґСЃРєР°Р·РєРё РєРЅРѕРїРєРё РїРѕРґСЂР°Р·РґРµР»РµРЅРёР№ Р’РЎРЈ
function updateUnitsUaButtonTitle() {
    const btn = document.getElementById('units-ua-btn');
    if (!btn) return;
    const t = translations[currentLang];
    btn.title = t.showUnitsUa || 'РџРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ Р’РЎРЈ';
}

// РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ РєРЅРѕРїРєРё РїРѕРґСЂР°Р·РґРµР»РµРЅРёР№
function initUnitsUaButton() {
    const btn = document.getElementById('units-ua-btn');
    if (!btn) return;

    // РЎРѕР·РґР°С‘Рј РїР°РЅРµР»СЊ РїРѕРёСЃРєР°
    const t = translations[currentLang];
    const searchPanel = document.createElement('div');
    searchPanel.id = 'units-search-panel';
    searchPanel.style.display = 'none';
    searchPanel.innerHTML = `
        <span class="units-search-input-wrap">
            <input type="text" id="units-search-input" placeholder="${t.unitsSearchPlaceholder}" enterkeyhint="search">
            <button id="units-search-clear" class="units-search-clear-inside" title="${t.clearSearch}">вњ•</button>
        </span>
        <button id="units-search-btn" title="${t.searchBtn}">рџ”Ќ</button>
    `;
    // btn.parentNode.insertBefore(searchPanel, btn.nextSibling);
    document.body.appendChild(searchPanel);

    const searchInput = document.getElementById('units-search-input');
    const searchClearBtn = document.getElementById('units-search-clear');

    // РЈРїСЂР°РІР»РµРЅРёРµ РІРёРґРёРјРѕСЃС‚СЊСЋ РєСЂРµСЃС‚РёРєР°
    searchInput.addEventListener('input', function() {
        searchClearBtn.style.display = this.value.trim() ? 'block' : 'none';
    });

    // РћР±СЂР°Р±РѕС‚С‡РёРєРё РїР°РЅРµР»Рё
    document.getElementById('units-search-btn').addEventListener('click', applyUnitsSearch);
    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        window.unitsSearchDigits = null;
        window.unitsSearchText = null;
        reloadUnitsUaLayer();
    });
    // keydown (Р° РЅРµ СѓСЃС‚Р°СЂРµРІС€РёР№ keypress): РЅР°РґС‘Р¶РЅРѕ СЃСЂР°Р±Р°С‚С‹РІР°РµС‚ Рё СЃ РІРёСЂС‚СѓР°Р»СЊРЅРѕР№ РєР»Р°РІРёР°С‚СѓСЂРѕР№ (Gboard)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyUnitsSearch();
    });

    // РћР±СЂР°Р±РѕС‚С‡РёРє СЃР°РјРѕР№ РєРЅРѕРїРєРё
    btn.addEventListener('click', toggleUnitsUa);

    window.isUnitsUaVisible = false;
    btn.classList.remove('active');
    btn.title = t.showUnitsUa || 'РџРѕРєР°Р·Р°С‚СЊ РїРѕРґСЂР°Р·РґРµР»РµРЅРёСЏ Р’РЎРЈ';
}

// Р­РєСЃРїРѕСЂС‚РёСЂСѓРµРј РЅРѕРІС‹Рµ С„СѓРЅРєС†РёРё

// ========== РРќРР¦РРђР›РР—РђР¦РРЇ Р’РЎР•РҐ Р¤РР›Р¬РўР РћР’ ==========
function initFilters() {
    initEquipmentFilter();
    initAttacksFilter();
    initFortificationFilter();
    // РћР±РЅРѕРІРёРј Р·Р°РіРѕР»РѕРІРєРё РєРЅРѕРїРѕРє
    // updateMilEquipButtonTitle();
    // updateAttacksOnUaButtonTitle();
    // updateFortificationButtonTitle();
}

// Р­РєСЃРїРѕСЂС‚РёСЂСѓРµРј С„СѓРЅРєС†РёРё, РєРѕС‚РѕСЂС‹Рµ Р±СѓРґСѓС‚ РЅСѓР¶РЅС‹ РІ script.js
window.initFilters = initFilters;
window.initFortificationFilter = initFortificationFilter;
window.initFortificationLayerWithFilter = initFortificationLayerWithFilter;

window.toggleEquipmentMenu = toggleEquipmentMenu;
window.toggleAttacksMenu = toggleAttacksMenu;
window.toggleFortificationMenu = toggleFortificationMenu;

window.updateMilEquipButtonTitle = updateMilEquipButtonTitle;
window.updateAttacksOnUaButtonTitle = updateAttacksOnUaButtonTitle;
window.updateFortificationButtonTitle = updateFortificationButtonTitle;
window.updateUnitsUaButtonTitle = updateUnitsUaButtonTitle;

window.applyEquipmentFilter = applyEquipmentFilter;
window.applyAttacksFilter = applyAttacksFilter;
window.applyFortificationFilter = applyFortificationFilter;

window.hideAllEquipmentMarkers = hideAllEquipmentMarkers;
window.hideAllAttacksMarkers = hideAllAttacksMarkers;
window.hideAllFortificationLayers = hideAllFortificationLayers;

window.reloadUnitsUaLayer = reloadUnitsUaLayer;
window.showUnitDetailsForProfileId = showUnitDetailsForProfileId;


//
document.addEventListener('DOMContentLoaded', function() {
    // РџРµСЂРµРјРµС‰Р°РµРј РјРµРЅСЋ С‚РµС…РЅРёРєРё РІ body
    const equipMenu = document.getElementById('equipment-filter-menu');
    if (equipMenu && equipMenu.parentNode !== document.body) {
        document.body.appendChild(equipMenu);
    }
    
    // РџРµСЂРµРјРµС‰Р°РµРј РјРµРЅСЋ Р°С‚Р°Рє РІ body
    const attacksMenu = document.getElementById('attacks-filter-menu');
    if (attacksMenu && attacksMenu.parentNode !== document.body) {
        document.body.appendChild(attacksMenu);
    }
    
    // РџРµСЂРµРјРµС‰Р°РµРј РјРµРЅСЋ С„РѕСЂС‚РёС„РёРєР°С†РёР№ РІ body
    const fortificationMenu = document.getElementById('fortification-filter-menu');
    if (fortificationMenu && fortificationMenu.parentNode !== document.body) {
        document.body.appendChild(fortificationMenu);
    }
    
    // Р—Р°РєСЂС‹С‚РёРµ РјРµРЅСЋ С„РёР»СЊС‚СЂРѕРІ РїСЂРё РєР»РёРєРµ РІРЅРµ РёС… РѕР±Р»Р°СЃС‚Рё
    document.addEventListener('click', function(e) {
        var filters = [
            { menu: document.getElementById('equipment-filter-menu'), btn: document.getElementById('mil-equip-btn') },
            { menu: document.getElementById('attacks-filter-menu'), btn: document.getElementById('attacks-on-ua-btn') },
            { menu: document.getElementById('fortification-filter-menu'), btn: document.getElementById('fortification-btn') }
        ];
        filters.forEach(function(item) {
            if (!item.menu || item.menu.style.display !== 'block') return;
            var inMenu = item.menu.contains(e.target);
            var inBtn = item.btn && item.btn.contains(e.target);
            if (!inMenu && !inBtn) {
                item.menu.style.display = 'none';
            }
        });
    });
});
