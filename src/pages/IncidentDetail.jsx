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
export default IncidentDetail;
