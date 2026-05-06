import * as React from 'react';
import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';

import { cn } from '@/app/lib/utils';
import { Button } from '@/shared/ui/button';
import { XIcon } from 'lucide-react';

function Sheet({ ...props }) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
  return (
    <SheetPrimitive.Backdrop
      className={cn('fixed inset-0 z-40 bg-black/70', className)}
      {...props}
    />
  );
}

function SheetContent({ className, children, side = 'left', showCloseButton = true, ...props }) {
  return (
    <SheetPortal>
      <SheetOverlay />

      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          // База
          'fixed z-1500 flex flex-col bg-popover text-popover-foreground shadow-xl transition-all duration-300 ease-out',

          // Мобильная версия — почти на весь экран
          'inset-0 w-full max-w-full sm:w-auto',

          // Десктопная версия
          'sm:inset-y-0 sm:left-0 sm:h-full sm:w-115 lg:w-125 xl:w-135 sm:rounded-r-2xl sm:rounded-l-none sm:border-r',

          // Анимации
          'data-ending-style:opacity-0 data-starting-style:opacity-0',
          'data-[side=left]:sm:data-ending-style:-translate-x-full data-[side=left]:sm:data-starting-style:-translate-x-full',

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <SheetPrimitive.Close
            className="absolute top-4 right-4 z-10"
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-muted"
              >
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Закрыть</span>
              </Button>
            }
          />
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-1.5 p-6', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-6', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-heading text-base font-medium text-foreground', className)}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
