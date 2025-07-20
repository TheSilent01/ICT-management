"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ComponentFailureData {
  component: string
  failureRate: number
  totalTested: number
  failed: number
}

interface ComponentFailureRateChartProps {
  data: ComponentFailureData[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-1))",
]

export function ComponentFailureRateChart({ data }: ComponentFailureRateChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    x: item.totalTested,
    y: item.failureRate,
    z: item.failed,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Total Tested"
            label={{ value: "Total Tested", position: "insideBottom", offset: -10 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Failure Rate %"
            label={{ value: "Failure Rate (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              if (name === "y") return [`${value}%`, "Failure Rate"]
              if (name === "x") return [value, "Total Tested"]
              return [value, name]
            }}
            labelFormatter={(label, payload) => {
              const data = payload?.[0]?.payload
              return data ? `${data.component}` : label
            }}
          />
          <Scatter name="Components" data={chartData} fill="hsl(var(--chart-1))">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
