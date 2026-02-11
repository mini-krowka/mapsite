// Конфигурация GitHub репозитория
const GITHUB_USERNAME = 'mini-krowka'; // Замените на ваш GitHub username
const GITHUB_REPO = 'mapsite'; // Замените на имя репозитория
const GITHUB_BRANCH = 'main'; // Или другая ветка

// Основные KML-файлы (будут заполнены автоматически)
window.kmlFiles = [];

// Функция для получения списка файлов через GitHub API
async function getFilesFromGitHub(path) {
    try {
        // GitHub API: получение содержимого директории
        const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Ошибка при получении файлов из ${path}: ${response.status}`);
        }
        
        const data = await response.json();
        return data.filter(item => item.type === 'file' && item.name.endsWith('.kml'))
                   .map(item => item.path);
    } catch (error) {
        console.error('Ошибка при работе с GitHub API:', error);
        return [];
    }
}

// Функция для извлечения даты из имени файла
function extractDateFromFileName(filePath) {
    // Регулярное выражение для поиска даты в формате _YY_MM_DD
    const dateRegex = /_(\d{2})_(\d{2})_(\d{2})\.kml$/i;
    const match = filePath.match(dateRegex);
    
    if (!match) return null;
    
    const [, year, month, day] = match;
    return {
        key: `${year}${month}${day}`, // Для сортировки
        formatted: `${day}.${month}.${year}` // Для отображения
    };
}

// Основная функция для построения kmlFiles
async function buildKmlFilesFromGitHub() {
    console.log('Начинаем загрузку списка KML файлов из GitHub...');
    
    // Папки для сканирования
    const directories = [
        'kml/ControlZones',
        'kml/FrontLine', 
        'kml/Progress/RuAF',
        'kml/Progress/AFU',
        'kml/Progress'
    ];
    
    // Получаем все файлы из всех директорий
    const allFilePromises = directories.map(dir => getFilesFromGitHub(dir));
    const allFileArrays = await Promise.all(allFilePromises);
    
    // Объединяем все файлы в один массив
    const allFiles = allFileArrays.flat();
    
    if (allFiles.length === 0) {
        console.warn('Не найдено ни одного KML файла!');
        return [];
    }
    
    console.log(`Найдено ${allFiles.length} KML файлов`);
    
    // Группируем файлы по дате
    const filesByDate = {};
    
    allFiles.forEach(filePath => {
        const dateInfo = extractDateFromFileName(filePath);
        
        if (!dateInfo) {
            console.warn(`Файл ${filePath} не содержит дату в формате _YY_MM_DD`);
            return;
        }
        
        const { key, formatted } = dateInfo;
        
        // Если даты еще нет в объекте, создаем запись
        if (!filesByDate[key]) {
            filesByDate[key] = {
                name: formatted,
                paths: []
            };
        }
        
        // Добавляем путь к файлу (уникально)
        if (!filesByDate[key].paths.includes(filePath)) {
            filesByDate[key].paths.push(filePath);
        }
    });
    
    // Преобразуем объект в массив и сортируем по дате
    const result = Object.keys(filesByDate)
        .sort() // Сортировка по ключу (хронологический порядок)
        .map(key => filesByDate[key]);
    
    console.log(`Сформировано ${result.length} записей по датам`);
    return result;
}

// Инициализация - вызывается при загрузке страницы
async function initializeKmlFiles() {
    try {
        // Пробуем загрузить автоматически
        window.kmlFiles = await buildKmlFilesFromGitHub();
        
        // Если не удалось загрузить (например, проблемы с API), используем fallback
        if (window.kmlFiles.length === 0) {
            console.warn('Используем fallback данные...');
            window.kmlFiles = getFallbackKmlFiles();
        }
        
        console.log('KML файлы успешно загружены:', window.kmlFiles.length);
    } catch (error) {
        console.error('Ошибка при инициализации KML файлов:', error);
        window.kmlFiles = getFallbackKmlFiles();
    }
}

// Fallback данные на случай проблем с GitHub API
function getFallbackKmlFiles() {
    return [
        { name: "29.01.26", paths: [
            "kml/ControlZones/Control_26_01_29.kml",
            "kml/Progress/Progress_26_01_29.kml"
        ]},
        { name: "02.02.26", paths: [
            "kml/ControlZones/Control_26_02_02.kml",
            "kml/Progress/Progress_26_02_02.kml"
        ]}
    ];
}

// Постоянные слои
window.permanentLayers = [
	// Области
	// { name: "Днепропетровская область",  path: "kml/PermanentObjects/Днепропетровская область.kml" },
	// { name: "Харьковская область",       path: "kml/PermanentObjects/Харьковская область.kml" },
	// { name: "Сумская область",           path: "kml/PermanentObjects/Сумская область.kml" },
	// { name: "ЛНР",                       path: "kml/PermanentObjects/ЛНР.kml" },
	// { name: "ДНР",                       path: "kml/PermanentObjects/ДНР.kml" },
	// { name: "Запорожская область",       path: "kml/PermanentObjects/Запорожская область.kml" },
	// { name: "Херсонская область",        path: "kml/PermanentObjects/Херсонская область.kml" },
	{ name: "Области",        path: "kml/PermanentObjects/Области.kml" },
    // Текущая ЛБС
     { name: "Current_frontline",      path: "kml/FrontLine/ЛБС.kml" },
	
    // Граница ЛДНР без Ростовской области
    // { name: "LDPR",                   path: "kml/PermanentObjects/LDPR_line3.kml" },
	{ name: "LDPR",                   path: "kml/PermanentObjects/LDPR_Border.kml" },
    //Конституционная граница РФ
    { name: "RuUaBorder",             path: "kml/PermanentObjects/RuUaBorder.kml" },
        //Единая линия на 10.10.23
    { name: "Offensive_23_10_10",     path: "kml/PermanentObjects/OffensiveLine_2023_10_10.kml" },
	// { name: "Offensive_23_10_10",     path: "kml/PermanentObjects/FrontLine_2023_10_10.kml" },
    //Линия максимального продвижения ВСУ в Курской области.
    { name: "AFU_advance_Kursk2024",  path: "kml/PermanentObjects/AFU_advance_Kursk2024.kml" },
    // Контур максимального продвижения в Доброполье
     { name: "Добропольский прорыв",  path: "kml/PermanentObjects/Доброполье.kml" },
	// Мультиполигон
    { name: "Мультиполигон",         path: "kml/PermanentObjects/CitiesBorders.kml" }
	// { name: "стиль1", path: "kml/Progress/RuAF/ProgressRuAF_25_10_29.kml" },
	// { name: "стиль2", path: "kml/Progress/AFU/ProgressAFU_25_10_29.kml" }
	// { name: "стили", path: "kml/Progress/Progress_26_01_29.kml" }
	
];

// Список городов с координатами
window.cities = [
    { name: { ru: "Суджа", en: "Sudzha" }, lat: 51.19055, lng: 35.27082 },
    { name: { ru: "Волчанск", en: "Volchansk" }, lat: 50.288107, lng: 36.946217 },
    { name: { ru: "Купянск", en: "Kupyansk" }, lat: 49.706396, lng: 37.616586 },
    { name: { ru: "Боровая", en: "Borovaya" }, lat: 49.38417, lng: 37.62086 },
    { name: { ru: "Северск", en: "Seversk" }, lat: 48.868709, lng: 38.106425 },
    { name: { ru: "Часов Яр", en: "Chasov Yar" }, lat: 48.591656, lng: 37.820354 },
    { name: { ru: "Дзержинск", en: "Dzerzhinsk" }, lat: 48.398329, lng: 37.836634 },
    { name: { ru: "Красноармейск", en: "Krasnoarmeisk" }, lat: 48.28566, lng: 37.17605 },
    { name: { ru: "Великая Новосёлка", en: "Velikaya Novoselka" }, lat: 47.83857, lng: 36.83697 },
    { name: { ru: "Гуляйполе", en: "Gulyaypole" }, lat: 47.66336, lng: 36.2587 },
    { name: { ru: "Орехов", en: "Orekhov" }, lat: 47.5675, lng: 35.78845 },
];

// Управление точками
window.pointsKmlPaths = [
    "kml/Geolocations/2026 год январь.kml",
    "kml/Geolocations/2023-2025.kml"
];
window.pointLayers = [];
window.pointsDateRange = {
    start: null,
    end: null
};

window.milequipKmlPaths = ["kml/Geolocations/Military_equipment.kml"];
window.milequipLayers = [];

window.attacksOnUaKmlPaths = [
    "kml/Geolocations/osint_alarm_2025.kml",
    "kml/Geolocations/osint_alarm_2026.kml"
];
window.attacksOnUaLayers = [];

// Функция для ручного обновления списка файлов (можно вызвать из консоли)
window.refreshKmlFiles = async function() {
    console.log('Обновление списка KML файлов...');
    const newFiles = await buildKmlFilesFromGitHub();
    if (newFiles.length > 0) {
        window.kmlFiles = newFiles;
        console.log('Список KML файлов обновлен:', window.kmlFiles.length);
        return true;
    }
    return false;
};

// Запускаем инициализацию при загрузке
document.addEventListener('DOMContentLoaded', async () => {
    // Даем время на загрузку других скриптов
    setTimeout(async () => {
        await initializeKmlFiles();
        
        // Отправляем событие, что kmlFiles загружены
        const event = new CustomEvent('kmlFilesLoaded', { 
            detail: { count: window.kmlFiles.length } 
        });
        document.dispatchEvent(event);
    }, 100);
});