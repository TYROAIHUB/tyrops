import { useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import UserGroupIcon from "@hugeicons/core-free-icons/UserGroupIcon"
import { useT } from "@/i18n"
import { BentoTile } from "./bento-tile"
import { teamContribution } from "../../lib/metrics"
import { formatCurrencyCompact } from "../../lib/format"

const AVATAR_PALETTE = [
  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
]

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}
function avatarColor(name) {
  return AVATAR_PALETTE[hashStr(name) % AVATAR_PALETTE.length]
}
function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("")
}

export function TeamContributionTile({ projects, className }) {
  const t = useT()
  const [showAll, setShowAll] = useState(false)
  const all = useMemo(() => teamContribution(projects), [projects])
  const visible = showAll ? all : all.slice(0, 6)
  const max = Math.max(1, ...all.map((m) => m.value))

  return (
    <BentoTile
      className={className}
      title={t("bento.teamContribution")}
      description={t("bento.teamContributionDesc")}
      icon={
        <HugeiconsIcon icon={UserGroupIcon} style={{ width: 22, height: 22, color: "var(--primary)" }} />
      }
    >
      <div className="space-y-2.5">
        {visible.length === 0 && (
          <div className="text-xs text-muted-foreground py-6 text-center">
            {t("empty.noTeam")}
          </div>
        )}
        {visible.map((m) => {
          const widthPct = (m.value / max) * 100
          const activeFrac = m.count > 0 ? m.active / m.count : 0
          return (
            <div key={m.name} className="flex items-center gap-3">
              <div
                className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColor(m.name)}`}
              >
                {initials(m.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium truncate">{m.name}</span>
                  <span className="text-xs font-semibold tabular-nums">
                    {formatCurrencyCompact(m.value)}
                  </span>
                </div>
                <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-700"
                    style={{ width: `${widthPct}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                    style={{ width: `${widthPct * activeFrac}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                  <span>
                    {m.count} {t("bento.projects")}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {m.active} {t("status.active").toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        {all.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors w-full pt-1"
          >
            {showAll ? t("bento.showLess") : `${t("bento.showAll")} (${all.length})`}
          </button>
        )}
      </div>
    </BentoTile>
  )
}
