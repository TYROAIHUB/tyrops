import { useMemo } from "react"
import { Workflow, Clock } from "lucide-react"
import { useT } from "@/i18n"
import useStore from "@/store/useStore"
import { Badge } from "@/components/ui/badge"
import { BentoTile } from "./bento-tile"
import { topAutomationsBySaved } from "../../lib/metrics"
import { formatHours, formatCurrencyCompact } from "../../lib/format"

const FREQ_COLOR = {
  hourly: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  daily: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  weekly: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "on-demand": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
}

export function TimeSavingsTile({ automations, className }) {
  const t = useT()
  const hourlyRate = useStore((s) => s.settings?.hourlyRate ?? 0)
  const top = useMemo(() => topAutomationsBySaved(automations, 6), [automations])
  const max = Math.max(1, ...top.map((a) => Number(a.monthlyTimeSaved || 0)))

  return (
    <BentoTile
      className={className}
      title={t("bento.timeSavings")}
      description={t("bento.timeSavingsDesc")}
      icon={Clock}
      iconColor="#10b981"
    >
      <div className="space-y-2.5">
        {top.length === 0 && (
          <div className="text-xs text-muted-foreground py-6 text-center">
            {t("empty.noAutomations")}
          </div>
        )}
        {top.map((a) => {
          const hours = Number(a.monthlyTimeSaved || 0)
          const widthPct = (hours / max) * 100
          const dollars = hourlyRate > 0 ? hours * hourlyRate : null
          return (
            <div key={a.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Workflow className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-medium truncate flex-1 min-w-0">{a.name}</span>
                <Badge variant="outline" className={`text-[9px] ${FREQ_COLOR[a.frequency] || ""}`}>
                  {a.frequency}
                </Badge>
                <span className="text-xs font-semibold tabular-nums w-12 text-right">
                  {formatHours(hours)}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-5">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                {dollars !== null && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium tabular-nums w-12 text-right">
                    {formatCurrencyCompact(dollars)}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </BentoTile>
  )
}
