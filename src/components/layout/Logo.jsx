import { TerminalIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, ...props }) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <TerminalIcon className="size-4" />
      </div>
      {showText && (
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">TYROX</span>
          <span className="truncate text-xs text-muted-foreground">
            AI Ops Tracker
          </span>
        </div>
      )}
    </div>
  )
}

export default Logo
