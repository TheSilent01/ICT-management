"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ICTDefect } from "@/types/defect";

interface StatusPieChartProps {
  defects: ICTDefect[]
}

const COLORS = {
  open: "#ef4444",
  "in-progress": "#f59e0b",
  resolved: "#3b82f6",
  verified: "#22c55e",
}

export function StatusPieChart({ defects }: StatusPieChartProps) {
  // Group defects by status
  const statusData = defects.reduce(
    (acc, defect) => {
      const status = defect.status
      if (!acc[status]) {
        acc[status] = { name: status, value: 0 }
      }
      acc[status].value += 1
      return acc
    },
    {} as Record<string, { name: string; value: number }>,
  )

  const chartData = Object.values(statusData).map((item) => ({
    ...item,
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1).replace("-", " "),
    displayName: item.name.charAt(0).toUpperCase() + item.name.slice(1).replace("-", " "),
  }))

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number; }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toLowerCase().replace(" ", "-") as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`${value} defects`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
