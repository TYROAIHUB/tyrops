import { Area, AreaChart, Line, LineChart, ResponsiveContainer } from "recharts"

// Minimal sparkline — no axes, no tooltip
// data: array of numbers OR array of {value: number}
// color: hex or var(--color-foo)
export function Sparkline({
  data,
  color = "var(--primary)",
  type = "area",
  height = 36,
  strokeWidth = 1.5,
}) {
  if (!data || data.length === 0) return <div style={{ height }} />

  const series = data.map((v, i) =>
    typeof v === "number" ? { i, value: v } : { i, ...v }
  )

  const gradId = `spark-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${series.length}`

  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={series} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={series} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={strokeWidth}
          fill={`url(#${gradId})`}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
