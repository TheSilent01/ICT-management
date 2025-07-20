"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MonthlyData {
  month: string
  defects: number
  resolved: number
  efficiency: number
}

interface MonthlyTrendChartProps {
  data: MonthlyData[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Efficiency") return [`${value}%`, name]
              return [value, name]
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="defects" fill="hsl(var(--chart-1))" name="Total Defects" />
          <Bar yAxisId="left" dataKey="resolved" fill="hsl(var(--chart-2))" name="Resolved" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="efficiency"
            stroke="hsl(var(--chart-3))"
            strokeWidth={3}
            name="Efficiency"
            dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
