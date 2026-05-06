import { loadIncidentById, loadUserById } from '@/features/incident-detail/api/incidentDetailAPI';
import { useNavigate } from 'react-router-dom';

export const useData = (id, setIncident, setOwner, setIsLoading) => {
  const navigate = useNavigate();
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // ============================================================================
      // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/incidents
      // ============================================================================
      const responseIncidents = await loadIncidentById(id);
      setIncident(responseIncidents.data);

      // проверка перед запросом
      if (responseIncidents.data?.userId) {
        // ============================================================================
        // GET-ЗАПРОС НА СЕРВЕР http://localhost:3001/user
        // ============================================================================
        const responseOwner = await loadUserById(responseIncidents.data.userId);
        setOwner(responseOwner.data);
      } else {
        toast.error(`Ошибка загрузки пользователя: ${error.message}`);
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
  return { fetchData };
};
