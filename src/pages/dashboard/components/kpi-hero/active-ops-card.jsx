import { Card, CardContent } from "@/components/ui/card"
import { Activity, Clock } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import UserMultiple02Icon from "@hugeicons/core-free-icons/UserMultiple02Icon"
import { useT } from "@/i18n"
import { AnimatedCounter } from "../../lib/animated-counter"
import { formatNumber, formatNumberCompact } from "../../lib/format"

function ReachMetric({ icon: Icon, value, label, color, formatter }) {
  return (
    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" style={{ color }} />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-lg font-bold tabular-nums leading-tight">
        <AnimatedCounter value={value} formatter={formatter} />
      </div>
    </div>
  )
}

export function ActiveOpsCard({
  totalActiveUsers,
  totalInteractions,
  totalRuntime,
  projects,
  agents,
  automations,
}) {
  const t = useT()

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-violet-500/[0.06] via-card to-card hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon icon={UserMultiple02Icon} style={{ width: 18, height: 18, color: "#7c3aed" }} />
            <span>{t("kpi.reach")}</span>
          </div>
        </div>

        {/* Big primary metric: active users */}
        <div className="space-y-0.5">
          <div className="text-3xl font-bold tabular-nums tracking-tight">
            <AnimatedCounter
              value={totalActiveUsers}
              formatter={(n) => formatNumber(Math.round(n))}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">{t("kpi.totalActiveUsers")}</p>
        </div>

        {/* Two secondary metrics */}
        <div className="flex items-center gap-3 pt-1 border-t pt-2.5">
          <ReachMetric
            icon={Activity}
            color="#8b5cf6"
            value={totalInteractions}
            label={t("kpi.interactions")}
            formatter={(n) => formatNumberCompact(Math.round(n))}
          />
          <div className="w-px self-stretch bg-border" />
          <ReachMetric
            icon={Clock}
            color="#0ea5e9"
            value={totalRuntime}
            label={t("kpi.runtime")}
            formatter={(n) => `${formatNumberCompact(Math.round(n))}h`}
          />
        </div>

        {/* Project/agent/automation counts */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t pt-2">
          <span>
            <span className="font-semibold text-foreground tabular-nums">{projects}</span> {t("kpi.projects").toLowerCase()}
          </span>
          <span>
            <span className="font-semibold text-foreground tabular-nums">{agents}</span> {t("kpi.agents").toLowerCase()}
          </span>
          <span>
            <span className="font-semibold text-foreground tabular-nums">{automations}</span> {t("kpi.automations").toLowerCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
