function IncidentForm() {
  // Пишем интерфейс на JSX
  return (
    // Такой же внешний контейнер как в home
    <div style={{ padding: '20px' }}>
      <h1>➕ Добавить новый инцидент</h1>
      <p>Форма для создания нового сообщения о ДТП или опасности.</p>
      <p>
        <i>(Доступно только авторизованным пользователям)</i>
      </p>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          marginTop: '20px',
        }}
      >
        Страница детализации находится в разработке
      </div>
      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: '20px',
          padding: '8px 16px',
          cursor: 'pointer',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        Назад
      </button>
    </div>
  );
}
export default IncidentForm;
