import { useEffect } from "react"
import { BaseLayout } from "@/components/layout/BaseLayout"
import { useStore } from "@/store/useStore"
import { seedProjects, seedAgents, seedAutomations } from "@/data/seedData"
import { MetricsOverview } from "./components/metrics-overview"
import { SalesChart } from "./components/sales-chart"
import { RevenueBreakdown } from "./components/revenue-breakdown"
import { RecentTransactions } from "./components/recent-transactions"
import { TopProducts } from "./components/top-products"
import { CustomerInsights } from "./components/customer-insights"

export default function Dashboard() {
  const projects = useStore((s) => s.projects)
  const agents = useStore((s) => s.agents)
  const automations = useStore((s) => s.automations)
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

  return (
    <BaseLayout>
      <div className="flex-1 space-y-6 px-6 pt-0">
        {/* Main Dashboard Grid */}
        <div className="@container/main space-y-6">
          {/* Top Row - Key Metrics */}
          <MetricsOverview />

          {/* Second Row - Charts */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <SalesChart />
            <RevenueBreakdown />
          </div>

          {/* Third Row - Lists */}
          <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
            <RecentTransactions />
            <TopProducts />
          </div>

          {/* Fourth Row - Customer Insights */}
          <CustomerInsights />
        </div>
      </div>
    </BaseLayout>
  )
}
