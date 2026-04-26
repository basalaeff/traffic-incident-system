import { incidentLabels } from '@/features/incident-detail/model/incidentLabels';

export const DetailTable = ({ incident, owner }) => {
  return (
    <table className="detail-table">
      <tbody>
        <tr>
          <td>Тип инцидента</td>
          <td>
            <span>{incidentLabels[incident?.type] || 'Другое'}</span>
          </td>
        </tr>
        <tr>
          <td>Широта</td>
          <td>{incident?.lat}</td>
        </tr>
        <tr>
          <td>Долгота</td>
          <td>{incident?.lng}</td>
        </tr>
        <tr>
          <td>Пользователь</td>
          <td>{owner?.login}</td>
        </tr>
        <tr>
          <td>Время</td>
          <td>
            {incident?.time}
            {/* detail-time */}
          </td>
        </tr>
        <tr>
          <td>Статус</td>
          <td>
            <span>{incident?.status === 'active' ? 'Активный' : 'Неактивный'}</span>
          </td>
        </tr>
      </tbody>
    </table>
    // detail-table
  );
};
export default DetailTable;
