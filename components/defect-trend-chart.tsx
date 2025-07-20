"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ICTDefect } from "@/types/defect"

interface DefectTrendChartProps {
  defects: ICTDefect[]
}

export function DefectTrendChart({ defects }: DefectTrendChartProps) {
  // Group defects by date
  const defectsByDate = defects.reduce(
    (acc, defect) => {
      const date = new Date(defect.timestamp).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { date, reported: 0, resolved: 0, high: 0, medium: 0, low: 0 }
      }
      acc[date].reported += 1
      acc[date][defect.severity] += 1

      if (defect.status === "resolved" || defect.status === "verified") {
        acc[date].resolved += 1
      }

      return acc
    },
    {} as Record<
      string,
      { date: string; reported: number; resolved: number; high: number; medium: number; low: number }
    >,
  )

  const chartData = Object.values(defectsByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value: string) => `Week of ${new Date(value).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
            formatter={(value: number, name: string) => [value, name === "reported" ? "Reported" : "Resolved"]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="reported"
            stroke="#ef4444"
            strokeWidth={3}
            name="Reported Defects"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#22c55e"
            strokeWidth={3}
            name="Resolved Defects"
            dot={{ fill: "#22c55e", strokeWidth: 2, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
