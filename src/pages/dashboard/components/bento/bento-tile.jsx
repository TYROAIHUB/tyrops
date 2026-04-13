import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Wrapper for bento tiles. Pass className for col-span/row-span control.
// `icon` is now a ReactNode (rendered icon, e.g. <HugeiconsIcon ... /> or <Lucide ... />)
export function BentoTile({
  className,
  title,
  description,
  icon,
  action,
  children,
  bodyClassName,
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
    >
      {(title || action) && (
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && <span className="shrink-0 inline-flex items-center justify-center">{icon}</span>}
            <div className="min-w-0">
              {title && <CardTitle className="text-sm font-semibold truncate">{title}</CardTitle>}
              {description && (
                <CardDescription className="text-[11px] truncate">{description}</CardDescription>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-0", bodyClassName)}>{children}</CardContent>
    </Card>
  )
}
