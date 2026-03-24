function Registration() {
  // Пишем интерфейс на JSX
  return (
    // Такой же внешний контейнер как в home
    <div style={{ padding: '20px' }}>
      <h1>📝 Регистрация аккаунта</h1>{' '}
      <p>Создайте новый аккаунт, чтобы иметь возможность добавлять инциденты на карту.</p>
      <div
        style={{
          border: '1px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          color: '#666',
          marginTop: '20px',
        }}
      >
        Форма регистрации в разработке
      </div>
      <p>Раздел в разработке</p>
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
export default Registration;
