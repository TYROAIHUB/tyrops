import { useMemo } from "react"
import { TrendingUp, Timer, Coins, AlertCircle } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import ChartIncreaseIcon from "@hugeicons/core-free-icons/ChartIncreaseIcon"
import { useT } from "@/i18n"
import { BentoTile } from "./bento-tile"
import { computeAnnualForecast } from "../../lib/metrics"
import { AnimatedCounter } from "../../lib/animated-counter"
import { formatCurrencyCompact, formatNumber } from "../../lib/format"

// Discrete bar level — equal-height vertical bars, filled vs muted (battery/equalizer style)
function SegmentedBar({ percent, positive }) {
  const total = 80
  const filledCount = Math.round((Math.max(0, Math.min(percent, 100)) / 100) * total)
  const filledColor = positive ? "bg-emerald-500" : "bg-rose-500"

  return (
    <div className="flex items-center gap-[3px] h-12 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-full transition-colors duration-500 ${
            i < filledCount ? filledColor : "bg-muted-foreground/15"
          }`}
        />
      ))}
    </div>
  )
}

function ForecastMetric({ icon: Icon, label, value, sub, color, formatter }) {
  return (
    <div className="rounded-lg border bg-card/60 backdrop-blur-sm p-4 space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3" style={{ color }} />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>
        <AnimatedCounter value={value} formatter={formatter} />
      </div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

export function AnnualForecastTile({ projects, settings, className }) {
  const t = useT()
  const f = useMemo(() => computeAnnualForecast(projects, settings), [projects, settings])

  // Compute % of net benefit vs gross
  const grossBenefit = f.annualValueProjection + f.annualReplacedSavings + f.annualSavedValue
  const netRatio = grossBenefit > 0 ? (f.annualNetBenefit / grossBenefit) * 100 : 0
  const benefitPositive = f.annualNetBenefit > 0

  return (
    <BentoTile
      className={className}
      title={t("forecast.title")}
      description={t("forecast.subtitle")}
      icon={
        <HugeiconsIcon icon={ChartIncreaseIcon} style={{ width: 22, height: 22, color: "#f59e0b" }} />
      }
    >
      <div className="space-y-4">
        {/* Hero: net benefit + vertical comparison bars */}
        <div
          className="relative rounded-xl p-5 overflow-hidden"
          style={{
            background: benefitPositive
              ? "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(245,158,11,0.06) 60%, transparent)"
              : "linear-gradient(135deg, rgba(244,63,94,0.12), rgba(245,158,11,0.06) 60%, transparent)",
          }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            <TrendingUp
              className="size-3"
              style={{ color: benefitPositive ? "#10b981" : "#f43f5e" }}
            />
            {t("forecast.netBenefit")}
          </div>
          <div
            className="text-4xl font-bold tabular-nums tracking-tight"
            style={{ color: benefitPositive ? "#059669" : "#e11d48" }}
          >
            <AnimatedCounter
              value={f.annualNetBenefit}
              formatter={(n) =>
                `${n >= 0 ? "+" : "−"}${formatCurrencyCompact(Math.abs(n))}`
              }
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {t("forecast.formula")}
          </p>

          {/* Segmented vertical bars — barcode/equalizer style */}
          {grossBenefit > 0 && (
            <div className="mt-4 space-y-1.5">
              <SegmentedBar percent={netRatio} positive={benefitPositive} />
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{t("forecast.grossBenefit")}: <span className="font-semibold text-foreground tabular-nums">{formatCurrencyCompact(grossBenefit)}</span></span>
                <span className={benefitPositive ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-rose-600 font-semibold"}>
                  {Math.round(netRatio)}% net
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 4 component metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ForecastMetric
            icon={Coins}
            color="var(--primary)"
            label={t("forecast.value")}
            value={f.annualValueProjection}
            formatter={(n) => formatCurrencyCompact(n)}
            sub={t("forecast.valueDesc")}
          />
          <ForecastMetric
            icon={AlertCircle}
            color="#10b981"
            label={t("forecast.replaced")}
            value={f.annualReplacedSavings}
            formatter={(n) => formatCurrencyCompact(n)}
            sub={t("forecast.replacedDesc")}
          />
          <ForecastMetric
            icon={Timer}
            color="#0ea5e9"
            label={t("forecast.timeValue")}
            value={f.annualSavedValue}
            formatter={(n) => formatCurrencyCompact(n)}
            sub={`${formatNumber(Math.round(f.annualSavedTime))}h/yıl`}
          />
          <ForecastMetric
            icon={AlertCircle}
            color="#f43f5e"
            label={t("forecast.cost")}
            value={f.annualOngoingCost}
            formatter={(n) => `−${formatCurrencyCompact(n)}`}
            sub={t("forecast.costDesc")}
          />
        </div>
      </div>
    </BentoTile>
  )
}
