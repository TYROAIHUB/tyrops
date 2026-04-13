import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useT } from "@/i18n"

const performanceData = [
  { month: "Jan", revenue: 45000, cost: 12000 },
  { month: "Feb", revenue: 52000, cost: 14500 },
  { month: "Mar", revenue: 48000, cost: 13200 },
  { month: "Apr", revenue: 61000, cost: 16800 },
  { month: "May", revenue: 72000, cost: 18400 },
  { month: "Jun", revenue: 85000, cost: 21000 },
  { month: "Jul", revenue: 93000, cost: 22500 },
  { month: "Aug", revenue: 88000, cost: 20800 },
  { month: "Sep", revenue: 102000, cost: 24200 },
  { month: "Oct", revenue: 115000, cost: 26100 },
  { month: "Nov", revenue: 128000, cost: 28400 },
  { month: "Dec", revenue: 142000, cost: 30500 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
  cost: { label: "Cost", color: "var(--primary)" },
}

export function SalesChart() {
  const t = useT()
  const [timeRange, setTimeRange] = useState("12m")

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{t('chart.aiPerformance')}</CardTitle>
          <CardDescription>{t('chart.revenueVsCost')}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m" className="cursor-pointer">{t('chart.last3months')}</SelectItem>
              <SelectItem value="6m" className="cursor-pointer">{t('chart.last6months')}</SelectItem>
              <SelectItem value="12m" className="cursor-pointer">{t('chart.last12months')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6">
        <div className="px-6 pb-6">
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cost)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-cost)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="cost" stackId="1" stroke="var(--color-cost)" fill="url(#colorCost)" strokeDasharray="5 5" strokeWidth={1} />
              <Area type="monotone" dataKey="revenue" stackId="2" stroke="var(--color-revenue)" fill="url(#colorRevenue)" strokeWidth={1} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
