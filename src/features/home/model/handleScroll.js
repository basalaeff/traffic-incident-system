// ============================================================================
// СКРОЛЛ
// ============================================================================

export const useScroll = (loadingRef, hasMoreRef, pageRef, fetchIncidentCards, setShowProgressForIncidentCards) => {
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    // Грузим, если: близко к низу + не грузим сейчас + есть ещё данные
    if (distanceToBottom < 100 && !loadingRef.current && hasMoreRef.current) {
      console.log('Загружаю страницу', pageRef.current + 1);
      fetchIncidentCards(false, true);
      setShowProgressForIncidentCards(true);
    }
  };
  return { handleScroll };
};
