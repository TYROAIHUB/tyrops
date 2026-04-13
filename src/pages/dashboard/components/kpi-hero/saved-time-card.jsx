import { Card, CardContent } from "@/components/ui/card"
import { Settings2, Zap } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import Clock02Icon from "@hugeicons/core-free-icons/Clock02Icon"
import { useT } from "@/i18n"
import { Link } from "react-router-dom"
import { AnimatedCounter } from "../../lib/animated-counter"
import { formatCurrencyCompact, formatNumber } from "../../lib/format"

export function SavedTimeCard({ savedTime, hourlyRate, savedTimeValue }) {
  const t = useT()
  const annualHours = (savedTime || 0) * 12
  const annualValue = (savedTimeValue || 0) * 12

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-emerald-500/[0.08] via-card to-card hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon icon={Clock02Icon} style={{ width: 18, height: 18, color: "#059669" }} />
            <span>{t("kpi.savedTime")}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{t("kpi.monthly")}</span>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-bold tabular-nums tracking-tight text-emerald-700 dark:text-emerald-400">
            <AnimatedCounter
              value={savedTime}
              formatter={(n) => `${formatNumber(Math.round(n))}h`}
            />
          </div>
          {hourlyRate > 0 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ≈ <AnimatedCounter value={savedTimeValue} formatter={(n) => formatCurrencyCompact(n)} /> /ay
            </p>
          ) : (
            <Link
              to="/app/settings/pricing"
              className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <Settings2 className="size-3" />
              {t("kpi.hourlyRateNotSet")}
            </Link>
          )}
        </div>

        {/* Annual projection */}
        <div className="rounded-md bg-muted/50 p-2.5 space-y-1.5">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Zap className="size-3 text-amber-500" />
            <span>{t("kpi.annualProjection")}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold tabular-nums">
              <AnimatedCounter value={annualHours} formatter={(n) => formatNumber(Math.round(n))} />
              <span className="text-xs font-normal text-muted-foreground ml-0.5">h/yıl</span>
            </span>
            {hourlyRate > 0 && (
              <span className="text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter value={annualValue} formatter={(n) => formatCurrencyCompact(n)} />
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
