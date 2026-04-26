import { Progress, ProgressLabel, ProgressValue } from '@/shared/ui/progress';
import { AnimationFadeInUp } from '@/shared/ui/animation';

export const ProgressBar = ({ incidents, incidentCards }) => {
  return (
    <div className="progress-position">
      <AnimationFadeInUp>
        <div className="progress-bar">
          <Progress
            value={incidents.length > 0 ? (incidentCards.length / incidents.length) * 100 : 0}
            className="w-full"
          >
            <ProgressLabel>
              Загрузка инцидентов: {incidentCards.length}/{incidents.length}
            </ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
        {/* progress-bar */}
      </AnimationFadeInUp>
    </div>
    // progress-position
  );
};
