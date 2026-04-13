import { CircleDot, Clock, CheckCircle2, PauseCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useT } from "@/i18n"

export const STATUS_CONFIG = {
  active: {
    icon: CircleDot,
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50",
  },
  planned: {
    icon: Clock,
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50",
  },
  completed: {
    icon: CheckCircle2,
    dot: "bg-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
  },
  hold: {
    icon: PauseCircle,
    dot: "bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    cls: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-900/50",
  },
}

export function StatusBadge({ status }) {
  const t = useT()
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.planned
  const Icon = cfg.icon
  return (
    <Badge variant="outline" className={`gap-1 font-medium ${cfg.cls}`}>
      <Icon className="size-2.5" />
      {t(`status.${status}`)}
    </Badge>
  )
}

export function StatusDot({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.planned
  return <span className={`size-2 rounded-full ${cfg.dot} shrink-0`} />
}

export function StatusIcon({ status, className = "size-3.5" }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.planned
  const Icon = cfg.icon
  return <Icon className={`${className} ${cfg.text}`} />
}
