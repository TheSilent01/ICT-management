"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ComponentData {
  component: string
  partNumber: string
  count: number
  vendor: string
}

interface ComponentReliabilityChartProps {
  data: ComponentData[]
}

export function ComponentReliabilityChart({ data }: ComponentReliabilityChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.component}</p>
          <p className="text-gray-600">Part: {data.partNumber}</p>
          <p className="text-gray-600">Vendor: {data.vendor}</p>
          <p className="text-red-600">Defects: {data.count}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="component" angle={-45} textAnchor="end" height={80} fontSize={11} stroke="#666" />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Defect Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
