import { useNavigate } from 'react-router-dom';
export const HomeBtn = () => {
  const navigate = useNavigate();
  return (
    <button
      className="home-btn"
      onClick={() => {
        navigate('/');
      }}
      title="Главная"
    >
      <img src="https://s.kontur.ru/common-v2/icons-ui/black/building-home/building-home-32-Regular.svg" />
    </button>
    // home-btn
  );
};
export default HomeBtn;