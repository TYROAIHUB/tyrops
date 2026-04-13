import { useMemo, useState } from "react"
import { useT } from "@/i18n"
import { Label, Pie, PieChart, Sector } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store/useStore"

import { TYPE_ICONS } from "@/data/type-icons"

const TYPE_COLORS = Object.fromEntries(
  Object.entries(TYPE_ICONS).map(([key, val]) => [key, { label: val.label, color: val.color }])
)

export function RevenueBreakdown() {
  const t = useT()
  const id = "project-breakdown"
  const projects = useStore((s) => s.projects)

  const { chartData, chartConfig } = useMemo(() => {
    const typeMap = {}
    projects.forEach((p) => {
      const type = p.type || "other"
      if (!typeMap[type]) typeMap[type] = { count: 0, revenue: 0 }
      typeMap[type].count++
      typeMap[type].revenue += p.valueGenerated || 0
    })

    const data = Object.entries(typeMap)
      .map(([type, info]) => ({
        category: type,
        count: info.count,
        revenue: info.revenue,
        fill: `var(--color-${type.replace("-", "")})`,
      }))
      .sort((a, b) => b.revenue - a.revenue)

    const config = { revenue: { label: "Revenue" } }
    data.forEach((d) => {
      const key = d.category.replace("-", "")
      config[key] = {
        label: TYPE_COLORS[d.category]?.label || d.category,
        color: TYPE_COLORS[d.category]?.color || "var(--chart-4)",
      }
    })

    return { chartData: data.map((d) => ({ ...d, category: d.category.replace("-", ""), originalType: d.category })), chartConfig: config }
  }, [projects])

  const [activeCategory, setActiveCategory] = useState(() => chartData[0]?.category || "")

  const activeIndex = useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [activeCategory, chartData]
  )

  const categories = useMemo(() => chartData.map((item) => item.category), [chartData])

  if (!chartData.length) return null

  return (
    <Card data-chart={id} className="flex flex-col cursor-pointer">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-2">
        <div>
          <CardTitle>{t('breakdown.title')}</CardTitle>
          <CardDescription>{t('breakdown.description')}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[160px] rounded-lg cursor-pointer" aria-label="Select a type">
              <SelectValue placeholder={t('breakdown.selectType')} />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-lg">
              {categories.map((key) => {
                const config = chartConfig[key]
                if (!config) return null
                return (
                  <SelectItem key={key} value={key} className="rounded-md [&_span]:flex cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 shrink-0" style={{ backgroundColor: `var(--color-${key})` }} />
                      {config.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <div className="flex justify-center">
            <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="revenue"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeIndex >= 0 ? activeIndex : 0}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius + 10} />
                      <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                    </g>
                  )}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const item = chartData[activeIndex >= 0 ? activeIndex : 0]
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                              ${item?.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(0)}K` : item?.revenue || 0}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                              {item?.count || 0} {t('breakdown.projects')}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            {chartData.map((item, index) => {
              const config = chartConfig[item.category]
              const isActive = index === (activeIndex >= 0 ? activeIndex : 0)
              const total = chartData.reduce((s, d) => s + d.revenue, 0)
              const pct = total > 0 ? ((item.revenue / total) * 100).toFixed(0) : 0
              return (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                  onClick={() => setActiveCategory(item.category)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: `var(--color-${item.category})` }} />
                    <span className="font-medium">{config?.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${item.revenue >= 1000 ? `${(item.revenue / 1000).toFixed(1)}K` : item.revenue}</div>
                    <div className="text-sm text-muted-foreground">{pct}% · {item.count} {t('breakdown.projects')}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
