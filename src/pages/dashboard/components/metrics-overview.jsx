import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FolderKanban,
  CircleDot,
  CheckCircle2,
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/store/useStore"
import { useT } from "@/i18n"

export function MetricsOverview() {
  const t = useT()
  const projects = useStore((s) => s.projects)

  const totalRevenue = projects.reduce((sum, p) => sum + (p.valueGenerated || 0), 0)
  const activeCount = projects.filter((p) => p.status === "active").length
  const completedCount = projects.filter((p) => p.status === "completed").length
  const totalCount = projects.length
  const successRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : "0"

  const metrics = [
    {
      title: t('metrics.totalRevenue'),
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      footer: t('metrics.fromAllProjects'),
      subfooter: t('metrics.valueGenerated'),
    },
    {
      title: t('metrics.activeProjects'),
      value: String(activeCount),
      change: `${activeCount} of ${totalCount}`,
      trend: "up",
      icon: CircleDot,
      footer: t('metrics.inProgress'),
      subfooter: t('metrics.tracked', totalCount),
    },
    {
      title: t('metrics.totalProjects'),
      value: String(totalCount),
      change: "+2",
      trend: "up",
      icon: FolderKanban,
      footer: t('metrics.growing'),
      subfooter: t('metrics.allOps'),
    },
    {
      title: t('metrics.successRate'),
      value: `${successRate}%`,
      change: completedCount > 0 ? `+${completedCount} completed` : "—",
      trend: completedCount > 0 ? "up" : "down",
      icon: CheckCircle2,
      footer: completedCount > 0 ? t('metrics.delivering') : t('metrics.noCompleted'),
      subfooter: t('metrics.completedActive', completedCount, activeCount),
    },
  ]

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
      {metrics.map((metric) => {
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={metric.title} className="cursor-pointer">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon className="h-4 w-4" />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {metric.footer} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">{metric.subfooter}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
