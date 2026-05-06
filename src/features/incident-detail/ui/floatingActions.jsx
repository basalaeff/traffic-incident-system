import { useNavigate } from 'react-router-dom';

export const FloatingActions = ({ id, user, incident, showDelete, handleDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="ud-btn">
      {/* Кнопка редактировать */}
      {user?.id === incident?.userId && !showDelete && (
        <button
          className="circle-btn"
          title="Редактировать"
          onClick={() => {
            navigate(`/editing-incident/${id}`);
          }}
        >
          <img src="https://s.kontur.ru/common-v2/icons-ui/black/tool-pencil-line/tool-pencil-line-32-Regular.svg" />
        </button>
      )}

      {/* Кнопка удалить */}
      {user?.id === incident?.userId && !showDelete && (
        <button className="circle-btn" title="Удалить" onClick={handleDelete}>
          <img src="https://s.kontur.ru/common-v2/icons-ui/black/trash-can/trash-can-32-Regular.svg" />
        </button>
      )}
    </div>
    // ud-btn
  );
};
export default FloatingActions;
