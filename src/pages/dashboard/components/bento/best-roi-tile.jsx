import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import MedalFirstPlaceIcon from "@hugeicons/core-free-icons/MedalFirstPlaceIcon"
import { useT } from "@/i18n"
import { BentoTile } from "./bento-tile"
import { topProjectsByRoi } from "../../lib/metrics"
import { TypeIcon } from "@/pages/projects/components/type-icon"
import { formatCurrencyCompact } from "../../lib/format"

function roiColor(roi) {
  if (roi >= 300) return "#10b981" // emerald
  if (roi >= 100) return "#84cc16" // lime
  if (roi >= 0) return "#f59e0b" // amber
  return "#f43f5e" // rose
}

function RoiGauge({ roi }) {
  const color = roiColor(roi)
  // Cap at 500% for visual scale
  const capped = Math.max(0, Math.min(roi, 500))
  const widthPct = (capped / 500) * 100

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${widthPct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
          }}
        />
      </div>
      <span className="text-[11px] font-bold tabular-nums shrink-0" style={{ color }}>
        {roi >= 0 ? "+" : ""}{Math.round(roi)}%
      </span>
    </div>
  )
}

export function BestRoiTile({ projects, className }) {
  const t = useT()
  const items = useMemo(() => topProjectsByRoi(projects, 6), [projects])

  return (
    <BentoTile
      className={className}
      title={t("bento.bestRoi")}
      description={t("bento.bestRoiDesc")}
      icon={
        <HugeiconsIcon icon={MedalFirstPlaceIcon} style={{ width: 22, height: 22, color: "#f59e0b" }} />
      }
    >
      <div className="space-y-2.5">
        {items.length === 0 && (
          <div className="text-xs text-muted-foreground py-6 text-center">
            {t("empty.noRoi")}
          </div>
        )}
        {items.map((p, i) => (
          <div
            key={p.id}
            className="rounded-md p-2 hover:bg-muted/40 transition-colors space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <span
                className="size-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: i === 0 ? "#fbbf24" : i === 1 ? "#cbd5e1" : i === 2 ? "#fb923c" : "var(--muted)",
                  color: i < 3 ? "#0a0a0a" : "var(--muted-foreground)",
                }}
              >
                {i + 1}
              </span>
              <TypeIcon type={p.type} size={14} />
              <span className="text-xs font-medium truncate flex-1 min-w-0">{p.name}</span>
            </div>
            <RoiGauge roi={p._roi} />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pl-7">
              <span>
                <TrendingUp className="size-2.5 inline mr-0.5" />
                {formatCurrencyCompact(p._annualNet)}/yıl
              </span>
              <span>
                {t("kpi.invested")}: <span className="font-semibold text-foreground">{formatCurrencyCompact(p.costSpent)}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </BentoTile>
  )
}
