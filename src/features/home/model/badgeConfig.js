// ============================================================================
// БЕЙДЖИ
// ============================================================================
import { AlertTriangle, Flame, CheckCircle2, XCircle } from 'lucide-react';

export const badgeConfig = {
  accident: {
    icon: AlertTriangle,
    colors: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    label: 'ДТП',
  },
  hazard: {
    icon: Flame,
    colors: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    label: 'Опасный участок',
  },
  active: {
    icon: CheckCircle2,
    colors: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    label: 'Активный',
  },
  inactive: {
    icon: XCircle,
    colors: 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300',
    label: 'Неактивный',
  },
};
