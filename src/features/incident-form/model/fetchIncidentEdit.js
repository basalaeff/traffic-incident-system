import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadIncidentById } from '@/features/incident-form/api/incidentFormAPI';
export const useIncidentEdit = (
  id,
  setIsLoading,
  setIsEditMode,
  setIncident,
  setOriginalIncident,
  setTitle,
  setDescription,
  setStatus,
  setType,
  user
) => {
  const navigate = useNavigate();
  const fetchIncidentEdit = async () => {
    setIsLoading(true);
    try {
      // ============================================================================
      // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
      // ============================================================================
      const responseIncident = await loadIncidentById(id);
      setIncident(responseIncident.data);
      setOriginalIncident(responseIncident.data);

      // Нужно, чтобы при редактировании в полях был текст
      setTitle(responseIncident.data?.title || '');
      setDescription(responseIncident.data?.description || '');
      setStatus(responseIncident.data?.status || '');
      setType(responseIncident.data?.type || '');

      // переключаем флаг на редактирование
      setIsEditMode(true);

      if (responseIncident.data?.userId != user?.id) {
        toast.warn('У вас недостаточно прав для выполнения этого действия!');
        navigate('/');
      }
      setIsLoading(false);
    } catch (err) {
      console.error(`Ошибка загрузки инцидента:`, err.response?.data?.message);
      toast.error(`Ошибка загрузки инцидента: ${err.response?.data?.message}`);
      if (err.response?.status === 404) navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  return { fetchIncidentEdit };
};
