import { cn } from '@/app/lib/utils';
import { Loader2Icon } from 'lucide-react';

export function Spinner({ className, color, style, ...props }) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-6 animate-spin', className)}
      stroke="currentColor"
      style={{ color, ...style }}
      {...props}
    />
  );
}
