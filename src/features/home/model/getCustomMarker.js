// ============================================================================
// НАСТРОЙКА МАРКЕРОВ
// ============================================================================
// Есть несколько типов инцидентов (пока ДТП и опасные участки, но может придумаю еще)
// У каждого типа инцидента будет свой маркер
// Напишу функцию, которая будет возвращать маркеры по типу инцидента
// Взял с GitHub: https://github.com/pointhi/leaflet-color-markers

// Нужна библиотека для работы с иконками
import L from 'leaflet';

export const getCustomMarker = (type, status) => {
  // Пропишу иконки
  // Красный маркер (для ДТП)
  const redIconUrl = '/markers/marker-icon-2x-red.png';
  // Оранжевый маркер (для опасных участков)
  const orangeIconUrl = '/markers/marker-icon-2x-orange.png';
  // Зеленый маркер (для другое)
  const greenIconUrl = '/markers/marker-icon-2x-green.png';
  // возьмем серый для "Устранено"
  const grayIconUrl = '/markers/marker-icon-2x-grey.png';
  // Синий по умолчанию
  const blueIconUrl = '/markers/marker-icon-2x-blue.png';

  let chosenUrl = blueIconUrl; // По умолчанию ставим синюю

  // Реализую логику выбора цвета
  if (status === 'inactive') {
    // Если инцидент устранен - ставим серую
    chosenUrl = grayIconUrl;
  } else if (type === 'accident') {
    // Если тип accident - ставим красную
    chosenUrl = redIconUrl;
  } else if (type === 'hazard') {
    // Если тип hazard - ставим оранжевую
    chosenUrl = orangeIconUrl;
  } else if (type === 'other') {
    chosenUrl = greenIconUrl;
  }
  // А теперь просто возвращаем созданный объект
  // Размеры взял с того же гит хаб
  // Создал общую конструкцию для вывода иконок
  return L.icon({
    iconUrl: chosenUrl, // Ссылка на выбранный маркер
    iconSize: [25, 41], // Размер иконки [ширина, высота] в пикселях.
    iconAnchor: [12, 41], // Точка привязки
    // 20 - это центр по горизонтали, 40 - это высота.
    popupAnchor: [1, -34], // Отсюда открывается попап.
  });
};
