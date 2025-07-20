"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";
import { ICTDefect } from "@/types/defect";

interface ParetoCauseChartProps {
  defects: ICTDefect[]
}

export function ParetoCauseChart({ defects }: ParetoCauseChartProps) {
  // Group defects by root cause
  const causeData = defects.reduce(
    (acc, defect) => {
      const cause = defect.rootCause
      if (!acc[cause]) {
        acc[cause] = 0
      }
      acc[cause] += 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort by frequency and calculate cumulative percentage
  const sortedCauses = Object.entries(causeData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6) // Show top 6 causes

  const total = sortedCauses.reduce((sum, [, count]) => sum + count, 0)
  let cumulative = 0

  const chartData = sortedCauses.map(([cause, count]) => {
    cumulative += count
    return {
      cause: cause.length > 20 ? cause.substring(0, 20) + "..." : cause,
      fullCause: cause,
      count,
      percentage: Math.round((cumulative / total) * 100),
    }
  })

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cause" angle={-45} textAnchor="end" height={80} fontSize={11} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "Cumulative %") return [`${value}%`, name]
              return [value, name]
            }}
            labelFormatter={(label: string, payload: any[]) => {
              const item = payload?.[0]?.payload
              return item?.fullCause || label
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Defect Count" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="percentage"
            stroke="#ef4444"
            strokeWidth={3}
            name="Cumulative %"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
