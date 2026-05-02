import { cn } from "@/app/lib/utils"
import { Loader2Icon } from "lucide-react"

function Spinner({
  className,
  ...props
}) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props} />
  );
}

export function SpinnerCircleBtn() {
  return (
    <div className="size-3">
      <Spinner />
    </div>
  );
}

