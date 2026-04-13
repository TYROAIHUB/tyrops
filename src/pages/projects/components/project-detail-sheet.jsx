import { useRef } from "react"
import { useT } from "@/i18n"
import useStore from "@/store/useStore"
import { useScrollFade } from "@/hooks/use-scroll-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Calendar,
  GitBranch,
  Globe,
  Pencil,
  Trash2,
  ExternalLink,
  Users,
  Wallet,
  StickyNote,
  Link2,
  Layers,
  TrendingUp,
  Timer,
  Coins,
  Activity,
  BarChart3,
  Clock,
  Scissors,
  DollarSign,
  RotateCw,
} from "lucide-react"
import { TypeIcon } from "./type-icon"
import { StatusBadge, StatusIcon, STATUS_CONFIG } from "./status-badge"
import { getTypeConfig } from "@/data/type-icons"

const formatCurrency = (value) => {
  if (!value) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const stackColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
]

const avatarPalette = [
  "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
]

function hashString(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function avatarColor(name) {
  return avatarPalette[hashString(name) % avatarPalette.length]
}

function initials(name) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("")
}

function SectionHeading({ label, icon: Icon }) {
  const language = useStore((s) => s.language)
  const loc = language === "TR" ? "tr-TR" : "en-US"
  return (
    <div className="flex items-center gap-2 pt-1">
      {Icon && <Icon className="size-3 text-muted-foreground" />}
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">
        {label.toLocaleUpperCase(loc)}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

function InfoCard({ icon, label, value, valueClass }) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`text-sm font-medium truncate ${valueClass ?? ""}`}>{value}</div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, accent }) {
  const language = useStore((s) => s.language)
  const loc = language === "TR" ? "tr-TR" : "en-US"
  const accentCls =
    accent === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent === "warn"
      ? "text-amber-600 dark:text-amber-400"
      : "text-foreground"
  return (
    <div className="rounded-lg border bg-gradient-to-br from-card to-muted/30 p-3.5 space-y-1.5 min-w-0">
      <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wide text-muted-foreground min-w-0">
        <Icon className="size-3 shrink-0" />
        <span className="truncate" title={label}>
          {label.toLocaleUpperCase(loc)}
        </span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${accentCls}`}>{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground truncate">{sub}</div>}
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-1 min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
        <Icon className="size-3 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <p className="text-base font-semibold tabular-nums truncate">{value}</p>
    </div>
  )
}

function LinkCard({ icon: Icon, label, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg border bg-card p-3 space-y-1.5 hover:bg-accent hover:border-accent-foreground/20 transition-colors block"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="size-3" />
        <span>{label}</span>
        <ExternalLink className="size-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="text-xs text-foreground truncate">{url}</div>
    </a>
  )
}

export function ProjectDetailSheet({
  open,
  onOpenChange,
  project,
  projects = [],
  onEdit,
  onDelete,
}) {
  const t = useT()
  const language = useStore((s) => s.language)
  const loc = language === "TR" ? "tr-TR" : "en-US"
  const hourlyRate = useStore((s) => s.settings?.hourlyRate ?? 0)
  const scrollRef = useRef(null)
  const showFade = useScrollFade(scrollRef)

  const formatNumber = (n) => new Intl.NumberFormat(loc).format(n || 0)

  const formatDate = (str) =>
    str
      ? new Date(str + "T00:00:00").toLocaleDateString(loc, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null

  if (!project) return null

  const dateRangeText = project.startDate
    ? project.endDate
      ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}`
      : `${formatDate(project.startDate)} →`
    : "-"

  const techList = project.tech || project.stack || []
  const teamList = project.team || []
  const statusCfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.planned
  const typeCfg = getTypeConfig(project.type)

  // ── KPI hesaplamaları ─────────────────────────────────
  const costSpent = Number(project.costSpent || 0)
  const monthlyRecurring = Number(project.monthlyRecurring || 0)
  const valueGenerated = Number(project.valueGenerated || 0)
  const replacedCost = Number(project.replacedCost || 0)
  const savedTime = Number(project.savedTime || 0)
  const activeUsers = Number(project.activeUsers || 0)
  const totalInteractions = Number(project.totalInteractions || 0)
  const totalRuntime = Number(project.totalRuntime || 0)

  const annualNetBenefit = valueGenerated + replacedCost - monthlyRecurring * 12
  const monthlyNet = (valueGenerated + replacedCost) / 12 - monthlyRecurring
  const roi = costSpent > 0 ? (annualNetBenefit / costSpent) * 100 : null
  const payback = costSpent > 0 && monthlyNet > 0 ? costSpent / monthlyNet : null
  const timeValue = savedTime > 0 && hourlyRate > 0 ? savedTime * hourlyRate : null

  const hasAnyKpi = roi !== null || payback !== null || monthlyNet !== 0 || timeValue !== null
  const hasAnyStat =
    activeUsers + totalInteractions + totalRuntime +
    savedTime + valueGenerated + replacedCost +
    costSpent + monthlyRecurring > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="data-[side=right]:sm:max-w-2xl w-full p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-3.5 pr-12 border-b shrink-0 flex-row items-center gap-3 space-y-0 bg-gradient-to-b from-primary/5 to-background">
          <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <TypeIcon type={project.type} size={18} />
          </div>
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <SheetTitle className="text-sm font-semibold truncate min-w-0">
              {project.name}
            </SheetTitle>
            <StatusBadge status={project.status} />
            <SheetDescription className="sr-only">
              {project.description || project.name}
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="relative flex-1 min-h-0">
          <div ref={scrollRef} className="overflow-y-auto h-full px-6 py-5 pb-8">
            <div className="space-y-5">
              {/* Description */}
              {project.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}

              {/* Meta Row — 3 info cards */}
              <div className="grid grid-cols-3 gap-3">
                <InfoCard
                  icon={<Calendar className="size-3" />}
                  label={t("form.dateRange")}
                  value={dateRangeText}
                />
                <InfoCard
                  icon={<TypeIcon type={project.type} size={12} />}
                  label={t("detail.type")}
                  value={t(`type.${project.type}`) || project.type}
                  valueClass=""
                />
                <InfoCard
                  icon={<StatusIcon status={project.status} className="size-3" />}
                  label={t("form.status")}
                  value={t(`status.${project.status}`)}
                  valueClass={statusCfg.text}
                />
              </div>

              {/* Tech Stack */}
              {techList.length > 0 && (
                <div className="space-y-2">
                  <SectionHeading label={t("detail.techStack")} />
                  <div className="flex flex-wrap gap-1.5">
                    {techList.map((tech, i) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className={stackColors[i % stackColors.length]}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Team */}
              {teamList.length > 0 && (
                <div className="space-y-2">
                  <SectionHeading label={t("detail.team")} icon={Users} />
                  <div className="flex flex-wrap gap-2">
                    {teamList.map((name) => (
                      <div
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-full border bg-card pl-0.5 pr-2.5 py-0.5"
                      >
                        <div
                          className={`size-5 rounded-full flex items-center justify-center text-[9px] font-semibold ${avatarColor(name)}`}
                        >
                          {initials(name)}
                        </div>
                        <span className="text-xs">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.repo || project.liveUrl) && (
                <div className="space-y-2">
                  <SectionHeading label={t("form.sectionLinks")} icon={Link2} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.repo && (
                      <LinkCard
                        icon={GitBranch}
                        label={t("detail.repo")}
                        url={project.repo}
                      />
                    )}
                    {project.liveUrl && (
                      <LinkCard
                        icon={Globe}
                        label={t("detail.liveUrl")}
                        url={project.liveUrl}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* KPI Hero */}
              {hasAnyKpi && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {roi !== null && (
                    <KpiCard
                      icon={TrendingUp}
                      label={t("detail.kpi.roi")}
                      value={`${roi >= 0 ? "+" : ""}${roi.toFixed(0)}%`}
                      accent={roi > 0 ? "positive" : "warn"}
                    />
                  )}
                  {payback !== null && (
                    <KpiCard
                      icon={RotateCw}
                      label={t("detail.kpi.payback")}
                      value={payback.toFixed(1)}
                      sub={t("detail.kpi.months")}
                    />
                  )}
                  <KpiCard
                    icon={Coins}
                    label={t("detail.kpi.monthlyNet")}
                    value={formatCurrency(Math.round(monthlyNet))}
                    accent={monthlyNet > 0 ? "positive" : monthlyNet < 0 ? "warn" : undefined}
                  />
                  {timeValue !== null && (
                    <KpiCard
                      icon={Timer}
                      label={t("detail.kpi.timeValue")}
                      value={formatCurrency(Math.round(timeValue))}
                      sub={`${savedTime}${t("detail.kpi.hoursMonthly")} × $${hourlyRate}`}
                      accent="positive"
                    />
                  )}
                </div>
              )}

              {/* İstatistikler — raw veriler */}
              {hasAnyStat && (
                <div className="space-y-2">
                  <SectionHeading label={t("detail.stats")} icon={BarChart3} />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeUsers > 0 && (
                      <StatCard icon={Users} label={t("detail.activeUsers")} value={formatNumber(activeUsers)} />
                    )}
                    {totalInteractions > 0 && (
                      <StatCard icon={Activity} label={t("detail.totalInteractions")} value={formatNumber(totalInteractions)} />
                    )}
                    {totalRuntime > 0 && (
                      <StatCard icon={Clock} label={t("detail.totalRuntime")} value={`${formatNumber(totalRuntime)}h`} />
                    )}
                    {savedTime > 0 && (
                      <StatCard icon={Timer} label={t("detail.savedTime")} value={`${formatNumber(savedTime)}h/ay`} />
                    )}
                    {valueGenerated > 0 && (
                      <StatCard icon={TrendingUp} label={t("detail.valueGen")} value={formatCurrency(valueGenerated)} />
                    )}
                    {replacedCost > 0 && (
                      <StatCard icon={Scissors} label={t("detail.replacedCost")} value={formatCurrency(replacedCost)} />
                    )}
                    {costSpent > 0 && (
                      <StatCard icon={Wallet} label={t("detail.costSpent")} value={formatCurrency(costSpent)} />
                    )}
                    {monthlyRecurring > 0 && (
                      <StatCard icon={DollarSign} label={t("detail.monthly")} value={formatCurrency(monthlyRecurring)} />
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {project.notes && (
                <div className="space-y-2">
                  <SectionHeading label={t("detail.notes")} icon={StickyNote} />
                  <p className="text-sm whitespace-pre-wrap leading-relaxed rounded-lg border bg-muted/30 p-3">
                    {project.notes}
                  </p>
                </div>
              )}

              {/* Related Projects */}
              {project.relatedProjects && project.relatedProjects.length > 0 && (
                <div className="space-y-2">
                  <SectionHeading label={t("form.related")} icon={Layers} />
                  <div className="flex flex-wrap gap-2">
                    {project.relatedProjects.map((rid) => {
                      const rp = projects.find((p) => p.id === rid)
                      if (!rp) return null
                      return (
                        <div
                          key={rid}
                          className="inline-flex items-center gap-1.5 rounded-md border bg-card px-2 py-1"
                        >
                          <TypeIcon type={rp.type} size={12} />
                          <span className="text-xs font-medium">{rp.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom fade gradient */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200"
            style={{ opacity: showFade ? 1 : 0 }}
          />
        </div>

        <SheetFooter className="px-6 py-4 border-t shrink-0 flex-row justify-end gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              onOpenChange(false)
              onEdit(project)
            }}
          >
            <Pencil className="size-4" />
            {t("detail.edit")}
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => {
              onOpenChange(false)
              onDelete(project.id)
            }}
          >
            <Trash2 className="size-4" />
            {t("detail.delete")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
