import { renderBadge } from '@/features/home/ui/renderBadge';
import { AnimationFadeInUp } from '@/shared/ui/animation';

export const IncidentsList = ({ listRef, incidentCards, onViewOnMap, onViewDetails }) => {
  return (
    <div className="incidents-list" ref={listRef}>
      {incidentCards.map((incidentCard) => {
        return (
          // Использую article
          // каждый инцидент самостоятельная единица данных
          <AnimationFadeInUp key={incidentCard?.id}>
            <IncidentCard
              incidentCard={incidentCard}
              onViewOnMap={onViewOnMap}
              onViewDetails={onViewDetails}
            />
          </AnimationFadeInUp>
        );
      })}
    </div>
    //  incidents-list
  );
};

const IncidentCard = ({ incidentCard, onViewOnMap, onViewDetails }) => {
  return (
    <article className="incident-card">
      <div className="incident-card-first">
        <header className="incident-card-header">
          {renderBadge(incidentCard?.type)}
          {renderBadge(incidentCard?.status)}
        </header>
        {/* incident-card-header */}
        <h2 className="incident-card-title">{incidentCard?.title}</h2>
        {/* incident-card-title */}
        <p className="incident-card-description">{incidentCard?.description}</p>
        {/* incident-card-description */}
        <time className="incident-card-time">{incidentCard?.time}</time>
        {/* incident-card-time */}
        <footer className="incident-card-footer">
          <span className="incident-card-coords">
            {incidentCard?.lat}, {incidentCard?.lng}
          </span>
          {/* incident-card-coords */}
        </footer>
        {/* incident-card-footer */}
      </div>
      {/* incident-card-first  */}
      <div className="incident-card-second">
        <div className="ud-btn">
          {/* Кнопка посмотреть на карте */}
          <button
            className="card-circle-btn"
            title="Посмотреть на карте"
            onClick={() => onViewOnMap(incidentCard)}
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/location-pin/location-pin-32-Regular.svg" />
          </button>

          {/* Кнопка на страницу детализации */}
          <button
            className="card-circle-btn"
            title="Подробнее"
            onClick={() => onViewDetails(incidentCard?.id)}
          >
            <img src="https://s.kontur.ru/common-v2/icons-ui/black/arrow-ui-corner-out-up-right/arrow-ui-corner-out-up-right-32-Regular.svg" />
          </button>
        </div>
        {/* ud-btn */}
      </div>
      {/* incident-card-second */}
    </article>
    // incident-card
  );
};
export default IncidentsList;