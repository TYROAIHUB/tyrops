import { useState } from "react"
import { useT } from "@/i18n"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users, MapPin, TrendingUp, Target, ArrowUpIcon, FolderKanban } from "lucide-react"
import { useStore } from "@/store/useStore"

const opsGrowthData = [
  { month: "Jan", projects: 2, agents: 3, automations: 4 },
  { month: "Feb", projects: 3, agents: 4, automations: 5 },
  { month: "Mar", projects: 3, agents: 5, automations: 6 },
  { month: "Apr", projects: 4, agents: 6, automations: 7 },
  { month: "May", projects: 5, agents: 7, automations: 8 },
  { month: "Jun", projects: 6, agents: 8, automations: 8 },
]

const chartConfig = {
  projects: { label: "Projects", color: "var(--chart-1)" },
  agents: { label: "AI Agents", color: "var(--chart-2)" },
  automations: { label: "Automations", color: "var(--chart-3)" },
}

export function CustomerInsights() {
  const t = useT()
  const [activeTab, setActiveTab] = useState("growth")
  const projects = useStore((s) => s.projects)
  const agents = useStore((s) => s.agents)
  const automations = useStore((s) => s.automations)

  const techData = {}
  projects.forEach((p) => {
    ;(p.tech || p.stack || []).forEach((t) => {
      if (!techData[t]) techData[t] = { name: t, projects: 0, revenue: 0 }
      techData[t].projects++
      techData[t].revenue += p.valueGenerated || 0
    })
  })
  const techRows = Object.values(techData).sort((a, b) => b.revenue - a.revenue).slice(0, 8)
  const totalRevenue = projects.reduce((s, p) => s + (p.valueGenerated || 0), 0)

  const teamData = {}
  projects.forEach((p) => {
    ;(p.team || []).forEach((m) => {
      if (!teamData[m]) teamData[m] = { name: m, projects: 0, revenue: 0 }
      teamData[m].projects++
      teamData[m].revenue += p.valueGenerated || 0
    })
  })
  const teamRows = Object.values(teamData).sort((a, b) => b.revenue - a.revenue)

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>{t('insights.title')}</CardTitle>
        <CardDescription>{t('insights.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg h-12">
            <TabsTrigger value="growth" className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('insights.tabGrowth')}</span>
            </TabsTrigger>
            <TabsTrigger value="tech" className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">{t('insights.tabTech')}</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t('insights.tabTeam')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="mt-8 space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-10 gap-6">
                <div className="col-span-10 xl:col-span-7">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">{t('insights.opsGrowth')}</h3>
                  <ChartContainer config={chartConfig} className="h-[375px] w-full">
                    <BarChart data={opsGrowthData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} tickLine={{ stroke: "var(--border)" }} axisLine={{ stroke: "var(--border)" }} />
                      <YAxis className="text-xs" tick={{ fontSize: 12 }} tickLine={{ stroke: "var(--border)" }} axisLine={{ stroke: "var(--border)" }} domain={[0, "dataMax"]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="projects" fill="var(--color-projects)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="agents" fill="var(--color-agents)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="automations" fill="var(--color-automations)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>

                <div className="col-span-10 xl:col-span-3 space-y-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-6">{t('insights.keyMetrics')}</h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{t('insights.totalProjects')}</span>
                      </div>
                      <div className="text-2xl font-bold">{projects.length}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />+{projects.filter((p) => p.status === "active").length} {t('insights.active')}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('insights.aiAgents')}</span>
                      </div>
                      <div className="text-2xl font-bold">{agents.length}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />{agents.filter((a) => a.status === "running").length} {t('insights.running')}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg max-lg:col-span-3 xl:col-span-3 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{t('insights.automations')}</span>
                      </div>
                      <div className="text-2xl font-bold">{automations.length}</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <ArrowUpIcon className="h-3 w-3" />{automations.filter((a) => a.status === "active").length} {t('insights.active')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">{t('insights.colTech')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colProjects')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colRevenue')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colShare')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {techRows.map((row) => (
                    <TableRow key={row.name} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">{row.name}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.projects}</TableCell>
                      <TableCell className="text-right py-5 px-6">${row.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className="font-medium text-green-600">
                          {totalRevenue > 0 ? ((row.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-8">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="py-5 px-6 font-semibold">{t('insights.colMember')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colProjects')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colRevenue')}</TableHead>
                    <TableHead className="text-right py-5 px-6 font-semibold">{t('insights.colContrib')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRows.map((row) => (
                    <TableRow key={row.name} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium py-5 px-6">{row.name}</TableCell>
                      <TableCell className="text-right py-5 px-6">{row.projects}</TableCell>
                      <TableCell className="text-right py-5 px-6">${row.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-5 px-6">
                        <span className="font-medium text-green-600">
                          {totalRevenue > 0 ? ((row.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
