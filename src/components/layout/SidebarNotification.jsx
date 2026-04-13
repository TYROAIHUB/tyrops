import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SidebarNotification({ count = 0, className, ...props }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      {...props}
    >
      <BellIcon className="size-4" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Button>
  )
}

export default SidebarNotification
