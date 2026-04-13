import { useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import ChampionIcon from "@hugeicons/core-free-icons/ChampionIcon"
import { useT } from "@/i18n"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { BentoTile } from "./bento-tile"
import { topProjectsByValue } from "../../lib/metrics"
import { TypeIcon } from "@/pages/projects/components/type-icon"
import { StatusBadge } from "@/pages/projects/components/status-badge"
import { formatCurrencyCompact } from "../../lib/format"

export function TopProjectsTile({ projects, className }) {
  const t = useT()
  const top = useMemo(() => topProjectsByValue(projects, 5), [projects])
  const max = Math.max(1, ...top.map((p) => Number(p.valueGenerated || 0)))

  const action = (
    <Button asChild variant="ghost" size="sm" className="h-7 text-[11px]">
      <Link to="/app/projects">
        {t("bento.viewAll")} <ArrowRight className="size-3" />
      </Link>
    </Button>
  )

  return (
    <BentoTile
      className={className}
      title={t("bento.topProjects")}
      description={t("bento.topProjectsDesc")}
      icon={
        <HugeiconsIcon icon={ChampionIcon} style={{ width: 22, height: 22, color: "#f59e0b" }} />
      }
      action={action}
    >
      <div className="space-y-2.5">
        {top.length === 0 && (
          <div className="text-xs text-muted-foreground py-6 text-center">
            {t("empty.noProjects")}
          </div>
        )}
        {top.map((p, i) => {
          const widthPct = (Number(p.valueGenerated || 0) / max) * 100
          return (
            <div key={p.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground w-4 text-center tabular-nums">
                  {i + 1}
                </span>
                <TypeIcon type={p.type} size={14} />
                <span className="text-sm font-medium truncate flex-1 min-w-0">{p.name}</span>
                <StatusBadge status={p.status} />
                <span className="text-sm font-bold tabular-nums w-16 text-right">
                  {formatCurrencyCompact(p.valueGenerated)}
                </span>
              </div>
              <div className="ml-6 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </BentoTile>
  )
}
