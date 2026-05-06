import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useCreateIncident = (isAddingMode, setIsAddingMode, tempMarker, setTempMarker) => {
  const navigate = useNavigate();

  // ============================================================================
  // ДЛЯ СОЗДАНИЯ ИНЦИДЕНТА
  // ============================================================================
  const handleCreateIncident = () => {
    // разрешили добавление
    setIsAddingMode(true);
    toast.info('Кликните по карте, чтобы установить маркер', {
      // закрытие по таймеру выключено
      autoClose: false,
      // по клику закрыть нельзя
      closeOnClick: false,
      // и перетаскиванием тоже
      draggable: false,
      // крестик убрал тоже
      closeButton: false,
      theme: 'dark',
    });
  };

  // ============================================================================
  // ДЛЯ ОБРАБОТКИ СОЗДАНИЯ ИНЦИДЕНТА ПОСЛЕ ВЫБОРА КООРДИНАТ
  // ============================================================================
  const handleConfirmCreateIncident = () => {
    toast.dismiss();
    // защита от ошибок при вызове координат
    if (!tempMarker) return;
    navigate('/create-incident', {
      // для переброса координат на страницу формы буду использовать state
      // самое приятное, что он передает данные в скрытом режиме,
      // не отображая их в адресной строке.
      state: { lat: tempMarker[0], lng: tempMarker[1] },
    });
    // сбрасываем маркер
    setTempMarker(null);
    // выключаем добавление
    setIsAddingMode(false);
  };

  // ============================================================================
  // ДЛЯ ОТМЕНЫ ДОБАВЛЕНИЯ ИНЦИДЕНТА
  // ============================================================================
  const handleCancelCreateIncident = () => {
    toast.dismiss();
    // убираем временный маркер
    setTempMarker(null);
    setIsAddingMode(false);
    toast.info('Создание инцидента отменено');
  };

  return {
    isAddingMode,
    setIsAddingMode,
    tempMarker,
    setTempMarker,
    handleCreateIncident,
    handleConfirmCreateIncident,
    handleCancelCreateIncident,
  };
};
