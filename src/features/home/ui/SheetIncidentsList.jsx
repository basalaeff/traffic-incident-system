import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { IncidentsList } from './incidentsList';

export const SheetIncidentsList = ({ listRef, incidentCards, onViewOnMap, onViewDetails }) => {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <div className="floating-btn-sheet">
            <div className="btns-menu">
              <button className="circle-btn" variant="outline" title="Список инцидентов">
                <img src="https://s.kontur.ru/common-v2/icons-ui/black/stack-h-down/stack-h-down-32-Regular.svg" />
              </button>
            </div>
          </div>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Список инцидентов</SheetTitle>
          <SheetDescription>
            Список инцидентов, отображаемых на карте. Вы можете просмотреть подробности каждого
            инцидента или отобразить его на карте.
          </SheetDescription>
        </SheetHeader>
        <IncidentsList
          listRef={listRef}
          incidentCards={incidentCards}
          onViewOnMap={onViewOnMap}
          onViewDetails={onViewDetails}
        />
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Close</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
