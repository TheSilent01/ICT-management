"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { ICTDefect } from "@/types/defect"

interface ComponentFailureChartProps {
  defects: ICTDefect[]
}

export function ComponentFailureChart({ defects }: ComponentFailureChartProps) {
  // Group defects by component and severity
  const componentData = defects.reduce(
    (acc: Record<string, { component: string; high: number; medium: number; low: number; total: number }>, defect: ICTDefect) => {
      const component = defect.component
      if (!acc[component]) {
        acc[component] = { component, high: 0, medium: 0, low: 0, total: 0 }
      }
      acc[component][defect.severity] += 1
      acc[component].total += 1
      return acc
    },
    {} as Record<string, { component: string; high: number; medium: number; low: number; total: number }>,
  )

  const chartData = Object.values(componentData)
    .sort((a, b) => b.total - a.total)
    .slice(0, 8) // Show top 8 components

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="component" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [value, `${name} Severity`]}
            labelFormatter={(label: string) => `Component: ${label}`}
          />
          <Legend />
          <Bar dataKey="high" stackId="a" fill="#ef4444" name="High" />
          <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
          <Bar dataKey="low" stackId="a" fill="#22c55e" name="Low" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
