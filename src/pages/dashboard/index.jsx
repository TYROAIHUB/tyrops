import { useEffect, useMemo } from "react"
import { BaseLayout } from "@/components/layout/BaseLayout"
import { useStore } from "@/store/useStore"
import { seedProjects, seedAgents, seedAutomations } from "@/data/seedData"
import { useT } from "@/i18n"

import { TotalValueCard } from "./components/kpi-hero/total-value-card"
import { RoiGaugeCard } from "./components/kpi-hero/roi-gauge-card"
import { SavedTimeCard } from "./components/kpi-hero/saved-time-card"
import { ActiveOpsCard } from "./components/kpi-hero/active-ops-card"

import { BentoGrid } from "./components/bento/bento-grid"
import { AnnualForecastTile } from "./components/bento/annual-forecast-tile"
import { PerformanceByTypeTile } from "./components/bento/performance-by-type-tile"
import { StatusDonutTile } from "./components/bento/status-donut-tile"
import { TopProjectsTile } from "./components/bento/top-projects-tile"
import { BestRoiTile } from "./components/bento/best-roi-tile"
import { TeamContributionTile } from "./components/bento/team-contribution-tile"

import { computePortfolioKpis } from "./lib/metrics"

export default function Dashboard() {
  const t = useT()
  const projects = useStore((s) => s.projects)
  const agents = useStore((s) => s.agents)
  const automations = useStore((s) => s.automations)
  const settings = useStore((s) => s.settings)
  const addProject = useStore((s) => s.addProject)
  const addAgent = useStore((s) => s.addAgent)
  const addAutomation = useStore((s) => s.addAutomation)

  useEffect(() => {
    if (projects.length === 0 && agents.length === 0 && automations.length === 0) {
      seedProjects.forEach((p) => addProject(p))
      seedAgents.forEach((a) => addAgent(a))
      seedAutomations.forEach((a) => addAutomation(a))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const kpis = useMemo(() => computePortfolioKpis(projects, settings), [projects, settings])

  const totalActiveUsers = useMemo(
    () =>
      projects.reduce((s, p) => s + Number(p.activeUsers || 0), 0) +
      agents.reduce((s, a) => s + Number(a.activeUsers || 0), 0),
    [projects, agents]
  )

  return (
    <BaseLayout>
      <div className="flex-1 space-y-6 px-4 lg:px-6 pt-0 pb-10">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        {/* Layer 1 — Executive KPI Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <TotalValueCard
            totalValue={kpis.totalValue}
            replacedCost={kpis.totalReplaced}
            totalCost={kpis.totalCost}
          />
          <RoiGaugeCard roi={kpis.roi} payback={kpis.payback} />
          <SavedTimeCard
            savedTime={kpis.totalSavedTime}
            hourlyRate={kpis.hourlyRate}
            savedTimeValue={kpis.savedTimeValue}
          />
          <ActiveOpsCard
            totalActiveUsers={totalActiveUsers}
            totalInteractions={kpis.totalInteractions}
            totalRuntime={kpis.totalRuntime}
            projects={projects.length}
            agents={agents.length}
            automations={automations.length}
          />
        </div>

        {/* Layer 2 — Bento Grid 2.0 */}
        <BentoGrid>
          {/* Annual forecast hero — full width */}
          <AnnualForecastTile
            projects={projects}
            settings={settings}
            className="col-span-12"
          />

          {/* Performance by type (replaces revenue chart) */}
          <PerformanceByTypeTile
            projects={projects}
            className="col-span-12 xl:col-span-8 row-span-2"
          />
          <StatusDonutTile projects={projects} className="col-span-12 xl:col-span-4 row-span-2" />

          <TopProjectsTile projects={projects} className="col-span-12 xl:col-span-8" />
          <BestRoiTile projects={projects} className="col-span-12 xl:col-span-4 row-span-2" />
          <TeamContributionTile projects={projects} className="col-span-12 xl:col-span-8" />
        </BentoGrid>
      </div>
    </BaseLayout>
  )
}
