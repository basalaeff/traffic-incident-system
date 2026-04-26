import Avatar from 'react-avatar';

export const FloatingActions = ({
  displayFloatingBtn,
  setDisplayFloatingBtn,
  displayMap,
  setDisplayMap,
  isAddingMode,
  user,
  displayLogout,
  handleAuthClick,
  handleCreateIncident,
  handleCancelCreateIncident,
  getLocation,
}) => {
  return (
    <div className="floating-btns">
      <div className="btns-menu">
        {/* Кнопка ОТМЕНА */}
        {displayFloatingBtn && isAddingMode && !displayLogout && (
          <button
            className="circle-btn"
            onClick={handleCancelCreateIncident}
            title="Отмена"
            style={{ backgroundColor: 'var(--danger-color)' }}
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/x-circle/x-circle-32-Regular.svg" />
          </button>
        )}
        {/* Кнопка ДОБАВЛЕНИЕ */}
        {displayFloatingBtn && user && displayMap && !isAddingMode && !displayLogout && (
          <button className="circle-btn" onClick={handleCreateIncident} title="Добавить инцидент">
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/plus-circle/plus-circle-32-Regular.png" />
          </button>
        )}
        {/* Кнопка центрировать по геолокации */}
        {displayFloatingBtn && !displayLogout && displayMap && (
          <button className="circle-btn" onClick={getLocation} title="Вернуться в координаты">
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/location-pin/location-pin-32-Regular.svg" />
          </button>
        )}
        {/* Кнопка КАРТЫ */}
        {displayFloatingBtn && !displayLogout && (
          <button
            className="circle-btn"
            onClick={() => {
              displayMap ? setDisplayMap(false) : setDisplayMap(true);
            }}
            title={displayMap ? 'Скрыть карту' : 'Показать карту'}
          >
            {displayMap ? (
              <img src="https://s.kontur.ru/common-v2/icons-ui/black/building-home/building-home-32-Regular.svg" />
            ) : (
              <img src="https://s.kontur.ru/common-v2/icons-ui/black/location-map/location-map-32-Regular.svg" />
            )}
          </button>
        )}
        {/* Кнопка ВХОДА */}
        {displayFloatingBtn && !displayLogout && (
          <button className="circle-btn" onClick={handleAuthClick} title={user ? 'Выйти' : 'Войти'}>
            {user ? (
              <Avatar name={user?.login} size="46" round={true} />
            ) : (
              <img src="https://s.kontur.ru/common-v2/icons-ui/black/arrow-ui-auth-login/arrow-ui-auth-login-32-Regular.svg" />
            )}
          </button>
        )}
        {/* Кнопка МЕНЮ */}
        {!displayLogout && (
          <button
            className="circle-btn"
            onClick={() => {
              displayFloatingBtn ? setDisplayFloatingBtn(false) : setDisplayFloatingBtn(true);
            }}
            title={user ? 'Скрыть' : 'Показать'}
          >
            {displayFloatingBtn ? (
              <img src="https://s.kontur.ru/common-v2/icons-ui/black/arrow-shape-a-right/arrow-shape-a-right-32-Regular.svg" />
            ) : (
              <img src="https://s.kontur.ru/common-v2/icons-ui/black/ui-menu-bars-3-h/ui-menu-bars-3-h-32-Regular.svg" />
            )}
          </button>
        )}
      </div>
      {/* btns-menu */}
    </div>
    //  floating-btns
  );
};
export default FloatingActions;