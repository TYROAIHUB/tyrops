import { Card, CardContent } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import CoinsDollarIcon from "@hugeicons/core-free-icons/CoinsDollarIcon"
import { useT } from "@/i18n"
import { AnimatedCounter } from "../../lib/animated-counter"
import { formatCurrencyCompact } from "../../lib/format"

export function TotalValueCard({ totalValue, replacedCost, totalCost }) {
  const t = useT()
  const totalGain = (totalValue || 0) + (replacedCost || 0)
  const valueShare = totalGain > 0 ? ((totalValue || 0) / totalGain) * 100 : 0
  const replacedShare = totalGain > 0 ? ((replacedCost || 0) / totalGain) * 100 : 0

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-primary/[0.06] via-card to-card hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon icon={CoinsDollarIcon} style={{ width: 18, height: 18, color: "var(--primary)" }} />
          <span>{t("kpi.totalGain")}</span>
        </div>

        <div className="text-3xl font-bold tabular-nums tracking-tight">
          <AnimatedCounter value={totalGain} formatter={(n) => formatCurrencyCompact(n)} />
        </div>

        {/* Stacked share bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden flex">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${valueShare}%` }}
            title={`${formatCurrencyCompact(totalValue)} value`}
          />
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${replacedShare}%` }}
            title={`${formatCurrencyCompact(replacedCost)} replaced`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            <span>{t("kpi.valueGen")}</span>
            <span className="font-semibold tabular-nums text-foreground">
              {formatCurrencyCompact(totalValue)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>{t("kpi.replaced")}</span>
            <span className="font-semibold tabular-nums text-foreground">
              {formatCurrencyCompact(replacedCost)}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground border-t pt-2 flex items-center gap-1">
          <span>{t("kpi.invested")}:</span>
          <span className="font-semibold text-foreground tabular-nums">
            {formatCurrencyCompact(totalCost)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
