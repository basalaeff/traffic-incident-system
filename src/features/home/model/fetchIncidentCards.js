import { useCallback } from 'react';
import { loadIncidentCards } from '@/features/home/api/homeAPI';
import { toast } from 'react-toastify';

// ============================================================================
// ЗАГРУЗКА КАРТОЧЕК ИНЦИДЕНТОВ
// ============================================================================
export const useIncidentCards = (
  limit,
  pageRef,
  hasMoreRef,
  loadingRef,
  setIncidentCards,
  setPage,
  setHasMore,
  setLoadingMore
) => {
  const fetchIncidentCards = useCallback(
    async (isInitial = false, append = false) => {
      // последующая загрузка
      if (!isInitial) {
        // данных нет или идет загрузка
        if (!hasMoreRef.current || loadingRef.current) return;
        loadingRef.current = true;
        setLoadingMore(true);
        pageRef.current += 1;
      }

      try {
        const requestPage = isInitial ? 1 : pageRef.current;
        const responseIncidents = await loadIncidentCards(requestPage, limit);
        const newIncidents = responseIncidents.data;

        // Если пришло меньше лимита, то данных больше нет
        if (newIncidents.length < limit) {
          setHasMore(false);
          hasMoreRef.current = false;
        }

        // Обновляем список карточек
        if (isInitial || !append) {
          setIncidentCards(newIncidents);
          if (isInitial) {
            setPage(1);
            pageRef.current = 1;
          }
        } else {
          setIncidentCards((prev) => {
            const uniqueNew = newIncidents.filter(
              (newItem) => !prev.some((oldItem) => oldItem.id === newItem.id)
            );
            return [...prev, ...uniqueNew];
          });
        }

        setPage(pageRef.current);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        toast.error(err.message || 'Ошибка загрузки инцидентов');
        // При ошибке откатываем страницу назад
        if (!isInitial) pageRef.current -= 1;
      } finally {
        if (!isInitial) {
          loadingRef.current = false;
          setLoadingMore(false);
        }
      }
    },
    [limit]
  );
  return { fetchIncidentCards };
};
