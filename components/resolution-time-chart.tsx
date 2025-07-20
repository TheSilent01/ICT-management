"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ErrorBar } from "recharts"

interface ResolutionTimeData {
  category: string
  avgHours: number
  minHours: number
  maxHours: number
}

interface ResolutionTimeChartProps {
  data: ResolutionTimeData[]
}

export function ResolutionTimeChart({ data }: ResolutionTimeChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    errorY: [item.avgHours - item.minHours, item.maxHours - item.avgHours],
  }))

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip
            formatter={(value, name) => [`${value} hours`, "Average Resolution Time"]}
            labelFormatter={(label) => `${label} Defects`}
          />
          <Bar dataKey="avgHours" fill="hsl(var(--chart-1))" name="Avg Resolution Time">
            <ErrorBar dataKey="errorY" width={4} stroke="hsl(var(--chart-2))" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
