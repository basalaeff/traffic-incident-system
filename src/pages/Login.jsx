function Login() {
  // ============================================================================
  // ФУНКЦИЯ ОБРАБОТКИ ФОРМЫ ДЛЯ ВХОДА
  // ============================================================================
  const handleSubmit = (e) => {
    // Предотвращает перезагрузку
    e.preventDefault();
    alert('Функция находится в разработке!');
  }
  // ============================================================================
  // ОСНОВНОЙ ИНТЕРФЕЙС
  // ============================================================================
  // Пишем интерфейс на JSX
  return (
    // Такой же внешний контейнер как в home
    <div style={{ padding: '20px' }}>
      <h1>🔐 Вход в систему</h1>
      <form onSubmit={handleSubmit}>
        {/* Блок для поля email */}
        <div style={{marginBottom: '15px'}}>
        {/* Отдельный блок (абзац), отступ снизу, начертание текста */}
        <label style = {{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Email:</label>
        {/* Поле для ввода */}
        <input
        type="email"
        // Добавлю подсказку (исчезнет при вводе)
        placeholder="user@test.com"
        required //Обязательно для заполнения
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        </div>

        {/* Блок для поля password */}
        <div style={{marginBottom: '15px'}}>
        {/* Отдельный блок (абзац), отступ снизу, начертание текста */}
        <label style = {{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Email:</label>
        {/* Поле для ввода */}
        <input
        type="password"
        // Добавлю подсказку (исчезнет при вводе)
        placeholder="********"
        required //Обязательно для заполнения
        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        </div>

        {/* Кнопка отправки формы */}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Войти
        </button>

      </form>
      {/* Нужна кнопка отмены, чтобы вернуться на предыдущую страницу */}
      <button onClick={() => window.history.back()}>Отмена</button>
    </div>
  );
}
export default Login;
