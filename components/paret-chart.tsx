"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ParetData {
  cause: string
  count: number
  percentage: number
  cumulativePercentage: number
}

interface ParetChartProps {
  data: ParetData[]
}

export function ParetChart({ data }: ParetChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Count: {data?.count}</p>
          <p className="text-green-600">Individual: {data?.percentage?.toFixed(1)}%</p>
          <p className="text-red-600">Cumulative: {data?.cumulativePercentage?.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="cause" angle={-45} textAnchor="end" height={80} fontSize={11} stroke="#666" />
          <YAxis yAxisId="left" stroke="#666" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Defect Count" radius={[4, 4, 0, 0]} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativePercentage"
            stroke="#ef4444"
            strokeWidth={3}
            name="Cumulative %"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: "#ef4444", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
