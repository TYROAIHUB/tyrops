import { useT } from "@/i18n"
import { HugeiconsIcon } from "@hugeicons/react"
import Wallet01Icon from "@hugeicons/core-free-icons/Wallet01Icon"
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon"
import Activity01Icon from "@hugeicons/core-free-icons/Activity01Icon"
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon"
import ChartIncreaseIcon from "@hugeicons/core-free-icons/ChartIncreaseIcon"

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// 20 bars, each = 5% → percent input is 0-100
const TOTAL_BARS = 25

function pctToBars(pct) {
  return Math.min(TOTAL_BARS, Math.max(0, Math.round((pct / 100) * TOTAL_BARS)))
}

function BarLevel({ filled, colorClass }) {
  return (
    <div className="flex items-center gap-[3px] h-8 mt-3">
      {Array.from({ length: TOTAL_BARS }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-full ${
            i < filled ? colorClass : "bg-muted-foreground/15"
          }`}
        />
      ))}
    </div>
  )
}

function TrendBadge({ value, label = "vs last month" }) {
  const isPositive = !String(value).startsWith("-")
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className={`text-sm font-semibold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function KpiCard({ title, value, icon: Icon, trend, trendLabel, barFilled, theme }) {
  return (
    <div className="bg-muted/50 backdrop-blur-xl border border-border/40 rounded-2xl p-3 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.10)] transition-shadow duration-300">
      {/* Outer: icon + title */}
      <div className="flex items-center gap-2 mb-2.5">
        <HugeiconsIcon icon={Icon} size={16} className={theme.iconText} strokeWidth={1.5} />
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>

      {/* Inner white box */}
      <div className="rounded-xl bg-white px-3.5 pt-3 pb-3">
        <p className="text-xl font-bold tracking-tight leading-none">{value}</p>
        <TrendBadge value={trend} label={trendLabel} />
        <BarLevel filled={barFilled} colorClass={theme.barColor} />
      </div>
    </div>
  )
}

const THEMES = {
  sky:     { iconText: "text-sky-500",     barColor: "bg-sky-400"     },
  rose:    { iconText: "text-rose-500",    barColor: "bg-rose-400"    },
  emerald: { iconText: "text-emerald-500", barColor: "bg-emerald-400" },
  violet:  { iconText: "text-violet-500",  barColor: "bg-violet-400"  },
  amber:   { iconText: "text-amber-500",   barColor: "bg-amber-400"   },
}

export function StatCards({ projects }) {
  const t = useT()
  const totalCount    = projects.length || 1
  const totalValue    = projects.reduce((sum, p) => sum + (p.valueGenerated || 0), 0)
  const totalCost     = projects.reduce((sum, p) => sum + (p.costSpent     || 0), 0)
  const activeCount   = projects.filter((p) => p.status === "active").length
  const completedCount= projects.filter((p) => p.status === "completed").length

  const roiRaw = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : null
  const roiVal = roiRaw !== null ? roiRaw.toFixed(1) : null

  // % hesapları (0-100)
  const totalBase      = totalValue + totalCost || 1
  const valuePct       = (totalValue / totalBase) * 100
  const costPct        = (totalCost  / totalBase) * 100
  const activePct      = (activeCount   / totalCount) * 100
  const completedPct   = (completedCount / totalCount) * 100
  const roiPct         = roiRaw !== null ? Math.min(Math.max(roiRaw, 0), 100) : 0

  const cards = [
    {
      title: t('stat.totalValue'),
      value: formatCurrency(totalValue),
      icon: Wallet01Icon,
      trend: "+12.5%",
      trendLabel: t('stat.vsLastMonth'),
      barFilled: pctToBars(valuePct),
      theme: THEMES.amber,
    },
    {
      title: t('stat.totalCost'),
      value: formatCurrency(totalCost),
      icon: Invoice01Icon,
      trend: "-3.2%",
      trendLabel: t('stat.vsLastMonth'),
      barFilled: pctToBars(costPct),
      theme: THEMES.rose,
    },
    {
      title: t('stat.active'),
      value: `${activeCount} / ${totalCount}`,
      icon: Activity01Icon,
      trend: "+2",
      trendLabel: t('stat.vsLastMonth'),
      barFilled: pctToBars(activePct),
      theme: THEMES.emerald,
    },
    {
      title: t('stat.completed'),
      value: `${completedCount} / ${totalCount}`,
      icon: CheckmarkCircle01Icon,
      trend: completedCount > 0 ? `+${completedCount}` : "—",
      trendLabel: t('stat.completedLbl'),
      barFilled: pctToBars(completedPct),
      theme: THEMES.sky,
    },
    {
      title: t('stat.roi'),
      value: roiVal !== null ? `${roiVal}%` : "N/A",
      icon: ChartIncreaseIcon,
      trend: roiVal !== null ? (parseFloat(roiVal) >= 0 ? `+${roiVal}%` : `${roiVal}%`) : "—",
      trendLabel: t('stat.roiLbl'),
      barFilled: pctToBars(roiPct),
      theme: THEMES.violet,
    },
  ]

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  )
}
