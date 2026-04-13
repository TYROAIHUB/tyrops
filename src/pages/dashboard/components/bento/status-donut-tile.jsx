import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import PieChart02Icon from "@hugeicons/core-free-icons/PieChart02Icon"
import { useT } from "@/i18n"
import { BentoTile } from "./bento-tile"
import { groupByStatus } from "../../lib/metrics"
import { STATUS_CONFIG } from "@/pages/projects/components/status-badge"

const STATUS_COLORS = {
  active: "#10b981",
  completed: "#3b82f6",
  planned: "#f59e0b",
  hold: "#f43f5e",
}

export function StatusDonutTile({ projects, className }) {
  const t = useT()

  const counts = useMemo(() => groupByStatus(projects), [projects])
  const data = useMemo(
    () =>
      ["active", "completed", "planned", "hold"]
        .map((key) => ({
          key,
          name: t(`status.${key}`),
          value: counts[key] || 0,
          fill: STATUS_COLORS[key],
        }))
        .filter((d) => d.value > 0),
    [counts, t]
  )

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <BentoTile
      className={className}
      title={t("bento.statusDistribution")}
      description={t("bento.statusDistributionDesc")}
      icon={
        <HugeiconsIcon icon={PieChart02Icon} style={{ width: 22, height: 22, color: "var(--primary)" }} />
      }
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-full h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{ key: "empty", value: 1, fill: "var(--muted)" }]}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={65}
                stroke="var(--background)"
                strokeWidth={2}
                paddingAngle={data.length > 1 ? 2 : 0}
              >
                {data.map((d) => (
                  <Cell key={d.key} fill={d.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold tabular-nums">{total}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("bento.totalProjects")}
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-x-3 gap-y-1.5">
          {["active", "planned", "completed", "hold"].map((key) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[key] }}
                />
                <span className="truncate text-muted-foreground">{t(`status.${key}`)}</span>
              </div>
              <span className="font-semibold tabular-nums">{counts[key] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </BentoTile>
  )
}
