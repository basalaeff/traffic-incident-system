import { toast } from 'react-toastify';
// ============================================================================
// ФУНКЦИЯ СБРОСА ПОЛЕЙ
// ============================================================================
export const useHandleReset = (
  isEditMode,
  originalIncident,
  setType,
  setStatus,
  setTitle,
  setDescription,
  setIsLoading
) => {
  const handleReset = () => {
    // добавил сброс к оригинальным значениям
    if (isEditMode && originalIncident) {
      setType(originalIncident.type || '');
      setStatus(originalIncident.status || '');
      setTitle(originalIncident.title || '');
      setDescription(originalIncident.description || '');
      toast.info('Изменения отменены');
    } else {
      setType('');
      setDescription('');
      setTitle('');
    }
    setIsLoading(false);
  };
  return { handleReset };
};
