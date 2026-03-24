//  Нужен хук, чтобы доставать id из ссылки
import { use } from 'react';
import { useParams } from 'react-router-dom';

function IncidentDetail() {
  // Достаем id c помощью хука
  const { id } = useParams();
  // Пишем интерфейс на JSX
  return (
    // Такой же внешний контейнер как в home
    <div style={{ padding: '20px' }}>
      <h1>Детали инцидента №{id}</h1>
      <p>Раздел в разработке</p>
      {/* Нужна кнопка назад, чтобы вернуться на предыдущую страницу */}
      <button onClick={() => window.history.back()}>← Назад к карте</button>
    </div>
  );
}
export default IncidentDetail;
