import { useMemo } from "react"
import { Users, Coins, Timer } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import Analytics01Icon from "@hugeicons/core-free-icons/Analytics01Icon"
import { useT } from "@/i18n"
import { BentoTile } from "./bento-tile"
import { performanceByType } from "../../lib/metrics"
import { TypeIcon } from "@/pages/projects/components/type-icon"
import { getTypeConfig } from "@/data/type-icons"
import { formatCurrencyCompact, formatNumberCompact } from "../../lib/format"

function TypeRow({ row, maxValue, maxUsers, maxSaved, total }) {
  const t = useT()
  const cfg = getTypeConfig(row.type)
  const valuePct = (row.valueGenerated / maxValue) * 100
  const usersPct = maxUsers > 0 ? (row.activeUsers / maxUsers) * 100 : 0
  const savedPct = maxSaved > 0 ? (row.savedTime / maxSaved) * 100 : 0
  const sharePct = total > 0 ? (row.valueGenerated / total) * 100 : 0

  return (
    <div className="rounded-lg border bg-card/40 p-3 space-y-2 hover:bg-card/70 hover:border-border transition-all">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <div
          className="size-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${cfg.color}1a` }}
        >
          <TypeIcon type={row.type} size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate">{t(`type.${row.type}`) || row.type}</span>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: cfg.color }}>
              {Math.round(sharePct)}%
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            {row.count} {t("bento.projects")}
          </div>
        </div>
      </div>

      {/* Three metric bars */}
      <div className="space-y-1.5">
        <BarRow
          icon={Coins}
          label={t("kpi.valueGen")}
          value={formatCurrencyCompact(row.valueGenerated)}
          pct={valuePct}
          color={cfg.color}
        />
        {row.activeUsers > 0 && (
          <BarRow
            icon={Users}
            label={t("kpi.users")}
            value={formatNumberCompact(row.activeUsers)}
            pct={usersPct}
            color="#8b5cf6"
          />
        )}
        {row.savedTime > 0 && (
          <BarRow
            icon={Timer}
            label={t("kpi.savedTime")}
            value={`${formatNumberCompact(row.savedTime)}h`}
            pct={savedPct}
            color="#10b981"
          />
        )}
      </div>
    </div>
  )
}

function BarRow({ icon: Icon, label, value, pct, color }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3 text-muted-foreground shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(0, Math.min(pct, 100))}%`, background: color }}
        />
      </div>
      <span className="text-[10px] font-semibold tabular-nums w-14 text-right">{value}</span>
    </div>
  )
}

export function PerformanceByTypeTile({ projects, className }) {
  const t = useT()
  const rows = useMemo(() => performanceByType(projects), [projects])
  const total = rows.reduce((s, r) => s + r.valueGenerated, 0)
  const maxValue = Math.max(1, ...rows.map((r) => r.valueGenerated))
  const maxUsers = Math.max(1, ...rows.map((r) => r.activeUsers))
  const maxSaved = Math.max(1, ...rows.map((r) => r.savedTime))

  return (
    <BentoTile
      className={className}
      title={t("bento.performanceByType")}
      description={t("bento.performanceByTypeDesc")}
      icon={
        <HugeiconsIcon icon={Analytics01Icon} style={{ width: 22, height: 22, color: "var(--primary)" }} />
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {rows.length === 0 && (
          <div className="text-xs text-muted-foreground py-6 text-center col-span-2">
            {t("empty.noProjects")}
          </div>
        )}
        {rows.map((row) => (
          <TypeRow
            key={row.type}
            row={row}
            maxValue={maxValue}
            maxUsers={maxUsers}
            maxSaved={maxSaved}
            total={total}
          />
        ))}
      </div>
    </BentoTile>
  )
}
