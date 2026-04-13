import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import ChartUpIcon from "@hugeicons/core-free-icons/ChartUpIcon"
import { useT } from "@/i18n"
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts"
import { AnimatedCounter } from "../../lib/animated-counter"

function gaugeColor(roi) {
  if (roi == null) return "var(--muted-foreground)"
  if (roi < 0) return "#ef4444" // rose-500
  if (roi < 100) return "#f59e0b" // amber-500
  if (roi < 300) return "#84cc16" // lime-500
  return "#10b981" // emerald-500
}

// Map ROI (-100..1000) to gauge angle 0..100
function roiToPercent(roi) {
  if (roi == null) return 0
  // Cap at 500% for visual; >500% is just full
  const capped = Math.max(0, Math.min(roi, 500))
  return (capped / 500) * 100
}

export function RoiGaugeCard({ roi, payback }) {
  const t = useT()
  const color = gaugeColor(roi)
  const pct = roiToPercent(roi)
  const noData = roi === null

  const data = [{ name: "roi", value: pct, fill: color }]

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-card to-muted/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon icon={ChartUpIcon} style={{ width: 18, height: 18, color }} />
          <span>{t("kpi.roi")}</span>
        </div>

        <div className="relative h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="80%"
              innerRadius="120%"
              outerRadius="150%"
              barSize={14}
              data={data}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar
                background={{ fill: "var(--muted)" }}
                dataKey="value"
                cornerRadius={8}
                isAnimationActive={true}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
            {noData ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <AlertCircle className="size-3" />
                {t("kpi.roiInsufficientData")}
              </div>
            ) : (
              <div className="text-2xl font-bold tabular-nums" style={{ color }}>
                <AnimatedCounter
                  value={roi}
                  formatter={(n) => `${n >= 0 ? "+" : ""}${Math.round(n)}%`}
                />
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center">
          {payback !== null && payback !== undefined
            ? `${t("kpi.payback")}: ${payback.toFixed(1)} ${t("detail.kpi.months")}`
            : t("kpi.paybackUnavailable")}
        </p>
      </CardContent>
    </Card>
  )
}
