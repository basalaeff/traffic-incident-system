// ============================================================================
// КОМПОНЕНТ ДЛЯ ОТРИСОВКИ
// ============================================================================
import { Badge } from '@/shared/ui/badge';
import { badgeConfig } from '../model/badgeConfig';

export const renderBadge = (key) => {
  const cfg = badgeConfig[key];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <Badge className={`gap-1.5 font-medium ${cfg.colors}`}>
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </Badge>
  );
};
export default renderBadge;